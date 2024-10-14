var lBoletoNew = false;   // true => impressão via PrinterManager (impr. Leopardo A7)
var lDebug     = false;   // true => somente gera o arquivo Spool.Txt
var lId        = "";      // Carga / NF_Boleto
var lPedido    = 0;       // Número   do pedido
var lSituacao  = "";      // Situação do pedido
var lPerDesc   = 0;       // Mantido por compatibilidade
var lDTCabec   = [];      // Array contendo os dados referente ao cabeçalho da nota
var lDTItens   = [];      // Array contendo os dados referente aos itens da nota
var lSpool     = "";      // Spool de impressão
var lTotQtd    = 0;       // SUM(QuaPedida) para geração do boleto
var lEmpresa   = "";      // ParamSe.Empresa  para geração da carga
var lVendedor  = 0;       // ParamSe.Vendedor para geração da carga
var lNome      = "";      // ParamSe.Nome     para geração da carga

var jsonOriginais = {}; 
var jsonFormatado = {};

(function () {
    "use strict";   // With strict mode, you cannot, for example, use undeclared variables.

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        InitPage("Impressão");
        //
        var params   = window.location.search.split('&');
        var TipoMov  = 0;       // Tipo de movimento do pedido
        var TipoDoc  = "";      // Tipo de documento do pedido
        var Operacao = "";      // Operacao do pedido
        var NFOk     = false;   // Pode imprimir NF     do pedido ?
        var BolOk    = false;   // Pode imprimir boleto do pedido ?
        var CrgOk    = false;   // Pode imprimir carga ?
        //
        lId = params[0].replace("?Id=", "");     // Carga ou NF_Boleto
        //
        if (lId == "NF_Bol") {                   // NF e/ou boleto
            lPedido   = params[1].replace("Pedido=", "");
            lSituacao = params[2].replace("Situacao=", "");
            TipoMov   = params[3].replace("TipoMov=", "");
            TipoDoc   = params[4].replace("TipoDoc=", "");
            Operacao  = params[5].replace("Operacao=", "");
            NFOk      = (lSituacao != "E" && TipoMov != 1   && gCliSeller == cGuimaraes);
            BolOk     = (lSituacao == "F" && TipoDoc == "5" && gCliSeller == cGuimaraes && Operacao != "2" && Operacao != "7" && Operacao != "Z");
            //
            if (BolOk) {
                DB.transaction(function (tx) {
                    tx.executeSql("SELECT SUM(QuaPedida) As SumQuaPedida, SepCampo FROM PedProSe, ParamSe WHERE Pedido = ?", [lPedido],
                        function (tx, rs) {
                            if (rs.rows.length > 0) {
                                lTotQtd    = NullValue(rs.rows.item(0).SumQuaPedida, 0);
                                lBoletoNew = (rs.rows.item(0).SepCampo == "1");
                                InitImp(NFOk, BolOk, CrgOk);
                            }
                        }, onGlobalError);
                });
            }
            else {
                InitImp(NFOk, BolOk, CrgOk);
            }
        }
        else {                                   // Carga
            CrgOk = true;
            //
            DB.transaction(function (tx) {
                tx.executeSql("SELECT Empresa, Vendedor, Nome FROM ParamSe", [],
                    function (tx, rs) {
                        if (rs.rows.length > 0) {
                            lEmpresa  = rs.rows.item(0).Empresa;
                            lVendedor = rs.rows.item(0).Vendedor;
                            lNome     = rs.rows.item(0).Nome;
                            InitImp(NFOk, BolOk, CrgOk);
                        }
                    }, onGlobalError);
            });
        }
    };
})();

//
// Inicializa tela de impressão
//
function InitImp(NFOk, BolOk, CrgOk) {
    if (CrgOk)
        tabheader_onclick(3);
    else if (BolOk)
        tabheader_onclick(2);
    else if (NFOk)
        tabheader_onclick(1);
    //
    if (NFOk) {
        tabheader1.style.display = "";
        LeCfgNF();
    }
    //
    if (BolOk) {
        tabheader2.style.display = "";
        PopulaCmbLocal();
        LeCfgBol();
    }
    //
    if (CrgOk) {
        tabheader3.style.display = "";
        PopulaCmbGrupo();
    }
    //
    bluetoothSerial.list(function (devices) {
        var i = 0;
        //
        devices.forEach(function (device) {
            cmbImpressora.options[i] = new Option(device.name, device.id);
            i += 1;
        });
        //
        /***
        if (i == 0) {
            btnImprimir.disabled = true;
            alert("Impressora não encontrada !\nImpressão não pode ser efetuada !");
        }
        else {
            LeCfgImp();
        }
        ***/
        LeCfgImp();
        /***/
    }, print_error);
}

