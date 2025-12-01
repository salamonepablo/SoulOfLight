import os
import argparse
import random
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

# === RUTAS EXACTAS QUE USA TU APP ===
INPUT_BASE = r"c:\Programmes\SoulOfLight\public\originals"
OUTPUT_BASE = r"c:\Programmes\SoulOfLight\public\images"

VALID_EXT = (".jpg", ".jpeg", ".png")

CARDS_DIR = "cards"
THUMBS_DIR = "thumbs"

# ============================================================
# 🔥 ESTÉTICA: Realce suave tipo e-commerce
# ============================================================

def enhance_image(img: Image.Image) -> Image.Image:
    img = ImageEnhance.Brightness(img).enhance(1.05)
    img = ImageEnhance.Contrast(img).enhance(1.10)
    img = ImageEnhance.Color(img).enhance(1.08)
    img = ImageEnhance.Sharpness(img).enhance(1.10)
    return img


# ============================================================
# 🧱 FONDO GRIS NEUTRO PREMIUM (Opción A)
# ============================================================

def generate_premium_gray_bg(size=(1600, 800)):
    """
    Fondo gris cálido con textura estilo mármol suave.
    Más visible y estético para e-commerce.
    """
    w, h = size

    # Base cálida (menos fría que antes)
    base_color = (228, 226, 222)  # gris cálido elegante
    img = Image.new("RGB", size, base_color)
    draw = ImageDraw.Draw(img)

    # --- VETAS GRANDES Y SUAVES ---
    for _ in range(18):
        x1 = random.randint(0, w)
        y1 = random.randint(0, h)
        x2 = x1 + random.randint(-350, 350)
        y2 = y1 + random.randint(-350, 350)

        color = random.choice([
            (210, 208, 205),
            (205, 203, 200),
            (235, 233, 230),
        ])

        width = random.randint(20, 45)  # vetas grandes
        draw.line((x1, y1, x2, y2), fill=color, width=width)

    # Suavizado general (mantiene vetas pero más naturales)
    img = img.filter(ImageFilter.GaussianBlur(radius=30))

    # --- TEXTURA LEVE VISUAL (más fuerte que antes) ---
    noise = Image.effect_noise(size, 35).convert("L")  # más visible
    noise = noise.filter(ImageFilter.GaussianBlur(radius=8))

    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    img = Image.blend(img, noise_rgb, alpha=0.15)

    return img


# ============================================================
# 📐 Center crop (para thumbs)
# ============================================================

def center_crop(img: Image.Image, target_w: int, target_h: int, bias_bottom: float = 0.15) -> Image.Image:
    """
    Aspect-fill + recorte centrado con leve sesgo hacia abajo.
    Útil para thumbs cuadradas que no corten tanto el producto.
    """
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    # resize manteniendo aspecto para cubrir completamente el target
    if src_ratio > target_ratio:
        new_h = target_h
        new_w = int(new_h * src_ratio)
    else:
        new_w = target_w
        new_h = int(new_w / src_ratio)

    img = img.resize((new_w, new_h), Image.LANCZOS)

    left = (new_w - target_w) // 2
    right = left + target_w

    excess_h = new_h - target_h
    top = int(excess_h * (0.5 - bias_bottom))
    top = max(0, min(top, excess_h))
    bottom = top + target_h

    return img.crop((left, top, right, bottom))


# ============================================================
# 💾 Guardado múltiple (JPG + WebP)
# ============================================================

def save_img(img: Image.Image, out_path_no_ext: str):
    jpg_path = out_path_no_ext + ".jpg"
    webp_path = out_path_no_ext + ".webp"

    img.convert("RGB").save(jpg_path, "JPEG", optimize=True, quality=90)
    img.convert("RGB").save(webp_path, "WEBP", quality=90, method=6)

    return jpg_path, webp_path


# ============================================================
# 🧩 Procesamiento de UNA imagen
# ============================================================

def process_image(file_path: str, out_cards_dir: str, out_thumbs_dir: str):
    filename = os.path.basename(file_path)
    base_name, _ = os.path.splitext(filename)

    print(f"Procesando: {filename} ...")

    with Image.open(file_path) as img:
        img = img.convert("RGB")
        img = enhance_image(img)

        # asegurar carpetas
        os.makedirs(out_cards_dir, exist_ok=True)
        os.makedirs(out_thumbs_dir, exist_ok=True)

        # ---------- CARD 1600x800 con fondo gris premium ----------
        bg = generate_premium_gray_bg((1600, 800))

        src_w, src_h = img.size
        # queremos que la imagen ocupe aprox 90% del alto o ancho
        scale_margin = 0.90
        scale = min((1600 * scale_margin) / src_w, (800 * scale_margin) / src_h)

        new_w = int(src_w * scale)
        new_h = int(src_h * scale)
        img_resized = img.resize((new_w, new_h), Image.LANCZOS)

        # centrado
        x = (1600 - new_w) // 2
        y = (800 - new_h) // 2

        bg.paste(img_resized, (x, y))

        save_img(bg, os.path.join(out_cards_dir, base_name))

        # ---------- THUMB 600x600 (recorte centrado) ----------
        thumb = center_crop(img, 600, 600)
        save_img(thumb, os.path.join(out_thumbs_dir, "thumb-" + base_name))


# ============================================================
# 🔁 Recorrido recursivo de carpeta
# ============================================================

def process_folder(input_base: str, output_base: str):
    out_cards = os.path.join(output_base, CARDS_DIR)
    out_thumbs = os.path.join(output_base, THUMBS_DIR)

    for current_dir, subdirs, files in os.walk(input_base):
        for file in files:
            if file.lower().endswith(VALID_EXT):
                full_path = os.path.join(current_dir, file)
                try:
                    process_image(full_path, out_cards, out_thumbs)
                except Exception as e:
                    print(f"⚠️ Error con {file}: {e}")


# ============================================================
# 🏁 MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="Procesador de imágenes SoulOfLight (cards + thumbs)")
    parser.add_argument("--input", default=INPUT_BASE, help="Carpeta de originales")
    parser.add_argument("--output", default=OUTPUT_BASE, help="Carpeta base de salida (images)")
    args = parser.parse_args()

    print("=== SOUL OF LIGHT — PROCESAMIENTO DE IMÁGENES ===")
    print(f"Origen: {args.input}")
    print(f"Salida cards:  {os.path.join(args.output, CARDS_DIR)}")
    print(f"Salida thumbs: {os.path.join(args.output, THUMBS_DIR)}")
    process_folder(args.input, args.output)
    print("=== COMPLETADO ===")


if __name__ == "__main__":
    main()
