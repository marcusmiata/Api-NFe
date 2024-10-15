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
const exNumeroDocumento = "NFe31240705642329000170550010001036181101036208";
const exEmail = "viniciusmiata@gmail.com";
const UF = "MG";
const exCodigoEmpresa = "9618";
const mode = "false"; // True ou falso, para mode de contingencia
const exnNf = "2040";
const exNotaFiscal = {
  "chave": "31240905642329000331550010000021401100021400",
  "ide": {
      "cUF": "31",
      "cNF": "10002140",
      "natOp": "RETORNO DE REMESSA P/ DEP. FECH",
      "mod": "55",
      "serie": "1",
      "nNF": "2040",
      "dhEmi": "2024-09-10T10:37:24-03:00",
      "dhSaiEnt": "2024-09-10T10:57:16-03:00",
      "tpNF": "1",
      "idDest": "1",
      "cMunFG": "3152501",
      "tpImp": "1",
      "tpEmis": "1",
      "cDV": "0",
      "tpAmb": "2",
      "finNFe": "1",
      "indFinal": "0",
      "indPres": "9",
      "indIntermed": "0",
      "procEmi": "3",
      "verProc": "4.01_sebrae_b037"
  },
  "emit": {
      "CNPJ": "05642329000331",
      "xNome": "GUIMARAES CANDIDO SOUZA CIA LTDA",
      "enderEmit": {
          "xLgr": "RUA MAURO BRANDAO",
          "nro": "68",
          "xBairro": "NOVA POUSO ALEGR",
          "cMun": "3152501",
          "xMun": "POUSO ALEGRE",
          "UF": "MG",
          "CEP": "37550000",
          "cPais": "1058",
          "xPais": "BRASIL"
      },
      "IE": "5252313220217",
      "CRT": "3"
  },
  "dest": {
      "CNPJ": "05642329000170",
      "xNome": "GUIMARAES CANDIDO SOUZA E CIA LTDA 1",
      "enderDest": {
          "xLgr": "AV ALBERTO DE BARROS COBRA",
          "nro": "576",
          "xCpl": "1",
          "xBairro": "NOVA POUSO ALEGRE",
          "cMun": "3152501",
          "xMun": "POUSO ALEGRE",
          "UF": "MG",
          "CEP": "37550000",
          "cPais": "1058",
          "xPais": "BRASIL"
      },
      "indIEDest": "1",
      "IE": "5252313220055",
      "email": "guimaraescpd@gmail.com"
  },
  "det": [
      {
          "nItem": "1",
          "prod": {
              "cProd": "300",
              "cEAN": "SEM GTIN",
              "xProd": "MARLBORO FOREST FUSION MNT KSRB SEM GTIN",
              "NCM": "24022000",
              "CEST": "0400100",
              "CFOP": "5906",
              "uCom": "PT",
              "qCom": "750.0000",
              "vUnCom": "108.0000",
              "vProd": "81000.00",
              "cEANTrib": "SEM GTIN",
              "uTrib": "PT",
              "qTrib": "750.0000",
              "vUnTrib": "108.0000",
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
              "cProd": "112",
              "cEAN": "SEM GTIN",
              "xProd": "MARLBORO GOLD KS RCB SEM GTIN",
              "NCM": "24022000",
              "CEST": "0400100",
              "CFOP": "5906",
              "uCom": "PT",
              "qCom": "250.0000",
              "vUnCom": "103.6000",
              "vProd": "25900.00",
              "cEANTrib": "SEM GTIN",
              "uTrib": "PT",
              "qTrib": "250.0000",
              "vUnTrib": "103.6000",
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
          "vProd": "106900.00",
          "vFrete": "0.00",
          "vSeg": "0.00",
          "vDesc": "0.00",
          "vII": "0.00",
          "vIPI": "0.00",
          "vIPIDevol": "0.00",
          "vPIS": "0.00",
          "vCOFINS": "0.00",
          "vOutro": "0.00",
          "vNF": "106900.00"
      }
  },
  "transp": {
      "modFrete": "4",
      "transporta": {
          "CNPJ": "05642329000170",
          "xNome": "GUIMARAES CANDIDO SOUZA E CIA LTDA",
          "IE": "5252313220055",
          "xEnder": "AV ALBERTO DE BARROS COBRA 576 1",
          "xMun": "POUSO ALEGRE",
          "UF": "MG"
      },
      "vol": {
          "qVol": "1000",
          "esp": "VOLUMES",
          "pesoL": "240.000",
          "pesoB": "250.000"
      }
  },
  "pag": {
      "detPag": [
          {
              "indPag": "0",
              "tPag": "90",
              "vPag": "0.00"
          }
        ]
  },
      "infAdic": {
          "infAdFisco": "ICMS SUSP CFE ART 19 ANEX 3 DECRETO 38104/96 - S.T.-BC:91,250.00 Vr:15,591.50",
          "infCpl": "DEVOLUCAO DE PRODUTOS REFERENTE A NF DE NO _104651____ DE _27/08/2024_. ; PEDIDO: 299 ; CARGA: 79 ; VENDEDOR: 11"
      }
}

const exNotaFiscal2 = {
    "chave": "1111111111111111111112222222222222222333",
    "ide": {
        "cUF": "31",
        "cNF": "10002140",
        "natOp": "RETORNO DE REMESSA P/ DEP. FECH",
        "mod": "55",
        "serie": "1",
        "nNF": "2040",
        "dhEmi": "2024-09-10T10:37:24-03:00",
        "dhSaiEnt": "2024-09-10T10:57:16-03:00",
        "tpNF": "1",
        "idDest": "1",
        "cMunFG": "3152501",
        "tpImp": "1",
        "tpEmis": "1",
        "cDV": "0",
        "tpAmb": "2",
        "finNFe": "1",
        "indFinal": "0",
        "indPres": "9",
        "indIntermed": "0",
        "procEmi": "3",
        "verProc": "4.01_sebrae_b037"
    },
    "emit": {
        "CNPJ": "05642329000331",
        "xNome": "GUIMARAES CANDIDO SOUZA CIA LTDA",
        "enderEmit": {
            "xLgr": "RUA MAURO BRANDAO",
            "nro": "68",
            "xBairro": "NOVA POUSO ALEGR",
            "cMun": "3152501",
            "xMun": "POUSO ALEGRE",
            "UF": "MG",
            "CEP": "37550000",
            "cPais": "1058",
            "xPais": "BRASIL"
        },
        "IE": "5252313220217",
        "CRT": "3"
    },
    "dest": {
        "CNPJ": "05642329000170",
        "xNome": "GUIMARAES CANDIDO SOUZA E CIA LTDA 1",
        "enderDest": {
            "xLgr": "AV ALBERTO DE BARROS COBRA",
            "nro": "576",
            "xCpl": "1",
            "xBairro": "NOVA POUSO ALEGRE",
            "cMun": "3152501",
            "xMun": "POUSO ALEGRE",
            "UF": "MG",
            "CEP": "37550000",
            "cPais": "1058",
            "xPais": "BRASIL"
        },
        "indIEDest": "1",
        "IE": "5252313220055",
        "email": "guimaraescpd@gmail.com"
    },
    "det": [
        {
            "nItem": "1",
            "prod": {
                "cProd": "300",
                "cEAN": "SEM GTIN",
                "xProd": "MARLBORO FOREST FUSION MNT KSRB SEM GTIN",
                "NCM": "24022000",
                "CEST": "0400100",
                "CFOP": "5906",
                "uCom": "PT",
                "qCom": "750.0000",
                "vUnCom": "108.0000",
                "vProd": "81000.00",
                "cEANTrib": "SEM GTIN",
                "uTrib": "PT",
                "qTrib": "750.0000",
                "vUnTrib": "108.0000",
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
                "cProd": "112",
                "cEAN": "SEM GTIN",
                "xProd": "MARLBORO GOLD KS RCB SEM GTIN",
                "NCM": "24022000",
                "CEST": "0400100",
                "CFOP": "5906",
                "uCom": "PT",
                "qCom": "250.0000",
                "vUnCom": "103.6000",
                "vProd": "25900.00",
                "cEANTrib": "SEM GTIN",
                "uTrib": "PT",
                "qTrib": "250.0000",
                "vUnTrib": "103.6000",
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
            "vProd": "106900.00",
            "vFrete": "0.00",
            "vSeg": "0.00",
            "vDesc": "0.00",
            "vII": "0.00",
            "vIPI": "0.00",
            "vIPIDevol": "0.00",
            "vPIS": "0.00",
            "vCOFINS": "0.00",
            "vOutro": "0.00",
            "vNF": "106900.00"
        }
    },
    "transp": {
        "modFrete": "4",
        "transporta": {
            "CNPJ": "05642329000170",
            "xNome": "GUIMARAES CANDIDO SOUZA E CIA LTDA",
            "IE": "5252313220055",
            "xEnder": "AV ALBERTO DE BARROS COBRA 576 1",
            "xMun": "POUSO ALEGRE",
            "UF": "MG"
        },
        "vol": {
            "qVol": "1000",
            "esp": "VOLUMES",
            "pesoL": "240.000",
            "pesoB": "250.000"
        }
    },
    "pag": {
        "detPag": [
            {
                "indPag": "0",
                "tPag": "90",
                "vPag": "0.00"
            }
          ]
    },
        "infAdic": {
            "infAdFisco": "ICMS SUSP CFE ART 19 ANEX 3 DECRETO 38104/96 - S.T.-BC:91,250.00 Vr:15,591.50",
            "infCpl": "DEVOLUCAO DE PRODUTOS REFERENTE A NF DE NO _104651____ DE _27/08/2024_. ; PEDIDO: 299 ; CARGA: 79 ; VENDEDOR: 11"
        }
  }
//======================================================================================================
let responseString = "";

//======================================================================================================
// Função utilitária para gerar o token
function gerarToken(codigoEmpresa) {
  return CryptoJS.MD5(CryptoJS.SHA1([codigoEmpresa] + Math.floor(Date.now() / 1000).toString())).toString(CryptoJS.enc.Hex);
}

// Função genérica para lidar com requisições HTTP
function enviarRequisicao(url, method, data, sucessoCallback, erroCallback) {
  cordova.plugin.http.sendRequest(url, {
      method: method,
      data: data || {},
      headers: {
          'Content-Type': 'application/json',
      }
  }, sucessoCallback, erroCallback);
}

// Função para exibir alertas
function exibirAlerta(mensagem, titulo = 'Resposta da API') {
  navigator.notification.alert(mensagem, null, titulo, 'OK');
}

// Sucesso e erro genéricos
function sucessoHandler(titulo, resposta) {
  responseString += `\n========== ${titulo} ==========\n` + JSON.stringify(resposta.data) + "\n";
  //exibirAlerta(responseString, titulo);
}

function erroHandler(resposta) {
  exibirAlerta(`Erro na requisição: ${resposta.error}`, 'Erro');
}

// Funções específicas de API
function gravarNfe(codigoEmpresa, chaveAcesso, notaFiscal) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=gravarNfe`;
  enviarRequisicao(url, 'POST', { nfe: notaFiscal }, (resposta) => sucessoHandler('Gravação', resposta), erroHandler);
}

function validarNfe(codigoEmpresa, chaveAcesso, nNF) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=validarNfe&nNF=${nNF}`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('Validação', resposta), erroHandler);
}

