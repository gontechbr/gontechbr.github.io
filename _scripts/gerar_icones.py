"""Gera favicon.ico, os PNG de ícone e a og-image do site a partir da Unbounded ExtraBold.

Segue as regras de 01-logo do repo go-marca: quadrado grafite com raio de 22% do lado, "GO" claro
e "!" verde, espaçamento de -0,05 em. Em 16 px usa a variante "G!", porque "GO!" fica ilegível.

Uso (na raiz do repo):
    python _scripts/gerar_icones.py caminho/para/Unbounded-ExtraBold.ttf

A fonte estática de peso 800 sai do arquivo variável do Google Fonts (ofl/unbounded) com
fontTools.varLib.instancer. Os arquivos gerados vão para a raiz do repo.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

GRAFITE = (0x0F, 0x11, 0x14, 255)
CLARO = (0xF4, 0xF5, 0xF7, 255)
VERDE = (0x0A, 0x9E, 0x64, 255)
CINZA = (0x9A, 0xA1, 0xAC, 255)

# Desenha grande e reduz, para a borda das letras ficar suave nos tamanhos pequenos.
SUPERSAMPLE = 8

ROOT = Path(__file__).resolve().parent.parent


def draw_word(draw, font, parts, center_x, center_y):
    """Desenha as partes (texto, cor) lado a lado com o espaçamento da marca, centralizadas pela caixa
    real das letras (não pela linha de base), para o logo ficar no meio do quadrado."""
    tracking = -0.05 * font.size
    glyphs = [(char, color) for text, color in parts for char in text]

    pen_x = 0.0
    boxes = []
    for char, color in glyphs:
        left, top, right, bottom = font.getbbox(char, anchor="ls")
        boxes.append((pen_x, char, color, left, top, right, bottom))
        pen_x += font.getlength(char) + tracking

    min_x = min(x + left for x, _, _, left, _, _, _ in boxes)
    max_x = max(x + right for x, _, _, _, _, right, _ in boxes)
    min_y = min(top for *_, top, _, _ in boxes)
    max_y = max(bottom for *_, bottom in boxes)

    origin_x = center_x - (min_x + max_x) / 2
    baseline_y = center_y - (min_y + max_y) / 2
    for x, char, color, *_ in boxes:
        draw.text((origin_x + x, baseline_y), char, font=font, fill=color, anchor="ls")


def make_icon(font_path, size, word_parts, width_ratio):
    """Ícone quadrado. width_ratio é a fração do lado que o texto ocupa na horizontal."""
    big = size * SUPERSAMPLE
    image = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((0, 0, big - 1, big - 1), radius=round(big * 0.22), fill=GRAFITE)

    font = fit_font(font_path, word_parts, big * width_ratio)
    draw_word(draw, font, word_parts, big / 2, big / 2)
    return image.resize((size, size), Image.LANCZOS)


def fit_font(font_path, word_parts, target_width):
    """Acha o tamanho de fonte em que a palavra ocupa target_width pixels."""
    text = "".join(text for text, _ in word_parts)
    probe = ImageFont.truetype(str(font_path), 1000)
    probe_width = sum(probe.getlength(char) for char in text) - 0.05 * 1000 * (len(text) - 1)
    return ImageFont.truetype(str(font_path), round(1000 * target_width / probe_width))


def make_og_image(font_path):
    """Imagem de 1200 x 630 que aparece quando o link do site é compartilhado."""
    width, height = 1200, 630
    image = Image.new("RGBA", (width * 2, height * 2), GRAFITE)
    draw = ImageDraw.Draw(image)
    font = fit_font(font_path, [("GO", CLARO), ("!", VERDE)], width * 2 * 0.42)
    draw_word(draw, font, [("GO", CLARO), ("!", VERDE)], width, height * 0.92)

    caption_font = ImageFont.truetype(str(font_path), 52)
    caption = "software industrial"
    caption_width = caption_font.getlength(caption)
    draw.text(((width * 2 - caption_width) / 2, height * 1.42), caption, font=caption_font, fill=CINZA)
    return image.resize((width, height), Image.LANCZOS).convert("RGB")


def main():
    if len(sys.argv) != 2:
        sys.exit("Informe o caminho da Unbounded-ExtraBold.ttf. Exemplo: python _scripts/gerar_icones.py Unbounded-ExtraBold.ttf")
    font_path = Path(sys.argv[1])
    if not font_path.is_file():
        sys.exit(f"Fonte não encontrada em {font_path}. Gere a instância de peso 800 a partir do arquivo variável.")

    full_word = [("GO", CLARO), ("!", VERDE)]
    short_word = [("G", CLARO), ("!", VERDE)]

    favicon_16 = make_icon(font_path, 16, short_word, 0.70)
    favicon_32 = make_icon(font_path, 32, full_word, 0.80)
    favicon_48 = make_icon(font_path, 48, full_word, 0.78)
    favicon_32.save(ROOT / "favicon-32.png")
    favicon_48.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[favicon_16, favicon_32])

    make_icon(font_path, 180, full_word, 0.70).save(ROOT / "apple-touch-icon.png")
    make_icon(font_path, 192, full_word, 0.70).save(ROOT / "icon-192.png")
    make_icon(font_path, 512, full_word, 0.70).save(ROOT / "icon-512.png")
    make_og_image(font_path).save(ROOT / "og-image.png")
    print(f"Ícones gerados em {ROOT}")


if __name__ == "__main__":
    main()
