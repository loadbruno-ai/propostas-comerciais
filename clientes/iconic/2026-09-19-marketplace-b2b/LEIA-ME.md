# ICONIC · Marketplace B2B · proposta preliminar (19/09/2026)

Projeto confidencial. Nada desta pasta vai para portfólio ou divulgação. Só `publicar/` vai para hospedagem.

## publicar/

- `iconic_2026-09-19_marketplace-b2b.html`: a proposta preliminar, arquivo único e offline, na identidade do documento Viva Sinaf, com meta `robots` de não indexação, animações (GSAP, ScrollTrigger e anime.js embutidos) e versão de impressão em A4. Sem valores em reais e sem horas nesta versão; o capítulo comercial fica oculto pelo `SHOW_COMMERCIAL = False` do build até estar pronto para apresentar.
- `robots.txt`: cópia do robots da raiz, para servir no domínio dedicado.

## materiais/

- `imagens/`: logos Fattoria, HubSpot e RD Station; mapa do Brasil (`@svg-maps/brazil`, CC BY 4.0, crédito no rodapé da página); retrato do Bruno; elos do hero; infográfico do cronograma (v1 e v2); capas e interfaces dos cases Bradesco e Ipiranga (origem: fattoria.digital).
- `fonte/iconic_2026-09-19_marketplace-b2b.template.html`: o HTML com placeholders (`{{LOGO_SYMBOL}}`, `{{MAP}}`, `{{HERO_LOOPS}}`, `{{SCHEDULE_INFOGRAPHIC}}`, `{{BRUNO_PORTRAIT}}`, `{{CASE_*}}`, `{{HUBSPOT_LOGO}}`, `{{RD_LOGO}}`, `{{GSAP_JS}}`, `{{SCROLLTRIGGER_JS}}`, `{{ANIME_JS}}`).
- `fonte/build_lp.py`: embute imagens, mapa e bibliotecas e grava em `../../publicar/`. Para editar a página: alterar o template e rodar `python3 build_lp.py` dentro de `materiais/fonte/`; um caminho como argumento grava em outro lugar (`python3 build_lp.py /tmp/teste.html`). Para voltar com o capítulo comercial, trocar `SHOW_COMMERCIAL` para `True`.
- `fonte/vendor/`: gsap.min.js, ScrollTrigger.min.js, anime-4.1.3.min.js e a licença do anime.
- `fonte/cases-indicadores-pendentes.md`: o que falta para cada case (valor, unidade, período, universo, fonte e autorização); Sinaf e portal B2B aguardam imagens reais.
- `fonte/dimensionamento-equipe-revisao.md`: as horas por bloco foram retiradas da proposta por falta de estimativa detalhada; R$ 200/h é referência citada, não preço aprovado. Estimar por entrega antes da proposta final.

## historico/

Base de trabalho da proposta, em ordem cronológica. As horas e os valores que aparecem nos documentos abaixo são referências de trabalho, anteriores à revisão de dimensionamento, e não estão na página nem aprovados.

### documentos/

- `memo_202609_ICONIC_Briefing_Projeto_Marketplace.md`: o que a Camila pediu na reunião de 11/9 e o escopo implícito.
- `plano_202609_ICONIC_Plano_Acao_Marketplace_B2B.md`: plano de ação inicial, com as falas da Camila.
- `memo_202609_ICONIC_Ajustes_Plano_MVP.md`: crítica ao plano e as quatro frentes que faltavam (confidencialidade, go/no-go por estado, pacote do distribuidor, MVP orçamentário).
- `memo_202609_ICONIC_Alinhamento_Socios_13set.md`: decisões da conversa Bruno e Vini de 13/9 e as dez perguntas para a Camila.
- `roteiro_202609_ICONIC_Apresentacao_Roadmap_Estrategia.md`: roteiro slide a slide da apresentação macro (deck v2).
- `pc_202609_ICONIC_Marketplace_B2B_v3.md`: proposta em três blocos, com valores de referência a R$ 200/h (versão anterior ao briefing oficial).
- `memo_202609_ICONIC_Briefing_Impulso_vs_Proposta.md`: leitura crítica do briefing "Projeto Impulso" contra a proposta, gaps por frente, o que mantemos, calendário, modelo comercial, perguntas e esqueleto da v4.
- `memo_202609_ICONIC_Alinhamento_Socios_18set.md` e `transcricao_202609_ICONIC_Alinhamento_Bruno_Vini_18set.md`: decisões da conversa de 18/9 (prazo, eventos, WhatsApp, HubSpot, comissão regressiva, squad, cases) e o que aproveitar da proposta i-Cherry.
- `dossie_202609_ICONIC_Mercado_Aftermarket.md`: pesquisa de mercado com fontes: os dez fatos da apresentação, base de CNPJs por estado e município (IBGE 2024), benchmarks, eventos 2026 e 2027, custos de tecnologia.
- `pc_202609_ICONIC_Marketplace_B2B_v4.md`: a proposta v4 nas sete frentes do briefing, fonte de conteúdo da primeira versão da landing page; a seção final, interna, guarda os valores de referência.
- `ajustes_pendentes_apresentacao.md`: log de ajustes por lote e o que já foi consolidado.

### apresentacao/

- `ICONIC_Roadmap_Estrategia_v2.pptx` e `.pdf`: apresentação macro de roadmap e estratégia no modelo Fattoria (19 slides, sem valores), anterior ao briefing oficial; substituída pela landing page como peça principal.
- `ICONIC_Marketplace_B2B_referencia_interna.html`: referência interna para o time (v3), mais detalhada que a apresentação.
- `fonte/`: `content_v2.py`, `build_v2.py`, `finish_v2.py` (pipeline que monta o deck sobre o `Modelo_Proposta_Comercial_Fattoria.pptx`, não incluído aqui) e `deck_v2.md`.

### referencias/

- `Briefing_Projeto_Impulso_Agencia_MKT_Confidencial_ICONIC.pdf` e `_texto_extraido.txt`: o briefing oficial da Camila (5 páginas, uso restrito ao processo de seleção).
- `Transcricao_Alinhamento_Socios_13set2026.pdf`: transcrição da conversa de 13/9.
- `iCherry_Proposta_Performance_Desktop_fev2023.pdf` e `.txt`: proposta recebida pelo Vini em 2023, usada como referência de formato (tabela recurso x horas, premissas, condições).

## Próximos passos

Cases com indicadores e autorização; dimensionamento por entrega; NDA, imersão restrita, proposta final até 15/10/2026 (com valores, cenários de verba, pacotes de eventos e cases detalhados), devolutiva até 30/10, kickoff em novembro.
