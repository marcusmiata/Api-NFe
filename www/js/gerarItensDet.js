function gerarItensDet(jsonOriginais) {
    var det = [];

    // Percorre as chaves numéricas do objeto jsonOriginais["itens"]
    for (var key in jsonOriginais["itens"]) {
        if (jsonOriginais["itens"].hasOwnProperty(key)) {
            var item = jsonOriginais["itens"][key];

            det.push({
                "nItem": key,
                "prod": {
                    "cProd": item.Produto,
                    "cEAN": "SEM GTIN",
                    "xProd": item.Descricao,
                    "NCM": item.NCM,
                    "CEST": "0400100",
                    "CFOP": CFO,
                    "uCom": item.Unidade,
                    "qCom": item.QtdeU,
                    "vUnCom": item.PrUnitario,
                    "vProd": item.QtdeU * item.PrUnitario,
                    "cEANTrib": "SEM GTIN",
                    "uTrib": item.Unidade,
                    "qTrib": item.QtdeU,
                    "vUnTrib": item.PrUnitario,
                    "vOutro": Round(item.QtdeU * item.PrUnitario * fDespAcess, 2),
                    "indTot": "1"
                },
                "imposto": {
                    "ICMS": {
                        "ICMS60": {
                            "orig": "0",
                            "CST": "60",
                            "vBCSTRet": 0,
                            "pST": 0,
                            "vICMSSubstituto": 0,
                            "vICMSSTRet": 0
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
            });
        }
    }

    return det;
}


// =================================== ROTINA PARA TESTES MANUAIS ===================================

var jsonOriginais = {
    "itens": {
        '1': {
            "Produto": "Produto A",
            "Descricao": "Descrição do Produto A",
            "NCM": "12345678",
            "Unidade": "UN",
            "QtdeU": 10,
            "PrUnitario": 50.00
        },
        '2': {
            "Produto": "Produto B",
            "Descricao": "Descrição do Produto B",
            "NCM": "87654321",
            "Unidade": "UN",
            "QtdeU": 5,
            "PrUnitario": 100.00
        }
    }
};

// Variáveis adicionais que a função espera
var CFO = "5102";
var fDespAcess = 0.05; // Por exemplo, uma taxa de 5%

// Função de arredondamento (se não estiver definida)
function Round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Chamar a função gerarItensDet
var resultadoDet = gerarItensDet(jsonOriginais);

// Exibir o resultado no console para inspeção
console.log("Json:  ");
console.log(JSON.stringify(resultadoDet, null, 2));