//
// Popula cmbLocal com locais do banco Bradesco (237-2) e Santander (033-7)
//
function PopulaCmbLocal() {
    if (lBoletoNew) {
        trLocal1.style.display = "";
        trLocal2.style.display = "";
        //
        DB.transaction(function (tx) {
            tx.executeSql("SELECT Codigo, Nome FROM Locais WHERE Banco IN (237, 2372, 33, 337) ORDER BY Nome, Codigo", [],
                function (tx, rs) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        cmbLocal.options[i] = new Option(rs.rows.item(i).Nome.trim(), rs.rows.item(i).Codigo);
                    }
                }, onGlobalError);
        });
    }
}

//
// Popula CmbGrupo
//
function PopulaCmbGrupo() {
    var i = 0;
    //
    DB.transaction(function (tx) {
        var vSQL = "SELECT ProdutSe.Grupo, GruposSe.Nome " +
                   "FROM   ProdutSe, GruposSe " +
                   "WHERE  ProdutSe.Grupo = GruposSe.Codigo " +
                   "GROUP BY ProdutSe.Grupo, GruposSe.Nome " +
                   "ORDER BY GruposSe.Nome, ProdutSe.Grupo";
        //
        tx.executeSql(vSQL, [],
            function (tx, rs) {
                cmbGrupo.options[0] = new Option("*** Todos ***", -1);
                //
                for (i = 0; i < rs.rows.length; i++) {
                    cmbGrupo.options[i + 1] = new Option(rs.rows.item(i).Nome.trim(), rs.rows.item(i).Grupo);
                }
                cmbGrupo.selectedIndex = 0;
                PopulaLstProdutos();
            }, onGlobalError);
    });
}

function cmbGrupo_onchange() {
    PopulaLstProdutos();
}

//
// Popula LstProdutos
//
function PopulaLstProdutos() {
    var vGrupo = cmbGrupo.value;
    var vAux   = (vGrupo == -1) ? "" : "WHERE Grupo = " + vGrupo + " ";
    var vSQL   = "SELECT Codigo, Descricao FROM ProdutSe " + vAux + "ORDER BY Codigo";
    //
    var onSuccess = function (tx, rs) {
        var rowOutput = "";
        //
        for (var i = 0; i < rs.rows.length; i++) {
            rowOutput += "<li style='height: 30px; border-right: 1px solid darkgrey'>" +
                             "<div class='cw15 right'>" + rs.rows.item(i).Codigo           + "</div>" +
                             "<div class='cw65 left' >" + rs.rows.item(i).Descricao.trim() + "</div>" +
                             "<div class='cw20 right' style='padding: 0px 0px'><input  class='inputBox' type='number' id='txtQtde" + rs.rows.item(i).Codigo + "'  maxlength='6' style='width: 100%; text-align: right' onclick='this.select()' /></div>" +
                         "</li>";
        }
        lstProdutos.innerHTML = rowOutput;
    }
    //
    DB.transaction(function (tx) { tx.executeSql(vSQL, [], onSuccess, onGlobalError); });
}

//
// Exibe "tab" corrente e oculta demais
//
function tabheader_onclick(tab) {
    for (var i = 1; i <= 3; i++) {
        document.getElementById("tabheader"  + i).setAttribute("class", (i == tab) ? "tabheader_active" : "");
        document.getElementById("tabcontent" + i).style.display = (i == tab) ? "block" : "none";
    }
    //
    if (tab == 1)
        btnImprimir.innerHTML = "Impr. NF";
    else if (tab == 2)
        btnImprimir.innerHTML = "Impr. boleto";
    else
        btnImprimir.innerHTML = "Impr. carga";
    //
    btnImprimir.disabled = false;
    //
    trImpressora.style.display = (tab == 2 && lBoletoNew) ? "none" : "";
}

function btnImprimir_onclick() {
    if (!HorarioOk()) return;
    //
    btnImprimir.disabled = true;
    //
    if (cmbImpressora.options.length == 0 && (!lDebug) && (btnImprimir.innerHTML != "Impr. boleto" || !lBoletoNew)) {
        alert("Impressora não encontrada !\nImpressão não pode ser efetuada !");
    }
    else {
        GravaCfgImp();
        //
        if (btnImprimir.innerHTML == "Impr. NF")
            VerificaNota();
        else if (btnImprimir.innerHTML == "Impr. boleto")
            if (lBoletoNew)
                ImprimeBoletoNew();
            else
                ImprimeBoleto();
        else
            ImprimeCarga();
    }
};

