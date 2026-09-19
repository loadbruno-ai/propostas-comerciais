# -*- coding: utf-8 -*-
import os, re, shutil, subprocess, sys, zipfile
from xml.sax.saxutils import escape
from lxml import etree
from content_v2 import SLIDES, FOOTER

ROOT = os.path.dirname(os.path.abspath(__file__))
SKILL = '/mnt/skills/public/pptx/scripts'
UNP = os.path.join(ROOT, 'unpacked')
TEMPLATE = os.path.join(ROOT, 'template.pptx')
OUT_STAGE = os.path.join(ROOT, 'stage_v2.pptx')

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
A = '{%s}' % NS['a']
P = '{%s}' % NS['p']

PURPLE, CYAN, PINK, DARK, GREY = '6E5BD5', '4CC9F0', 'FF1F8F', '333333', '595959'

# ---------- 1. fresh unpack ----------
shutil.rmtree(UNP, ignore_errors=True)
zipfile.ZipFile(TEMPLATE).extractall(UNP)

# ---------- 2. duplicate slides in target order ----------
new_files = []
for s in SLIDES:
    out = subprocess.run([sys.executable, os.path.join(SKILL, 'add_slide.py'), UNP, f"slide{s['src']}.xml"],
                         capture_output=True, text=True, check=True)
    m = re.search(r'Created (ppt/slides/slide\d+\.xml)', out.stdout + out.stderr)
    if not m:
        raise SystemExit('add_slide failed: ' + out.stdout + out.stderr)
    new_files.append(m.group(1))
print('created', len(new_files), 'slides:', new_files[0], '..', new_files[-1])

# ---------- 3. keep only the new slides in sldIdLst ----------
pres_path = os.path.join(UNP, 'ppt/presentation.xml')
pres = etree.parse(pres_path)
lst = pres.find('.//p:sldIdLst', NS)
rels_path = os.path.join(UNP, 'ppt/_rels/presentation.xml.rels')
rels = etree.parse(rels_path)
RNS = 'http://schemas.openxmlformats.org/package/2006/relationships'
rid_to_target = {r.get('Id'): r.get('Target') for r in rels.getroot()}
keep_targets = set('slides/' + os.path.basename(f) for f in new_files)
for sid in list(lst):
    rid = sid.get('{%s}id' % NS['r'])
    if rid_to_target.get(rid) not in keep_targets:
        lst.remove(sid)
pres.write(pres_path, xml_declaration=True, encoding='UTF-8', standalone=True)
print('sldIdLst now has', len(lst), 'entries')

# ---------- 4. clean orphans ----------
out = subprocess.run([sys.executable, os.path.join(SKILL, 'clean.py'), UNP], capture_output=True, text=True)
print('clean.py:', (out.stdout + out.stderr).strip()[-400:])

# ---------- 5. content ----------
def rpr(sz, bold=False, color=None, scheme='dk1', font='Poppins'):
    fill = f'<a:srgbClr val="{color}"/>' if color else f'<a:schemeClr val="{scheme}"/>'
    b = ' b="1"' if bold else ''
    return (f'<a:rPr lang="pt-BR" sz="{sz}"{b}><a:solidFill>{fill}</a:solidFill>'
            f'<a:latin typeface="{font}"/><a:ea typeface="{font}"/><a:cs typeface="{font}"/><a:sym typeface="{font}"/></a:rPr>')

def run(text, sz, **kw):
    t = escape(text)
    sp = ' xml:space="preserve"' if text != text.strip() or '  ' in text else ''
    return f'<a:r>{rpr(sz, **kw)}<a:t{sp}>{t}</a:t></a:r>'

def ppr(kind, spc_bef=0, lnspc=115, marl=0, indent=0):
    return (f'<a:pPr marL="{marl}" lvl="0" indent="{indent}" algn="l" rtl="0"><a:lnSpc><a:spcPct val="{lnspc}000"/></a:lnSpc>'
            f'<a:spcBef><a:spcPts val="{spc_bef}"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft><a:buNone/></a:pPr>')