function transmitirNfe(codigoEmpresa, chaveAcesso, nNF) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=transmitirNfe&nNF=${nNF}&debug=1`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('Transmissão', resposta), erroHandler);
}

function getPDF(codigoEmpresa, chaveAcesso, nNF) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getPDF&nNF=${nNF}`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('PDF', resposta), erroHandler);
}

function enviarEmail(codigoEmpresa, chaveAcesso, nNF, email) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=enviarNfe&nNF=${nNF}&email=${email}&debug=1`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('Envio de Email', resposta), erroHandler);
}

function apagarNFe(codigoEmpresa, chaveAcesso, nNF) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=excluirNfe&nNF=${nNF}`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('Exclusão', resposta), erroHandler);
}

function verTudo(codigoEmpresa, chaveAcesso) {
  const url = `https://fiscal.ogestor.com.br/api/json/4?e=${codigoEmpresa}&key=${chaveAcesso}&acao=getAllNfe`;
  enviarRequisicao(url, 'GET', null, (resposta) => sucessoHandler('Todas as NF-es', resposta), erroHandler);
}

// Função principal para orquestrar chamadas
function sendToAPI(codigoEmpresa, notaFiscal, nNF, emailCliente) {
  const chave = gerarToken(codigoEmpresa);
  gravarNfe(codigoEmpresa, chave, notaFiscal);
  validarNfe(codigoEmpresa, chave, nNF);
  transmitirNfe(codigoEmpresa, chave, nNF);
  getPDF(codigoEmpresa, chave, nNF);
  enviarEmail(codigoEmpresa, chave, nNF, emailCliente);
  exibirAlerta(responseString, 'Resultado da Requisição');
}