function btnVoltar_onclick() {
    if (!HorarioOk()) return;
    //
    window.location = (lId == "Carga") ? "MenuPrincipal.html" : "Pedidos.html";
};

//
// Le dados de configuração da nota
//
function LeCfgNF() {
    DB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM CfgSeller WHERE Parametro IN (?, ?, ?)", ["NF_Placa", "NF_PlacaUF", "NF_NovoLayout"],
            function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    switch (rs.rows.item(i).Parametro) {
                        case "NF_Placa":      txtPlaca.value        = rs.rows.item(i).Valor; break;
                        case "NF_PlacaUF":    txtPlacaUF.value      = rs.rows.item(i).Valor; break;
                        case "NF_NovoLayout": chkNovoLayout.checked = rs.rows.item(i).Valor == 1 ? true : false; break;
                    }
                }
            }, onGlobalError);
    });
    //
    DB.transaction(function (tx) {
        if (lSituacao != "F") {   // Pedido não faturado => Próximo
            tx.executeSql("SELECT Serie, UltNota FROM ParamSe", [],
                function (tx, rs) {
                    txtSerie.value  = rs.rows.item(0).Serie;
                    txtNumero.value = rs.rows.item(0).UltNota + 1;
                }, onGlobalError);
        }
        else {                    // Pedido faturado     => O mesmo
            tx.executeSql("SELECT Mensagem FROM PedCabSe WHERE Pedido = ?", [lPedido],
                function (tx, rs) {
                    txtSerie.value  =     Mid(rs.rows.item(0).Mensagem, 10, 3);
                    txtNumero.value = Val(Mid(rs.rows.item(0).Mensagem,  3, 6));
                    txtSerie.disabled  = true;
                    txtNumero.disabled = true;
                }, onGlobalError);
        }
    });
}

//
// Le dados de configuração da impressora
//
function LeCfgImp() {
    DB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM CfgSeller WHERE Parametro = ?", ["Imp_Id"],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    cmbImpressora.value = rs.rows.item(0).Valor;
                }
            }, onGlobalError);
    });
}

//
// Le dados de configuração do boleto
//
function LeCfgBol() {
    txtLocal.value      = "Pagavel em qualquer banco ate o vencimento";
    txtInstrucao1.value = "Multa de 2% apos o vencimento";
    txtInstrucao2.value = "Juros de 0,33% por dia de atraso";
    txtInstrucao3.value = "Titulo sujeito a protesto apos 07 dias do vencimento";
    txtInstrucao4.value = "Negativacao SERASA apos 30 dias";
    txtInstrucao5.value = "Nosso sistema so identifica pagamento com boleto";
    //
    DB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM CfgSeller WHERE Parametro IN (?, ?, ?, ?, ?, ?)", ["Bol_Local", "Bol_Instrucao1", "Bol_Instrucao2", "Bol_Instrucao3", "Bol_Instrucao4", "Bol_Instrucao5"],
            function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    switch (rs.rows.item(i).Parametro) {
                        case "Bol_Local":      txtLocal.value      = rs.rows.item(i).Valor; break;
                        case "Bol_Instrucao1": txtInstrucao1.value = rs.rows.item(i).Valor; break;
                        case "Bol_Instrucao2": txtInstrucao2.value = rs.rows.item(i).Valor; break;
                        case "Bol_Instrucao3": txtInstrucao3.value = rs.rows.item(i).Valor; break;
                        case "Bol_Instrucao4": txtInstrucao4.value = rs.rows.item(i).Valor; break;
                        case "Bol_Instrucao5": txtInstrucao5.value = rs.rows.item(i).Valor; break;
                    }
                }
            }, onGlobalError);
    });
}

//
// Grava dados de configuração da impressora
//
function GravaCfgImp() {
    if (cmbImpressora.options.length > 0) {
        GravaConfig("Imp_Id", cmbImpressora.value);
    }
}

//
// Grava dados de configuração do boleto
//
function GravaCfgBol() {
    GravaConfig("Bol_Local",      txtLocal.value);
    GravaConfig("Bol_Instrucao1", txtInstrucao1.value);
    GravaConfig("Bol_Instrucao2", txtInstrucao2.value);
    GravaConfig("Bol_Instrucao3", txtInstrucao3.value);
    GravaConfig("Bol_Instrucao4", txtInstrucao4.value);
    GravaConfig("Bol_Instrucao5", txtInstrucao5.value);
}

