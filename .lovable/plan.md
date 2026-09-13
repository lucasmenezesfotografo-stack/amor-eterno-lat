# Restaurar páginas antigas no banco original

## Objetivo
Voltar a conectar o site ao banco original indicado, onde os presentes e seus `slug`s já existem, sem alterar URLs, layout ou conteúdo das páginas.

## Alterações
- Criar uma conexão segura usando a URL e a chave pública do banco original; nenhuma chave administrativa ficará no navegador.
- Direcionar consultas, criação de páginas, uploads, pagamentos e cadastro para essa conexão única, evitando a mistura atual entre dois bancos.
- Manter a abertura por `https://memoryl.ink/regalo/{slug}` e a busca pela coluna `gift_pages.slug`.
- Preservar todas as páginas e QR codes já emitidos, sem recriar ou mudar slugs.

## Validação
- Confirmar que o slug de exemplo retorna o presente existente.
- Testar a página `/regalo/isadora-daniel-mr3ugqwa-rkx9` no celular.
- Verificar erros de rede e compilação antes de concluir.

## Detalhes técnicos
A configuração atual combina a URL do banco novo com uma chave do banco antigo. A correção separará a conexão original em um cliente público consistente e atualizará somente os pontos que usam dados, arquivos e funções.
