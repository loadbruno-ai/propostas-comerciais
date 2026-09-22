# Propostas Comerciais

Padrão dos HTMLs: `cliente_AAAA-MM-DD_projeto.html`.
A data é a data de emissão do documento.

## Viva Sinaf — implantação de CRM

- Versão final: [abrir proposta](clientes/viva-sinaf/2026-09-16-crm/publicar/viva-sinaf_2026-09-16_implantacao-crm.html).
- `publicar/`: somente a versão pronta para o cliente, com imagens incorporadas.
- `historico/`: original e versões anteriores, para uso interno.
- `materiais/imagens/`: imagens de origem e imagens produzidas.

## ICONIC — marketplace B2B (proposta preliminar)

- Versão final: [abrir proposta](clientes/iconic/2026-09-19-marketplace-b2b/publicar/iconic_2026-09-19_marketplace-b2b.html).
- `publicar/`: HTML único e offline, com meta `robots` e cópia do `robots.txt`.
- `materiais/imagens/`: logos Fattoria e o mapa do Brasil (`@svg-maps/brazil`, CC BY 4.0, crédito no rodapé do documento).
- `materiais/fonte/`: template HTML com placeholders e `build_lp.py`, que embute logos e mapa e gera o arquivo de `publicar/`. Para editar: alterar o template e rodar `python3 build_lp.py` dentro da pasta `materiais/fonte/` (o script espera `../imagens/` e grava em `../../publicar/`).
- Projeto confidencial: sem valores em reais nesta versão; proposta final até 15/10/2026.

## Sinaf — manutenção do portal

- Versão 1 (manutenção até 29/01/2027, contrato anual a partir de fevereiro de 2027): [abrir proposta](clientes/sinaf/2026-09-21-manutencao-portal/publicar/sinaf_2026-09-21_manutencao-portal.html).
- Versão 2 (manutenção até 31/12/2026, contrato anual a partir de janeiro de 2027, reavaliação na primeira quinzena de dezembro; 3 meses = 210h / R$ 42.000, 2 meses = 140h / R$ 28.000; emitida em 22/09/2026): [abrir proposta](clientes/sinaf/2026-09-21-manutencao-portal/publicar/sinaf_2026-09-22_manutencao-portal-v2.html).
- `publicar/`: HTML único e offline, com meta `robots` e cópia do `robots.txt`.
- `materiais/imagens/`: logos Fattoria (reaproveitados da pasta ICONIC) e as imagens de compartilhamento `sinaf-manutencao-portal-social.png` (v1) e `sinaf-manutencao-portal-v2-social.png` (v2), 2400×1260, geradas a partir do hero do documento; o build copia para `publicar/`.
- `materiais/fonte/`: um template HTML por versão (`sinaf_2026-09-21_manutencao-portal.template.html` e `sinaf_2026-09-22_manutencao-portal-v2.template.html`) e o `build_lp.py`, que embute logos (inclusive como favicon) e retratos, resolve a imagem de compartilhamento e gera os arquivos de `publicar/`. Para editar: alterar o template da versão e rodar `python3 build_lp.py` dentro de `materiais/fonte/` (gera as duas; `python3 build_lp.py v2` gera só uma). Uma alteração de conteúdo que valha para as duas versões precisa ser feita nos dois templates. No deploy, rodar com `PUBLIC_BASE_URL=https://.../pasta/ python3 build_lp.py` para as metas `og:image`, `twitter:image` e `og:url` saírem com URL absoluta (sem isso, a imagem fica relativa ao HTML e só funciona quando os arquivos estão na mesma pasta do servidor).
- Documento de fechamento comercial (não é pré-proposta): manutenção inicial da assinatura até 29/01/2027, com custo mensal de R$ 14.000 (70h/mês a R$ 200/h, incluindo 8h de atendimento, reuniões e PO; 4 meses = 280h / R$ 56.000, 3 meses = 210h / R$ 42.000, faturamento mensal, horas acumuladas no período com planilha de controle compartilhada), seguida de contrato de 12 meses a partir de fevereiro de 2027, dimensionado na reavaliação. Um capítulo por frente (performance do portal, manutenção técnica, SEO técnico e AEO, landing pages, e-mail marketing, apoio técnico ao blog), cada um fechado por um painel de escopo (limites + quando/como/condições), com as entregas acrescentadas pela Fattoria marcadas como "Sugestão Fattoria"; reuniões quinzenais; sem seção de backlog. A correção de performance das LPs (proposta de setembro) está absorvida como primeira grande ação. `materiais/imagens/` também guarda o retrato do Bruno usado nos cards da equipe.

## Compartilhamento

O arquivo final funciona sozinho e offline. Para ter uma URL acessível por clientes, é necessário hospedá-lo. O endereço file:// só funciona no computador local.

Publicar somente o conteúdo da pasta `publicar/`. Não enviar o histórico, os materiais ou o catálogo interno para a hospedagem.

Situação: organização local concluída; hospedagem aguardando definição.

## Não indexação e robôs

Todos os HTMLs, inclusive históricos, contêm a meta `robots` com `noindex, nofollow, nosnippet, noimageindex`.
O corpo dos documentos não foi alterado.

O `robots.txt` bloqueia robôs em geral e explicita rastreadores de IA. Googlebot e Bingbot podem buscar o HTML para ler o `noindex`: bloquear também essa leitura pode deixar uma URL aparecendo nos resultados sem descrição.

Na publicação, servir o robots.txt em `/robots.txt`, na raiz do domínio/subdomínio dedicado às propostas. Uma cópia foi incluída em `publicar/`. Em domínio compartilhado com o site institucional, NÃO substituir o robots.txt global por este: adaptar Disallow aos caminhos das propostas e preservar as regras do site principal.

As regras estão preparadas localmente, ainda não validadas em hospedagem. Não garantem bloqueio de robôs que as ignoram nem de certas consultas iniciadas por usuários. Para confidencialidade, usar autenticação. Para novos HTMLs, incluir a mesma meta no head.

Referências: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag · https://developers.openai.com/api/docs/bots · https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
