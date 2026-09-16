# Propostas Comerciais

Padrão dos HTMLs: `cliente_AAAA-MM-DD_projeto.html`.
A data é a data de emissão do documento.

## Viva Sinaf — implantação de CRM

- Versão final: [abrir proposta](clientes/viva-sinaf/2026-09-16-crm/publicar/viva-sinaf_2026-09-16_implantacao-crm.html).
- `publicar/`: somente a versão pronta para o cliente, com imagens incorporadas.
- `historico/`: original e versões anteriores, para uso interno.
- `materiais/imagens/`: imagens de origem e imagens produzidas.

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
