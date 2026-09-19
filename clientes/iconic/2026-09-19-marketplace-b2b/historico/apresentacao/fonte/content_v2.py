# -*- coding: utf-8 -*-
"""v2: storytelling do Bruno (13/9). Só conteúdo apresentável; perguntas inline nos slides de fase; sem notas.

kind: 'cover' | 'divider' | 'phase' (coluna lateral Objetivo/Entregáveis/Tempo estimado do template) | 'content' (sem coluna lateral, corpo largo)
extra: 'phases' (visual do roadmap macro) | 'table'
"""

FOOTER = "Apresentação          ICONIC — Camila Brandão Soares          Roadmap e estratégia — Setembro de 2026"

SLIDES = []

def add(**kw):
    SLIDES.append(kw)

# ---------------------------------------------------------------- Capa
add(src=2, kind='cover',
    title="Do cadastro do CNPJ à recompra",
    subtitle="Estratégia e roadmap macro para o lançamento do marketplace B2B",
    client="ICONIC — Camila Brandão Soares",
    service="Roadmap e estratégia — Setembro de 2026")

# ---------------------------------------------------------------- 01 Cenário
add(src=3, kind='divider', number="01", title="Cenário")

add(src=6, kind='content', size=1100,
    title="O que a Camila nos falou",
    body=[
        ('bullet', "Uma marca nova,", " sem vínculo visível com ICONIC, Ipiranga ou Texaco, vendendo para o pequeno varejo de carros, motos e caminhões."),
        ('bullet', "Um mercado fragmentado,", " sem portal consolidado, em que o ponto de venda nem sabe que pode comprar online."),
        ('bullet', "Lançamento por estado,", " conforme estoque, preço e frete de cada distribuidor se conectam à plataforma."),
        ('bullet', "Plataforma de e-commerce em decisão,", " entre dois fornecedores, com o front-end vindo junto."),
        ('bullet', "Duas bases:", " a do distribuidor, que já existe e está parada, e o varejo novo, que precisa ser encontrado."),
        ('bullet', "Sem time digital interno:", " a contratação prevista é comercial, para trazer fornecedores e mix."),
        ('bullet', "Orçamento limitado e prazo curto:", " execução em dezembro ou janeiro."),
        ('quote', "\"Eu preciso cadastrar o CNPJ dele lá, eu preciso que ele compre lá, eu preciso aumentar o mix dele lá, eu preciso gerar recompra lá.\""),
    ])

add(src=6, kind='content', size=1100,
    title="O que entendemos do desafio",
    body=[
        ('bullet', "É um marketplace, e marketplace nasce pelos dois lados.", " A oferta (mix e distribuidores conectados) precisa estar de pé antes de a demanda (o varejista) ser chamada; chamar cedo demais queima verba e credibilidade."),
        ('bullet', "A primeira compra mais barata está na base do distribuidor.", " Cliente inativo que já conhece o produto e o distribuidor converte por relacionamento, não por mídia."),
        ('bullet', "O varejo novo precisa ser educado antes de ser convertido.", " Ele não procura um portal porque não sabe que existe; a mensagem é \"abasteça o negócio\", não \"conheça a marca\"."),
        ('bullet', "O cadastro do CNPJ é o primeiro atrito.", " Cada campo, documento e espera vira desistência; a jornada precisa ser desenhada para esse comprador, não para o consumidor final."),
        ('bullet', "Um estado por vez, medido de ponta a ponta.", " O que o primeiro estado ensina vira o playbook do segundo, e a expansão passa a ser repetição, não novo projeto."),
        ('question', "Por que esses estados? Foi estratégia, distribuição ou pesquisa prévia?"),
    ])

# ---------------------------------------------------------------- 02 Roadmap
add(src=8, kind='divider', number="02", title="Roadmap macro")

add(src=6, kind='content', size=1100, extra='phases',
    title="Cinco fases até o primeiro estado rodando",
    phases=[
        ("Imersão", "mercado, persona, jornada, estratégia"),
        ("Planejamento de mídia e social", "canais, volumes, editoriais, enxoval"),
        ("Setup técnico", "CRM, integração, pixels, landing pages, réguas"),
        ("Campanhas de primeira compra", "base do distribuidor, awareness, testes"),
        ("Análise e ajustes", "dashboards, KPIs, pós-venda"),
    ],
    future=[
        ("Jornadas de recorrência", ""),
        ("Cross-sell e aumento de mix", ""),
        ("Playbook de expansão por estado", ""),
        ("Fidelização", ""),
    ],
    body=[
        ('intro', "As cinco fases levam ao primeiro estado no ar com o funil medido. Os passos futuros entram quando a primeira compra estiver validada."),
    ])

