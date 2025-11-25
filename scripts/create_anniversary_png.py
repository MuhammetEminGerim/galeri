import os

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
OUTPUT_PATH = os.path.join(PUBLIC_DIR, "anniversary.png")

WIDTH, HEIGHT = 700, 500
BACKGROUND_COLOR = (248, 246, 241)
TEXT_COLOR = (225, 112, 16)
TEXT = "1. Yıl"


def load_font():
  font_candidates = [
      "C:/Windows/Fonts/BRUSHSCI.TTF",
      "C:/Windows/Fonts/segoesc.ttf",
      "C:/Windows/Fonts/segoescb.ttf",
      "C:/Windows/Fonts/SegoeScript.ttf",
      "C:/Windows/Fonts/cour.ttf",
  ]
  for path in font_candidates:
    if os.path.exists(path):
      return ImageFont.truetype(path, 220)
  return ImageFont.load_default()


def main():
  os.makedirs(PUBLIC_DIR, exist_ok=True)
  img = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND_COLOR)
  draw = ImageDraw.Draw(img)

  font = load_font()
  bbox = draw.textbbox((0, 0), TEXT, font=font)
  text_width = bbox[2] - bbox[0]
  text_height = bbox[3] - bbox[1]
  x = (WIDTH - text_width) / 2
  y = (HEIGHT - text_height) / 2 - 30

  draw.text((x, y), TEXT, fill=TEXT_COLOR, font=font)

  underline_start = WIDTH * 0.15
  underline_end = WIDTH * 0.85
  line_y = y + text_height + 25
  draw.line((underline_start, line_y, underline_end, line_y), fill=TEXT_COLOR, width=18)

  img.save(OUTPUT_PATH, format="PNG")
  print(f"✅ Anniversary badge saved to {OUTPUT_PATH}")


if __name__ == "__main__":
  main()

