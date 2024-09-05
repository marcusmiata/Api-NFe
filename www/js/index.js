/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// ===========================================================================================================================
// ===================================== Nota fiscal para Testes =====================================
const numeroDocumento = "12345678901234567890123456789012345678901234";
const email = "viniciusmiata@gmail.com";
const UF = "MG";
const mode = "true"; // True ou falso, para mode de contingencia
const notaFiscal = {
    "chave": numeroDocumento,
    "ide": {
      "cUF": "35",
      "cNF": "123456",
      "natOp": "Venda de mercadorias",
      "indPag": "0",
      "mod": "55",
      "serie": "1",
      "nNF": "123456",
      "dhEmi": "2024-08-30T14:30:00Z",
      "dhSaiEnt": "2024-08-30T15:00:00Z",
      "tpNF": "1",
      "idDest": "1",
      "cMunFG": "3550308",
      "tpImp": "1",
      "tpEmis": "1",
      "cDV": "5",
      "tpAmb": "1",
      "finNFe": "1",
      "indFinal": "0",
      "indPres": "1",
      "procEmi": "0",
      "verProc": "1.00",
      "dhCont": "2024-08-30T14:00:00Z",
      "xJust": "Justificativa de contingência"
    },
    "emit": {
      "CNPJ": "12345678000195",
      "xNome": "Empresa Exemplo LTDA",
      "xFant": "Exemplo",
      "enderEmit": {
        "xLgr": "Rua Exemplo",
        "nro": "123",
        "xCpl": "Sala 101",
        "xBairro": "Centro",
        "cMun": "3550308",
        "xMun": "São Paulo",
        "UF": "SP",
        "CEP": "01000-000",
        "cPais": "1058",
        "xPais": "Brasil",
        "fone": "(11) 1234-5678"
      },
      "IE": "123456789",
      "IM": "12345",
      "CNAE": "1234-56",
      "CRT": "1"
    },
    "dest": {
      "CPF": "12345678901",
      "xNome": "Cliente Exemplo",
      "enderDest": {
        "xLgr": "Avenida Exemplo",
        "nro": "456",
        "xCpl": "Apto 202",
        "xBairro": "Bela Vista",
        "cMun": "3550308",
        "xMun": "São Paulo",
        "UF": "SP",
        "CEP": "01234-567",
        "cPais": "1058",
        "xPais": "Brasil",
        "fone": "(11) 9876-5432"
      },
      "indIEDest": "1",
      "IE": "987654321",
      "email": "cliente@exemplo.com"
    },
    "det": [
      {
        "nItem": "1",
        "prod": {
          "cProd": "001",
          "cEAN": "7891234567890",
          "xProd": "Produto Exemplo",
          "NCM": "12345678",
          "CFOP": "5101",
          "uCom": "un",
          "qCom": "10",
          "vUnCom": "15.00",
          "vProd": "150.00",
          "cEANTrib": "7891234567890",
          "uTrib": "un",
          "qTrib": "10",
          "vUnTrib": "15.00",
          "vFrete": "0.00",
          "indTot": "1",
          "xPed": "PED123",
          "nItemPed": "1"
        },
        "imposto": {
          "vTotTrib": "30.00",
          "ICMS": {
            "ICMSSN102": {
              "orig": "0",
              "CSOSN": "102"
            }
          },
          "PIS": {
            "PISNT": {
              "CST": "01"
            }
          },
          "COFINS": {
            "COFINSNT": {
              "CST": "01"
            }
          }
        }
      }
    ],
    "total": {
      "ICMSTot": {
        "vBC": "150.00",
        "vICMS": "15.00",
        "vICMSDeson": "0.00",
        "vBCST": "0.00",
        "vST": "0.00",
        "vProd": "150.00",
        "vFrete": "0.00",
        "vSeg": "0.00",
        "vDesc": "0.00",
        "vII": "0.00",
        "vIPI": "0.00",
        "vPIS": "1.50",
        "vCOFINS": "2.00",
        "vOutro": "0.00",
        "vNF": "150.00",
        "vTotTrib": "30.00"
      }
    },
    "transp": {
      "modFrete": "0"
    },
    "infAdic": {
      "infCpl": "Informações adicionais de interesse do contribuinte."
    }
  };
  
