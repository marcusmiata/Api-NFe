# Aplicativo de Emissão de NF-e com WebView e Fetch API

Este projeto consiste em um aplicativo Android para emissão de Notas Fiscais Eletrônicas (NF-e) utilizando uma WebView para carregar um código JavaScript que faz requisições a uma API REST. O objetivo é integrar a funcionalidade de emissão de NF-e com uma interface web desenvolvida em HTML, CSS e JavaScript, permitindo a interação direta com a API através do próprio dispositivo móvel.

## Funcionalidades

- **Geração de Chave de Acesso**: Geração automática da chave de acesso necessária para a comunicação com a API de emissão de NF-e.
- **Requisições via Fetch API**: Realização de requisições GET e POST para consultar e gravar notas fiscais na plataforma fiscal.
- **Integração com WebView**: Utilização de WebView no Android para carregar a interface web e realizar as requisições diretamente do aplicativo.
- **Tratamento de Erros**: Exibição de mensagens de erro detalhadas em caso de falha na comunicação com a API.

## Tecnologias Utilizadas

- **JavaScript**: Lógica para fazer as requisições à API, tratamento de dados e manipulação de DOM.
- **HTML/CSS**: Interface gráfica carregada na WebView do aplicativo Android.
- **Fetch API**: Para comunicação com a API RESTful do sistema fiscal.
- **WebView**: Componente do Android usado para carregar e exibir a interface web dentro do aplicativo.
- **CORS Proxy (opcional)**: Para contornar problemas de CORS em ambiente de desenvolvimento.

## Como Usar

1. **Configuração do Projeto**: Clone o repositório e configure o ambiente de desenvolvimento Android.
2. **Substituição de Variáveis**: Insira os valores corretos para `codigoEmpresa` e configure a geração da chave de acesso (`gerarToken()`).
3. **Desenvolvimento e Testes**: Utilize a WebView para testar as funcionalidades diretamente no dispositivo Android.
4. **Compilação**: Compile o projeto e instale o APK no dispositivo.
