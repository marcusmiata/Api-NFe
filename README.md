# Projeto de Integração com API de NF-e

Este projeto realiza a integração com uma API de emissão e gerenciamento de Notas Fiscais Eletrônicas (NF-e). Utiliza o plugin `cordova-plugin-advanced-http` para fazer requisições HTTP e inclui funcionalidades como gravação, validação, transmissão e envio de NF-e por e-mail, além da geração de PDFs e exclusão de notas.

## Funcionalidades

- **Gravação de NF-e**: Grava os dados de uma Nota Fiscal no sistema.
- **Validação de NF-e**: Valida a Nota Fiscal no ambiente fiscal.
- **Transmissão de NF-e**: Transmite a NF-e para o órgão fiscal.
- **Geração de PDF**: Gera o PDF da NF-e para download ou visualização.
- **Envio de NF-e por e-mail**: Envia a NF-e por e-mail ao destinatário.
- **Exclusão de NF-e**: Exclui a NF-e do sistema.
- **Consulta de todas as NF-es**: Lista todas as NF-es cadastradas.

## Dependências

- **Apache Cordova**
- **cordova-plugin-advanced-http**
- **CryptoJS**: Para gerar tokens de autenticação.

## Como Executar

1. Configure o Apache Cordova no seu projeto.
2. Adicione o plugin `cordova-plugin-advanced-http` com o comando:
   ```bash
   cordova plugin add cordova-plugin-advanced-http
3. Inclua as credenciais da empresa, chave de acesso e dados da NF-e no código.
4. Execute o projeto no dispositivo.

## Estrutura de Funções
- gerarToken(codigoEmpresa): Gera o token de autenticação para as requisições.
- enviarRequisicao(url, method, data, sucessoCallback, erroCallback): Função genérica para lidar com requisições HTTP.
- **Funções específicas**:
    - ```bash gravarNfe(codigoEmpresa, chaveAcesso, notaFiscal)```
    - ```bash validarNfe(codigoEmpresa, chaveAcesso, nNF)```
    - ```bash transmitirNfe(codigoEmpresa, chaveAcesso, nNF)```
    - ```bash getPDF(codigoEmpresa, chaveAcesso, nNF)```
    - ```bash enviarEmail(codigoEmpresa, chaveAcesso, nNF, email)```
    - ```bash apagarNFe(codigoEmpresa, chaveAcesso, nNF)```
    - ```bash verTudo(codigoEmpresa, chaveAcesso)```

## Eventos de Botões

Os eventos de clique dos botões são configurados para acionar as funções correspondentes. Cada botão está associado a uma funcionalidade da API.