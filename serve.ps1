# ============================================================
#  本地静态服务器（给「我的项目」「放松一下」两页用）
#  为什么要它：直接双击 html（file:// 地址）打开时，浏览器会
#  忽略 <a download> 属性，点「下载」不会有任何下载任务。
#  用 http://localhost 打开就一切正常（下载、播放、进度条都好使）。
#  用法：双击「启动本地服务器.bat」，或命令行运行本脚本。
#  关闭黑窗口 / Ctrl+C 即停止。
#
#  并发说明：每个连接交给线程池里的一个 runspace 处理。
#  之前是「一次只处理一个连接」，首页一边播 bgm.mp3（5 MB 多）
#  一边点「我的项目 / 放松一下」时，新页面的请求会排在音频下载
#  后面，看起来就是一直卡在加载页。改成并发后不再互相排队。
# ============================================================

param([int]$Port = 8000)

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
if(-not $root){ $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

# ---------- 处理单个连接（在线程池里执行，所以整段独立定义） ----------
$worker = {
  param($client, $root)

  $mimeMap = @{
    '.html' = 'text/html; charset=utf-8'
    '.htm'  = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.mjs'  = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.mp3'  = 'audio/mpeg'
    '.m4a'  = 'audio/mp4'
    '.aac'  = 'audio/aac'
    '.wav'  = 'audio/wav'
    '.ogg'  = 'audio/ogg'
    '.oga'  = 'audio/ogg'
    '.opus' = 'audio/ogg'
    '.flac' = 'audio/flac'
    '.wma'  = 'audio/x-msma'
    '.webm' = 'video/webm'
    '.mp4'  = 'video/mp4'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.webp' = 'image/webp'
    '.ico'  = 'image/x-icon'
    '.txt'  = 'text/plain; charset=utf-8'
    '.md'   = 'text/markdown; charset=utf-8'
    '.c'    = 'text/plain; charset=utf-8'
    '.h'    = 'text/plain; charset=utf-8'
    '.vbs'  = 'text/plain; charset=utf-8'
    '.bat'  = 'text/plain; charset=utf-8'
    '.ps1'  = 'text/plain; charset=utf-8'
    '.pdf'  = 'application/pdf'
    '.zip'  = 'application/zip'
  }

  function Get-CType([string]$path){
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    if($mimeMap.ContainsKey($ext)){ return $mimeMap[$ext] }
    return 'application/octet-stream'
  }

  function Write-Head($stream, [int]$code, [string]$reason, $headers){
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append("HTTP/1.1 $code $reason`r`n")
    foreach($k in $headers.Keys){ [void]$sb.Append("$k`: $($headers[$k])`r`n") }
    [void]$sb.Append("Cache-Control: no-cache`r`n")
    [void]$sb.Append("Accept-Ranges: bytes`r`n")
    [void]$sb.Append("Connection: close`r`n`r`n")
    $bytes = [System.Text.Encoding]::ASCII.GetBytes($sb.ToString())
    $stream.Write($bytes, 0, $bytes.Length)
  }

  function Send-File($stream, [string]$file, $rangeHeader){
    $info  = New-Object System.IO.FileInfo($file)
    $len   = $info.Length
    $ctype = Get-CType $file

    $start = 0
    $end   = $len - 1
    $isRange = $false

    if($rangeHeader -and $rangeHeader -match 'bytes=(\d*)-(\d*)'){
      $isRange = $true
      $s = $matches[1]; $e = $matches[2]
      if($s -ne ''){ $start = [int64]$s }
      if($e -ne ''){ $end = [int64]$e }
      if($end -ge $len){ $end = $len - 1 }
      if($start -gt $end -or $start -ge $len){
        Write-Head $stream 416 'Range Not Satisfiable' @{'Content-Length' = '0'}
        return
      }
    }

    $count = $end - $start + 1
    if($isRange){
      Write-Head $stream 206 'Partial Content' @{
        'Content-Type'   = $ctype
        'Content-Length' = $count
        'Content-Range'  = "bytes $start-$end/$len"
      }
    }else{
      Write-Head $stream 200 'OK' @{
        'Content-Type'   = $ctype
        'Content-Length' = $len
      }
    }

    $fs = [System.IO.File]::Open($file, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    try{
      $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
      $buf  = New-Object byte[] 1048576        # 1 MB：大文件少绕几圈循环
      $left = $count
      while($left -gt 0){
        $read = $fs.Read($buf, 0, [int][Math]::Min($buf.Length, $left))
        if($read -le 0){ break }
        $stream.Write($buf, 0, $read)
        $left -= $read
      }
    }finally{
      $fs.Close()
    }
  }

  function Send-Text($stream, [int]$code, [string]$reason, [string]$body){
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
    Write-Head $stream $code $reason @{
      'Content-Type'   = 'text/plain; charset=utf-8'
      'Content-Length' = $bytes.Length
    }
    $stream.Write($bytes, 0, $bytes.Length)
  }

  $stream = $null
  try{
    $stream = $client.GetStream()
    $client.ReceiveTimeout = 10000
    $client.SendTimeout    = 600000

    $ms   = New-Object System.IO.MemoryStream
    $buf  = New-Object byte[] 8192
    $text = ''
    do{
      $n = $stream.Read($buf, 0, $buf.Length)
      if($n -le 0){ break }
      $ms.Write($buf, 0, $n)
      $text = [System.Text.Encoding]::ASCII.GetString($ms.ToArray())
    }while($ms.Length -lt 65536 -and ($text -notmatch "`r`n`r`n"))

    if($text -notmatch "`r`n`r`n"){ return }
    $lines = $text -split "`r`n"
    $req   = $lines[0] -split ' '
    if($req.Length -lt 2){ return }
    $method = $req[0]
    $rawUrl = $req[1]

    $headers = @{}
    foreach($l in $lines[1..($lines.Length - 1)]){
      $i = $l.IndexOf(':')
      if($i -gt 0){ $headers[$l.Substring(0, $i).Trim().ToLower()] = $l.Substring($i + 1).Trim() }
    }

    $pathOnly = $rawUrl.Split('?')[0]
    try{ $pathOnly = [Uri]::UnescapeDataString($pathOnly) }catch{}
    if($pathOnly -eq '/' -or $pathOnly -eq ''){ $pathOnly = '/index.html' }
    $pathOnly = $pathOnly -replace '/+', '/'
    $rel  = $pathOnly.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    $full = [System.IO.Path]::GetFullPath((Join-Path $root $rel))

    if(-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)){
      Send-Text $stream 403 'Forbidden' '403'
      return
    }

    if(Test-Path -LiteralPath $full -PathType Container){
      $full = Join-Path $full 'index.html'
    }
    if(-not (Test-Path -LiteralPath $full -PathType Leaf)){
      Send-Text $stream 404 'Not Found' ('404 - ' + $pathOnly)
      Write-Output ('  404 ' + $pathOnly)
      return
    }

    if($method -eq 'HEAD'){
      Write-Head $stream 200 'OK' @{'Content-Type' = (Get-CType $full); 'Content-Length' = '0'}
      return
    }
    Send-File $stream $full $headers['range']
    $kb = [math]::Round(((New-Object System.IO.FileInfo($full)).Length) / 1KB, 1)
    Write-Output ('  ' + $method + ' ' + $pathOnly + '  (' + $kb + ' KB)')
  }catch{
    Write-Output ('  [!] ' + $_.Exception.Message)
  }finally{
    try{ if($stream){ $stream.Close() } }catch{}
    try{ $client.Close() }catch{}
  }
}

# ---------- 启动：端口被占用就自动往后找一个 ----------
$listener = $null
for($p = $Port; $p -lt ($Port + 30); $p++){
  try{
    $l = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $p)
    $l.Start()
    $listener = $l
    $Port = $p
    break
  }catch{
    try{ $l.Stop() }catch{}
  }
}
if(-not $listener){
  Write-Host '[x] 端口都被占用了，换个端口再试。'
  exit 1
}

