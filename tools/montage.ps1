param([string]$Dir, [string]$Out, [int]$Cols = 6, [int]$Cell = 300)
# Builds a labelled preview grid of every *-sm.jpg in a folder.
Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem $Dir -Filter *-sm.jpg | Sort-Object Name
$rows = [Math]::Ceiling($files.Count / $Cols)
$bmp = New-Object System.Drawing.Bitmap ($Cols * $Cell), ($rows * ($Cell + 24))
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Black)
$font = New-Object System.Drawing.Font 'Arial', 12
$i = 0
foreach ($f in $files) {
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $s = [Math]::Min([double]($Cell - 8) / $img.Width, [double]($Cell - 8) / $img.Height)
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)
  $x = ($i % $Cols) * $Cell + [int](($Cell - $w) / 2)
  $y = [Math]::Floor($i / $Cols) * ($Cell + 24) + [int](($Cell - $h) / 2)
  $g.DrawImage($img, $x, $y, $w, $h)
  $g.DrawString($f.BaseName, $font, [System.Drawing.Brushes]::White, (($i % $Cols) * $Cell + 4), ([Math]::Floor($i / $Cols) * ($Cell + 24) + $Cell))
  $img.Dispose(); $i++
}
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