//======================================================================================================


// ====== Gerando o Token (Key) para acesso a API ======================================================
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Utilizado apenas para testes, quando for para WebView android não será necess
const codigoEmpresa = "12289";

function md5(mensagem) {
    const hash = CryptoJS.MD5(mensagem);
    
    return hash.toString(CryptoJS.enc.Hex);
    
}

function sha1(mensagem) {

    const hash = CryptoJS.SHA1(mensagem);
    
    return hash.toString(CryptoJS.enc.Hex);
    
}

function gerarToken() {
    return $token = md5(sha1([codigoEmpresa] + Math.floor(Date.now() / 1000).toString()));    
}

//======================================================================================================


// === Criar Nota Fiscal para Api =====================================================================

function gravarNfe() {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=gravarNfe`;

    // Fazendo a requisição usando cordova.plugin.http
    
    cordova.plugin.http.sendRequest(url, {
        method: 'POST',
        data: notaFiscal, // Enviar o objeto diretamente
        headers: {
            'Content-Type': 'application/json',
        }
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("create").addEventListener('click', gravarNfe);



//======================================================================================================


//=== Validar NFe após criação ===========================================================================


function validarNfe(nDocumento) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=validarNfe&nNF=${nDocumento}`;

    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("validate").addEventListener('click', function (){
    validarNfe(numeroDocumento);
    });


//======================================================================================================


//=== Transmitir NFe ===================================================================================

function transmitirNfe(nDocumento) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=transmitirNfce&nNF=${nDocumento}&debug=1`;

    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("transfer").addEventListener('click', function(){
    validarNfe(numeroDocumento);
});

//======================================================================================================


//=== Verificar status NFe==============================================================================

function getStatus(uf, modo) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getStatus&UF=${uf}&tpAmb=2&contingencia=${modo}`; 
    // Fazendo a requisição usando fetch
    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("verify").addEventListener('click', function(){
    getStatus(UF, mode);
});

//======================================================================================================


//=== Gerar PDF ========================================================================================

function getPDF() {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getPDF&nNF=${numeroDocumento}`; 

    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("pdf").addEventListener('click', getStatus);

//======================================================================================================


//=== Enviar por email =================================================================================

function enviarEmail(nDocumento, mail) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=enviarNfe&nNF=${nDocumento}&email=${mail}&debug=1`; 
    // Fazendo a requisição usando fetch
    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("send").addEventListener('click', function (){
    getStatus(numeroDocumento, email)
});

//======================================================================================================


//=== Excluir NFe ======================================================================================

function apagarNFe(nDocumento) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=excluirNfe&nNF=${nDocumento}`; 

    // Fazendo a requisição usando fetch
    cordova.plugin.http.sendRequest(url, {
        method: 'GET',
    }, function(response) {
        // Sucesso
        navigator.notification.alert(
            response.data, // message: o conteúdo que você quer mostrar
            null,          // callback: função chamada quando o alerta é fechado (pode ser null se não precisar)
            'Resposta da API', // title: o título da caixa de alerta
            'OK'           // buttonName: o texto do botão
        );
        console.log(`Erro na requisição: ${response.data}`);
    }, function(response) {
        // Erro
        navigator.notification.alert(
            `Erro na requisição: ${response.error}`, // message: mensagem de erro formatada
            null,                                  // callback: função chamada quando o alerta é fechado
            'Erro',                                // title: título da caixa de alerta
            'OK'                                   // buttonName: texto do botão
        );
        console.log(`Erro na requisição: ${response.error}`);
    });
}

document.getElementById("delete").addEventListener('click', function (){
    apagarNFe(numeroDocumento)
});

//======================================================================================================