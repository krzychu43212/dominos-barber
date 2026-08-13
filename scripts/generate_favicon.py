"""Generate favicon set and Open Graph image for Dominos Barber."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "images" / "logo.png"
OUT_DIR = ROOT / "images"
LOGO_BG = (250, 247, 242, 255)
ICON_BG = (255, 255, 255, 255)
CREAM = (250, 247, 242, 255)
NAVY = (26, 39, 68, 255)
RED = (196, 30, 58, 255)
MUTED = (92, 100, 120, 255)

SQUIRCLE_RATIO = 0.22
POLE_PADDING_RATIO = 0.15


def is_background(rgba, tolerance=35):
    return sum(abs(int(a) - int(b)) for a, b in zip(rgba, LOGO_BG)) <= tolerance


def squircle_mask(size: int, radius_ratio: float = SQUIRCLE_RATIO) -> Image.Image:
    radius = max(1, int(size * radius_ratio))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def find_pole_bounds(img: Image.Image) -> tuple[int, int, int, int]:
    w, h = img.size
    pixels = img.load()

    col_counts = [sum(1 for y in range(h) if not is_background(pixels[x, y])) for x in range(w)]
    threshold = h * 0.04
    pole_cols = [x for x, c in enumerate(col_counts) if c > threshold]
    if not pole_cols:
        raise RuntimeError("Could not detect barber pole in logo")

    x0, x1 = min(pole_cols), max(pole_cols)

    row_counts = [sum(1 for x in range(w) if not is_background(pixels[x, y])) for y in range(h)]
    mid_start, mid_end = int(h * 0.35), int(h * 0.65)
    banner_rows = [y for y in range(mid_start, mid_end) if row_counts[y] > w * 0.25]
    if banner_rows:
        banner_top, banner_bottom = min(banner_rows), max(banner_rows)
    else:
        banner_top, banner_bottom = int(h * 0.42), int(h * 0.58)

    return x0, x1, banner_top, banner_bottom


def rgba_to_key(rgba, bg=LOGO_BG, tolerance=35) -> bool:
    return is_background(rgba, tolerance)


def remove_background(img: Image.Image, bg=LOGO_BG, tolerance=35) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            if rgba_to_key(pixels[x, y], bg, tolerance):
                pixels[x, y] = (0, 0, 0, 0)
    return img


def extract_pole_only(img: Image.Image) -> Image.Image:
    """Extract full barber pole (both caps + stripes), excluding text banner."""
    w, h = img.size
    x0, x1, banner_top, banner_bottom = find_pole_bounds(img)
    pad_x = max(2, int((x1 - x0) * 0.08))

    top = img.crop((x0 - pad_x, 0, x1 + pad_x, banner_top - 4))
    bottom = img.crop((x0 - pad_x, banner_bottom + 4, x1 + pad_x, h))

    combined_h = top.height + bottom.height
    pole = Image.new("RGBA", (max(top.width, bottom.width), combined_h), (0, 0, 0, 0))
    pole.paste(top, ((pole.width - top.width) // 2, 0), top)
    pole.paste(bottom, ((pole.width - bottom.width) // 2, top.height), bottom)
    return remove_background(pole)


def trim_to_content(img: Image.Image, tolerance=35) -> Image.Image:
    alpha = img.split()[3]
    bbox = alpha.getbbox()
    if not bbox:
        return img
    margin = 2
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(img.width, bbox[2] + margin)
    bottom = min(img.height, bbox[3] + margin)
    return img.crop((left, top, right, bottom))


def make_squircle_icon(pole: Image.Image, size: int) -> Image.Image:
    mask = squircle_mask(size)
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    white = Image.new("RGBA", (size, size), ICON_BG)
    icon.paste(white, mask=mask)

    padding = int(size * POLE_PADDING_RATIO)
    inner = max(1, size - padding * 2)
    scaled = pole.copy()
    scaled.thumbnail((inner, inner), Image.Resampling.LANCZOS)
    ox = (size - scaled.width) // 2
    oy = (size - scaled.height) // 2

    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    layer.paste(scaled, (ox, oy), scaled)
    icon = Image.alpha_composite(icon, layer)

    alpha = icon.split()[3]
    icon.putalpha(ImageChops.multiply(alpha, mask))
    return icon


def save_png(img: Image.Image, path: Path) -> None:
    img.convert("RGBA").save(path, optimize=True)


def save_ico(images: list[Image.Image], path: Path) -> None:
    images[0].save(
        path,
        format="ICO",
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:],
    )


def load_font(size: int, serif: bool = False) -> ImageFont.FreeTypeFont:
    candidates = (
        [
            "C:/Windows/Fonts/GEORGIAZ.TTF",
            "C:/Windows/Fonts/GEORGIA.TTF",
            "C:/Windows/Fonts/timesbd.ttf",
        ]
        if serif
        else [
            "C:/Windows/Fonts/segoeuib.ttf",
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ]
    )
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_og_image(pole: Image.Image, path: Path) -> None:
    width, height = 1200, 630
    canvas = Image.new("RGBA", (width, height), CREAM)
    draw = ImageDraw.Draw(canvas)

    font_title = load_font(72, serif=True)
    font_tagline = load_font(34)
    font_meta = load_font(26)
    font_small = load_font(22)

    # Left accent bar
    draw.rectangle((0, 0, 8, height), fill=RED)

    # Decorative navy block (subtle)
    draw.rounded_rectangle((60, 60, width - 60, height - 60), radius=24, outline=NAVY, width=2)

    # Pole on left inside card
    pole_large = remove_background(pole.copy())
    pole_large.thumbnail((220, 420), Image.Resampling.LANCZOS)
    pole_x = 120
    pole_y = (height - pole_large.height) // 2
    canvas.paste(pole_large, (pole_x, pole_y), pole_large)

    text_x = 400
    text_w = width - text_x - 100

    # Red eyebrow line + label
    draw.rectangle((text_x, 150, text_x + 56, 154), fill=RED)
    draw.text((text_x, 168), "BARBER · OLSZYNA", font=font_small, fill=RED)

    y = 210
    for line in ["Dominos", "Barber"]:
        bbox = draw.textbbox((0, 0), line, font=font_title)
        draw.text((text_x, y), line, font=font_title, fill=NAVY)
        y += bbox[3] - bbox[1] + 4

    y += 18
    tagline = "Męski styl, fryzjerstwo i brody z pasją."
    draw.text((text_x, y), tagline, font=font_tagline, fill=MUTED)
    y += 56

    draw.line((text_x, y, text_x + 120, y), fill=RED, width=3)
    y += 28

    address_lines = [
        "Chopina 27A, Olszyna",
        "59-830 · Dolnośląskie",
    ]
    for line in address_lines:
        draw.text((text_x, y), line, font=font_meta, fill=NAVY)
        y += 36

    y += 8
    draw.text((text_x, y), "dominosbarber.pl", font=font_meta, fill=RED)

    # Subtle stripe pattern on right
    for i in range(6):
        x = width - 180 + i * 22
        points = [(x, height - 40), (x + 14, height - 220), (x + 28, height - 40)]
        color = RED if i % 3 == 0 else NAVY if i % 3 == 1 else (255, 255, 255, 180)
        draw.polygon(points, fill=color)

    canvas.convert("RGB").save(path, format="JPEG", quality=92, optimize=True)


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    pole = trim_to_content(extract_pole_only(logo))

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    png_specs = {
        "favicon-16x16.png": 16,
        "favicon-32x32.png": 32,
        "apple-touch-icon.png": 180,
    }
    ico_images: list[Image.Image] = []

    for name, px in png_specs.items():
        icon = make_squircle_icon(pole, px)
        save_png(icon, OUT_DIR / name)
        if px in (16, 32):
            ico_images.append(icon)

    icon48 = make_squircle_icon(pole, 48)
    ico_images.append(icon48)
    save_ico(ico_images, ROOT / "favicon.ico")
    save_png(make_squircle_icon(pole, 32), ROOT / "favicon-32x32.png")

    og_path = OUT_DIR / "og-image.jpg"
    make_og_image(pole, og_path)

    print("Created:")
    for p in [
        ROOT / "favicon.ico",
        ROOT / "favicon-32x32.png",
        OUT_DIR / "favicon-16x16.png",
        OUT_DIR / "favicon-32x32.png",
        OUT_DIR / "apple-touch-icon.png",
        og_path,
    ]:
        print(f"  {p.relative_to(ROOT)} ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
