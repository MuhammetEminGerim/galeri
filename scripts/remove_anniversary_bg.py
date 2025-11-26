from PIL import Image


def main():
    image_path = "public/anniversary.png"
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size
    removed = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r > 230 and g > 220 and b > 200:
                pixels[x, y] = (r, g, b, 0)
                removed += 1

    img.save(image_path)
    print(f"Removed background pixels: {removed}")


if __name__ == "__main__":
    main()