//
// Grava dados de configuração da nota
//
function GravaCfgNF() {
    GravaConfig("NF_Placa",      txtPlaca.value);
    GravaConfig("NF_PlacaUF",    txtPlacaUF.value);
    GravaConfig("NF_NovoLayout", chkNovoLayout.checked ? 1 : 0);
}

//
// Grava dados de configuração
//
function GravaConfig(Parametro, Valor) {
    DB.transaction(function (tx) {
        tx.executeSql("DELETE FROM CfgSeller WHERE Parametro = ?", [Parametro], onGlobalSuccess, onGlobalError);
        tx.executeSql("INSERT INTO CfgSeller VALUES (?, ?)", [Parametro, Valor], onGlobalSuccess, onGlobalError);
    });
}

//
// Verifica reimpressão e numeração repetida
//
function VerificaNota() {
    if (lSituacao == "F") {   // Pedido faturado => Solicita confirmação
        if (confirm("Pedido já faturado !\n\nDeseja reimprimir a nota ?")) LeDadosCabec();
    }
    else {                    // Pedido não faturado => Verifica se numeração da nota já impressa
        DB.transaction(function (tx) {
            var Numero = Fill("0", Val(txtNumero.value).toString(), 6);
            var Serie  = FillR(" ", txtSerie.value, 3);
            //
            tx.executeSql("SELECT COUNT(*) AS Qtde FROM PedCabSe WHERE Situacao = ? AND Mensagem LIKE ?", ["F", "NF" + Numero + "/" + Serie + "%"],
                function (tx, rs) {
                    if (rs.rows.item(0).Qtde > 0)
                        alert("Nota com esta numeração já impressa !");
                    else
                        LeDadosCabec();
                }, onGlobalError);
        });
    }
}

//
// Le dados refente ao cabeçalho da nota
//
function LeDadosCabec() {
    GravaCfgNF();
    //
    DB.transaction(function (tx) {
        var vSQL = "SELECT PedCabSe.ValorDig,  PedCabSe.Desconto,   PedCabSe.Vencimento, PedCabSe.DespAcess, " +
                          "ClientSe.RazaoSoc,  ClientSe.PessoaFis,  ClientSe.CPF,        ClientSe.CNPJ, " +
                          "ClientSe.Endereco,  ClientSe.Bairro,     ClientSe.CEP,        ClientSe.Cidade, " +
                          "ClientSe.Estado,    ClientSe.Inscricao,  ClientSe.Revendedor, ClientSe.Codigo, " +
                          "CPagSe.Financeiro,  CPagSe.NumParc,      CPagSe.DiaEntParc,   CPagSe.Operacao, " +
                          "ParamSe.Nome " +
                   "FROM   PedCabSe,           ClientSe,            CPagSe,              ParamSe " +
                   "WHERE  PedCabSe.Cliente = ClientSe.Codigo AND " +
                          "PedCabSe.CondPag = CPagSe.Codigo   AND " +
                          "PedCabSe.Pedido  = ?";
        tx.executeSql(vSQL, [lPedido],
            function (tx, rs) {
                if (rs.rows.length > 0) {
                    lDTCabec[0] = {
                        ValorDig:   Round(rs.rows.item(0).ValorDig * (1 - lPerDesc / 100), 2),
                        Desconto:   Round(rs.rows.item(0).Desconto * (1 - lPerDesc / 100), 2),
                        Vencimento: rs.rows.item(0).Vencimento,
                        DespAcess:  rs.rows.item(0).DespAcess,
                        RazaoSoc:   rs.rows.item(0).RazaoSoc,
                        CpjCnpj:    rs.rows.item(0).PessoaFis ? FormatCPF(rs.rows.item(0).CPF) : FormatCNPJ(rs.rows.item(0).CNPJ),
                        Endereco:   rs.rows.item(0).Endereco,
                        Bairro:     rs.rows.item(0).Bairro,
                        CEP:        rs.rows.item(0).CEP,
                        Cidade:     rs.rows.item(0).Cidade,
                        Estado:     rs.rows.item(0).Estado,
                        Inscricao:  rs.rows.item(0).PessoaFis ? " " : rs.rows.item(0).Inscricao,
                        Revendedor: rs.rows.item(0).Revendedor,
                        Codigo:     rs.rows.item(0).Codigo,
                        Financeiro: rs.rows.item(0).Financeiro,
                        NumParc:    rs.rows.item(0).NumParc,
                        DiaEntParc: rs.rows.item(0).DiaEntParc,
                        Operacao:   rs.rows.item(0).Operacao,
                        NomeEmp:    rs.rows.item(0).Nome
                    };
                    //
                    jsonCabecalho = JSON.stringify(lDTCabec[0]); // Criar o JSON ao fazer a busca
                    LeDadosItens();
                }
                else {
                    alert("Pedido não encontrado !");
                }
            }, onGlobalError);
    });
}

