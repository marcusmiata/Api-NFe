s# Projeto de Envio de Notas Fiscais com Cordova

Este projeto Cordova tem como objetivo permitir o envio de notas fiscais via JSON para uma API fiscal, utilizando plugins Cordova para realizar requisições HTTP avançadas e exibir notificações.

## Funcionalidades

- Enviar notas fiscais para a API.
- Validar notas fiscais.
- Transmitir e verificar o status de notas fiscais.
- Gerar PDF de notas fiscais.
- Enviar notas fiscais por e-mail.
- Excluir notas fiscais.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado o Node.js e o Cordova CLI.

## Instalação de Plugins Cordova

Este projeto utiliza os seguintes plugins Cordova:

### `cordova-plugin-dialogs`

Utilizado para exibir alertas nativos no aplicativo.

Para instalar:

```bash
cordova plugin add cordova-plugin-dialogs
```

### `cordova-plugin-advanced-http`

Utilizado para fazer as requisições na API, no lugar do "fetch".

Para instalar:

```bash
cordova plugin add cordova-plugin-advanced-http
```
## Para executar

Se estiver com celular conectado via USB, e a função depurar USB estiver ativada

```bash
cordova run android
```

Caso não esteja pode gerar o APK, e transferir para o smartphone, codigo para gerar apk:

```bash
cordova build android
```
