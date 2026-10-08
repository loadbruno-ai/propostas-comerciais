// Gera a minuta do contrato Fattoria x Sinaf e o modelo reutilizável de contrato de prestação de serviços.
// Uso: node build_contratos.js  -> out/*.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Header, Footer, PageNumber,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, PageBreak,
} = require('docx');

const BLUE = '1F4E79';
const GREY = '6B6F7B';
const CONTENT_W = 9070; // A4 (11906) - margens 1418 x 2

// ---------- mini-marcação: **negrito** e [[campo a preencher]] ----------
function runs(text, base = {}) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g).filter(Boolean);
  return parts.map((p) => {
    if (p.startsWith('**')) return new TextRun({ ...base, text: p.slice(2, -2), bold: true });
    if (p.startsWith('[[')) return new TextRun({ ...base, text: '[' + p.slice(2, -2) + ']', shading: { type: ShadingType.CLEAR, fill: 'FFF2A8', color: 'auto' } });
    return new TextRun({ ...base, text: p });
  });
}
const para = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.JUSTIFIED,
  spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 276 },
  indent: opts.indent,
  keepNext: opts.keepNext,
  children: runs(text, opts.run || {}),
});
const clauseTitle = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 280, after: 120 },
  keepNext: true,
  children: [new TextRun({ text })],
});
const subTitle = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 100 },
  keepNext: true,
  children: [new TextRun({ text })],
});
const label = (text) => new Paragraph({
  spacing: { before: 120, after: 60 },
  keepNext: true,
  children: [new TextRun({ text, bold: true, color: BLUE, size: 20, allCaps: true, characterSpacing: 20 })],
});
// item numerado manualmente (1.1.), com recuo pendente
const item = (n, text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 120, line: 276 },
  indent: { left: 709, hanging: 709 },
  children: [new TextRun({ text: n + '\t' }), ...runs(text)],
  tabStops: [{ type: 'left', position: 709 }],
});
// alínea (a), (b)
const alinea = (n, text) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 80, line: 276 },
  indent: { left: 1134, hanging: 425 },
  children: [new TextRun({ text: n + '\t' }), ...runs(text)],
  tabStops: [{ type: 'left', position: 1134 }],
});
const bullet = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 80, line: 264 },
  children: runs(text),
});
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

// ---------- tabelas ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: 'C9CFDA' };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
function table(widths, rows, { header = true, noLines = false } = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((cells, ri) => new TableRow({
      cantSplit: true,
      children: cells.map((c, ci) => {
        const isHead = header && ri === 0;
        const cell = typeof c === 'string' ? { text: c } : c;
        const lines = Array.isArray(cell.text) ? cell.text : [cell.text];
        return new TableCell({
          width: { size: widths[ci], type: WidthType.DXA },
          borders: noLines ? noBorders : borders,
          shading: isHead ? { type: ShadingType.CLEAR, fill: 'E8EEF6', color: 'auto' }
            : cell.fill ? { type: ShadingType.CLEAR, fill: cell.fill, color: 'auto' } : undefined,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: lines.map((l, li) => new Paragraph({
            alignment: cell.align || AlignmentType.LEFT,
            spacing: { after: li === lines.length - 1 ? 0 : 60 },
            children: runs(l, { bold: isHead || cell.bold, size: cell.size || 20, color: cell.color }),
          })),
        });
      }),
    })),
  });
}

