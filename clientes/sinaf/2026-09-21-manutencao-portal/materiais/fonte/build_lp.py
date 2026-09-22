"""Monta as landing pages da proposta Sinaf (manutenção do portal) a partir dos templates, dos logos,
dos retratos e das imagens sociais. Gera as duas versões em ../../publicar/ (arquivos únicos, offline):

  v1  sinaf_2026-09-21_manutencao-portal.html     manutenção até 29/01/2027, contrato anual a partir de fev/2027
  v2  sinaf_2026-09-22_manutencao-portal-v2.html  manutenção até 31/12/2026, contrato anual a partir de jan/2027

Uso: python3 build_lp.py            (gera as duas)
     python3 build_lp.py v2         (gera só a v2; idem para v1)
     python3 build_lp.py v1 v2 --out /outra/pasta

Para o deploy, defina PUBLIC_BASE_URL com a URL da pasta publicada (https://.../): o script monta a URL
de cada página, resolve a URL absoluta da imagem de compartilhamento e adiciona og:url."""
import base64, os, pathlib, shutil, sys
from html import escape
from urllib.parse import urljoin

ROOT = pathlib.Path(__file__).parent
MAT = ROOT.parent / 'imagens'
OUT_DIR = ROOT.parent.parent / 'publicar'

VARIANTS = {
    'v1': ('sinaf_2026-09-21_manutencao-portal.template.html',
           'sinaf_2026-09-21_manutencao-portal.html',
           'sinaf-manutencao-portal-social.png'),
    'v2': ('sinaf_2026-09-22_manutencao-portal-v2.template.html',
           'sinaf_2026-09-22_manutencao-portal-v2.html',
           'sinaf-manutencao-portal-v2-social.png'),
}

def data_uri(path, mime='image/svg+xml'):
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

args = sys.argv[1:]
if '--out' in args:
    i = args.index('--out')
    OUT_DIR = pathlib.Path(args[i + 1])
    del args[i:i + 2]
selected = args or list(VARIANTS)
base_url = os.environ.get('PUBLIC_BASE_URL', '')
if base_url and not base_url.endswith('/'):
    base_url += '/'

assets = {
    '{{LOGO_SYMBOL}}': data_uri(MAT / 'fattoria-simbolo.svg'),
    '{{LOGO_TEXT}}': data_uri(MAT / 'fattoria-texto.svg'),
    '{{BRUNO_PORTRAIT}}': data_uri(MAT / 'bruno-portrait-v1.webp', 'image/webp'),
    '{{THIAGO_PORTRAIT}}': data_uri(MAT / 'thiago-nobrega-portrait-v1.webp', 'image/webp'),
}

OUT_DIR.mkdir(parents=True, exist_ok=True)
for key in selected:
    template, out_name, social_name = VARIANTS[key]
    html = (ROOT / template).read_text(encoding='utf-8')
    for placeholder, value in assets.items():
        html = html.replace(placeholder, value)
    # Imagem de compartilhamento (og:image / twitter:image). Sem PUBLIC_BASE_URL fica relativa ao HTML.
    page_url = urljoin(base_url, out_name) if base_url else ''
    html = html.replace('{{SOCIAL_IMAGE_URL}}', escape(urljoin(page_url, social_name), quote=True))
    if page_url:
        html = html.replace('</head>', '<meta property="og:url" content="' + escape(page_url, quote=True) + '"></head>')
    assert '{{' not in html, f'placeholder sobrando em {template}'
    shutil.copy2(MAT / social_name, OUT_DIR / social_name)
    out = OUT_DIR / out_name
    out.write_text(html, encoding='utf-8')
    print(key, out, len(html))