//
// Le dados refente aos itens da nota
//
function LeDadosItens() {
    DB.transaction(function (tx) {
        var vSQL = "SELECT PedProSe.Produto,   PedProSe.QuaPedStr, PedProSe.PrUnitario, PedProSe.QuaPedida, " +
                          "ProdutSe.Descricao, ProdutSe.Status,    ProdutSe.Unidade,    ProdutSe.QFrUn, "     +
                          "ProdutSe.Fracao,    ProdutSe.NCM,       CodTrib.ICMSContr,   CodTrib.ICMSNContr "  +
                   "FROM   PedProSe, ProdutSe, CodTrib " +
                   "WHERE  PedProSe.Produto = ProdutSe.Codigo AND " +
                          "ProdutSe.CodTrib = CodTrib.Codigo  AND " +
                          "CodTrib.Estado   = ? AND " +
                          "PedProSe.Pedido  = ? " +
                   "ORDER BY Item";
        tx.executeSql(vSQL, [lDTCabec[0].Estado, lPedido],
            function (tx, rs) {
                for (var i = 0; i < rs.rows.length; i++) {
                    lDTItens[i] = {
                        QtdeU:       DecodeQtdeU(rs.rows.item(i).QuaPedStr),
                        QtdeF:       DecodeQtdeF(rs.rows.item(i).QuaPedStr),
                        CodST:       Mid(rs.rows.item(i).Status, 1, 2) + "0",
                        BCalcSTProd: Val(Mid(rs.rows.item(i).Status, 3, 6)),
                        ValorSTProd: Val(Mid(rs.rows.item(i).Status, 9, 6)),
                        AliqIcms:    lDTCabec[0].Revendedor ? rs.rows.item(i).ICMSContr : rs.rows.item(i).ICMSNContr,
                        NCM:         rs.rows.item(i).NCM,
                        PrUnitario:  rs.rows.item(i).PrUnitario,
                        Produto:     rs.rows.item(i).Produto,
                        Descricao:   rs.rows.item(i).Descricao,
                        Unidade:     rs.rows.item(i).Unidade,
                        QFrUn:       rs.rows.item(i).QFrUn,
                        Fracao:      rs.rows.item(i).Fracao,
                        QuaPedida:   rs.rows.item(i).QuaPedida
                    };
                }
                //
                ImprimeNota();
            }, onGlobalError);
    });
}

