from PIL import Image
from pathlib import Path
from collections import Counter

files = [
    'src/assets/colleges/igdtuw.png',
    'src/assets/colleges/nsut.png',
    'src/assets/colleges/dtu.png',
    'src/assets/colleges/iit-delhi.png',
    'src/assets/colleges/iiit-delhi.png',
]

for f in files:
    p = Path(f)
    img = Image.open(p).convert('RGBA')
    pixels = list(img.getdata())
    counts = Counter((r, g, b, a) for r, g, b, a in pixels)
    print(p.name, 'mode=', img.mode, 'size=', img.size)
    for color, count in counts.most_common(15):
        print(' ', color, count)
    print('---')
