import os
import argparse
from PIL import Image, ImageEnhance, ImageFilter

INPUT_BASE = r"c:\Programmes\SoulOfLight\public\originals"
OUTPUT_BASE = r"c:\Programmes\SoulOfLight\public\images"
VALID_EXT = (".jpg", ".jpeg", ".png")

CARDS_DIR = "cards"
THUMBS_DIR = "thumbs"

# ============================================================
# 🔥 ESTÉTICA: Realce Profesional (modo e-commerce)
# ============================================================

def enhance_image(img):
    """Aplica mejoras suaves estilo ecommerce."""
    img = ImageEnhance.Brightness(img).enhance(1.08)
    img = ImageEnhance.Contrast(img).enhance(1.12)
    img = ImageEnhance.Color(img).enhance(1.10)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=3))
    return img


# ============================================================
# 📌 Center Crop Inteligente
# ============================================================

def center_crop(img, target_width, target_height, bias_bottom=0.20):
    """
    Realiza un crop horizontal 2:1 priorizando la zona inferior
    (para no cortar productos sobre mesa).
    bias_bottom = cuánto bajar el recorte (0.20 = 20%)
    """
    src_width, src_height = img.size
    target_ratio = target_width / target_height
    src_ratio = src_width / src_height

    # Redimensionado manteniendo aspecto
    if src_ratio > target_ratio:
        new_height = target_height
        new_width = int(new_height * src_ratio)
    else:
        new_width = target_width
        new_height = int(new_width / src_ratio)

    img = img.resize((new_width, new_height), Image.LANCZOS)

    # Recorte horizontal
    left = (new_width - target_width) // 2
    right = left + target_width

    # Recorte vertical inteligente
    excess_h = new_height - target_height

    # desplazamos el recorte hacia abajo para no cortar producto
    top = int(excess_h * (0.5 - bias_bottom))
    top = max(0, min(top, excess_h))  # límites seguros

    bottom = top + target_height

    return img.crop((left, top, right, bottom))


# ============================================================
# 📌 Guardado múltiple (JPG + WebP)
# ============================================================

def save_img(img, out_path_no_ext):
    jpg_path = out_path_no_ext + ".jpg"
    webp_path = out_path_no_ext + ".webp"

    img.save(jpg_path, "JPEG", optimize=True, quality=90)
    img.save(webp_path, "WEBP", quality=90, method=6)

    return jpg_path, webp_path


# ============================================================
# 📌 Procesamiento de una imagen
# ============================================================

def process_image(file_path, rel_dir, out_cards_dir, out_thumbs_dir):
    filename = os.path.basename(file_path)
    base_name, _ = os.path.splitext(filename)

    print(f"Procesando: {rel_dir}/{filename}")

    with Image.open(file_path) as img:
        img = img.convert("RGB")
        img = enhance_image(img)

        os.makedirs(out_cards_dir, exist_ok=True)
        os.makedirs(out_thumbs_dir, exist_ok=True)

        # ===== CARD 1600×800 (2:1) =====
        card = center_crop(img, 1600, 800)
        save_img(card, os.path.join(out_cards_dir, base_name))

        # ===== THUMB 600×600 (1:1) =====
        thumb = center_crop(img, 600, 600)
        save_img(thumb, os.path.join(out_thumbs_dir, "thumb-" + base_name))


# ============================================================
# 📌 Recorrido recursivo
# ============================================================

def process_folder(input_base, output_base):
    out_cards = os.path.join(output_base, CARDS_DIR)
    out_thumbs = os.path.join(output_base, THUMBS_DIR)
    for current_dir, subdirs, files in os.walk(input_base):
        rel_dir = os.path.relpath(current_dir, input_base)
        if rel_dir == ".":
            rel_dir = ""
        for file in files:
            if file.lower().endswith(VALID_EXT):
                full_path = os.path.join(current_dir, file)
                try:
                    process_image(full_path, rel_dir, out_cards, out_thumbs)
                except Exception as e:
                    print(f"⚠️ Error con {file}: {e}")


# ============================================================
# 📌 MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="Procesador de imágenes Alma de Luz")
    parser.add_argument("--input", default=INPUT_BASE, help="Carpeta de originales")
    parser.add_argument("--output", default=OUTPUT_BASE, help="Carpeta de salida base (images)")
    args = parser.parse_args()

    print("=== SOUL OF LIGHT — PROCESAMIENTO DE IMÁGENES ===")
    print(f"Origen: {args.input}")
    print(f"Salida: {args.output} / {CARDS_DIR}, {THUMBS_DIR}")
    process_folder(args.input, args.output)
    print("=== COMPLETADO ===")


if __name__ == "__main__":
    main()
