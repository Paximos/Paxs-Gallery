param([string]$Src, [string]$Out, [string]$Prefix)
Add-Type -AssemblyName System.Drawing
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
New-Item -ItemType Directory -Force $Out | Out-Null
$rows = @()
$i = 0
function Prop($img, $id) { try { return $img.GetPropertyItem($id) } catch { return $null } }
function Rat($p, $off) { $n = [BitConverter]::ToUInt32($p.Value, $off); $d = [BitConverter]::ToUInt32($p.Value, $off + 4); if ($d -eq 0) { return 0 }; return $n / $d }
function Str($p) { if ($p) { return ([Text.Encoding]::ASCII.GetString($p.Value)).Trim([char]0).Trim() } return '' }
Get-ChildItem $Src -Filter *.jpg | Sort-Object Name | ForEach-Object {
  $i++
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $o = Prop $img 0x0112
  if ($o) {
    switch ([BitConverter]::ToUInt16($o.Value, 0)) {
      3 { $img.RotateFlip('Rotate180FlipNone') }
      6 { $img.RotateFlip('Rotate90FlipNone') }
      8 { $img.RotateFlip('Rotate270FlipNone') }
    }
  }
  $make = Str (Prop $img 0x010F); $model = Str (Prop $img 0x0110)
  $f = Prop $img 0x829D; $e = Prop $img 0x829A; $iso = Prop $img 0x8827; $fl = Prop $img 0x920A; $dt = Str (Prop $img 0x9003)
  $name = '{0}-{1:D2}' -f $Prefix, $i
  foreach ($size in @(@{ s = 2400; tag = '' }, @{ s = 900; tag = '-sm' })) {
    $w = $img.Width; $h = $img.Height
    $scale = [Math]::Min([double]1, [double]$size.s / [Math]::Max($w, $h))
    $nw = [int]($w * $scale); $nh = [int]($h * $scale)
    $bmp = New-Object System.Drawing.Bitmap $nw, $nh
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]80)
    $bmp.Save((Join-Path $Out "$name$($size.tag).jpg"), $codec, $ep)
    $g.Dispose(); $bmp.Dispose()
  }
  $rows += [pscustomobject]@{
    id = $name; source = $_.Name; w = $img.Width; h = $img.Height
    camera = ("$make $model").Trim()
    f = if ($f) { [Math]::Round((Rat $f 0), 1) } else { $null }
    shutter = if ($e) { $v = Rat $e 0; if ($v -gt 0 -and $v -lt 1) { "1/$([Math]::Round(1 / $v))" } elseif ($v) { "$v" } else { $null } } else { $null }
    iso = if ($iso) { [BitConverter]::ToUInt16($iso.Value, 0) } else { $null }
    focal = if ($fl) { [Math]::Round((Rat $fl 0)) } else { $null }
    date = $dt
  }
  $img.Dispose()
}
$rows | ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $Out "$Prefix.json")