add(src=6, kind='phase', size=1000,
    title="2.1 Imersão",
    side=("Entender mercado, comprador e jornada antes de decidir canal ou verba",
          "Persona, mapa da jornada, diagnóstico e tese de estratégia",
          "3 a 4 semanas"),
    body=[
        ('bullet', "Mercado e concorrência:", " como o varejista pequeno compra hoje (distribuidor, representante, balcão, WhatsApp), quem já tenta vender online para ele e o que não funcionou."),
        ('bullet', "Público:", " conversas com varejistas e distribuidores dos estados de lançamento para desenhar a persona do comprador: quem decide, o que compra, com que frequência, o que o faria trocar de canal."),
        ('bullet', "Jornada:", " rascunho da jornada do primeiro contato ao pedido recorrente, com os atritos do cadastro do CNPJ, da primeira compra e do frete."),
        ('bullet', "Estratégia:", " tese de entrada por estado, ordem entre base do distribuidor e varejo novo, critérios de prontidão e o que medir em cada etapa."),
        ('question', "Quem é o comprador de vocês hoje? Por onde ele fala com o distribuidor?"),
    ])

add(src=6, kind='phase', size=1000,
    title="2.2 Planejamento de mídia e social",
    side=("Definir como a demanda será gerada e com que verba",
          "Plano de mídia por objetivo, plano editorial, cenários de investimento",
          "2 a 3 semanas, junto com o fim da imersão"),
    body=[
        ('bullet', "Estratégia por objetivo:", " awareness para ensinar que dá para comprar online, remarketing para quem visitou e não cadastrou, conversão para cadastro e primeira compra."),
        ('bullet', "Volume por localização:", " verba distribuída por estado conforme a prontidão de mix, integração e base, não em partes iguais."),
        ('bullet', "Canais e editoriais:", " Facebook e Instagram como base, com linha editorial em educação, produto e necessidade, e prova (fornecedores e distribuidores na plataforma)."),
        ('bullet', "Estratégia de entrada e expansão:", " como a verba e a mensagem mudam do lançamento para a sustentação e para o próximo estado."),
        ('bullet', "Cenários de investimento:", " dois cenários para vocês reagirem, um enxuto para validar e um para acelerar."),
        ('question', "Qual a expectativa de investimento? Há meta de CAC ou de vendas? Existe uma ideia de verba por estado?"),
    ])

add(src=6, kind='phase', size=1000,
    title="2.3 Canais e enxoval de lançamento",
    side=("Chegar ao go-live com canais e material prontos",
          "Perfis configurados, kit de campanha, landing pages, estoque de conteúdo",
          "3 a 4 semanas, em paralelo ao setup técnico"),
    body=[
        ('bullet', "Arroz com feijão primeiro:", " Facebook e Instagram abertos e configurados em nome da marca nova, WhatsApp Business conectado, contas de anúncio e públicos criados."),
        ('bullet', "Enxoval de lançamento:", " identidade de campanha, peças por objetivo (awareness, remarketing, conversão), banners e vitrines para a plataforma, landing pages de cadastro e estoque de posts e stories para a página não nascer vazia."),
        ('bullet', "Mensagem por necessidade:", " pneu, bateria, peça, palheta, filtro; o varejista compra para abastecer o negócio, e a comunicação fala disso."),
        ('bullet', "Novo canal só depois:", " com a base rodando e medida, testar um canal novo escolhido pela sinergia com o que a imersão e a persona mostrarem, um teste por vez."),
    ])

add(src=6, kind='phase', size=1000,
    title="2.4 Definição de CRM e setup técnico",
    side=("Dados e relacionamento prontos antes da primeira campanha",
          "CRM, integração com o e-commerce, pixels, landing pages, réguas básicas",
          "4 a 6 semanas, conforme a plataforma"),
    body=[
        ('bullet', "Definição do CRM:", " recomendação de HubSpot, por modelar distribuidor, pedido e estado como objetos e crescer sem retrabalho de jornada quando entrarem os próximos estados."),
        ('bullet', "Integração com o e-commerce:", " eventos de cadastro, carrinho e pedido chegando ao CRM e aos painéis; requisitos de marketing entregues agora, para pesarem na escolha da plataforma."),
        ('bullet', "Pixels, tags e analytics:", " GTM como camada de tags, pixels de Meta e Google, GA4 e Microsoft Clarity configurados por evento, mais as integrações que a plataforma e o CRM pedirem, com o funil rastreado de ponta a ponta."),
        ('bullet', "Landing pages:", " páginas de cadastro por estado e por distribuidor, desenhadas para reduzir o atrito do CNPJ."),
        ('bullet', "Réguas básicas:", " boas-vindas, cadastro incompleto, incentivo à primeira compra, carrinho abandonado e pós-venda; as réguas de recorrência ficam para a fase seguinte."),
        ('question', "Qual plataforma está na frente e quando isso é definido? Teremos plataforma de SAC?"),
    ])