//======================================================================================================
// Chamadas dos botões

function setupEventListeners() {
  document.getElementById("main").addEventListener('click', function() {
      sendToAPI(exCodigoEmpresa, exNotaFiscal, exnNf, exEmail);
  });

  document.getElementById("create").addEventListener('click', function() {
      gravarNfe(exCodigoEmpresa, gerarToken(exCodigoEmpresa), exNotaFiscal);
  });

  document.getElementById("validate").addEventListener('click', function() {
      validarNfe(exCodigoEmpresa, gerarToken(exCodigoEmpresa), exnNf);
  });

  document.getElementById("transfer").addEventListener('click', function() {
      transmitirNfe(exCodigoEmpresa, gerarToken(exCodigoEmpresa), exnNf);
  });

  document.getElementById("verify").addEventListener('click', function() {
      getStatus(exCodigoEmpresa, gerarToken(exCodigoEmpresa), mode);
  });

  document.getElementById("pdf").addEventListener('click', function() {
      getPDF(exCodigoEmpresa, gerarToken(exCodigoEmpresa), exnNf);
  });

  document.getElementById("send").addEventListener('click', function() {
    salvar_arquivo_json_data(exNotaFiscal2);
  });

  document.getElementById("delete").addEventListener('click', function() {
      download_arquivo_json();
  });

//   document.getElementById("all").addEventListener('click', function() {
//       verTudo(exCodigoEmpresa, gerarToken(exCodigoEmpresa));
//   });
document.getElementById("all").addEventListener('click', function(){
    salvar_arquivo_json_data(exNotaFiscal);
    
});
}



