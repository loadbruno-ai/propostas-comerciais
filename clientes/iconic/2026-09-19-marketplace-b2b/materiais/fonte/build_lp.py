"""Monta a landing page da proposta ICONIC a partir do template, dos logos e do mapa.
Saída: ../../publicar/iconic_2026-09-19_marketplace-b2b.html (arquivo único, offline)."""
import base64, re, pathlib, sys

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'iconic_2026-09-19_marketplace-b2b.template.html'
OUT = ROOT.parent.parent / 'publicar' / 'iconic_2026-09-19_marketplace-b2b.html'
MAT = ROOT.parent / 'imagens'

def data_uri(path, mime='image/svg+xml'):
    b = path.read_bytes()
    return f'data:{mime};base64,' + base64.b64encode(b).decode()

# Mapa: classe, estados em destaque e rótulos
svg = (MAT / 'mapa-brasil-svg-maps.svg').read_text(encoding='utf-8')
svg = re.sub(r'\s+', ' ', svg)
svg = re.sub(r'<svg[^>]*>',
             '<svg class="map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 613 639" role="img" aria-labelledby="mapt"><title id="mapt">Mapa do Brasil com Santa Catarina, Minas Gerais e Rio de Janeiro em destaque</title>',
             svg, count=1)
assert 'class="map"' in svg, 'cabeçalho do svg não encontrado'
for uf in ('sc', 'mg', 'rj'):
    svg, n = re.subn(rf'<path id="{uf}"', f'<path class="on" id="{uf}"', svg)
    assert n == 1, uf
labels = ('<g aria-hidden="true">'
          '<text x="446" y="372" text-anchor="middle">MG</text>'
          '<text x="534" y="450" text-anchor="start">RJ</text>'
          '<text x="358" y="536" text-anchor="middle">SC</text>'
          '</g>')
svg = svg.replace('</svg>', labels + '</svg>')

html = SRC.read_text(encoding='utf-8')
# Restore to True when the commercial chapter is ready to present.
SHOW_COMMERCIAL = False
if not SHOW_COMMERCIAL:
    html, removed = re.subn(r'<section class="chapter" id="comercial">.*?</section>', '', html, count=1, flags=re.S)
    assert removed == 1, 'capítulo comercial não encontrado'
    html = re.sub(r'<a href="#comercial">.*?</a>', '', html)
    html = html.replace('<a href="#fechar">10 / Para fechar</a>', '<a href="#fechar">09 / Para fechar</a>')
    html = html.replace('<span class="phase-number" aria-hidden="true">11</span>', '<span class="phase-number" aria-hidden="true">10</span>')

html = html.replace('{{LOGO_SYMBOL}}', data_uri(MAT / 'fattoria-simbolo.svg'))
html = html.replace('{{LOGO_TEXT}}', data_uri(MAT / 'fattoria-texto.svg'))
html = html.replace('{{MAP}}', svg)
html = html.replace('{{ANIME_JS}}', (ROOT / 'vendor' / 'anime-4.1.3.min.js').read_text(encoding='utf-8'))
for placeholder, filename in [('GSAP_JS', 'gsap.min.js'), ('SCROLLTRIGGER_JS', 'ScrollTrigger.min.js')]:
    html = html.replace('{{' + placeholder + '}}', (ROOT / 'vendor' / filename).read_text(encoding='utf-8'))
html = html.replace('{{HUBSPOT_LOGO}}', data_uri(MAT / 'hubspot.svg'))
html = html.replace('{{RD_LOGO}}', data_uri(MAT / 'rd-station.svg'))
html = html.replace('{{SCHEDULE_INFOGRAPHIC}}', data_uri(MAT / 'infografico-cronograma-estrategia-v2.png', 'image/png'))
html = html.replace('{{BRUNO_PORTRAIT}}', data_uri(MAT / 'bruno-branco-close-sorrindo-v1.png', 'image/png'))
html = html.replace('{{CASE_BRADESCO_COVER}}', data_uri(MAT / 'case-bradesco.jpg', 'image/jpeg'))
html = html.replace('{{CASE_BRADESCO_SCREEN}}', data_uri(MAT / 'case-bradesco-interface.jpg', 'image/jpeg'))
html = html.replace('{{CASE_IPIRANGA_COVER}}', data_uri(MAT / 'case-ipiranga.jpg', 'image/jpeg'))
html = html.replace('{{CASE_IPIRANGA_SCREEN}}', data_uri(MAT / 'case-ipiranga-interface.jpg', 'image/jpeg'))
html = html.replace('{{HERO_LOOPS}}', data_uri(MAT / 'hero-elos-fattoria-v1.png', 'image/png'))
assert '{{' not in html, 'placeholder sobrando'
if len(sys.argv) > 1:
    OUT = pathlib.Path(sys.argv[1])
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(html, encoding='utf-8')
print(OUT, len(html))
