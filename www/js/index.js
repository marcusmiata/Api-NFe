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

// ===========================================================================================================================
// ===================================== Constantes =====================================
const numeroDocumento = "NFe31240705642329000170550010001036181101036208";
const email = "viniciusmiata@gmail.com";
const UF = "MG";
const codigoEmpresa = "12289";
const mode = "false"; // True ou falso, para mode de contingencia
const notaFiscal = {
    "chave": "31240705642329000170550010001036181101036188",
    "ide": {
      "cUF": "31",
      "cNF": "00000011",
      "natOp": "VENDA",
      "mod": "55",
      "serie": "1", // Faz parte do codigo
      "nNF": "000000001", // parte do codigo
      "dhEmi": "2024-07-31T16:06:25-03:00",
      "dhSaiEnt": "2024-07-31T16:26:31-03:00",
      "tpNF": "1",
      "idDest": "1",
      "cMunFG": "3152501",
      "tpImp": "1",
      "tpEmis": "1",
      "cDV": "8",
      "tpAmb": "2", // Homologação
      "finNFe": "1",
      "indFinal": "0",
      "indPres": "9",
      "indIntermed": "0",
      "procEmi": "3",
      "verProc": "4.01 b037"
    },
    "emit": {
      "CNPJ": "05642329000170",
      "xNome": "GUIMARAES CANDIDO SOUZA CIA LTDA",
      "enderEmit": {
        "xLgr": "AV ALBERTO DE BARROS COBRA",
        "nro": "576",
        "xBairro": "N. POUSO ALEGRE",
        "cMun": "3152501",
        "xMun": "POUSO ALEGRE",
        "UF": "MG",
        "CEP": "37550000",
        "cPais": "1058",
        "xPais": "BRASIL"
      },
      "IE": "5252313220055",
      "CRT": "3"
    },
    "dest": {
      "CNPJ": "40270073000118",
      "xNome": "JOSE GABRIEL CANCIO FERREIRA 18272",
      "enderDest": {
        "xLgr": "ROD BR 267 KM491",
        "nro": "0",
        "xBairro": "RODOVIA",
        "cMun": "3105301",
        "xMun": "BANDEIRA DO SUL",
        "UF": "MG",
        "CEP": "37740000",
        "cPais": "1058",
        "xPais": "BRASIL"
      },
      "indIEDest": "1",
      "IE": "0039316110050",
      "email": "postocorujao21@gmail.com"
    },
    "det": [
      {
        "nItem": "1",
        "prod": {
          "cProd": "388",
          "cEAN": "7893789310063",
          "xProd": "CHESTERFIELD ORIGINAL 4.0 KS R 7893789310063",
          "NCM": "24022000",
          "CEST": "0400100",
          "CFOP": "5405",
          "uCom": "PT",
          "qCom": "1.0000",
          "vUnCom": "59.9000",
          "vProd": "59.90",
          "cEANTrib": "7893789310063",
          "uTrib": "PT",
          "qTrib": "1.0000",
          "vUnTrib": "59.9000",
          "vOutro": "0.73",
          "indTot": "1"
        },
        "imposto": {
          "ICMS": {
            "ICMS60": {
              "orig": "0",
              "CST": "60",
              "vBCSTRet": "0.00",
              "pST": "0.00",
              "vICMSSubstituto": "0.00",
              "vICMSSTRet": "0.00"
            }
          },
          "PIS": {
            "PISNT": {
              "CST": "08"
            }
          },
          "COFINS": {
            "COFINSNT": {
              "CST": "08"
            }
          }
        }
      },
      {
        "nItem": "2",
        "prod": {
          "cProd": "427",
          "cEAN": "7893789312487",
          "xProd": "MARLBORO CRAFTED RED KS BOX 20 7893789312487",
          "NCM": "24022000",
          "CEST": "0400100",
          "CFOP": "5405",
          "uCom": "PT",
          "qCom": "2.0000",
          "vUnCom": "50.6000",
          "vProd": "101.20",
          "cEANTrib": "7893789312487",
          "uTrib": "PT",
          "qTrib": "2.0000",
          "vUnTrib": "50.6000",
          "vOutro": "1.22",
          "indTot": "1"
        },
        "imposto": {
          "ICMS": {
            "ICMS60": {
              "orig": "0",
              "CST": "60",
              "vBCSTRet": "0.00",
              "pST": "0.00",
              "vICMSSubstituto": "0.00",
              "vICMSSTRet": "0.00"
            }
          },
          "PIS": {
            "PISNT": {
              "CST": "08"
            }
          },
          "COFINS": {
            "COFINSNT": {
              "CST": "08"
            }
          }
        }
      }
    ],
    "total": {
      "ICMSTot": {
        "vBC": "0.00",
        "vICMS": "0.00",
        "vICMSDeson": "0.00",
        "vFCP": "0.00",
        "vBCST": "0.00",
        "vST": "0.00",
        "vFCPST": "0.00",
        "vFCPSTRet": "0.00",
        "vProd": "161.10",
        "vFrete": "0.00",
        "vSeg": "0.00",
        "vDesc": "0.00",
        "vII": "0.00",
        "vIPI": "0.00",
        "vIPIDevol": "0.00",
        "vPIS": "0.00",
        "vCOFINS": "0.00",
        "vOutro": "1.95",
        "vNF": "163.05"
      }
    },
    "transp": {
      "modFrete": "3",
      "transporta": {
        "CNPJ": "05642329000170",
        "xNome": "GUIMARAES CANDIDO SOUZA CIA LTDA",
        "IE": "5252313220055",
        "xEnder": "AV. ALBERTO DE BARROS COBRA 576",
        "xMun": "POUSO ALEGRE",
        "UF": "MG"
      },
      "vol": {
        "qVol": "3",
        "esp": "VOLUMES",
        "pesoL": "0.720",
        "pesoB": "0.750"
      }
    },
    "pag": {
      "detPag": {
        "indPag": "1",
        "tPag": "15",
        "vPag": "163.05"
      }
    },
    "infAdic": {
      "infAdFisco": "- S.T.-BC:175.00 Vr:23.30",
      "infCpl": "CONVENIENCIA P: VENCIMENTO : VALOR R$ P: VENCIMENTO : VALOR R$0: 07/08/2024 : 163.05 ; PEDIDO: 69431 ; CARGA: 8 ; VENDEDOR: 8"
    }
}
//======================================================================================================


// ====== Gerando o Token (Key) para acesso a API ======================================================
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

    console.log(chaveAcesso)
    // Construindo a URL da API
    const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=gravarNfe`;

    // Fazendo a requisição usando cordova.plugin.http
    
    cordova.plugin.http.sendRequest(url, {
        method: 'POST',
        data: {
            nfe: notaFiscal // Enviando o JSON da nota como um campo form-data chamado 'nfe'
        },
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
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getPDF&nNF=000001`; 

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

function enviarEmail(mail) {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=enviarNfe&nNF=000001&email=${mail}&debug=1`; 
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
    getStatus(email);
});

//======================================================================================================


//=== Excluir NFe ======================================================================================

function apagarNFe() {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=excluirNfe&nNF=000001`; 

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
    apagarNFe(numeroDocumento);
});

//======================================================================================================

function verTudo() {
    const chaveAcesso = gerarToken();

    // Construindo a URL da API
    url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getAllNfe&pag=1&ipp=15`; 

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

document.getElementById("all").addEventListener('click', function (){
    verTudo();
});