"""Monta a landing page da proposta Sinaf (manutenção do portal) a partir do template, dos logos e da imagem social.
Saída: ../../publicar/sinaf_2026-09-21_manutencao-portal.html (arquivo único, offline) + cópia da imagem social.
Para o deploy, defina PUBLIC_PAGE_URL com a URL final da página (https://...): o script resolve a URL absoluta
da imagem de compartilhamento e adiciona og:url."""
import base64, os, pathlib, shutil, sys
from html import escape
from urllib.parse import urljoin

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'sinaf_2026-09-21_manutencao-portal.template.html'
OUT = ROOT.parent.parent / 'publicar' / 'sinaf_2026-09-21_manutencao-portal.html'
MAT = ROOT.parent / 'imagens'

def data_uri(path, mime='image/svg+xml'):
    b = path.read_bytes()
    return f'data:{mime};base64,' + base64.b64encode(b).decode()

html = SRC.read_text(encoding='utf-8')
html = html.replace('{{LOGO_SYMBOL}}', data_uri(MAT / 'fattoria-simbolo.svg'))
html = html.replace('{{LOGO_TEXT}}', data_uri(MAT / 'fattoria-texto.svg'))
html = html.replace('{{BRUNO_PORTRAIT}}', data_uri(MAT / 'bruno-portrait-v1.webp', 'image/webp'))
html = html.replace('{{THIAGO_PORTRAIT}}', data_uri(MAT / 'thiago-nobrega-portrait-v1.webp', 'image/webp'))

# Imagem de compartilhamento (og:image / twitter:image). Sem PUBLIC_PAGE_URL fica relativa ao HTML.
social_name = 'sinaf-manutencao-portal-social.png'
public_page_url = os.environ.get('PUBLIC_PAGE_URL', '')
html = html.replace('{{SOCIAL_IMAGE_URL}}', escape(urljoin(public_page_url, social_name), quote=True))
if public_page_url:
    html = html.replace('</head>', '<meta property="og:url" content="' + escape(public_page_url, quote=True) + '"></head>')
assert '{{' not in html, 'placeholder sobrando'

if len(sys.argv) > 1:
    OUT = pathlib.Path(sys.argv[1])
OUT.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(MAT / social_name, OUT.parent / social_name)
OUT.write_text(html, encoding='utf-8')
print(OUT, len(html))