add(src=6, kind='phase', size=1000,
    title="2.5 Campanhas com foco em primeira compra",
    side=("Converter a base do distribuidor e os primeiros varejistas em pedidos",
          "Campanhas no ar, testes de públicos, leitura diária do funil",
          "4 a 6 semanas após o go-live"),
    body=[
        ('bullet', "Base do distribuidor primeiro:", " régua de convite, cadastro e primeira compra sobre a base cedida, com o distribuidor alinhado; é a compra mais barata do lançamento."),
        ('bullet', "Awareness e conversão no estado:", " Google por intenção de compra, Facebook e Instagram para educação e conversão, remarketing para quem não concluiu o cadastro."),
        ('bullet', "Análise diária e testes:", " públicos, segmentações, mensagens e ofertas testados em ciclos curtos, com a verba migrando para o que converte."),
        ('bullet', "Gate antes de ligar a verba:", " mix mínimo atrativo, integração validada, base preparada e rastreamento funcionando; sem isso, a campanha espera."),
        ('question', "Qual a estratégia e a previsão de mix e de fornecedores para o lançamento do primeiro estado?"),
    ])

add(src=6, kind='phase', size=1000,
    title="2.6 Análise e ajustes",
    side=("Transformar dados em decisões semanais e cuidar de quem já comprou",
          "Dashboards, KPIs confirmados, rotina de acompanhamento e pós-venda",
          "Contínuo, a partir do go-live"),
    body=[
        ('bullet', "Dashboards do funil:", " alcance, cadastro do CNPJ, primeira compra, mix e recompra, por estado e por distribuidor."),
        ('bullet', "Confirmação de KPIs:", " metas por trimestre acordadas com vocês, e o que é sucesso para o primeiro estado escrito antes de ele começar."),
        ('bullet', "Monitoramento de pós-venda:", " dúvidas, reclamações, entrega e troca lidas junto com o funil, porque um pedido mal atendido não vira recompra."),
        ('bullet', "Ajustes:", " verba, públicos, mensagens e réguas revisados toda semana; aprendizados registrados para o próximo estado."),
        ('question', "Onde fica o time de atendimento? A plataforma de e-commerce que está sendo contratada inclui atendimento? Se não, quem opera o SAC na ICONIC? Quem responde DM e WhatsApp?"),
    ])

add(src=6, kind='content', size=1200,
    title="Depois do primeiro estado",
    body=[
        ('bullet', "Recorrência, recompra e aumento de mix:", " jornadas por recência, frequência e valor, recomendação de categorias complementares e campanhas de cross-sell, para o varejista comprar mais categorias e com mais frequência."),
        ('bullet', "Playbook de expansão por estado:", " o que o primeiro estado ensinou vira um kit replicável, com critérios de prontidão, campanhas, réguas e material regionalizados, para lançar os próximos em 4 a 6 semanas cada."),
        ('bullet', "Fidelização:", " programa futuro, desenhado depois de a primeira compra e a recompra estarem validadas; sem detalhes agora."),
    ])

# ---------------------------------------------------------------- Papéis e GTM
add(src=6, kind='content', size=1100,
    title="Papéis e responsabilidades",
    body=[
        ('intro', "Como entendemos a divisão. Vale conferir se são os papéis que vocês esperam."),
        ('bullet', "ICONIC:", " fornecedores e mix por estado, política comercial e comissão, acordo com os distribuidores e uso das bases, verba de mídia, aprovação de campanhas, interlocução única e SAC do varejista."),
        ('bullet', "Fattoria:", " estratégia, imersão e jornada, CRM (definição, implantação e operação), planejamento e execução de mídia, redes sociais, criação, conversão dentro da plataforma, dados e o playbook por estado."),
        ('bullet', "Plataforma de e-commerce:", " front-end, catálogo, checkout, integração de estoque, preço, frete e logística, espaços promocionais e suporte técnico."),
        ('bullet', "Distribuidores:", " bases com regra de uso, estoque, preço e frete por estado, ocorrências de entrega."),
        ('question', "Quem define os calendários promocionais: nasce do comercial da ICONIC com os fornecedores ou é provocado pelo marketing?"),
    ])