function ImprimeNota() {
    var i             = 0;
    var n             = 0;
    var ContProd      = 9999;
    var PrecoUni      = 0;
    var TotalProd     = 0;
    var BCalcST       = 0;
    var ValorST       = 0;
    var BCalcIcms     = 0;
    var ValorIcms     = 0;
    var BCalcIcmsItem = 0;
    var AdicFin       = 0;
    var TotalQtde     = 0;
    //
    for (i = 0; i < lDTItens.length; i++) {
        n = 0;
        if (lDTItens[i].QtdeU > 0) n += 1;
        if (lDTItens[i].QtdeF > 0) n += 1;
        if (lDTItens[i].QtdeU > 0 && lDTItens[i].NCM.trim() != "" && !chkNovoLayout.checked) n += 1;
        if (lDTItens[i].QtdeF > 0 && lDTItens[i].NCM.trim() != "" && !chkNovoLayout.checked) n += 1;
        //
        if (ContProd + n > 16) {
            if (ContProd != 9999) {
                ImprimeNotaRod(ContProd, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            }
            //
            ImprimeNotaCab();
            ContProd = 0;
        }
        //
        if (lDTItens[i].QtdeU > 0) {
            PrecoUni   = Round(lDTItens[i].PrUnitario * (1 - lPerDesc / 100), 2);
            TotalProd += PrecoUni * lDTItens[i].QtdeU;
            ContProd  += 1;
            TotalQtde += lDTItens[i].QtdeU;
            if (lDTItens[i].NCM.trim() != "" && !chkNovoLayout.checked) ContProd += 1;
            ImprimeNotaIte(i, lDTItens[i].Unidade, lDTItens[i].QtdeU, PrecoUni);
        }
        //
        if (lDTItens[i].QtdeF > 0) {
            PrecoUni   = Round(Round(lDTItens[i].PrUnitario / lDTItens[i].QFrUn + 0.004, 2) * (1 - lPerDesc / 100), 2);
            TotalProd += PrecoUni * lDTItens[i].QtdeF;
            ContProd  += 1;
            TotalQtde += lDTItens[i].QtdeF;
            if (lDTItens[i].NCM.trim() != "" && !chkNovoLayout.checked) ContProd += 1;
            ImprimeNotaIte(i, lDTItens[i].Fracao, lDTItens[i].QtdeF, PrecoUni);
        }
        //
        if (lDTItens[i].BCalcSTProd > 0) {
            BCalcST += Round(CalcTotItem(lDTItens[i].BCalcSTProd, lDTItens[i].QuaPedida, lDTItens[i].QFrUn), 2);
            ValorST += Round(CalcTotItem(lDTItens[i].ValorSTProd, lDTItens[i].QuaPedida, lDTItens[i].QFrUn), 2);
        }
        else {
            BCalcIcmsItem = CalcTotItem(lDTItens[i].PrUnitario, lDTItens[i].QuaPedida, lDTItens[i].QFrUn) * (1 + lDTCabec[0].Financeiro / 100) * (1 - lDTCabec[0].Desconto / lDTCabec[0].ValorDig);
            BCalcIcms    += Round(BCalcIcmsItem, 2);
            ValorIcms    += Round(BCalcIcmsItem * lDTItens[i].AliqIcms / 100, 2);
        }
    }
    //
    // Imprime rodape da ultima nota
    //
    AdicFin = lDTCabec[0].ValorDig - TotalProd;
    ImprimeNotaRod(ContProd, lDTCabec[0].Desconto, lDTCabec[0].DespAcess, AdicFin, BCalcIcms, ValorIcms, TotalProd, BCalcST, ValorST, TotalQtde);
    FinalizaImp("NF", AdicFin);
}

//
// Imprime cabeçalho da nota
//
function ImprimeNotaCab() {
    var Serie  = FillR(" ", txtSerie.value, 3);
    var Numero = Val(txtNumero.value);
    var NatOpe = (lDTCabec[0].Operacao == "2" || lDTCabec[0].Operacao == "7" || lDTCabec[0].Operacao == "Z") ? "BONIFICACAO" : "VENDA      ";
    var CFO    = (lDTCabec[0].Operacao == "2" || lDTCabec[0].Operacao == "7" || lDTCabec[0].Operacao == "Z") ? "5.910"       : "5.104";
    //
    if (chkNovoLayout.checked) {
        ImprimeLinha(Space(70) + Fill("0", Numero.toFixed(0), 6));
        ImprimeLinha(Space(44) + "XX" + Space(27) + "/" + Serie);
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(NatOpe + Space(13) + CFO);
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(FillR(" ", lDTCabec[0].RazaoSoc, 44) + " " + FillR(" ", lDTCabec[0].CpjCnpj, 18) + Space(3) + FormatDate(Today(), "dd/MM/yy"));
        ImprimeLinha(" ");
        ImprimeLinha(FillR(" ", lDTCabec[0].Endereco, 39) + " " + Mid(lDTCabec[0].Bairro, 1, 12) + " " + FormatCEP(lDTCabec[0].CEP) + Space(4) + FormatDate(Today(), "dd/MM/yy"));
        ImprimeLinha(" ");
        ImprimeLinha(FillR(" ", lDTCabec[0].Cidade, 29) + Space(10) + lDTCabec[0].Estado + Space(3) + FillR(" ", lDTCabec[0].Inscricao, 16) + FormatTime(Now(), "HH:mm:ss"));
    }
    else {
        ImprimeLinha(" ");
        ImprimeLinha(Space(30) + "XX" + Space(20) + Fill("0", Numero.toFixed(0), 6));
        ImprimeLinha(" ");
        ImprimeLinha(Space(52) + Serie);
        ImprimeLinha(Mid(NatOpe, 1, 7) + Space(3) + CFO);
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(Mid(lDTCabec[0].RazaoSoc, 1, 30) + " " + FillR(" ", lDTCabec[0].CpjCnpj, 18) + Space(3) + FormatDate(Today(), "dd/MM/yy"));
        ImprimeLinha(" ");
        ImprimeLinha(Mid(lDTCabec[0].Endereco, 1, 25) + " " + Mid(lDTCabec[0].Bairro, 1, 12) + " " + FormatCEP(lDTCabec[0].CEP) + Space(4) + FormatDate(Today(), "dd/MM/yy"));
        ImprimeLinha(" ");
        ImprimeLinha(Mid(lDTCabec[0].Cidade,   1, 15) + Space(10) + lDTCabec[0].Estado + Space(3) + FillR(" ", lDTCabec[0].Inscricao, 16) + Space(6) + FormatTime(Now(), "HH:mm:ss"));
    }
    ImprimeLinha(" ");
    ImprimeLinha(" ");
    ImprimeLinha(" ");
}

//
// Imprime um item da nota
//
function ImprimeNotaIte(i, UnFr, Qtde, PrecoUni) {
    if (chkNovoLayout.checked) {
        ImprimeLinha(Fill(" ", FormatNumber(lDTItens[i].Produto, 0), 7) + "  " +
                     Mid(lDTItens[i].Descricao, 1, 22) + " " +
                     lDTItens[i].NCM + "  " +
                     lDTItens[i].CodST + " " +
                     UnFr + " " +
                     Fill(" ", FormatNumber(Qtde, 0), 3) + " " +
                     Fill(" ", PrecoUni.toFixed(2), 7) + " " +
                     Fill(" ", FormatNumber(PrecoUni * Qtde, 2), 8) + "  " +
                     Fill(" ", FormatNumber(lDTItens[i].AliqIcms, 0), 2));
    }
    else {
        ImprimeLinha(Fill(" ", FormatNumber(lDTItens[i].Produto, 0), 7) + "  " +
                     Mid(lDTItens[i].Descricao, 1, 19) + " " +
                     lDTItens[i].CodST + " " +
                     UnFr + " " +
                     Fill(" ", FormatNumber(Qtde, 0), 3) + " " +
                     Fill(" ", PrecoUni.toFixed(2), 7) + " " +
                     Fill(" ", FormatNumber(PrecoUni * Qtde, 2), 8) + "  " +
                     Fill(" ", FormatNumber(lDTItens[i].AliqIcms, 0), 2));
        if (lDTItens[i].NCM.trim() != "") ImprimeLinha("        NCM: " + lDTItens[i].NCM);
    }
}

//
// Imprime rodapé da nota
//
function ImprimeNotaRod(ContProd, Desconto, DespAcess, AdicFin, BCalcIcms, ValorIcms, TotalProd, BCalcST, ValorST, TotalQtde) {
    var i     = 0;
    var Placa = FillR(" ", txtPlaca.value, 7);
    //
    for (i = 0; i < 16 - ContProd; i++) {
        ImprimeLinha(" ");
    }
    //
    if (Desconto > 0)
        ImprimeLinha(Space(3) + "Desconto:" + Space(12) + Fill(" ", FormatNumber(Desconto, 2), 10));
    else
        ImprimeLinha(" ");
    //
    if (AdicFin > 0)
        ImprimeLinha(Space(3) + "Adicional financeiro:" + Fill(" ", FormatNumber(AdicFin,  2), 10));
    else if (AdicFin < 0)
        ImprimeLinha(Space(3) + "Desconto financeiro: " + Fill(" ", FormatNumber(-AdicFin, 2), 10));
    else
        ImprimeLinha(" ");
    //
    ImprimeLinha("SR. REV.: OBSERVAR AS EXIGENCIAS DA IN SRF 753/07 NO TOCANTE A FIXAÇAO E");
    ImprimeLinha("MANUTENÇAO DAS TABELAS DE PREÇO AO CONSUMIDOR EM LOCAL VISIVEL. PROIBIDA");
    ImprimeLinha("A VENDA DE CIGARROS A MENORES DE 18 ANOS - LEIS 8069/1990 E 10702/2003.");
    //
    ImprimeLinha(" ");
    ImprimeLinha(" ");
    //
    if (TotalProd > 0) {
        if (chkNovoLayout.checked) {
            ImprimeLinha(Fill(" ", FormatNumber(BCalcIcms, 2), 10) + Space(4) +
                         Fill(" ", FormatNumber(ValorIcms, 2), 10) + Space(40) +
                         Fill(" ", FormatNumber(TotalProd - Desconto, 2), 10));
            ImprimeLinha(" ");
            ImprimeLinha(Space(28) + Fill(" ", FormatNumber(DespAcess, 2), 10) +
                         Space(26) + Fill(" ", FormatNumber(TotalProd - Desconto + DespAcess, 2), 10));
        }
        else {
            ImprimeLinha(Fill(" ", FormatNumber(BCalcIcms, 2), 10) +
                         Fill(" ", FormatNumber(ValorIcms, 2), 10) + Space(30) +
                         Fill(" ", FormatNumber(TotalProd - Desconto, 2), 10));
            ImprimeLinha(" ");
            ImprimeLinha(Space(23) + Fill(" ", FormatNumber(DespAcess, 2), 10) +
                         Space(17) + Fill(" ", FormatNumber(TotalProd - Desconto + DespAcess, 2), 10));
        }
    }
    else {
        ImprimeLinha(" ");
        ImprimeLinha(" ");
        ImprimeLinha(" ");
    }
    //
    ImprimeLinha(" ");
    ImprimeLinha(" ");
    if (chkNovoLayout.checked)
        ImprimeLinha(Space(39) + "1" + Space(3) + Placa + Space(2) + txtPlacaUF.value);
    else
        ImprimeLinha(lDTCabec[0].NomeEmp + Space(15) + "1" + Space(3) + Placa + Space(2) + txtPlacaUF.value);
    //
    for (i = 0; i < 4; i++) {
        ImprimeLinha(" ");
    }
    //
    if (TotalQtde > 0)
        ImprimeLinha(Fill(" ", FormatNumber(TotalQtde, 0), 7));
    else
        ImprimeLinha(" ");
    //
    for (i = 0; i < 3; i++) {
        ImprimeLinha(" ");
    }
    //
    if (BCalcST > 0) {
        ImprimeLinha("B.Calc.ST.: " + Fill(" ", FormatNumber(BCalcST, 2), 8));
        ImprimeLinha("Icms ST...: " + Fill(" ", FormatNumber(ValorST, 2), 8));
    }
    else {
        ImprimeLinha(" ");
        ImprimeLinha(" ");
    }
    //
    ImprimeLinha("Vencimento: " + FormatDate(lDTCabec[0].Vencimento, "dd/MM/yy"));
    ImprimeLinha("Cod.Client: " + lDTCabec[0].Codigo);
    ImprimeLinha("Vendedor..: " + lDTCabec[0].NomeEmp);
    //
    for (i = 0; i < 8; i++) {
        ImprimeLinha(" ");
    }
}

//
// Imprime boleto (pré-impresso)
//
function ImprimeBoleto() {
    GravaCfgBol();
    if (lSituacao != "F")
        alert("Pedido não faturado !");
    else {
        DB.transaction(function (tx) {
            var vSQL = "SELECT Vencimento, DataPedido, ValorDig,  Desconto,  DespAcess, " +
                              "RazaoSoc,   Endereco,   Bairro,    CEP,       Cidade, " +
                              "Estado,     DDD,        Telefone1, PessoaFis, CNPJ, " +
                              "CPF,        Codigo " +
                       "FROM   PedCabSe, ClientSe " +
                       "WHERE  Cliente = Codigo AND " +
                              "Pedido  = ?";
            tx.executeSql(vSQL, [lPedido],
                function (tx, rs) {
                    if (rs.rows.length > 0) {
                        var CpjCnpj  = rs.rows.item(0).PessoaFis ? FormatCPF(rs.rows.item(0).CPF) : FormatCNPJ(rs.rows.item(0).CNPJ);
                        var RazaoSoc = rs.rows.item(0).RazaoSoc.trim() + "   Cod do cliente: " + rs.rows.item(0).Codigo;
                        var Valor    = rs.rows.item(0).ValorDig - rs.rows.item(0).Desconto + rs.rows.item(0).DespAcess;
                        //
                        ImprimeLinha(" ");
                        ImprimeLinha(FillR(" ", txtLocal.value, 94) + FormatDate(rs.rows.item(0).Vencimento, "dd/MM/yyyy"));
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(FormatDate(rs.rows.item(0).DataPedido, "dd/MM/yyyy"));
                        ImprimeLinha(" ");
                        ImprimeLinha(Space(45) + Fill(" ", FormatNumber(lTotQtd, 0), 7) + Space(38) + Fill(" ", FormatNumber(Valor, 2), 12));
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(SubstPct(txtInstrucao1.value, Valor));
                        ImprimeLinha(FillR(" ", SubstPct(txtInstrucao2.value, Valor), 42) + "Serie: " + FillR(" ", txtSerie.value, 8) + "Nro: " + txtNumero.value);
                        ImprimeLinha(SubstPct(txtInstrucao3.value, Valor));
                        ImprimeLinha(FillR(" ", RazaoSoc, 78) + CpjCnpj);
                        ImprimeLinha(rs.rows.item(0).Endereco.trim() + "   Telefone: " + rs.rows.item(0).DDD.trim() + " " + rs.rows.item(0).Telefone1);
                        ImprimeLinha(rs.rows.item(0).Bairro.trim() + "   " + FormatCEP(rs.rows.item(0).CEP) + "   " + rs.rows.item(0).Cidade.trim() + " - " + rs.rows.item(0).Estado);
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        ImprimeLinha(" ");
                        //
                        FinalizaImp("Bol", 0);
                    }
                    else {
                        alert("Pedido não encontrado !");
                    }
                }, onGlobalError);
        });
    }
}