def para(inner, kind='plain', spc_bef=0, lnspc=115, sz=1100, bullet=False):
    marl, indent = (342900, -177800) if bullet else (0, 0)
    return f'<a:p>{ppr(kind, spc_bef, lnspc, marl, indent)}{inner}<a:endParaRPr sz="{sz}"/></a:p>'

def build_paragraphs(body, sz):
    ps = []
    first = True
    for item in body:
        kind = item[0]
        bef = 0 if first else 600
        if kind == 'intro':
            ps.append(para(run(item[1], sz), spc_bef=bef, sz=sz))
        elif kind == 'label':
            ps.append(para(run(item[1], sz, bold=True, color=PURPLE), spc_bef=bef + 200, sz=sz))
        elif kind == 'bullet':
            inner = run('•', sz) + run('    ', 700) + run(item[1], sz, bold=True) + run(item[2], sz)
            ps.append(para(inner, spc_bef=bef, sz=sz, bullet=True))
        elif kind == 'num':
            n, title, desc = item[1], item[2], item[3]
            inner = run(f'{n}.', sz, bold=True, color=PURPLE) + run('    ', 700)
            if title:
                inner += run(title, sz, bold=True)
            inner += run(desc, sz)
            ps.append(para(inner, spc_bef=bef, sz=sz, bullet=True))
        elif kind == 'quote':
            ps.append(para(run(item[1], sz, color=GREY, font='Poppins Medium'), spc_bef=bef + 400, lnspc=120, sz=sz))
        elif kind == 'question':
            inner = run('Pergunta: ', sz, bold=True, color=PINK) + run(item[1], sz, bold=True)
            ps.append(para(inner, spc_bef=bef + 600, sz=sz))
        first = False
    return ''.join(ps)

WRAP = ('<w xmlns:a="%s" xmlns:p="%s" xmlns:r="%s">' % (NS['a'], NS['p'], NS['r'])) + '{}</w>'

def replace_paragraphs(sp, xml_paras):
    tx = sp.find('p:txBody', NS)
    for p_ in tx.findall('a:p', NS):
        tx.remove(p_)
    frag = etree.fromstring(WRAP.format(xml_paras))
    for child in list(frag):
        tx.append(child)

def sp_text(sp):
    return ''.join(t.text or '' for t in sp.iter(A + 't'))

def find_sp(tree, startswith=None, equals=None):
    for sp in tree.iter(P + 'sp'):
        t = sp_text(sp).strip()
        if equals is not None and t == equals:
            return sp
        if startswith is not None and t.startswith(startswith):
            return sp
    return None

def first_sp(tree, *alts):
    for kw in alts:
        sp = find_sp(tree, **kw)
        if sp is not None:
            return sp
    raise SystemExit('shape not found: %r' % (alts,))

def set_single(sp, text, sz, bold=False, color=None, scheme='dk1', font='Poppins'):
    replace_paragraphs(sp, para(run(text, sz, bold=bold, color=color, scheme=scheme, font=font), sz=sz, lnspc=100))

def set_xfrm(sp, y=None, cy=None):
    off = sp.find('.//a:xfrm/a:off', NS); ext = sp.find('.//a:xfrm/a:ext', NS)
    if y is not None: off.set('y', str(y))
    if cy is not None: ext.set('cy', str(cy))

def remove_logo_pics(tree):
    for pic in list(tree.iter(P + 'pic')):
        off = pic.find('.//a:xfrm/a:off', NS)
        if off is not None and off.get('x') == '318200':
            pic.getparent().remove(pic)

def title_size(text):
    n = len(text)
    return 3600 if n <= 26 else 3000 if n <= 36 else 2600 if n <= 42 else 2400 if n <= 50 else 2200

def set_cx(sp, cx):
    sp.find('.//a:xfrm/a:ext', NS).set('cx', str(cx))