add(src=6, kind='content', size=1100,
    title="Roadmap de go-to-market",
    body=[
        ('bullet', "Setembro:", " alinhamento, NDA e lista de autorizados, proposta com cenários, requisitos de marketing entregues para a escolha da plataforma."),
        ('bullet', "Outubro:", " imersão (persona, jornada, diagnóstico) e planejamento de mídia e social; definição do CRM."),
        ('bullet', "Novembro:", " setup técnico (CRM, integração, pixels, landing pages, réguas) e enxoval de lançamento (canais, kit, estoque de conteúdo)."),
        ('bullet', "Dezembro:", " gate de prontidão do primeiro estado, campanhas montadas, base do distribuidor carregada."),
        ('bullet', "Janeiro:", " go-live do primeiro estado, campanhas com foco em primeira compra, análise diária."),
        ('bullet', "A partir de fevereiro:", " análise e ajustes, réguas de recorrência, e o segundo estado 4 a 6 semanas depois do primeiro, seguindo o playbook."),
        ('question', "Qual será o primeiro estado? E o que \"final do ano\" significa para vocês: estratégia definida, agência fechada, CRM rodando ou plataforma no ar?"),
    ])

# ---------------------------------------------------------------- 03 Time, perguntas, próximos passos
add(src=11, kind='divider', number="03", title="Time e próximos passos")

add(src=6, kind='content', size=1100,
    title="Quem responde pelo projeto",
    body=[
        ('bullet', "Bruno Branco, Lead Product Designer.", " Sócio da Fattoria, com mais de 20 anos desenhando produtos, plataformas digitais e jornadas complexas para clientes como Bradesco Seguros, Ipiranga, Amil e outros. No projeto: estratégia, imersão e jornada, conversão dentro da plataforma, criação e interlocução com a ICONIC."),
        ('bullet', "Vinicius Vasconcelos, Head de Growth.", " Conduz o funil de ponta a ponta: planejamento e execução de mídia, testes, prova de valor na base do distribuidor e o playbook de expansão por estado."),
        ('bullet', "Thiago Nóbrega, CTO.", " Responde por CRM, integrações com o e-commerce, pixels, dados e os requisitos técnicos para a escolha da plataforma."),
        ('bullet', "Núcleo de execução:", " CRM e automação, gestão de mídia, redes sociais e comunidade, planejamento e conteúdo, direção de arte e design, dados e analytics, apoio técnico."),
    ])

add(src=7, kind='content', size=1100,
    title="O que precisamos para fechar a proposta",
    body=[
        ('num', "1", "", "Por que esses estados? Estratégia, distribuição ou pesquisa prévia? Qual será o primeiro?"),
        ('num', "2", "", "Quem é o comprador de vocês hoje e por onde ele fala com o distribuidor?"),
        ('num', "3", "", "Qual a expectativa de investimento? Meta de CAC ou de vendas? Ideia de verba por estado?"),
        ('num', "4", "", "Qual a estratégia e a previsão de mix e de fornecedores para o lançamento?"),
        ('num', "5", "", "Qual plataforma de e-commerce está na frente e quando isso é definido?"),
        ('num', "6", "", "Teremos plataforma de SAC? Quem opera o atendimento? Quem responde DM e WhatsApp?"),
        ('num', "7", "", "As bases dos distribuidores virão para o lançamento? Com que regra de uso e de contato?"),
        ('num', "8", "", "Quem define os calendários promocionais?"),
        ('num', "9", "", "O que \"final do ano\" significa: estratégia definida, agência fechada, CRM rodando ou plataforma no ar?"),
        ('num', "10", "", "Quem contrata: a ICONIC ou um CNPJ da marca nova?"),
    ])

add(src=6, kind='content', size=1100,
    title="Próximos passos",
    body=[
        ('bullet', "NDA", " enviado pela ICONIC e lista de quem pode saber, esta semana."),
        ('bullet', "Requisitos de marketing para a plataforma", " entregues pela Fattoria dentro da janela de decisão dos fornecedores."),
        ('bullet', "Proposta com cenários", " a partir das respostas desta reunião, com escopo, roadmap, time e investimento por fase."),
        ('bullet', "Reunião técnica", " sobre CRM e integração assim que a plataforma estiver definida."),
        ('bullet', "Decisão até o início de outubro,", " para a imersão começar e o primeiro estado sair em janeiro."),
    ])