function salvar_arquivo_json_data(json) {
    // Converter o JSON em string
    let jsonData = JSON.stringify(json, null, 4);

    // Nome do arquivo a ser salvo
    let fileName = "dados.json";

    // Verifica se o diretório está acessível
    if (!cordova.file.dataDirectory) {
        alert("Erro: O diretório de dados não está disponível.");
        return;
    }

    // Função para salvar o arquivo no diretório de dados do app
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
        // Verifica se o arquivo já existe
        dir.getFile(fileName, { create: false }, function (fileEntry) {
            // Se o arquivo existir, exclua-o
            fileEntry.remove(function () {
                console.log("Arquivo antigo excluído.");

                // Após excluir, cria um novo arquivo e grava o conteúdo JSON
                criarNovoArquivo(dir, fileName, jsonData);

            }, function (error) {
                alert("Erro ao excluir o arquivo antigo: " + error);
            });
        }, function () {
            // Caso o arquivo não exista, simplesmente cria o novo
            criarNovoArquivo(dir, fileName, jsonData);
        });
    }, function (error) {
        alert("Erro ao acessar o diretório: " + error);
    });

    // Função para criar e gravar o novo arquivo
    function criarNovoArquivo(dir, fileName, jsonData) {
        dir.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function () {
                    alert("Arquivo JSON salvo com sucesso em " + fileEntry.nativeURL);
                };

                fileWriter.onerror = function (e) {
                    alert("Erro ao salvar o arquivo: " + e.toString());
                };

                let blob = new Blob([jsonData], { type: 'application/json' });
                fileWriter.write(blob);
            }, function (error) {
                alert("Erro ao criar writer: " + error);
            });
        }, function (error) {
            alert("Erro ao acessar o sistema de arquivos: " + error);
        });
    }
}


function download_arquivo_json() {
    // Nome base do arquivo
    let baseFileName = "dados.json";

    // Caminho do arquivo no diretório de dados do aplicativo
    let sourceFile = cordova.file.dataDirectory + baseFileName;

    // Caminho de destino na pasta de Downloads
    let downloadDirPath = cordova.file.externalRootDirectory + "Download/";

    // Verifica se o diretório de Downloads está acessível
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
        // Cria o diretório de Downloads se não existir
        dirEntry.getDirectory("Download", { create: true }, function (downloadDir) {
            // Verifica se o arquivo já existe no diretório de Downloads
            downloadDir.getFile(baseFileName, { create: false }, function (existingFileEntry) {
                // Se o arquivo já existir, exclua-o
                existingFileEntry.remove(function () {
                    // Após excluir o arquivo existente, copie o novo arquivo
                    copiarArquivo(downloadDir, sourceFile);
                }, function (error) {
                    alert("Erro ao remover o arquivo existente: " + error);
                });
            }, function (error) {
                // Se o arquivo não existir, apenas copie o novo arquivo
                if (error.code === FileError.NOT_FOUND_ERR) {
                    copiarArquivo(downloadDir, sourceFile);
                } else {
                    alert("Erro ao acessar o arquivo existente: " + error);
                }
            });
        }, function (error) {
            alert("Erro ao acessar o diretório de Downloads: " + error);
        });
    }, function (error) {
        alert("Erro ao acessar o diretório raiz externo: " + error);
    });
}

// Função para copiar o arquivo
function copiarArquivo(downloadDir, sourceFile) {
    window.resolveLocalFileSystemURL(sourceFile, function (fileEntry) {
        fileEntry.copyTo(downloadDir, "dados.json", function (newFileEntry) {
            alert("Arquivo JSON baixado com sucesso em " + newFileEntry.nativeURL);
        }, function (error) {
            alert("Erro ao copiar o arquivo: " + error);
        });
    }, function (error) {
        alert("Erro ao acessar o arquivo de origem: " + error);
    });
}



setupEventListeners();