$url = "http://localhost:$Port/"
Write-Host ''
Write-Host '=========================================='
Write-Host '  本地服务器已启动（支持并发）'
Write-Host ('  请在浏览器里访问：' + $url)
Write-Host '  下载 / 播放 / 进度条 在这个地址下都正常'
Write-Host '  要停止服务器：关掉这个窗口 或 按 Ctrl+C'
Write-Host '=========================================='
Write-Host ''
Start-Process $url

# ---------- 线程池：每个连接一个 runspace，互不排队 ----------
$pool = [runspacefactory]::CreateRunspacePool(2, 24)
$pool.Open()
$running = New-Object System.Collections.ArrayList

try{
  while($true){
    $client = $listener.AcceptTcpClient()

    $ps = [powershell]::Create()
    $ps.RunspacePool = $pool
    $null = $ps.AddScript($worker).AddArgument($client).AddArgument($root)
    $null = $running.Add([pscustomobject]@{ PS = $ps; Async = $ps.BeginInvoke() })

    # 回收已完成的：否则长跑会攒下大量 PowerShell 对象
    for($i = $running.Count - 1; $i -ge 0; $i--){
      $item = $running[$i]
      if($item.Async.IsCompleted){
        try{
          $out = $item.PS.EndInvoke($item.Async)
          if($out){ Write-Host $out }
        }catch{}
        try{ $item.PS.Dispose() }catch{}
        $running.RemoveAt($i)
      }
    }
  }
}finally{
  try{ $pool.Close() }catch{}
  $listener.Stop()
}
