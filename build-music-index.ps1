# ============================================================
#  扫描 music/ 目录，生成「放松一下」页面的音乐索引 music-index.js
#  用法：把音乐拖进 music 文件夹 → 双击「更新音乐索引.bat」→ 刷新网页即可
#  （和「我的项目」页的 files-index.js 是完全一样的方式）
# ============================================================

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
if(-not $root){ $root = Split-Path -Parent $MyInvocation.MyCommand.Path }

$musicDir = Join-Path $root 'music'
$outFile  = Join-Path $root 'music-index.js'

if(-not (Test-Path -LiteralPath $musicDir)){
  New-Item -ItemType Directory -Path $musicDir | Out-Null
}

$audioExt = @('.mp3','.m4a','.aac','.wav','.ogg','.oga','.opus','.flac','.aiff','.aif','.webm','.wma')

Write-Host '正在扫描 music 目录…' -ForegroundColor Cyan

$items = @()
foreach($f in (Get-ChildItem -LiteralPath $musicDir -Recurse -File -Force |
               Where-Object { $audioExt -contains $_.Extension.ToLower() -and $_.Name -notlike '~$*' })){
  $rel = $f.FullName.Substring($root.Length).TrimStart('\','/').Replace('\','/')
  $parts = $rel -split '/'
  # 放在子文件夹里时，用文件夹名当作简介（例如 music/轻音乐/xxx.mp3 → 轻音乐）
  $desc = '来自 music 文件夹'
  if($parts.Length -gt 2){ $desc = $parts[1] }
  $items += [pscustomobject]@{
    n = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    p = $rel
    s = $f.Length
    d = $desc
  }
}

$items = @($items | Sort-Object n)

$json = '[' + (($items | ForEach-Object { $_ | ConvertTo-Json -Compress }) -join ',') + ']'
if($items.Count -eq 0){ $json = '[]' }
# 把 \uXXXX 还原成中文，方便查看
$json = [regex]::Replace($json, '\\u([0-9a-fA-F]{4})', { param($m) [string][char][int]('0x' + $m.Groups[1].Value) })

$totalMB = 0
if($items.Count -gt 0){ $totalMB = [math]::Round((($items | Measure-Object -Property s -Sum).Sum) / 1MB, 2) }

$text = @"
/* =======================================================================
   「放松一下」音乐索引 —— 由「更新音乐索引.bat」自动生成，请不要手改
   生成时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
   音乐数量：$($items.Count) 首，合计约 $totalMB MB
   ======================================================================= */
window.MUSIC_FILES = $json;
window.MUSIC_UPDATED = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')";
"@

[System.IO.File]::WriteAllText($outFile, $text, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "已生成：$outFile" -ForegroundColor Green
Write-Host "共 $($items.Count) 首音乐，约 $totalMB MB" -ForegroundColor Green
if($items.Count -eq 0){
  Write-Host 'music 文件夹里还没有音频，把 mp3 拖进去再运行一次即可。' -ForegroundColor Yellow
}
