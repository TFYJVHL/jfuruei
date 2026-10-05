# ============================================================
#  扫描 files/ 目录，生成项目页「资源下载」的索引文件 files-index.js
#  用法：双击根目录下的「更新文件索引.bat」，或右键本文件用 PowerShell 运行
# ============================================================

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if(-not $root){ $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

$filesDir = Join-Path $root 'files'
$outFile  = Join-Path $root 'files-index.js'

if(-not (Test-Path -LiteralPath $filesDir)){
  Write-Host "找不到 files 文件夹：$filesDir" -ForegroundColor Red
  exit 1
}

# 子目录 -> 分组名（分层整理过的目录单独成组）
$groupOfDir = @{
  'bat语言'  = 'BAT 语言'
  'VBS语言'  = 'VBS 语言'
  '用户交互' = '用户交互 / 游戏'
}
$order = @('C 源码','可执行程序','BAT 语言','批处理脚本','VBS 语言','VBS 脚本','用户交互 / 游戏','文档','其他')

function Get-Group($file, $relPath){
  $parts = $relPath -split '/'
  if($parts.Length -gt 2){                       # 位于子目录里
    $dir = $parts[1]
    if($groupOfDir.ContainsKey($dir)){ return $groupOfDir[$dir] }
    return "其他 / $dir"
  }
  switch($file.Extension.ToLower()){
    '.c'    { 'C 源码' }
    '.cpp'  { 'C 源码' }
    '.h'    { 'C 源码' }
    '.exe'  { '可执行程序' }
    '.msi'  { '可执行程序' }
    '.bat'  { '批处理脚本' }
    '.cmd'  { '批处理脚本' }
    '.vbs'  { 'VBS 脚本' }
    '.txt'  { '文档' }
    '.md'   { '文档' }
    '.pdf'  { '文档' }
    default { '其他' }
  }
}

Write-Host '正在扫描 files 目录…' -ForegroundColor Cyan

$items = @()
foreach($f in (Get-ChildItem -LiteralPath $filesDir -Recurse -File -Force | Where-Object { $_.Name -notlike '~$*' })){
  $rel = $f.FullName.Substring($root.Length).TrimStart('\','/').Replace('\','/')
  $items += [pscustomobject]@{
    n = $f.Name
    p = $rel
    s = $f.Length
    g = (Get-Group $f $rel)
  }
}

# 按分组顺序排，组内按名称排
$items = $items | Sort-Object @{Expression = {
  $i = $order.IndexOf($_.g)
  if($i -lt 0){ $order.Count } else { $i }
}}, n
$items = @($items)

$json = '[' + (($items | ForEach-Object { $_ | ConvertTo-Json -Compress }) -join ',') + ']'
# 把 \uXXXX 还原成中文，方便查看
$json = [regex]::Replace($json, '\\u([0-9a-fA-F]{4})', { param($m) [string][char][int]('0x' + $m.Groups[1].Value) })

$groupNames = @($items | Select-Object -ExpandProperty g -Unique)
$groupsJson = '[' + (($groupNames | ForEach-Object { '"' + $_ + '"' }) -join ',') + ']'
$totalMB = [math]::Round((($items | Measure-Object -Property s -Sum).Sum) / 1MB, 2)

$text = @"
/* =======================================================================
   项目页「资源下载」索引 —— 由「更新文件索引.bat」自动生成，请不要手改
   生成时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
   文件数量：$($items.Count) 个，合计约 $totalMB MB
   ======================================================================= */
window.SITE_FILES = $json;
window.SITE_FILE_GROUPS = $groupsJson;
"@

[System.IO.File]::WriteAllText($outFile, $text, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "已生成：$outFile" -ForegroundColor Green
Write-Host "共 $($items.Count) 个文件，约 $totalMB MB" -ForegroundColor Green

# ------------------------------------------------------------------
#  顺便把同样的清单写进 projects.html 的静态索引区
#  卡片列表是 JS 渲染的，搜索引擎抓不到；这段是给爬虫看的纯文本链接，
#  默认折叠，不影响页面观感。
# ------------------------------------------------------------------
$projFile = Join-Path $root 'projects.html'
if(Test-Path -LiteralPath $projFile){
  function Esc([string]$s){
    $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;')
  }
  $links = ($items | ForEach-Object {
    '<a href="' + (Esc $_.p) + '">' + (Esc $_.n) + '</a>'
  }) -join "`n      "

  $nl = [Environment]::NewLine
  $block = '<!--SEO-LIST:START-->' + $nl +
           '    <details class="seo-list">' + $nl +
           '      <summary>全部文件索引（' + $items.Count + ' 个，' + $totalMB + ' MB）</summary>' + $nl +
           '      <div class="seo-files">' + $nl + '      ' + $links + $nl +
           '      </div>' + $nl +
           '    </details>' + $nl +
           '    <!--SEO-LIST:END-->'

  $startTag = '<!--SEO-LIST:START-->'
  $endTag   = '<!--SEO-LIST:END-->'
  $html = [System.IO.File]::ReadAllText($projFile)
  $i = $html.IndexOf($startTag)
  $j = $html.IndexOf($endTag)
  if($i -ge 0 -and $j -gt $i){
    $new = $html.Substring(0, $i) + $block + $html.Substring($j + $endTag.Length)
    [System.IO.File]::WriteAllText($projFile, $new, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "已同步 projects.html 的静态文件索引" -ForegroundColor Green
  }
}
