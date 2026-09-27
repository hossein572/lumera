#!/usr/bin/env bash
# Builds derived image variants from the masters in public/img.
# Masters were produced once from the original photographic assets.
set -e
OUT=public/img
cd "$(dirname "$0")/.."

# --- category tiles: wide editorial crops + tinted fragments -------------
for n in skin hair nails makeup care massage; do
  convert "$OUT/cat-$n.jpg" -gravity Center -crop 900x620+0+150 +repage -strip -quality 80 "$OUT/cat-$n-wide.jpg"
  convert "$OUT/cat-$n-wide.jpg" -gravity East -crop 420x620+0+0 +repage -modulate 92,86 -fill "#C96CFF" -colorize 9 -strip -quality 76 "$OUT/frag-$n.jpg"
  convert "$OUT/cat-$n-wide.jpg" -gravity West -crop 620x620+0+0 +repage -modulate 88,92 -strip -quality 78 "$OUT/work-$n-1.jpg"
  convert "$OUT/cat-$n-wide.jpg" -gravity Center -crop 520x620+380+0 +repage -modulate 96,80 -strip -quality 78 "$OUT/work-$n-2.jpg"
  convert "$OUT/cat-$n.jpg" -gravity Center -crop 700x700+100+330 +repage -strip -quality 80 "$OUT/work-$n-3.jpg"
done

# --- specialist imagery: re-framed crops inside the original frame ---------
for i in 1 2 3; do
  convert "$OUT/portrait-$i.jpg" -gravity Center -crop 900x620+0+120 +repage -strip -quality 80 "$OUT/portrait-$i-wide.jpg"
  convert "$OUT/portrait-$i.jpg" -gravity North -crop 800x800+50+20 +repage -strip -quality 82 "$OUT/portrait-$i-face.jpg"
  convert "$OUT/portrait-$i.jpg" -gravity South -resize 1000x1000 -gravity North -crop 900x900+50+55 +repage -modulate 98,90 -strip -quality 80 "$OUT/portrait-$i-alt.jpg"
done

# derived variants (tone shift only, keeps the frame seamless)
convert "$OUT/portrait-1-alt.jpg" -modulate 100,84 -fill "#6EF2D0" -colorize 5 -strip -quality 82 "$OUT/portrait-alt-4.jpg"
convert "$OUT/portrait-2-alt.jpg" -modulate 98,80 -fill "#C96CFF" -colorize 6 -strip -quality 82 "$OUT/portrait-alt-5.jpg"
convert "$OUT/portrait-3-alt.jpg" -modulate 102,88 -fill "#FF7A9E" -colorize 4 -strip -quality 82 "$OUT/portrait-alt-6.jpg"

identify -format "%f %wx%h %b\n" "$OUT"/*.jpg | sort
du -sh "$OUT"
