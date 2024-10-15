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

var lDTItens = [];
var jsonOriginais = {};
var jsonNovo = {};

jsonOriginais["itens"] = {};


// Simulando o lDTItens

lDTItens.push({
    QtdeU: 10,
    QtdeF: 5,
    CodST: "01", 
    BCalcSTProd: 100.00, 
    ValorSTProd: 18.00, 
    AliqIcms: 12.00, 
    NCM: "12345678", 
    PrUnitario: 50.00,
    Produto: "Produto A",
    Descricao: "Descrição do Produto A", 
    Unidade: "UN",
    QFrUn: 2, 
    Fracao: 1, 
    QuaPedida: 10 
});

lDTItens.push({
    QtdeU: 20,
    QtdeF: 10,
    CodST: "02",
    BCalcSTProd: 200.00, 
    ValorSTProd: 36.00, 
    AliqIcms: 18.00, 
    NCM: "87654321",
    PrUnitario: 60.00, 
    Produto: "Produto B", 
    Descricao: "Descrição do Produto B", 
    Unidade: "KG", 
    QFrUn: 1, 
    Fracao: 1, 
    QuaPedida: 20 
});

// Exibindo o vetor lDTItens no console
console.log(JSON.stringify(lDTItens, null, 2));


for (var i = 0; i < lDTItens.length; i++) {
    // Criando o item com todos os atributos e um índice 'n'
    jsonOriginais["itens"][i + 1] = {
        "n": (i + 1).toString(),    // índice do item
        "QtdeU": lDTItens[i].QtdeU,
        "QtdeF": lDTItens[i].QtdeF,
        "CodST": lDTItens[i].CodST,
        "BCalcSTProd": lDTItens[i].BCalcSTProd,
        "ValorSTProd": lDTItens[i].ValorSTProd,
        "AliqIcms": lDTItens[i].AliqIcms,
        "NCM": lDTItens[i].NCM,
        "PrUnitario": lDTItens[i].PrUnitario,
        "Produto": lDTItens[i].Produto,
        "Descricao": lDTItens[i].Descricao,
        "Unidade": lDTItens[i].Unidade,
        "QFrUn": lDTItens[i].QFrUn,
        "Fracao": lDTItens[i].Fracao,
        "QuaPedida": lDTItens[i].QuaPedida
    };
}

// Variáveis adicionais que a função espera
var CFO = "5102";
var fDespAcess = 0.05; 

// Função de arredondamento
function Round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// Chamar a função gerarItensDet
var resultadoDet = gerarItensDet(jsonOriginais);


// Atribuir o resultado para o campo det de um outro json
jsonNovo['Det'] = resultadoDet;
alert(JSON.stringify(jsonNovo['Det'], null, 2));