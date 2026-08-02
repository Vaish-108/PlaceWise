from rembg import remove
from PIL import Image
from pathlib import Path

files = [
    'src/assets/colleges/igdtuw.png',
    'src/assets/colleges/nsut.png',
    'src/assets/colleges/dtu.png',
    'src/assets/colleges/iit-delhi.png',
    'src/assets/colleges/iiit-delhi.png',
]

for f in files:
    input_path = Path(f)
    output_path = input_path.with_name(input_path.stem + '-transparent.png')
    img = Image.open(input_path)
    out = remove(img)
    out.save(output_path)
    print('saved', output_path)