// ---------- conteúdo ----------
function build(v) {
  const S = v === 'sinaf';
  const pick = (s, m) => (S ? s : m);
  const out = [];

  if (!S) {
    // Página de instruções do modelo
    out.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'COMO USAR ESTE MODELO', bold: true, color: BLUE, size: 28 })] }));
    [
      'Este é o modelo de contrato de prestação de serviços da Fattoria. Duplique o arquivo a cada novo contrato e apague esta página antes de enviar.',
      '**Campos a preencher.** Tudo o que está destacado em amarelo, entre colchetes, é para substituir: dados das partes, objeto, valores, datas e interlocutores. Ao terminar, procure por "[" para conferir que não sobrou nenhum campo.',
      '**Escolha do modelo comercial.** As Cláusulas 2 e 6 trazem duas opções: A, banco de horas mensal (manutenção e operação contínua), e B, projeto com marcos de entrega (projeto fechado). Mantenha a opção do contrato e apague a outra, renumerando os itens.',
      '**Anexos.** O Anexo I recebe o escopo da proposta aprovada, frente por frente: entregas, o que não está incluído e as condições de execução. O Anexo II resume as condições comerciais. A proposta aprovada, em PDF, entra como Anexo III.',
      '**Valor-hora.** O contrato não expõe o valor da hora. Use valor mensal, valor por etapa ou valor total, e horas de referência quando o modelo for banco de horas.',
      '**Formato de envio.** Envie ao cliente em .docx, para que o jurídico dele possa marcar alterações. A versão final, depois de acordada, segue para assinatura eletrônica em PDF.',
      '**Revisão jurídica.** Este modelo foi montado como ponto de partida e deve ser revisado pelo advogado da Fattoria antes do primeiro uso, em especial as cláusulas de responsabilidade, proteção de dados, propriedade intelectual e tributos.',
    ].forEach((t) => out.push(para(t, { after: 160 })));
    out.push(pageBreak());
  }

  // Cabeçalho do documento
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [new TextRun({ text: pick('MINUTA PARA REVISÃO · 30 DE SETEMBRO DE 2026', 'MODELO · CONTRATO DE PRESTAÇÃO DE SERVIÇOS'), size: 18, color: GREY, characterSpacing: 30 })] }));
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 80 },
    children: [new TextRun({ text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS', bold: true, size: 30, color: BLUE })] }));
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 },
    children: runs(pick('Manutenção do portal sinaf.com.br e das landing pages de campanha, com produção de e-mail marketing',
      '[[Nome do serviço ou projeto]]'), { size: 22, color: GREY }) }));

  // Preâmbulo
  out.push(para('Pelo presente instrumento particular, de um lado:'));
  out.push(para(pick(
    '**CONTRATANTE:** [[razão social da empresa do grupo Sinaf que contrata]], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [[●]], com sede na [[endereço completo, cidade, UF, CEP]], neste ato representada na forma de seus atos constitutivos por [[nome, cargo e CPF do representante legal]] ("CONTRATANTE"); e',
    '**CONTRATANTE:** [[razão social]], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [[●]], com sede na [[endereço completo, cidade, UF, CEP]], neste ato representada na forma de seus atos constitutivos por [[nome, cargo e CPF do representante legal]] ("CONTRATANTE"); e')));
  out.push(para('**CONTRATADA:** [[razão social da Fattoria]], pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [[●]], com sede na [[endereço completo]], Rio de Janeiro, RJ, CEP [[●]], neste ato representada por [[Bruno Castelo Branco, cargo, CPF nº ●]] ("CONTRATADA");'));
  out.push(para('CONTRATANTE e CONTRATADA, em conjunto denominadas "Partes" e, individualmente, "Parte",'));
  out.push(para(pick(
    'considerando que a CONTRATADA apresentou à CONTRATANTE a Proposta Comercial "Manutenção do Portal Sinaf", emitida em 22 de setembro de 2026 ("Proposta"), aprovada pela CONTRATANTE em [[data da aprovação]] de 2026,',
    'considerando que a CONTRATADA apresentou à CONTRATANTE a Proposta Comercial "[[nome da proposta]]", emitida em [[data de emissão]] ("Proposta"), aprovada pela CONTRATANTE em [[data da aprovação]],')));
  out.push(para('têm entre si justo e contratado o presente Contrato de Prestação de Serviços ("Contrato"), que se regerá pelas cláusulas e condições a seguir.', { after: 200 }));

  // Cláusula 1
  out.push(clauseTitle('CLÁUSULA 1ª · DO OBJETO'));
  if (S) {
    out.push(item('1.1.', 'O objeto deste Contrato é a prestação, pela CONTRATADA, de serviços contínuos de manutenção técnica, evolução e operação do portal sinaf.com.br, compreendendo o site institucional e o blog, e das landing pages de campanha da CONTRATANTE, incluindo a produção de peças de e-mail marketing ("Serviços"), organizados nas seguintes frentes de trabalho:'));
    ['(a) performance do portal;', '(b) manutenção técnica e operacional;', '(c) SEO técnico e AEO (otimização para mecanismos de resposta e assistentes de inteligência artificial);', '(d) landing pages;', '(e) e-mail marketing; e', '(f) apoio técnico ao blog.']
      .forEach((t) => { const [n, ...r] = t.split(' '); out.push(alinea(n, r.join(' '))); });
    out.push(item('1.2.', 'As entregas, os limites e as condições de execução de cada frente estão descritos no Anexo I (Escopo dos Serviços).'));
    out.push(item('1.3.', 'A primeira ação prioritária da execução é a melhoria de performance do portal, iniciando pela correção das cinco landing pages de campanha, conforme a proposta de correção apresentada à CONTRATANTE em setembro de 2026, que fica incorporada ao objeto deste Contrato, sem cobrança adicional, e se estende em ciclos às páginas institucionais e ao blog.'));
    out.push(item('1.4.', 'Não fazem parte do objeto deste Contrato:'));
    [
      'a sustentação do portal do cliente, em cliente.sinaf.com.br;',
      'a manutenção do site do Viva Sinaf, a ser tratada em contrato próprio;',
      'a pauta, o calendário editorial, a redação e a publicação dos posts do blog, bem como a produção de conteúdo e de vídeo;',
      'a mudança de hospedagem, servidor ou provedor;',
      'a mídia paga, os criativos de anúncio e a cópia das campanhas;',
      'a estratégia de e-mail, a gestão da base de contatos, o disparo e as automações de e-mail; e',
      'o custo de licenças, ferramentas, plugins pagos, hospedagem, domínio e demais serviços de terceiros.',
    ].forEach((t, i) => out.push(alinea('(' + 'abcdefg'[i] + ')', t)));
    out.push(item('1.5.', 'Os itens listados no item 1.4 podem ser contratados mediante termo aditivo ou proposta específica.'));
  } else {
    out.push(item('1.1.', 'O objeto deste Contrato é a prestação, pela CONTRATADA, de serviços de [[descrição do serviço: o que será feito, em qual sistema, site, aplicativo ou canal, e com qual finalidade]] ("Serviços"), organizados nas seguintes frentes ou etapas:'));
    ['(a) [[frente ou etapa 1]];', '(b) [[frente ou etapa 2]]; e', '(c) [[frente ou etapa 3]].']
      .forEach((t) => { const [n, ...r] = t.split(' '); out.push(alinea(n, r.join(' '))); });
    out.push(item('1.2.', 'As entregas, os limites e as condições de execução de cada frente ou etapa estão descritos no Anexo I (Escopo dos Serviços).'));
    out.push(item('1.3.', 'Não fazem parte do objeto deste Contrato:'));
    ['[[item fora do escopo 1]];', '[[item fora do escopo 2]]; e', 'o custo de licenças, ferramentas, hospedagem, domínio, mídia e demais serviços de terceiros.']
      .forEach((t, i) => out.push(alinea('(' + 'abc'[i] + ')', t)));
    out.push(item('1.4.', 'Os itens listados no item 1.3 podem ser contratados mediante termo aditivo ou proposta específica.'));
  }

  // Cláusula 2
  out.push(clauseTitle('CLÁUSULA 2ª · DO MODELO DE EXECUÇÃO'));
  const bh = [
    ['2.1.', pick('Os Serviços são prestados na modalidade de banco de horas, com referência de 70 (setenta) horas por mês, sem cota fixa por frente. A distribuição de referência entre as frentes consta do Anexo II e não constitui limite por frente.',
      'Os Serviços são prestados na modalidade de banco de horas, com referência de [[●]] horas por mês, sem cota fixa por frente. A distribuição de referência entre as frentes consta do Anexo II e não constitui limite por frente.')],
    ['2.2.', 'As horas de referência de cada mês se acumulam ao longo da vigência: as horas não utilizadas em um mês ficam disponíveis nos meses seguintes, até o término da vigência previsto na Cláusula 5ª.'],
    ['2.3.', 'As prioridades são definidas em reuniões quinzenais de acompanhamento, nas quais a CONTRATADA apresenta os resultados do período e as Partes definem as próximas tarefas. Demandas urgentes entre as reuniões podem ser encaminhadas pelo canal de suporte e são registradas no controle de horas.'],
    ['2.4.', 'A CONTRATADA mantém uma planilha de controle de horas compartilhada com a CONTRATANTE, com o registro das horas por tarefa e por frente e o saldo disponível, atualizada a cada reunião quinzenal e disponível para consulta a qualquer momento.'],
    ['2.5.', pick('As tarefas de produção recorrente, como landing pages e peças de e-mail, não têm volume mínimo ou máximo mensal: cada peça consome o banco de horas conforme o esforço registrado.',
      'As tarefas de produção recorrente não têm volume mínimo ou máximo mensal: cada peça consome o banco de horas conforme o esforço registrado.')],
    ['2.6.', 'Se o saldo de horas se esgotar antes do término da vigência, a CONTRATADA comunicará a CONTRATANTE e as Partes farão uma reavaliação. A execução de horas além do saldo depende da contratação de um novo bloco de horas, em condições comerciais acordadas entre as Partes e formalizadas por termo aditivo ou por aceite por escrito da CONTRATANTE. Nenhuma hora além do saldo será executada ou cobrada sem esse acordo prévio.'],
    ['2.7.', 'O saldo de horas não utilizado até o término da vigência não gera crédito, reembolso ou desconto, salvo se as Partes acordarem de outra forma no instrumento que formalizar a continuidade dos Serviços.'],
  ];
  const comuns2 = [
    'Os Serviços são prestados de segunda a sexta-feira, das 9h às 18h, no horário de Brasília, exceto em feriados nacionais e no município do Rio de Janeiro. Demandas fora desse horário dependem de acordo prévio por escrito entre as Partes, inclusive quanto à forma de cobrança.',
    'Alterações em ambiente de produção são executadas em janela acordada com a CONTRATANTE, com cópia de segurança prévia e possibilidade de reversão, e validadas em ambiente de homologação quando houver.',
    'Os prazos de cada entrega ficam suspensos enquanto ela aguardar materiais, acessos, informações ou aprovações da CONTRATANTE.',
  ];
  if (S) {
    bh.forEach(([n, t]) => out.push(item(n, t)));
    comuns2.forEach((t, i) => out.push(item('2.' + (8 + i) + '.', t)));
  } else {
    out.push(label('Opção A · Banco de horas mensal (apagar se não se aplicar)'));
    bh.forEach(([n, t]) => out.push(item(n, t)));
    out.push(label('Opção B · Projeto com marcos de entrega (apagar se não se aplicar)'));
    [
      'Os Serviços são executados em etapas, conforme o cronograma do Anexo I, e cada etapa é concluída com a entrega indicada e o aceite da CONTRATANTE.',
      'A CONTRATANTE terá [[5 (cinco)]] dias úteis, contados do recebimento de cada entrega, para aceitá-la ou apontar ajustes de forma fundamentada. Sem manifestação nesse prazo, a entrega será considerada aceita.',
      'Ajustes que alterem o escopo aprovado são tratados como mudança de escopo, orçados à parte e formalizados por termo aditivo antes da execução.',
      'Cada etapa inclui até [[2 (duas)]] rodadas de ajustes sobre a entrega apresentada; rodadas adicionais são tratadas como mudança de escopo.',
    ].forEach((t, i) => out.push(item('2.' + (1 + i) + '.', t)));
    out.push(label('Itens comuns às duas opções'));
    comuns2.forEach((t, i) => out.push(item('2.[[' + (8 + i) + ']].', t)));
  }

  // Cláusula 3
  out.push(clauseTitle('CLÁUSULA 3ª · DAS OBRIGAÇÕES DA CONTRATADA'));
  out.push(item('3.1.', 'Sem prejuízo das demais obrigações previstas neste Contrato, cabe à CONTRATADA:'));
  [
    'executar os Serviços com diligência, de acordo com as boas práticas técnicas e com equipe qualificada;',
    pick('manter um interlocutor único junto à CONTRATANTE e conduzir as reuniões quinzenais de acompanhamento;', 'manter um interlocutor único junto à CONTRATANTE e conduzir as reuniões de acompanhamento;'),
    pick('manter atualizada a planilha de controle de horas e entregar um relatório mensal com as atividades realizadas e as recomendações de melhoria;', 'manter a CONTRATANTE informada sobre o andamento dos Serviços e, no banco de horas, manter atualizada a planilha de controle de horas;'),
    'realizar cópia de segurança antes de alterações relevantes em ambiente de produção;',
    'utilizar os acessos concedidos exclusivamente para a execução dos Serviços, com credenciais individuais, e zelar pela sua segurança;',
    'comunicar prontamente à CONTRATANTE os riscos, falhas ou impedimentos identificados que possam afetar os Serviços; e',
    'responder integralmente pelos encargos trabalhistas, previdenciários, fiscais e comerciais relativos à sua equipe.',
  ].forEach((t, i) => out.push(alinea('(' + 'abcdefg'[i] + ')', t)));

  // Cláusula 4
  out.push(clauseTitle('CLÁUSULA 4ª · DAS OBRIGAÇÕES DA CONTRATANTE'));
  out.push(item('4.1.', 'Sem prejuízo das demais obrigações previstas neste Contrato, cabe à CONTRATANTE:'));
  [
    pick('conceder à CONTRATADA, em até 5 (cinco) dias úteis da assinatura, os acessos necessários à execução: WordPress com perfil administrativo, painel da hospedagem, Google Tag Manager, GA4, Google Ads, Google Search Console, HubSpot, ROI Reveal, Looker Studio e a ferramenta de disparo de e-mail;',
      'conceder à CONTRATADA, em até [[5 (cinco)]] dias úteis da assinatura, os acessos necessários à execução: [[lista de sistemas e ferramentas]];'),
    'indicar interlocutor com autonomia para priorizar tarefas e aprovar entregas;',
    'fornecer os briefings, materiais, conteúdos, informações e aprovações necessários, nos prazos acordados;',
    pick('responder pelo conteúdo que fornecer, incluindo textos, imagens, marcas, ofertas e informações de produtos, garantindo que detém os direitos de uso e que o conteúdo atende à regulamentação aplicável à sua atividade;',
      'responder pelo conteúdo que fornecer, incluindo textos, imagens, marcas e informações de produtos, garantindo que detém os direitos de uso e que o conteúdo atende à regulamentação aplicável à sua atividade;'),
    'contratar e manter, às suas expensas, a hospedagem, o domínio, as licenças e as ferramentas de terceiros necessárias;',
    pick('participar das reuniões quinzenais de acompanhamento; e', 'participar das reuniões de acompanhamento; e'),
    'efetuar os pagamentos nos prazos e condições previstos neste Contrato.',
  ].forEach((t, i) => out.push(alinea('(' + 'abcdefg'[i] + ')', t)));
  out.push(item('4.2.', 'O atraso da CONTRATANTE no cumprimento das obrigações deste item não caracteriza descumprimento da CONTRATADA e não altera o valor devido.'));

  // Cláusula 5
  out.push(clauseTitle('CLÁUSULA 5ª · DA VIGÊNCIA'));
  if (S) {
    out.push(item('5.1.', 'Este Contrato vigora de [[1º de outubro de 2026]] ("Data de Início") até 31 de dezembro de 2026, sem renovação automática.'));
    out.push(item('5.2.', 'Na primeira quinzena de dezembro de 2026, a CONTRATADA apresentará à CONTRATANTE o relatório de consumo de horas por frente e a proposta de um contrato de 12 (doze) meses a partir de janeiro de 2027, dimensionado pelo consumo real do período. A continuidade dos Serviços depende de novo instrumento firmado pelas Partes, sem obrigação de contratar para qualquer delas.'));
  } else {
    out.push(item('5.1.', 'Este Contrato vigora de [[data de início]] ("Data de Início") até [[data de término ou conclusão da última etapa]], sem renovação automática.'));
    out.push(item('5.2.', '[[Opcional, para banco de horas: até [●] dias antes do término, a CONTRATADA apresentará o relatório de consumo de horas e a proposta de continuidade. A continuidade depende de novo instrumento firmado pelas Partes.]]'));
  }

  // Cláusula 6
  out.push(clauseTitle('CLÁUSULA 6ª · DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO'));
  const pay6 = S ? [
    'Pelos Serviços, a CONTRATANTE pagará à CONTRATADA o valor mensal fixo de **R$ 14.000,00 (quatorze mil reais)**, correspondente a 70 (setenta) horas de referência por mês.',
    'O valor total deste Contrato corresponde ao valor mensal multiplicado pelo número de meses de vigência. Com Data de Início em [[1º de outubro de 2026]], são 3 (três) parcelas mensais, no total de **R$ 42.000,00 (quarenta e dois mil reais)**.',
    'Se a Data de Início não coincidir com o primeiro dia do mês, a primeira parcela e as horas de referência daquele mês serão proporcionais aos dias corridos de vigência no mês.',
    'A CONTRATADA emitirá a nota fiscal de serviços no último dia útil de cada mês de vigência, referente aos Serviços daquele mês, com vencimento em [[15 (quinze)]] dias corridos contados da emissão, por meio de boleto bancário ou transferência para a conta indicada na nota fiscal.',
  ] : null;
  const comuns6 = [
    'Os valores deste Contrato incluem todos os tributos incidentes sobre os Serviços. As retenções na fonte exigidas pela legislação serão feitas pela CONTRATANTE sobre o valor bruto da nota fiscal, com envio dos respectivos comprovantes à CONTRATADA.',
    'O atraso no pagamento sujeita o valor devido a multa de 2% (dois por cento), juros de mora de 1% (um por cento) ao mês, calculados dia a dia, e correção monetária pelo IPCA. Após 30 (trinta) dias de atraso, a CONTRATADA poderá, mediante notificação, suspender os Serviços até a regularização, sem prejuízo do disposto na Cláusula 13ª.',
    'Custos de terceiros eventualmente necessários à execução, como licenças, ferramentas ou bancos de imagem, dependem de aprovação prévia da CONTRATANTE e são contratados em seu nome ou reembolsados mediante comprovante.',
  ];
  if (S) {
    pay6.forEach((t, i) => out.push(item('6.' + (1 + i) + '.', t)));
    comuns6.forEach((t, i) => out.push(item('6.' + (5 + i) + '.', t)));
  } else {
    out.push(label('Opção A · Banco de horas mensal (apagar se não se aplicar)'));
    [
      'Pelos Serviços, a CONTRATANTE pagará à CONTRATADA o valor mensal fixo de **R$ [[●]] ([[valor por extenso]])**, correspondente a [[●]] horas de referência por mês.',
      'O valor total deste Contrato corresponde ao valor mensal multiplicado pelo número de meses de vigência, no total de **R$ [[●]] ([[valor por extenso]])**.',
      'Se a Data de Início não coincidir com o primeiro dia do mês, a primeira parcela e as horas de referência daquele mês serão proporcionais aos dias corridos de vigência no mês.',
      'A CONTRATADA emitirá a nota fiscal de serviços no último dia útil de cada mês de vigência, com vencimento em [[15 (quinze)]] dias corridos contados da emissão.',
    ].forEach((t, i) => out.push(item('6.' + (1 + i) + '.', t)));
    out.push(label('Opção B · Projeto com marcos de entrega (apagar se não se aplicar)'));
    [
      'Pelos Serviços, a CONTRATANTE pagará à CONTRATADA o valor total de **R$ [[●]] ([[valor por extenso]])**, dividido nos seguintes marcos:',
    ].forEach((t) => out.push(item('6.1.', t)));
    ['(a) [[Marco 1, por exemplo, assinatura do Contrato]]: R$ [[●]];', '(b) [[Marco 2, por exemplo, aprovação do layout]]: R$ [[●]]; e', '(c) [[Marco 3, por exemplo, entrega final]]: R$ [[●]].']
      .forEach((t) => { const [n, ...r] = t.split(' '); out.push(alinea(n, r.join(' '))); });
    out.push(item('6.2.', 'A nota fiscal de cada marco é emitida na conclusão do marco, com vencimento em [[15 (quinze)]] dias corridos contados da emissão.'));
    out.push(label('Itens comuns às duas opções'));
    comuns6.forEach((t, i) => out.push(item('6.[[' + (5 + i) + ']].', t)));
  }

  // Cláusula 7
  out.push(clauseTitle('CLÁUSULA 7ª · DA NATUREZA DAS OBRIGAÇÕES'));
  out.push(item('7.1.', pick(
    'As obrigações da CONTRATADA são de meio. A CONTRATADA emprega as melhores práticas para melhorar a performance, a indexação e a visibilidade do portal e das landing pages, mas não garante resultados específicos de posicionamento em buscadores, citação em assistentes de inteligência artificial, indicadores de Core Web Vitals, tráfego, conversão ou vendas, que dependem também de fatores fora do seu controle, como algoritmos de terceiros, hospedagem, scripts de terceiros, conteúdo e mídia.',
    'As obrigações da CONTRATADA são de meio. A CONTRATADA emprega as melhores práticas na execução dos Serviços, mas não garante resultados específicos de audiência, posicionamento em buscadores, conversão ou vendas, que dependem também de fatores fora do seu controle.')));
  out.push(item('7.2.', 'A CONTRATADA não responde por falhas, indisponibilidades, alterações de funcionamento ou descontinuidade de plataformas e serviços de terceiros, incluindo hospedagem, sistemas de gestão de conteúdo, plugins e ferramentas de mensuração, CRM e envio de e-mail, sem prejuízo do dever de comunicar e apoiar a CONTRATANTE na solução, dentro do banco de horas.'));

  // Cláusula 8
  out.push(clauseTitle('CLÁUSULA 8ª · DA PROPRIEDADE INTELECTUAL'));
  [
    ['8.1.', pick('Os códigos, layouts, templates, landing pages, peças de e-mail, painéis e demais materiais desenvolvidos especificamente para a CONTRATANTE no âmbito deste Contrato ("Entregáveis") passam a ser de titularidade da CONTRATANTE após o pagamento da parcela correspondente ao mês em que foram produzidos, com a cessão dos direitos patrimoniais de uso, reprodução e modificação, sem limite de prazo ou território.',
      'Os códigos, layouts, peças, documentos e demais materiais desenvolvidos especificamente para a CONTRATANTE no âmbito deste Contrato ("Entregáveis") passam a ser de titularidade da CONTRATANTE após o pagamento correspondente, com a cessão dos direitos patrimoniais de uso, reprodução e modificação, sem limite de prazo ou território.')],
    ['8.2.', 'Permanecem de titularidade da CONTRATADA as ferramentas, bibliotecas, componentes, métodos e conhecimentos preexistentes ou de uso geral ("Materiais da CONTRATADA"). Na medida em que integrem os Entregáveis, a CONTRATANTE recebe licença não exclusiva, gratuita, perpétua e irrevogável para utilizá-los como parte dos Entregáveis.'],
    ['8.3.', 'Componentes de terceiros, como plugins, temas, fontes, bibliotecas de código aberto e imagens de banco, seguem as licenças de seus titulares. Licenças pagas são contratadas em nome da CONTRATANTE.'],
    ['8.4.', 'As marcas, conteúdos e materiais fornecidos pela CONTRATANTE permanecem de sua titularidade, e seu uso pela CONTRATADA fica restrito à execução deste Contrato.'],
    ['8.5.', 'A CONTRATADA pode mencionar a CONTRATANTE como cliente. A divulgação de detalhes, resultados ou imagens dos trabalhos depende de autorização prévia e por escrito da CONTRATANTE.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 9
  out.push(clauseTitle('CLÁUSULA 9ª · DA CONFIDENCIALIDADE'));
  [
    ['9.1.', 'Cada Parte manterá em sigilo as informações não públicas da outra Parte a que tiver acesso em razão deste Contrato, incluindo informações técnicas, comerciais, estratégicas, credenciais de acesso e dados de clientes ("Informações Confidenciais"), e as utilizará exclusivamente para a execução deste Contrato, compartilhando-as apenas com empregados e prestadores que precisem conhecê-las e estejam sujeitos a obrigação de sigilo equivalente.'],
    ['9.2.', 'Não são Informações Confidenciais as que forem ou se tornarem públicas sem violação deste Contrato, as que a Parte já conhecia legitimamente, as desenvolvidas de forma independente e as que devam ser reveladas por determinação legal ou judicial, caso em que a Parte avisará previamente a outra, quando permitido.'],
    ['9.3.', 'A obrigação de sigilo vale durante a vigência e por 5 (cinco) anos após o término deste Contrato. Para dados pessoais e credenciais de acesso, vale por prazo indeterminado.'],
    ['9.4.', 'No término deste Contrato, cada Parte devolverá ou eliminará as Informações Confidenciais da outra, ressalvadas as cópias que deva manter por obrigação legal.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 10
  out.push(clauseTitle('CLÁUSULA 10ª · DA PROTEÇÃO DE DADOS PESSOAIS'));
  out.push(item('10.1.', pick(
    'Na execução dos Serviços, a CONTRATADA poderá ter acesso a dados pessoais tratados pela CONTRATANTE, em formulários, no CRM e nas ferramentas de mensuração e de e-mail. Nesses casos, a CONTRATANTE atua como controladora e a CONTRATADA como operadora, nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais, "LGPD").',
    'Na execução dos Serviços, a CONTRATADA poderá ter acesso a dados pessoais tratados pela CONTRATANTE. Nesses casos, a CONTRATANTE atua como controladora e a CONTRATADA como operadora, nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais, "LGPD").')));
  out.push(item('10.2.', 'Cabe à CONTRATADA:'));
  [
    'tratar os dados pessoais somente para a execução deste Contrato e conforme as instruções documentadas da CONTRATANTE;',
    'adotar medidas técnicas e administrativas de segurança aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas;',
    'restringir o acesso aos dados pessoais aos profissionais que precisem dele para a execução dos Serviços;',
    'não compartilhar dados pessoais com terceiros sem autorização da CONTRATANTE, exceto com suboperadores necessários à execução, que assumam obrigações equivalentes às desta cláusula;',
    'comunicar à CONTRATANTE, em até 48 (quarenta e oito) horas da ciência, qualquer incidente de segurança que envolva dados pessoais relacionados a este Contrato;',
    'apoiar a CONTRATANTE, no que lhe couber, no atendimento aos titulares e à Autoridade Nacional de Proteção de Dados; e',
    'eliminar ou devolver os dados pessoais ao término deste Contrato, ressalvadas as hipóteses de conservação previstas em lei.',
  ].forEach((t, i) => out.push(alinea('(' + 'abcdefg'[i] + ')', t)));
  out.push(item('10.3.', 'Cabe à CONTRATANTE, como controladora, definir as bases legais e as finalidades do tratamento, obter os consentimentos necessários e manter a transparência exigida pela LGPD, incluindo as políticas de privacidade e de cookies dos seus canais.'));
  out.push(item('10.4.', 'Cada Parte responde pelos danos que causar em razão do descumprimento da legislação de proteção de dados, na medida da sua responsabilidade.'));

  // Cláusula 11
  out.push(clauseTitle('CLÁUSULA 11ª · DOS ACESSOS E DA SEGURANÇA'));
  [
    ['11.1.', 'Os acessos aos sistemas da CONTRATANTE são concedidos por credenciais individuais e nominais, com autenticação em dois fatores sempre que disponível. A CONTRATANTE mantém a administração dos seus sistemas e pode revogar os acessos a qualquer tempo.'],
    ['11.2.', 'No término deste Contrato, a CONTRATANTE revogará os acessos concedidos e a CONTRATADA eliminará as credenciais que tiver armazenado.'],
    ['11.3.', 'A CONTRATADA não responde por incidentes decorrentes de vulnerabilidades de sistemas de terceiros, de acessos de outros usuários ou prestadores da CONTRATANTE, ou da decisão da CONTRATANTE de não adotar recomendações de segurança comunicadas por escrito pela CONTRATADA.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 12
  out.push(clauseTitle('CLÁUSULA 12ª · DA RESPONSABILIDADE'));
  [
    ['12.1.', 'Cada Parte responde pelos danos diretos, efetivamente comprovados, que causar à outra em razão do descumprimento deste Contrato.'],
    ['12.2.', 'Nenhuma das Partes responde por lucros cessantes, danos indiretos, perda de receita ou perda de oportunidade de negócio.'],
    ['12.3.', 'A responsabilidade total da CONTRATADA no âmbito deste Contrato fica limitada ao valor efetivamente pago pela CONTRATANTE até a data do evento que deu causa ao dano.'],
    ['12.4.', 'As limitações desta cláusula não se aplicam aos casos de dolo ou culpa grave.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 13
  out.push(clauseTitle('CLÁUSULA 13ª · DA RESCISÃO'));
  [
    ['13.1.', 'Qualquer das Partes pode rescindir este Contrato sem justa causa, mediante aviso prévio por escrito de 30 (trinta) dias, sem multa. Durante o aviso prévio, os Serviços e os pagamentos seguem normalmente, e a última parcela é proporcional aos dias até o fim do aviso.'],
    ['13.2.', 'Qualquer das Partes pode rescindir este Contrato de imediato, por justa causa, nos casos de descumprimento não sanado em até 10 (dez) dias úteis após notificação por escrito, de falência, recuperação judicial ou insolvência da outra Parte, ou de violação das Cláusulas 9ª, 10ª ou 15ª.'],
    ['13.3.', pick('Em qualquer caso de término, a CONTRATANTE pagará os Serviços prestados até a data de encerramento, e a CONTRATADA entregará os Entregáveis produzidos até essa data, a planilha de controle de horas atualizada e um relatório de encerramento. O saldo de horas não utilizado segue o disposto no item 2.7.',
      'Em qualquer caso de término, a CONTRATANTE pagará os Serviços prestados até a data de encerramento, e a CONTRATADA entregará os Entregáveis produzidos até essa data e um relatório de encerramento.')],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 14
  out.push(clauseTitle('CLÁUSULA 14ª · DA INDEPENDÊNCIA DAS PARTES'));
  [
    ['14.1.', 'Este Contrato não cria vínculo empregatício, societário ou de representação entre as Partes, nem entre uma Parte e a equipe da outra. A equipe da CONTRATADA é por ela dirigida e remunerada.'],
    ['14.2.', 'Este Contrato não é exclusivo. A CONTRATADA pode prestar serviços a terceiros, observada a Cláusula 9ª.'],
    ['14.3.', 'A CONTRATADA pode contar com profissionais e fornecedores subcontratados para parte dos Serviços, permanecendo integralmente responsável perante a CONTRATANTE.'],
    ['14.4.', 'Durante a vigência e por 12 (doze) meses após o término, nenhuma das Partes contratará, direta ou indiretamente, profissionais da outra que tenham atuado na execução deste Contrato, salvo com a concordância por escrito da outra Parte.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 15
  out.push(clauseTitle('CLÁUSULA 15ª · DA CONDUTA ÉTICA E ANTICORRUPÇÃO'));
  out.push(item('15.1.', 'As Partes declaram conhecer e se comprometem a cumprir a Lei nº 12.846/2013 e as demais normas de prevenção à corrupção, abstendo-se de oferecer, prometer ou conceder vantagem indevida a agente público ou privado em relação a este Contrato.'));

  // Cláusula 16
  out.push(clauseTitle('CLÁUSULA 16ª · DAS COMUNICAÇÕES'));
  out.push(item('16.1.', 'As comunicações entre as Partes são feitas por escrito, preferencialmente por e-mail, aos interlocutores indicados abaixo, ou a outros que as Partes venham a indicar por escrito:'));
  out.push(alinea('(a)', pick('CONTRATANTE: [[Rodrigo Palo, rpalo@sinaf.com.br]];', 'CONTRATANTE: [[nome, e-mail]];')));
  out.push(alinea('(b)', 'CONTRATADA: Bruno Castelo Branco, bruno@fattoriaweb.com.br.'));
  out.push(item('16.2.', pick('A priorização de tarefas e a aprovação de entregas podem ser registradas por e-mail, em ata das reuniões quinzenais ou na ferramenta de gestão acordada entre as Partes, e têm validade para os fins deste Contrato.',
    'A priorização de tarefas e a aprovação de entregas podem ser registradas por e-mail, em ata das reuniões de acompanhamento ou na ferramenta de gestão acordada entre as Partes, e têm validade para os fins deste Contrato.')));

  // Cláusula 17
  out.push(clauseTitle('CLÁUSULA 17ª · DAS DISPOSIÇÕES GERAIS'));
  [
    ['17.1.', 'Integram este Contrato o Anexo I (Escopo dos Serviços), o Anexo II (Referência de Esforço e Condições Comerciais) e o Anexo III (Proposta). Em caso de divergência, prevalece este Contrato, seguido dos Anexos I, II e III, nessa ordem.'],
    ['17.2.', 'Este Contrato substitui as negociações e entendimentos anteriores sobre o seu objeto, e qualquer alteração depende de termo aditivo firmado pelas Partes.'],
    ['17.3.', 'A tolerância de uma Parte quanto ao descumprimento de qualquer obrigação pela outra não implica novação ou renúncia de direito.'],
    ['17.4.', 'Nenhuma das Partes pode ceder este Contrato sem a concordância prévia e por escrito da outra.'],
    ['17.5.', 'Se alguma disposição deste Contrato for considerada inválida, as demais permanecem em vigor.'],
    ['17.6.', 'As Partes reconhecem a validade da assinatura deste Contrato por meio eletrônico, em plataforma que assegure a autoria e a integridade do documento, nos termos da Medida Provisória nº 2.200-2/2001 e da Lei nº 14.063/2020.'],
  ].forEach(([n, t]) => out.push(item(n, t)));

  // Cláusula 18
  out.push(clauseTitle('CLÁUSULA 18ª · DO FORO'));
  out.push(item('18.1.', 'Fica eleito o foro da Comarca da Capital do Estado do Rio de Janeiro para dirimir as questões decorrentes deste Contrato, com renúncia a qualquer outro, por mais privilegiado que seja.'));
  out.push(para('E, por estarem assim justas e contratadas, as Partes assinam este Contrato eletronicamente, juntamente com as testemunhas abaixo.', { before: 200, keepNext: true }));
  out.push(para('Rio de Janeiro, [[●]] de [[●]] de 2026.', { align: AlignmentType.LEFT, before: 120, after: 480, keepNext: true }));

  // Assinaturas
  const sig = (who, name) => ({ text: ['_________________________________________', '**' + who + '**', name] });
  out.push(table([4535, 4535], [
    [sig('CONTRATANTE', '[[Nome e cargo]]'), sig('CONTRATADA', '[[Bruno Castelo Branco, cargo]]')],
    [{ text: [' '] }, { text: [' '] }],
    [sig('TESTEMUNHA 1', '[[Nome e CPF]]'), sig('TESTEMUNHA 2', '[[Nome e CPF]]')],
  ], { header: false, noLines: true }));

  // ---------- ANEXO I ----------
  out.push(pageBreak());
  out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 60 }, children: [new TextRun('ANEXO I · ESCOPO DOS SERVIÇOS')] }));
  out.push(para(pick('Este anexo detalha, por frente de trabalho, as entregas, o que não está incluído e as condições de execução, conforme a Proposta de 22 de setembro de 2026. A execução segue o banco de horas da Cláusula 2ª, com prioridades definidas nas reuniões quinzenais.',
    'Este anexo detalha, por frente ou etapa, as entregas, o que não está incluído e as condições de execução, conforme a Proposta aprovada.'), { run: { color: GREY } }));

  const frentes = S ? FRENTES_SINAF : [{
    t: 'Frente 1 · [[nome da frente ou etapa]]',
    e: ['**[[Entrega 1]].** [[descrição objetiva da entrega]]', '**[[Entrega 2]].** [[descrição objetiva da entrega]]', '**[[Entrega 3]].** [[descrição objetiva da entrega]]'],
    l: ['[[item não incluído nesta frente]]'],
    q: '[[quando acontece]]', c: '[[como é executado]]', p: '[[condições para execução: acessos, materiais, aprovações]]',
  }, {
    t: 'Frente 2 · [[nome da frente ou etapa]]',
    e: ['**[[Entrega 1]].** [[descrição objetiva da entrega]]', '**[[Entrega 2]].** [[descrição objetiva da entrega]]'],
    l: ['[[item não incluído nesta frente]]'],
    q: '[[quando acontece]]', c: '[[como é executado]]', p: '[[condições para execução]]',
  }];
  frentes.forEach((f) => {
    out.push(subTitle(f.t.replace(/\[\[|\]\]/g, '')));
    if (f.intro) out.push(para(f.intro));
    out.push(label('Entregas'));
    f.e.forEach((t) => out.push(bullet(t)));
    out.push(label('Não inclui'));
    f.l.forEach((t) => out.push(bullet(t)));
    out.push(table([2268, 6802], [
      [{ text: '**Quando acontece**', fill: 'F4F6FA' }, { text: f.q }],
      [{ text: '**Como é executado**', fill: 'F4F6FA' }, { text: f.c }],
      [{ text: '**Condições para execução**', fill: 'FFF8EC' }, { text: f.p }],
    ], { header: false }));
  });

  // ---------- ANEXO II ----------
  out.push(pageBreak());
  out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 60 }, children: [new TextRun('ANEXO II · REFERÊNCIA DE ESFORÇO E CONDIÇÕES COMERCIAIS')] }));
  out.push(label('Referência mensal de esforço por frente'));
  const ref = S ? [
    ['Manutenção técnica e operacional', 'Atualizações, correções, suporte e relatório mensal', '10h'],
    ['SEO técnico e AEO', 'Rastreamento e indexação, dados estruturados, Core Web Vitals e visibilidade em assistentes de IA', '8h'],
    ['Landing pages', 'Produção por campanha, com esforço medido por página, e ajustes nas existentes', '24h'],
    ['E-mail marketing', 'Produção sobre o template mestre, com esforço medido por peça', '12h'],
    ['Apoio técnico ao blog', 'Configurações de SEO e AEO, dashboard e recomendações mensais', '8h'],
    ['Gestão do projeto e atendimento', 'Reuniões quinzenais, atendimento, priorização e planilha de controle de horas', '8h'],
  ] : [
    ['[[Frente 1]]', '[[resumo]]', '[[●]]h'],
    ['[[Frente 2]]', '[[resumo]]', '[[●]]h'],
    ['Gestão do projeto e atendimento', 'Reuniões de acompanhamento, atendimento, priorização e controle de horas', '[[●]]h'],
  ];
  out.push(table([2835, 4990, 1245], [
    ['Frente', 'O que cobre', { text: 'Referência', align: AlignmentType.RIGHT }],
    ...ref.map(([a, b, c]) => [a, b, { text: c, align: AlignmentType.RIGHT }]),
    [{ text: '**Referência mensal**', fill: 'F4F6FA' }, { text: '', fill: 'F4F6FA' }, { text: pick('**70h**', '**[[●]]h**'), align: AlignmentType.RIGHT, fill: 'F4F6FA' }],
  ]));
  out.push(para(pick('A distribuição acima descreve a operação em regime e não é cota por frente. A performance do portal e a padronização das landing pages são ações concentradas no início da vigência e consomem as horas acumuladas.',
    'A distribuição acima descreve a operação em regime e não é cota por frente.'), { before: 100, run: { size: 20, color: GREY } }));

  out.push(label('Condições comerciais'));
  const cond = S ? [
    ['Valor mensal', 'R$ 14.000,00, com impostos inclusos'],
    ['Horas de referência', '70 horas por mês, acumuláveis até o término da vigência'],
    ['Vigência', 'De [[1º de outubro de 2026]] a 31 de dezembro de 2026'],
    ['Valor total', '[[R$ 42.000,00, em 3 parcelas mensais, com início em 1º de outubro de 2026]]'],
    ['Faturamento', 'Nota fiscal no último dia útil de cada mês de vigência'],
    ['Vencimento', '[[15 (quinze)]] dias corridos após a emissão da nota fiscal'],
    ['Acompanhamento', 'Reuniões quinzenais e planilha de controle de horas compartilhada'],
    ['Atendimento', 'Segunda a sexta-feira, das 9h às 18h'],
    ['Continuidade', 'Reavaliação na primeira quinzena de dezembro de 2026 e proposta de contrato de 12 meses a partir de janeiro de 2027'],
  ] : [
    ['Modelo', '[[Banco de horas mensal ou projeto com marcos de entrega]]'],
    ['Valor', '[[R$ ● mensais ou R$ ● no total]], com impostos inclusos'],
    ['Horas de referência', '[[● horas por mês, acumuláveis até o término (banco de horas)]]'],
    ['Vigência', '[[De ● a ●]]'],
    ['Faturamento', '[[Mensal, no último dia útil do mês, ou por marco concluído]]'],
    ['Vencimento', '[[15 (quinze)]] dias corridos após a emissão da nota fiscal'],
    ['Acompanhamento', '[[Reuniões quinzenais ou semanais e relatório]]'],
    ['Atendimento', 'Segunda a sexta-feira, das 9h às 18h'],
  ];
  out.push(table([2835, 6235], cond.map(([a, b]) => [{ text: '**' + a + '**', fill: 'F4F6FA' }, b]), { header: false }));

  // ---------- ANEXO III ----------
  out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 60 }, children: [new TextRun('ANEXO III · PROPOSTA')] }));
  out.push(para(pick(
    'Proposta Comercial "Manutenção do Portal Sinaf", emitida pela CONTRATADA em 22 de setembro de 2026 e aprovada pela CONTRATANTE, anexa a este Contrato em PDF e disponível em propostas-comerciais-fattoria.vercel.app/clientes/sinaf/2026-09-21-manutencao-portal/publicar/sinaf_2026-09-22_manutencao-portal-v2.html.',
    'Proposta Comercial "[[nome da proposta]]", emitida pela CONTRATADA em [[data]] e aprovada pela CONTRATANTE, anexa a este Contrato em PDF.')));
  return out;
}