def remove_side_column(tree):
    """Remove rótulos, valores e barras de acento da coluna lateral."""
    for sp in list(tree.iter(P + 'sp')):
        t = sp_text(sp).strip()
        ext = sp.find('.//a:xfrm/a:ext', NS)
        if t in ('Objetivo', 'Entregáveis', 'Tempo estimado', '[Descreva o objetivo]', '[Descreva os entregáveis]', '[Prazo estimado]') \
           or (ext is not None and ext.get('cx') == '27000'):
            sp.getparent().remove(sp)

def set_x(sp, x):
    sp.find('.//a:xfrm/a:off', NS).set('x', str(x))

for s, f in zip(SLIDES, new_files):
    path = os.path.join(UNP, f)
    tree = etree.parse(path)
    kind = s['kind']
    if kind == 'cover':
        set_single(find_sp(tree, equals='[Título da capa]'), s['title'], 3600, scheme='lt1', font='Poppins Light')
        set_single(find_sp(tree, equals='[Subtítulo]'), s['subtitle'], 2000, scheme='lt1', font='Poppins ExtraLight')
        set_single(find_sp(tree, equals='[Cliente — Contato]'), s['client'], 900, scheme='lt1')
        svc = find_sp(tree, equals='[Tipo de serviço] — [Mês e ano]'); set_cx(svc, 3600000)
        set_single(svc, s['service'], 900, scheme='lt1')
        set_single(find_sp(tree, startswith='Proposta Comercial'), FOOTER, 900, scheme='lt1')
        remove_logo_pics(tree)
    elif kind == 'divider':
        num = first_sp(tree, dict(equals='01'), dict(equals='02'), dict(equals='03'))
        set_cx(num, 1900000); set_single(num, s['number'], 7200, color=DARK, font='Poppins SemiBold')
        ttl = first_sp(tree, dict(equals='Escopo'), dict(equals='Nosso Processo'), dict(equals='Investimento'))
        set_cx(ttl, 7400000); set_single(ttl, s['title'], 5200, scheme='lt1', font='Poppins Light')
        set_single(find_sp(tree, startswith='Proposta Comercial'), FOOTER, 900, scheme='lt1')
        remove_logo_pics(tree)
    else:
        sz = s.get('size', 1100)
        ttl = first_sp(tree, dict(equals='[Título da seção]'), dict(equals='Cenário'), dict(equals='Requisitos fora de escopo'))
        set_cx(ttl, 8303700); set_single(ttl, s['title'], title_size(s['title']), font='Poppins Light')
        body = first_sp(tree, dict(startswith='[Linha de introdução'), dict(startswith='[Cenário, parágrafo 1'))
        replace_paragraphs(body, build_paragraphs(s['body'], sz))
        if kind == 'phase':
            obj, ent, tempo = s['side']
            set_single(find_sp(tree, equals='[Descreva o objetivo]'), obj, 800, scheme='dk2', font='Poppins Medium')
            set_single(find_sp(tree, equals='[Descreva os entregáveis]'), ent, 800, scheme='dk2', font='Poppins Medium')
            set_single(find_sp(tree, equals='[Prazo estimado]'), tempo, 800, scheme='dk2', font='Poppins Medium')
        else:
            remove_side_column(tree)
            set_x(body, 379826); set_cx(body, 8303700)
        if s.get('extra') == 'phases':
            set_xfrm(body, y=3500000, cy=900000)
        set_single(find_sp(tree, startswith='Proposta Comercial'), FOOTER, 900)
    tree.write(path, xml_declaration=True, encoding='UTF-8', standalone=True)

# ---------- 6. zip ----------
if os.path.exists(OUT_STAGE):
    os.remove(OUT_STAGE)
subprocess.run(['zip', '-Xr', OUT_STAGE, '.'], cwd=UNP, check=True, capture_output=True)
print('staged', OUT_STAGE)