// ---------- escopo da Sinaf (a partir da proposta v2 aprovada) ----------
const FRENTES_SINAF = [
  {
    t: 'Primeira grande ação e disposições gerais do escopo',
    intro: 'A execução começa pela performance do portal: correção das cinco landing pages de campanha, proposta em setembro de 2026 e incorporada a este Contrato, seguida de ciclos incrementais pelas páginas institucionais e pelo blog, cada um medido em campo com dados do Chrome UX Report antes do próximo.',
    e: ['**Banco de horas único.** 70 horas de referência por mês, sem cota fixa por frente, acumuláveis até 31 de dezembro de 2026.', '**Reuniões quinzenais.** Apresentação dos resultados do período e definição das próximas tarefas e melhorias.', '**Planilha de controle de horas.** Compartilhada com a CONTRATANTE, atualizada a cada reunião quinzenal e disponível para consulta a qualquer momento.'],
    l: ['Pauta, calendário, redação e publicação dos posts do blog; produção de conteúdo e vídeo entram apenas como escopo adicional, se solicitados.', 'Manutenção do site do Viva Sinaf, a ser tratada em contrato próprio.', 'Mudança de hospedagem, servidor ou provedor.', 'Sustentação do portal do cliente, em cliente.sinaf.com.br.'],
    q: 'Desde a Data de Início, ao longo de toda a vigência.',
    c: 'Prioridades definidas nas reuniões quinzenais; demandas urgentes pelo canal de suporte; horas registradas por tarefa e por frente.',
    p: 'Acessos da Cláusula 4ª concedidos e interlocutor indicado pela CONTRATANTE.',
  },
  {
    t: 'Frente 1 · Performance do portal',
    e: [
      '**Levantamento e baseline.** Inventário técnico do portal: scripts carregados, plugins, tema, imagens, hospedagem e cache. Baseline de Core Web Vitals por página com dados de campo do Chrome UX Report e baseline das conversões registradas no Google Tag Manager.',
      '**Correção das landing pages de campanha.** Latência de servidor e cache, otimização de imagens, redução do JavaScript não utilizado e validação do disparo das conversões no Google Ads, no GA4 e na Meta, antes e depois de cada alteração.',
      '**Ciclos pelo portal.** As mesmas correções aplicadas às páginas institucionais e ao blog, uma alteração por vez, com backup e possibilidade de reversão.',
      '**Scripts de terceiros e formulário.** Auditoria do que cada página carrega, incluindo o formulário HubSpot embutido, com uma versão mais leve que preserva a integração com o CRM.',
      '**Hospedagem e cache.** Revisão do cache de página e de objetos, da versão de PHP e dos recursos do servidor.',
      '**Medição em campo.** Nova coleta após a janela de 28 dias do Chrome UX Report a cada ciclo, com relatório do antes e depois apresentado na reunião quinzenal.',
    ],
    l: ['Redesign das páginas, alteração de conteúdo e implementação de CDN.', 'Mudança de hospedagem ou provedor, que, se necessária, é decidida com a CONTRATANTE a partir do levantamento e orçada à parte.'],
    q: 'Nas primeiras semanas da vigência, com ciclos até dezembro de 2026.',
    c: 'Uma alteração por vez, em janela acordada, com backup e reversão; resultados apresentados nas reuniões quinzenais.',
    p: 'Acesso administrativo ao WordPress, ao Google Tag Manager, ao GA4 e ao Google Ads; informações de hospedagem e cache; ambiente de homologação, se existir.',
  },
  {
    t: 'Frente 2 · Manutenção técnica e operacional',
    e: [
      '**Atualizações.** WordPress, plugins e tema atualizados conforme a compatibilidade, com remoção dos plugins sem uso.',
      '**Correções técnicas.** Erros, redirecionamentos, links quebrados e problemas de layout, identificados pela CONTRATADA ou reportados pela CONTRATANTE.',
      '**Publicação e ajustes de conteúdo institucional.** Páginas institucionais publicadas e ajustadas a partir do material enviado pela CONTRATANTE.',
      '**Painel de indicadores.** Painel unificado do site institucional e do blog no Looker Studio, preparado para incluir o Viva Sinaf.',
      '**Suporte e relatório mensal.** Canal de suporte para as demandas de funcionamento do site e do blog e relatório mensal com o que foi feito e as recomendações de melhoria.',
      '**Homologação e backup.** Cópia do site para testar atualizações e correções antes de publicar, e backup automatizado com restauração testada.',
      '**Segurança.** Autenticação em dois fatores, revisão de usuários e permissões e firewall de aplicação.',
    ],
    l: ['Novas funcionalidades e novas seções do site, que são tratadas como novas tarefas, dimensionadas nas reuniões quinzenais e executadas dentro do banco de horas.', 'Mudança de hospedagem ou provedor.', 'Sustentação do portal do cliente, em cliente.sinaf.com.br.'],
    q: 'Contínua, ao longo de toda a vigência.',
    c: 'Rotina semanal de atualizações; demandas pontuais pelo canal de suporte; relatório mensal.',
    p: 'Acesso administrativo ao WordPress e à hospedagem; interlocutor da CONTRATANTE para aprovar publicações.',
  },
  {
    t: 'Frente 3 · SEO técnico e AEO',
    e: [
      '**Rastreamento e indexação.** Sitemap XML, robots.txt, canonical tags, redirecionamentos e códigos de status HTTP mantidos e corrigidos.',
      '**Erros e arquitetura.** Acompanhamento de erros 404, links quebrados e problemas de arquitetura e código, com correção.',
      '**Dados estruturados.** Implementação e validação de Schema Markup para páginas de produto, FAQ e artigos do blog.',
      '**Core Web Vitals.** Acompanhamento contínuo dos indicadores em campo, conectado à frente de performance.',
      '**AEO: conteúdo pronto para ser citado.** Estruturação das páginas de produto, das FAQs e dos artigos do blog para responder de forma direta às perguntas do negócio: pergunta e resposta no início da seção, dados estruturados de FAQ e de organização, autoria e fontes explícitas, e liberação dos rastreadores de IA no robots.txt conforme a política da CONTRATANTE.',
      '**AEO: visibilidade em IA.** Acompanhamento mensal de como a CONTRATANTE aparece nas respostas de ChatGPT, Gemini, Perplexity e AI Overviews do Google para as perguntas do negócio, com ajustes de conteúdo a cada ciclo.',
      '**Ferramentas.** Avaliação de uma ferramenta de SEO além do plugin gratuito atual.',
      '**Relatório mensal.** Correções realizadas, visibilidade em IA e recomendações técnicas.',
    ],
    l: ['Redação de conteúdo novo, link building e estratégia de palavras-chave; o AEO estrutura e otimiza o conteúdo existente e orienta a produção do blog.', 'Licenças de ferramentas de SEO ou de acompanhamento em IA, que, se adotadas, são contratadas pela CONTRATANTE com especificação da CONTRATADA.'],
    q: 'Contínua, com auditoria inicial nas primeiras semanas; o AEO entra em ciclos a partir do segundo mês, junto com o apoio técnico ao blog.',
    c: 'Auditoria técnica, correções priorizadas nas reuniões quinzenais, acompanhamento mensal no Search Console e no Looker Studio e verificação mensal das respostas dos assistentes de IA.',
    p: 'Acesso ao Search Console, ao GA4 e ao Looker Studio.',
  },
  {
    t: 'Frente 4 · Landing pages',
    e: [
      '**Entendimento da demanda.** Levantamento das campanhas, dos públicos, do objetivo de cada página e do fluxo atual de criação, com as equipes de marketing e de mídia da CONTRATANTE, incluindo as landing pages existentes.',
      '**Padronização.** Definição da estrutura comum a todas as landing pages de campanha: seções, formulários, CTAs, âncoras e regras de conteúdo, com o que muda e o que não muda entre campanhas.',
      '**Nova UI/UX de campanha.** Redesenho do layout das landing pages com uma identidade de campanha própria, responsiva e construída com os Core Web Vitals como referência desde o início.',
      '**Métricas e integrações.** Tagueamento de conversão padronizado no Google Tag Manager, formulários integrados ao HubSpot e leitura de resultado no ROI Reveal, iguais em todas as páginas.',
      '**Produção por campanha.** Landing pages produzidas a partir do briefing da CONTRATANTE, sobre o padrão definido, com homologação antes da publicação.',
      '**Esforço medido por página.** Medição e registro do esforço de dois casos, uma landing page nova, do zero, e uma landing page sobre o padrão, com a troca apenas das imagens de apoio da campanha, para orientar o planejamento de cada campanha e o consumo do banco de horas.',
      '**Manutenção das existentes.** Correções, alterações de layout, conteúdo e elementos funcionais nas landing pages já publicadas.',
      '**Migração para o novo padrão.** Migração gradual das páginas atuais para o padrão único, começando pelas de maior tráfego.',
    ],
    l: ['Mídia paga, criativos de anúncio e cópia das campanhas, que ficam com a CONTRATANTE e seus parceiros de mídia.', 'Volume mínimo ou máximo de páginas por mês: cada página consome o banco de horas conforme o esforço medido.'],
    q: 'Entendimento e padronização nas primeiras semanas; produção contínua a partir do padrão aprovado.',
    c: 'Briefing da CONTRATANTE, design sobre o padrão, desenvolvimento no WordPress, homologação e publicação, com o esforço apontado por página.',
    p: 'Briefings com objetivo, público e oferta de cada campanha; acesso ao HubSpot, ao ROI Reveal e ao Google Tag Manager.',
  },
  {
    t: 'Frente 5 · E-mail marketing',
    e: [
      '**Ferramenta de disparo.** Levantamento da ferramenta usada pela CONTRATANTE para disparar os e-mails e de suas limitações: HTML aceito, hospedagem de imagens, campos de personalização, limite de peso e regras de teste. As entregas respeitam essas condições.',
      '**Template mestre.** Estrutura base responsiva, construída para a ferramenta de disparo e testada nos principais clientes de e-mail, alinhada à identidade das landing pages.',
      '**Volume e esforço por peça.** Definição, com a CONTRATANTE, do volume esperado de envios e medição do tempo de dois casos, criar um template novo e adaptar o template mestre com novo conteúdo e imagens, para orientar o calendário e o consumo do banco de horas.',
      '**Produção das peças.** Peças HTML produzidas a partir do material da CONTRATANTE, sobre o template mestre, adaptadas a computador e celular.',
      '**Homologação.** Checklist de links, parâmetros UTM, renderização e textos alternativos antes da entrega.',
      '**Ajustes.** Correções identificadas na homologação ou após o envio.',
    ],
    l: ['Estratégia de e-mail, base de contatos, disparo e automação, que ficam com a CONTRATANTE, na ferramenta de envio.', 'Volume fixo de peças por mês: cada peça consome o banco de horas conforme o esforço medido.'],
    q: 'Contínua, conforme o calendário de envios da CONTRATANTE.',
    c: 'Briefing, produção sobre o template mestre, homologação e entrega do HTML, com o esforço apontado por peça.',
    p: 'Calendário de envios e material das campanhas; acesso à ferramenta de disparo para o levantamento das limitações e para os testes.',
  },
  {
    t: 'Frente 6 · Apoio técnico ao blog',
    e: [
      '**Dashboard do blog.** Painel no Looker Studio, com Search Console e GA4, para acompanhar o desempenho de cada post e do blog como um todo.',
      '**Configuração de SEO do blog.** Estrutura de categorias e tags, URLs, títulos e descrições padrão, dados estruturados de artigo e autor, links internos e paginação, configurados no WordPress e no plugin de SEO, com revisão técnica dos posts já publicados: imagens pesadas, links quebrados e dados estruturados ausentes.',
      '**Configuração de AEO do blog.** Modelo de artigo preparado para citação em assistentes de IA: resumo no topo, bloco de pergunta e resposta direta, dados estruturados de FAQ, autoria e fontes, com orientação de uso para quem publica.',
      '**Recomendações a partir do desempenho.** Leitura mensal do dashboard com recomendações técnicas para a equipe do blog: quais posts ganham com ajuste de título, estrutura, dados estruturados ou links internos.',
    ],
    l: ['Pauta, calendário editorial, redação e publicação dos posts, que seguem com a CONTRATANTE; a CONTRATADA não atua na parte editorial.', 'Produção de conteúdo e de vídeo, que, se solicitada, entra como escopo adicional.'],
    q: 'Configuração e revisão técnica nas primeiras semanas; leitura de desempenho e recomendações mensais.',
    c: 'Ajustes no WordPress e no plugin de SEO, modelo de artigo com orientações de uso e relatório mensal a partir do dashboard.',
    p: 'Acesso ao WordPress, ao Search Console, ao GA4 e ao Looker Studio.',
  },
];

// ---------- documento ----------
function makeDoc(v) {
  const S = v === 'sinaf';
  return new Document({
    creator: 'Fattoria',
    title: S ? 'Minuta · Contrato de prestação de serviços · Fattoria e Sinaf' : 'Modelo · Contrato de prestação de serviços · Fattoria',
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Calibri', size: 22, bold: true, color: BLUE, characterSpacing: 10 },
          paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { font: 'Calibri', size: 24, bold: true, color: '13141D' },
          paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
      ],
    },
    numbering: { config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 567, hanging: 283 } } } }] }] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1418, bottom: 1300, left: 1418, right: 1418, header: 680, footer: 600 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: S ? 'Fattoria × Sinaf · Contrato de prestação de serviços · Minuta' : 'Fattoria · Modelo de contrato de prestação de serviços', size: 16, color: GREY })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: 'Página ', size: 16, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY }),
        new TextRun({ text: ' de ', size: 16, color: GREY }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: GREY })] })] }) },
      children: build(v),
    }],
  });
}

const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const files = [
    ['sinaf', 'sinaf_2026-09-30_minuta-contrato-manutencao-portal.docx'],
    ['modelo', 'Modelo_Contrato_Prestacao_Servicos_Fattoria.docx'],
  ];
  for (const [v, name] of files) {
    fs.writeFileSync(path.join(OUT, name), await Packer.toBuffer(makeDoc(v)));
    console.log('ok', name);
  }
})();
