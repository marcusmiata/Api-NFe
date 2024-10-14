/*------------------------------------------------------------------------------*
'* Acc Informatica & Assessoria Ltda       Departamento de Software             *
'*------------------------------------------------------------------------------*
'* Sistema .: Acc Seller - Hybrid App      Versao : 4.1m                        *
'* Analise .: Carlos Miata                                                      *
'*------------------------------------------------------------------------------*
'* Módulo ..: Impressao.js                 Versao : 4.1m                        *
'* Tipo ....: JavaScript                   Escrita: 26/03/15                    *
'* Autor ...: Carlos Miata                 Usando : Visual Studio 2013          *
'*------------------------------------------------------------------------------*
'* Funcao ..: Scripts da pagina de impressao de carga / boleto / nf             *
'*------------------------------------------------------------------------------*
'* Data     Responsavel Local      Manutencao                                   *
'*------------------------------------------------------------------------------*
'* 11/01/16 Miata       Acc        Retirar 2a via do boleto (canhoto)           *
'* 21/03/17 Miata       Acc        Correcao / default Instrucao 3 (r.38)        *
'* 17/04/17 Miata       Acc        +Instrucao 4 e 5               (r.39)        *
'* 15/12/17 Miata       Acc        VS2017 - cordova-plugin-file                 *
'* 19/01/18 Miata       Acc        AtualizaDB logo apos envio para impressora   *
'* 06/03/18 Miata       Acc        Carga: +Grupo                                *
'* 09/07/19 Miata       Acc        +Vendedor no canhoto do boleto (r.53)        *
'* 14/07/22 Mauro       Home        r.71: -1 linha branca no cabeçalho, +3 linhas de mensagens legais na NF (itens de 18 para 16)
'* 27/07/22 Mauro       Home       r.73: mover nome do vendedor de transportador para dados adicionais'
'* 07/08/24 Mauro       Home       r.75: nova mensagem4 dos boletos             *
'*------------------------------------------------------------------------------*/

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
var itens = [];
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
                    jsonOriginais["TipoMov"] = TipoMov;
                    jsonOriginais["TipoDoc"] = TipoDoc;
                    jsonOriginais["Operacao"] = Operacao;
                    jsonOriginais["lId"] = lId;
                    jsonOriginais["lPedido"] = lPedido;
                    jsonOriginais["lSituacao"] = lSituacao;
                    jsonOriginais["placa"] = txtPlaca.value;
                    jsonOriginais["placaUF"] = txtPlacaUF.value;
                    jsonOriginais["Serie"] = txtSerie.value;
                    jsonOriginais["Numero"] = txtNumero.value;
                    jsonOriginais["ValorDig"] = lDTCabec[0].ValorDig;
                    jsonOriginais["Desconto"] = lDTCabec[0].Desconto;
                    jsonOriginais["Vencimento"] = lDTCabec[0].Vencimento;
                    jsonOriginais["DespAcess"] = lDTCabec[0].DespAcess;
                    jsonOriginais["RazaoSoc"] = lDTCabec[0].RazaoSoc;
                    jsonOriginais["CpjCnpj"] = lDTCabec[0].CpjCnpj;
                    jsonOriginais["Endereco"] = lDTCabec[0].Endereco;
                    jsonOriginais["Bairro"] = lDTCabec[0].Bairro
                    jsonOriginais["CEP"] = lDTCabec[0].CEP;
                    jsonOriginais["Cidade"] = lDTCabec[0].cidade;
                    jsonOriginais["Estado"] = lDTCabec[0].Estado;
                    jsonOriginais["Inscricao"] = lDTCabec[0].Inscricao;
                    jsonOriginais["Revendedor"] = lDTCabec[0].Revendedor;
                    jsonOriginais["Codigo"] = lDTCabec[0].Codigo;
                    jsonOriginais["Financeiro"] = lDTCabec[0].Financeiro;
                    jsonOriginais["NumParc"] = lDTCabec[0].NumParc;
                    jsonOriginais["DiaEntParc"] = lDTCabec[0].DiaEntParc;
                    jsonOriginais["Operacao"] = lDTCabec[0].Operacao;
                    jsonOriginais["NomeEmp"] = lDTCabec[0].NomeEmp;
                    
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
                
                jsonOriginais["itens"] = {};  // Criando o objeto "itens" vazio

                for (var i = 0; i < lDTItens.length; i++) {
                    // Criando o item com todos os atributos e um índice 'n'
                    json["itens"][i + 1] = {
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
                //Criar JSON no formato da api:
                console.log(JSON.stringify(jsonOriginais, null, 2));
                jsonFormatado = {
                    "chave": null,
                    "ide": {
                        "cUF": null,
                        "cNF": null,
                        "natOp": null,
                        "mod": null,
                        "serie": null,
                        "nNF": null,
                        "dhEmi": null,
                        "dhSaiEnt": null,
                        "tpNF": null,
                        "idDest": null,
                        "cMunFG": null,
                        "tpImp": null,
                        "tpEmis": null,
                        "cDV": null,
                        "tpAmb": null,
                        "finNFe": null,
                        "indFinal": null,
                        "indPres": null,
                        "indIntermed": null,
                        "procEmi": null,
                        "verProc": null
                    },
                    "emit": {
                        "CNPJ": null,
                        "xNome": null,
                        "enderEmit": {
                            "xLgr": null,
                            "nro": null,
                            "xBairro": null,
                            "cMun": null,
                            "xMun": null,
                            "UF": null,
                            "CEP": null,
                            "cPais": null,
                            "xPais": null
                        },
                        "IE": null,
                        "CRT": null
                    },
                    "dest": {
                        "CNPJ": null,
                        "xNome": null,
                        "enderDest": {
                            "xLgr": null,
                            "nro": null,
                            "xCpl": null,
                            "xBairro": null,
                            "cMun": null,
                            "xMun": null,
                            "UF": null,
                            "CEP": null,
                            "cPais": null,
                            "xPais": null
                        },
                        "indIEDest": null,
                        "IE": null,
                        "email": null
                    },
                    "det": gerarItensDet(jsonOriginais),
                        "total": {
                            "ICMSTot": {
                            "vBC": null,
                            "vICMS": null,
                            "vICMSDeson": null,
                            "vFCP": null,
                            "vBCST": null,
                            "vST": null,
                            "vFCPST": null,
                            "vFCPSTRet": null,
                            "vProd": null,
                            "vFrete": null,
                            "vSeg": null,
                            "vDesc": null,
                            "vII": null,
                            "vIPI": null,
                            "vIPIDevol": null,
                            "vPIS": null,
                            "vCOFINS": null,
                            "vOutro": null,
                            "vNF": null
                        }
                    },
                    "transp": {
                        "modFrete": null,
                        "transporta": {
                            "CNPJ": null,
                            "xNome": null,
                            "IE": null,
                            "xEnder": null,
                            "xMun": null,
                            "UF": null
                        },
                        "vol": {
                            "qVol": null,
                            "esp": null,
                            "pesoL": null,
                            "pesoB": null
                        }
                    },
                    "pag": {
                        "detPag": [
                            {
                                "indPag": null,
                                "tPag": null,
                                "vPag": null
                            }
                          ]
                    },
                        "infAdic": {
                            "infAdFisco": null,
                            "infCpl": null
                        }
                }

                ImprimeNota();
                sendToAPI(codigoEmpresa, jsonFormatado, nNF, emailCliente); 
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

//
// Substitui o % pelo valor na instrução do boleto. Ex: Multa de 2% apos o vencimento => Multa de R$ 2,34 apos o vencimento
//
function SubstPct(Instrucao, Valor) {
    var ret  = Instrucao;
    var p1   = 0;
    var p2   = InStr(Instrucao, "%");
    var spct = "";
    var c    = "";
    var pct  = 0;
    //
    // Multa de 2% apos o vencimento
    // 12345678901234567890123456789
    //
    if (p2 > 0) {
        for (p1 = p2 - 1; p1 > 0; p1--) {
            c = Mid(Instrucao, p1, 1);
            if (c == ",") c = ".";
            if (InStr("0123456789.-", c) > 0)
                spct = c + spct;
            else
                break;
        }
        pct = Val(spct);
        if (pct != 0)
            ret = Mid(Instrucao, 1, p1) + "R$ " + FormatNumber(Valor * pct / 100, 2) + Mid(Instrucao, p2 + 1);
    }
    //
    return ret;
}

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    Listagem Resumida de Carga    DD/MM/AA HH:MM
   +------------------------------------------------------------------------------+
   |Vendedor: ZZ9 XXXXXXXXXX   Grupo: Z9 XXXXXXXXXXXX                             |
   +---------------------------+----+-------+------+-------+-------+-------+------+
   |Codigo Descricao           |Rem.|Remessa|Recar-|  Venda|Retorno| Conta-| Dife-|
   |                           |V.D.|       |ga    |       |       | gem   | renca|
   +---------------------------+----+-------+------+-------+-------+-------+------+
   |ZZZZZ9 XXXXXXXXXXXXXXXXXXXX|    |ZZZ9:99|      |ZZZ9:99|ZZZ9:99|ZZZ9:99|ZZ9:99|
   |ZZZZZ9 XXXXXXXXXXXXXXXXXXXX|    |ZZZ9:99|      |ZZZ9:99|ZZZ9:99|ZZZ9:99|ZZ9:99|
   |ZZZZZ9 XXXXXXXXXXXXXXXXXXXX|    |ZZZ9:99|      |ZZZ9:99|ZZZ9:99|ZZZ9:99|ZZ9:99|
   ...                                                                          ...
   |ZZZZZ9 XXXXXXXXXXXXXXXXXXXX|    |ZZZ9:99|      |ZZZ9:99|ZZZ9:99|ZZZ9:99|ZZ9:99|
   +---------------------------+----+-------+------+-------+-------+-------+------+
   |Total da carga             |    |ZZZ9   |      |ZZZ9   |ZZZ9   |ZZZ9   |ZZ9   |
   +---------------------------+----+-------+------+-------+-------+-------+------+
   */
function ImprimeCarga() {
    DB.transaction(function (tx) {
        var Contagem      = 0;
        var Diferenca     = 0;
        var TotContagem   = 0;
        var TotQtdEstoque = 0;
        var TotQuaPedida  = 0;
        var TotDiferenca  = 0;
        var sBoldOn       = "";
        var sBoldOff      = "";
        var sEsc          = "";
        var lis           = tabcontent3.getElementsByTagName("li");
        var vGrupo        = cmbGrupo.value;
        var sGrupo        = (vGrupo == -1) ? "Todos" + Space(10) : Fill(" ", vGrupo.toString(), 2) + " " + FillR(" ", cmbGrupo.options[cmbGrupo.selectedIndex].text, 12);
        var vAux          = (vGrupo == -1) ? "" : "WHERE Grupo = " + vGrupo + " ";
        var vSQL          = "SELECT Codigo, Descricao, QFrUn, QtdEstoque, SUM(QuaPedida) As QuaPedida " +
                            "FROM   ProdutSe LEFT JOIN PedProSe ON (Codigo = Produto) " +
                            vAux +
                            "GROUP BY Codigo, Descricao, QFrUn, QtdEstoque " +
                            "ORDER BY Codigo";
        //
        tx.executeSql(vSQL, [],
            function (tx, rs) {
                ImprimeLinha(lEmpresa + "    Listagem Resumida de Carga    " + FormatDate(Today(), "dd/MM/yy") + " " + FormatTime(Now(), "HH:mm"));
                ImprimeLinha("+------------------------------------------------------------------------------+");
                ImprimeLinha("|Vendedor: " + Fill(" ", lVendedor.toFixed(0), 3) + " " + lNome + "   Grupo: " + sGrupo + Space(29) + "|");
                ImprimeLinha("+---------------------------+----+-------+------+-------+-------+-------+------+");
                ImprimeLinha("|Codigo Descricao           |Rem.|Remessa|Recar-|  Venda|Retorno| Conta-| Dife-|");
                ImprimeLinha("|                           |V.D.|       |ga    |       |       | gem   | renca|");
                ImprimeLinha("+---------------------------+----+-------+------+-------+-------+-------+------+");
                for (var i = 0; i < rs.rows.length; i++) {
                    Contagem  = lis[i + 1].getElementsByClassName('inputBox')[0].value;
                    Diferenca = Val(Contagem) - rs.rows.item(i).QtdEstoque;
                    if (Diferenca < 0) {
                        sEsc     = lDebug ? "<ESC>" : String.fromCharCode(27);
                        sBoldOn  = sEsc + "E";
                        sBoldOff = sEsc + "F";
                    }
                    else {
                        sBoldOn  = "";
                        sBoldOff = "";
                    }
                    //
                    ImprimeLinha("|" + Fill(" ", rs.rows.item(i).Codigo.toFixed(0), 6) + " " +
                                       Mid(rs.rows.item(i).Descricao, 1, 20) + "|    |" +
                                       DBaseF(rs.rows.item(i).QtdEstoque + NullValue(rs.rows.item(i).QuaPedida, 0), rs.rows.item(i).QFrUn, 4, 2) + "|      |" +
                                       DBaseF(NullValue(rs.rows.item(i).QuaPedida, 0), rs.rows.item(i).QFrUn, 4, 2) + "|" +
                                       DBaseF(rs.rows.item(i).QtdEstoque,              rs.rows.item(i).QFrUn, 4, 2) + "|" +
                                       DBaseF(Val(Contagem),                           rs.rows.item(i).QFrUn, 4, 2) + "|" + sBoldOn +
                                       DBaseF(Diferenca,                               rs.rows.item(i).QFrUn, 3, 2) + sBoldOff + "|");
                    TotQtdEstoque += rs.rows.item(i).QtdEstoque;
                    TotQuaPedida  += NullValue(rs.rows.item(i).QuaPedida, 0);
                    TotContagem   += Val(Contagem);
                    TotDiferenca  += Diferenca;
                }
                ImprimeLinha("+---------------------------+----+-------+------+-------+-------+-------+------+");
                ImprimeLinha("|Total da carga             |    |" +
                             Fill(" ", (TotQtdEstoque + TotQuaPedida).toFixed(0), 4) + "   |      |" +
                             Fill(" ", TotQuaPedida.toFixed(0),                   4) + "   |" +
                             Fill(" ", TotQtdEstoque.toFixed(0),                  4) + "   |" +
                             Fill(" ", TotContagem.toFixed(0),                    4) + "   |" +
                             Fill(" ", TotDiferenca.toFixed(0),                   3) + "   |");
                ImprimeLinha("+---------------------------+----+-------+------+-------+-------+-------+------+");
                FinalizaImp("Crg", 0);
            }, onGlobalError);
    });
}

//
// Imprime uma linha
//
function ImprimeLinha(Linha) {
    lSpool += Linha + "\r\n";
}

//
// Finaliza processo de impressão
//
function FinalizaImp(Id, AdicFin) {
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,
        function (entry) {
            var Arq = cDownloadDir + "/Spool.Txt";
            //
            entry.getFile(Arq, { create: true, exclusive: false },
                function (fileEntry) {
                    fileEntry.createWriter(
                        function (writer) {
                            writer.onerror = onGlobalErrorFS;
                            // writer.seek(writer.length);
                            writer.write(lSpool);
                            writer.onwrite = function (evt) {
                                if (!lDebug) {
                                    bluetoothSerial.connect(cmbImpressora.value,
                                        function () {
                                            bluetoothSerial.write(lSpool,
                                                function () {
                                                    AtualizaDB(Id, AdicFin, 0, "");
                                                    /***
                                                    Wait(3000);   // Aguarda 3 segundos p/ resolver o problema da impressão do rodape do 2o. formulario
                                                    bluetoothSerial.disconnect(function () { AtualizaDB(Id, AdicFin, 0, ""); }, print_error);
                                                    ***/
                                                }, print_error);
                                        }, print_error);
                                }
                                else {
                                    AtualizaDB(Id, AdicFin, 0, "");
                                }
                            }
                        }, onGlobalErrorFS);
                }, onGlobalErrorFS);
        }, onGlobalErrorFS);
}

print_error = function (tx, e) {
    alert("Print error: " + e.message);
}

ignore_error = function (tx, e) {
}

//
// Atualiza DB
//
function AtualizaDB(Id, AdicFin, Local, NossoNumeroExi) {
    if (Id == "NF" && lSituacao != "F") {
        var Msg = "NF" +
                  Fill("0", Val(txtNumero.value).toFixed(0), 6) + "/" +
                  FillR(" ", txtSerie.value, 3) + "/" +
                  FillR(" ", lDTCabec[0].Estado, 2) + "/" +
                  FormatBit(lDTCabec[0].Revendedor) + "/" +
                  Fill("0", lDTCabec[0].NumParc.toFixed(0), 3) + "/" +
                  Fill("0", lDTCabec[0].DiaEntParc.toFixed(0), 3) + "/" +
                  Fill("0", lDTCabec[0].Financeiro.toFixed(2), 6).replace(",", ".") + "/" +
                  Fill("0", lPerDesc.toFixed(2), 6).replace(",", ".") + "/" +
                  Fill("0", AdicFin.toFixed(2), 6).replace(",", ".") + "/";
        //
        DB.transaction(function (tx) {
            tx.executeSql("UPDATE ParamSe  SET Serie = ?,    UltNota  = ?", [txtSerie.value, Val(txtNumero.value)], onGlobalSuccess, onGlobalErrorRollback);
            tx.executeSql("UPDATE PedCabSe SET Mensagem = ?, Situacao = ? WHERE Pedido = ?", [Msg, "F", lPedido], onGlobalSuccess, onGlobalErrorRollback);
        }, FinalizaImpErro, FinalizaImpOk);
    }
    else if (Id == "Bol") {
        DB.transaction(function (tx) {
            tx.executeSql("UPDATE PedCabSe SET TipoDoc = ?, Local = ?, NossoNumero = ? WHERE Pedido = ?", ["5", Local, NossoNumeroExi, lPedido], onGlobalSuccess, onGlobalErrorRollback);
        }, FinalizaImpErro, FinalizaImpOk);
    }
    else {
        FinalizaImpOk();
    }
}

function FinalizaImpErro() {
    alert("Erro ocorrido durante a impressão !");
    btnImprimir.disabled = false;
    bluetoothSerial.disconnect(function () { }, ignore_error);
}

function FinalizaImpOk() {
    Wait(3000);   // Aguarda 3 segundos p/ resolver o problema da impressão do rodape do 2o. formulario
    bluetoothSerial.disconnect(function () { }, ignore_error);
    Wait(1000);   // Aguarda 1 segundo
    btnVoltar_onclick();
}

//
// Funções para impressão do boleto na impressora térmica Leopardo A-7 da Input Service
// Obs.: Estas funções irá gerar um arquivo texto contendo os dados do boleto a ser impresso.
//       O aplicativo PrinterManager irá ler os dados deste arquivo e fazer a impressão propriamente dita.
//
function CalcFatVenc(Vencimento) {
    return DateDiff(Vencimento, "1997-10-07");
}

function Modulo11Padrao(sCod) {
    var k = 0;
    var s = 0;
    var i = 2;
    var d = 0;
    //
    for (k = sCod.length; k > 0; k--) {
        s += Val(Mid(sCod, k, 1)) * i;
        i += 1;
        if (i > 9) i = 2;
    }
    //
    d = 11 - (s % 11);
    if (d < 1 || d > 9) {
        d = 1;
    }
    //
    return d;
}

function Modulo11Bradesco(sCod) {
    var k = 0;
    var s = 0;
    var i = 2;
    var a = 0;
    var d = "";
    //
    for (k = sCod.length; k > 0; k--) {
        s += Val(Mid(sCod, k, 1)) * i;
        i += 1;
        if (i > 7) i = 2;//9 ao inves de 7
    }
    //
    a = 11 - (s % 11);
    //
    if (a == 10)
        d = "P";
    else if (a == 11)
        d = "0";
    else
        d = a.toFixed(0);
    //
    return d;
}

function Modulo11Santander(sCod) {
    var k = 0;
    var s = 0;
    var i = 2;
    var a = 0;
    var d = "";
    //
    for (k = sCod.length; k > 0; k--) {
        s += Val(Mid(sCod, k, 1)) * i;
        i += 1;
        if (i > 9) i = 2;
    }
    //
    a = 11 - (s % 11);
    //
    if (a >= 10)
        d = "0";
    else
        d = a.toFixed(0);
    //
    return d;
}

function Modulo10Padrao(sCod) {
    var k = 0;
    var s = 0;
    var t = 0;
    var i = 2;
    var a = 0;
    var d = "";
    //
    for (k = sCod.length; k > 0; k--) {
        s = Val(Mid(sCod, k, 1)) * i;
        t += (s > 9) ? s - 10 + 1 : s;
        i = (i == 2) ? 1 : 2;
    }
    //
    a = 10 - (t % 10);
    if (a >= 10)
        d = "0";
    else
        d = a.toFixed(0);
    //
    return d;
}

function CalcLinDigitavel(CodBanco, Agencia, Conta, Carteira, NossoNumero, Vencimento, ValorDocumento) {
    var cCodePadrao = "";
    var cLivre      = "";
    var cDV         = "";
    var cCodBarras  = "";
    //
    // 1ª parte: Monta a parte do código de barras padrão que vale para todos os bancos (18 caracteres)
    //
    cCodePadrao = Mid(CodBanco, 1, 3) + "9" + Fill("0", CalcFatVenc(Vencimento).toFixed(0), 4) + Fill("0", (ValorDocumento * 100).toFixed(0), 10);
    //
    // 2ª parte: Monta o campo livre que varia de acordo com o banco (25 caracteres).
    //
    if (CodBanco == "237-2") {
        //
        // Bradesco
        // ========
        // Posição Tam Conteúdo
        // ------- --- --------------------------------------------------------------------------------------------------
        // 20 a 23   4 Agência Beneficiária (Sem o digito verificador, completar com zeros a esquerda quando necessário)
        // 24 a 25   2 Carteira
        // 26 a 36  11 Número do Nosso Número (Sem o digito verificador)
        // 37 a 43   7 Conta do Beneficiário (Sem o digito verificador, completar com zeros a esquerda quando necessário)
        // 44 a 44   1 Zero
        //
        cLivre = Fill("0", Mid(Agencia, 1, Agencia.length - 2), 4) + Fill("0", Carteira, 2) + Fill("0", NossoNumero, 11) + Fill("0", Mid(Conta, 1, Conta.length - 2), 7) + "0";
    }
    else if (CodBanco == "033-7") {
        //
        // Santander
        // =========
        // Posição Tam Conteúdo
        // ------- --- --------------------------------------------------------------------------------------------------
        // 20 a 20   1 Fixo 9
        // 21 a 27   7 Conta do Beneficiário (completar com zeros a esquerda quando necessário)
        // 28 a 40  13 Número do Nosso Número (Com o digito verificador)
        // 41 a 41   1 IOS
        // 42 a 44   3 Carteira
        //
        cLivre = "9" + Fill("0", Conta, 7) + Fill("0", NossoNumero, 13) + "0" + Fill("0", Carteira, 3);
    }
    //
    // 3ª parte: Finaliza o código de barras inserindo o digito de controle final.
    //
    cDV        = Modulo11Padrao(cCodePadrao + cLivre);
    cCodBarras = Mid(cCodePadrao, 1, 4) + cDV + Mid(cCodePadrao, 5, 14) + cLivre;
    //
    var c1 = Mid(cCodBarras,  1,  4) + Mid(cCodBarras, 20, 5);   // Cód. banco + Cód. moeda + 1 a 5 do livre + dv
    var c2 = Mid(cCodBarras, 25, 10);                            //  6 a 15 do livre                         + dv
    var c3 = Mid(cCodBarras, 35, 10);                            // 16 a 25 do livre                         + dv
    var c4 = Mid(cCodBarras,  5,  1);                            // dv geral
    var c5 = Mid(cCodBarras,  6, 14);                            // Fat. venc. + valor doc.
    //
    return Mid(c1, 1, 5) + "." + Mid(c1, 6, 4) + Modulo10Padrao(c1) + " " +
           Mid(c2, 1, 5) + "." + Mid(c2, 6, 5) + Modulo10Padrao(c2) + " " +
           Mid(c3, 1, 5) + "." + Mid(c3, 6, 5) + Modulo10Padrao(c3) + " " +
           c4 + " " +
           c5;
}

function AgenciaOk(Banco, Agencia) {
    var Ret = true;
    //
    if (Banco == 237 || Banco == 2372) {   // Bradesco: 9999-9
        if (Agencia.length < 3 || Agencia.length > 6)
            Ret = false;
        else if (Mid(Agencia, Agencia.length - 1, 1) != "-")
            Ret = false;
    }
    else {                                 // Outros .: 9999
        if (Agencia.length < 1 || Agencia.length > 4)
            Ret = false;
    }
    //
    return Ret;
}

function ContaOk(Banco, Conta) {
    var Ret = true;
    //
    if (Banco == 237 || Banco == 2372) {   // Bradesco: 9999999-9
        if (Conta.length < 3 || Conta.length > 9)
            Ret = false;
        else if (Mid(Conta, Conta.length - 1, 1) != "-")
            Ret = false;
    }
    else {                                 // Outros .: 9999999
        if (Conta.length < 1 || Conta.length > 7)
            Ret = false;
    }
    //
    return Ret;
}

function CarteiraOk(Banco, Carteira) {
    var Ret = true;
    //
    if (Banco == 237 || Banco == 2372) {   // Bradesco: 99
        if (Carteira.length < 1 || Carteira.length > 2)
            Ret = false;
    }
    else {                                 // Outros .: 999
        if (Carteira.length < 1 || Carteira.length > 3)
            Ret = false;
    }
    //
    return Ret;
}

function ImprimeBoletoNew() {
    GravaCfgBol();
    if (lSituacao != "F")
        alert("Pedido não faturado !");
    else if (cmbLocal.selectedIndex < 0)
        alert("Local de cobrança não selecionado !");
    else {
        DB.transaction(function (tx) {
            var vSQL = "SELECT PedCabSe.Vencimento, PedCabSe.DataPedido, PedCabSe.ValorDig,  PedCabSe.Desconto,  PedCabSe.DespAcess, " +
                              "ClientSe.Codigo,     ClientSe.RazaoSoc,   ClientSe.Endereco,  ClientSe.Bairro,    ClientSe.CEP, " +
                              "ClientSe.Cidade,     ClientSe.Estado,     ClientSe.DDD,       ClientSe.Telefone1, ClientSe.PessoaFis, " +
                              "ClientSe.CNPJ,       ClientSe.CPF,        ParamSe.Empresa,    ParamSe.Vendedor,   Locais.Banco, " +
                              "Locais.Agencia,      Locais.Conta,        Locais.EspecieDoc,  Locais.Aceite,      Locais.Carteira " +
                       "FROM   PedCabSe, ClientSe, ParamSe, Locais " +
                       "WHERE  PedCabSe.Cliente = ClientSe.Codigo AND " +
                              "PedCabSe.Pedido  = ?               AND " +
                              "Locais.Codigo    = ?";
            tx.executeSql(vSQL, [lPedido, cmbLocal.value],
                function (tx, rs) {
                    if (rs.rows.length > 0) {
                        var NomeBanco      = "";
                        var CodBanco       = "";
                        var LocalPagamento = "";
                        var Banco          = rs.rows.item(0).Banco;
                        var Agencia        = rs.rows.item(0).Agencia.trim();
                        var Conta          = rs.rows.item(0).Conta.trim();
                        var Carteira       = rs.rows.item(0).Carteira.trim();
                        //
                        if (!AgenciaOk(Banco, Agencia))
                            alert("Número da agência inválido !");
                        else if (!ContaOk(Banco, Conta))
                            alert("Número da conta inválido !");
                        else if (!CarteiraOk(Banco, Carteira))
                            alert("Número da carteira inválido !");
                        else {
                            var EspecieDoc     = rs.rows.item(0).EspecieDoc.trim();
                            var Aceite         = rs.rows.item(0).Aceite.trim();
                            var NossoNumero    = "";
                            var CarteiraExi    = "";
                            var NossoNumeroExi = "";
                            var ValorDocumento = rs.rows.item(0).ValorDig - rs.rows.item(0).Desconto + rs.rows.item(0).DespAcess;
                            var CpfCnpj        = rs.rows.item(0).PessoaFis ? FormatCPF(rs.rows.item(0).CPF) : FormatCNPJ(rs.rows.item(0).CNPJ);
                            var LinDig         = "";
                            var NomeArq        = "Bol_" + Fill("0", txtNumero.value, 6);
                            var CnpjEmp        = (gCliSeller == cGuimaraes) ? "   CNPJ: 05.642.329/0001-70" : "";
                            //
                            if (rs.rows.item(0).Banco == 237 || rs.rows.item(0).Banco == 2372) {
                                NomeBanco      = "Bradesco";
                                CodBanco       = "237-2";
                                LocalPagamento = "Banco Bradesco S.A.";
                                NossoNumero    = "00" + Fill("0", rs.rows.item(0).Vendedor.toFixed(0), 3) + Fill("0", txtNumero.value, 6);
                                NossoNumeroExi = Carteira + "/" + NossoNumero + "-" + Modulo11Bradesco(Carteira + NossoNumero);
                                CarteiraExi    = Carteira;
                            }
                            else if (rs.rows.item(0).Banco == 33 || rs.rows.item(0).Banco == 337) {
                                NomeBanco       = "Santander";
                                CodBanco        = "033-7";
                                LocalPagamento  = "Banco Santander S.A.";
                                NossoNumero     = "000" + Fill("0", rs.rows.item(0).Vendedor.toFixed(0), 3) + Fill("0", txtNumero.value, 6);
                                NossoNumeroExi  = NossoNumero;
                                NossoNumero    += Modulo11Santander(NossoNumero);
                                NossoNumeroExi += "-" + Modulo11Santander(NossoNumeroExi);
                                CarteiraExi     = Carteira;
                            }
                            //
                            LinDig = CalcLinDigitavel(CodBanco, Agencia, Conta, Carteira, NossoNumero, rs.rows.item(0).Vencimento, ValorDocumento);
                            //
                            // Gera arquivo Bol_999999.Txt
                            //
                            ImprimeLinha("LinhaDigitavel="         + LinDig);
                            ImprimeLinha("NomeBanco="              + NomeBanco);
                            ImprimeLinha("CodBanco="               + CodBanco);
                            ImprimeLinha("LocalPagamento="         + LocalPagamento);
                            ImprimeLinha("LocalOpcionalPagamento=" + txtLocal.value);
                            ImprimeLinha("Vencimento="             + FormatDate(rs.rows.item(0).Vencimento, "dd/MM/yyyy"));
                            ImprimeLinha("Cedente="                + rs.rows.item(0).Empresa + CnpjEmp);
                            ImprimeLinha("AgenciaCodigoCedente="   + Fill(" ", Agencia + " / " + Conta, 20));
                            ImprimeLinha("DataDocumento="          + FormatDate(rs.rows.item(0).DataPedido, "dd/MM/yyyy"));
                            ImprimeLinha("NumeroDocumento="        + txtNumero.value);
                            ImprimeLinha("EspecieDoc="             + EspecieDoc);
                            ImprimeLinha("Aceite="                 + Aceite);
                            ImprimeLinha("DataProcessamento="      + FormatDate(Today(), "dd/MM/yyyy"));
                            ImprimeLinha("NossoNumero="            + Fill(" ", NossoNumeroExi, 17));
                            ImprimeLinha("UsoDoBanco="             + "");
                            ImprimeLinha("Cip="                    + "");
                            ImprimeLinha("Carteira="               + CarteiraExi);
                            ImprimeLinha("EspecieMoeda="           + "R$");
                            ImprimeLinha("Quantidade="             + FormatNumber(lTotQtd, 0));
                            ImprimeLinha("Valor="                  + FormatNumber(ValorDocumento, 2));
                            ImprimeLinha("ValorDocumento="         + Fill(" ", FormatNumber(ValorDocumento, 2), 12));
                            ImprimeLinha("InstrucoesCedente1="     + SubstPct(txtInstrucao1.value, ValorDocumento));
                            ImprimeLinha("InstrucoesCedente2="     + SubstPct(txtInstrucao2.value, ValorDocumento) + "   Serie: " + txtSerie.value);
                            ImprimeLinha("InstrucoesCedente3="     + SubstPct(txtInstrucao3.value, ValorDocumento));
                            ImprimeLinha("InstrucoesCedente4="     + SubstPct(txtInstrucao4.value, ValorDocumento));
                            ImprimeLinha("InstrucoesCedente5="     + SubstPct(txtInstrucao5.value, ValorDocumento));
                            ImprimeLinha("InstrucoesCedente6="     + "");
                            ImprimeLinha("InstrucoesCedente7="     + "");
                            ImprimeLinha("Desconto="               + "");
                            ImprimeLinha("Deducoes="               + "");
                            ImprimeLinha("Multa="                  + "");
                            ImprimeLinha("Acrescimos="             + "");
                            ImprimeLinha("ValorCobrado="           + "");
                            ImprimeLinha("SacadoNome="             + rs.rows.item(0).RazaoSoc.trim() + "   Codigo: " + rs.rows.item(0).Codigo + "   Vendedor: " + rs.rows.item(0).Vendedor);
                            ImprimeLinha("SacadoEndereco="         + rs.rows.item(0).Endereco.trim() + "   Telefone: " + rs.rows.item(0).DDD.trim() + " " + rs.rows.item(0).Telefone1);
                            ImprimeLinha("SacadoCep="              + rs.rows.item(0).Bairro.trim() + "   " + FormatCEP(rs.rows.item(0).CEP) + "   " + rs.rows.item(0).Cidade.trim() + " - " + rs.rows.item(0).Estado);
                            ImprimeLinha("SacadoCidade="           + "");
                            ImprimeLinha("SacadoUF="               + "");
                            ImprimeLinha("SacadoCnpj="             + CpfCnpj);
                            //
                            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,
                            function (entry) {
                                entry.getFile(cDownloadDir + "/" + NomeArq + ".Txt", { create: true, exclusive: false },
                                    function (fileEntry) {
                                        fileEntry.createWriter(
                                            function (writer) {
                                                writer.onerror = onGlobalErrorFS;
                                                writer.write(lSpool);
                                                writer.onwrite = function (evt) { Imprime2aVia(NomeArq, NossoNumeroExi); }
                                            }, onGlobalErrorFS);
                                    }, onGlobalErrorFS);
                            }, onGlobalErrorFS);
                        }
                    }
                    else {
                        alert("Pedido não encontrado !");
                    }
                }, onGlobalError);
        });
    }
}

function Imprime2aVia(NomeArq, NossoNumeroExi) {
    /***
    Wait(5000);   // Aguarda 5 segundos para dar tempo de imprimir a 1a via
    //
    if (confirm("Imprimir segunda via ?")) {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory,
        function (entry) {
            entry.getFile(cDownloadDir + "/" + NomeArq + "_2.Txt", { create: true, exclusive: false },
                function (fileEntry) {
                    fileEntry.createWriter(
                        function (writer) {
                            writer.onerror = onGlobalErrorFS;
                            writer.write(lSpool);
                            writer.onwrite = function (evt) { AtualizaDB("Bol", 0, cmbLocal.value, NossoNumeroExi); }
                        }, onGlobalErrorFS);
                }, onGlobalErrorFS);
        }, onGlobalErrorFS);
    }
    else {
        AtualizaDB("Bol", 0, cmbLocal.value, NossoNumeroExi);
    }
    ***/
    AtualizaDB("Bol", 0, cmbLocal.value, NossoNumeroExi);
}

// Função para preencher os itens
function gerarItensDet(jsonOriginais) {
    var det = [];
    
    jsonOriginais["itens"].forEach(function(item, index) {
        det.push({
            "nItem": (index + 1).toString(),
            "prod": {
                "cProd": item.cProd,
                "cEAN": "SEM GTIN", // Você pode alterar isso se necessário
                "xProd": item.xProd,
                "NCM": item.NCM,
                "CEST": item.CEST,
                "CFOP": item.CFOP,
                "uCom": item.uCom,
                "qCom": item.qCom,
                "vUnCom": item.vUnCom,
                "vProd": item.vProd,
                "cEANTrib": "SEM GTIN", // Você pode alterar isso se necessário
                "uTrib": item.uTrib,
                "qTrib": item.qTrib,
                "vUnTrib": item.vUnTrib,
                "indTot": item.indTot
            },
            "imposto": {
                "ICMS": {
                    "ICMS60": {
                        "orig": item.orig || "0",  // Default "0" se não houver dado
                        "CST": item.CST || "60",   // Default "60" se não houver dado
                        "vBCSTRet": item.vBCSTRet || "0.00", 
                        "pST": item.pST || "0.00",
                        "vICMSSubstituto": item.vICMSSubstituto || "0.00",
                        "vICMSSTRet": item.vICMSSTRet || "0.00"
                    }
                },
                "PIS": {
                    "PISNT": {
                        "CST": item.CSTPIS || "08"  // Default "08" se não houver dado
                    }
                },
                "COFINS": {
                    "COFINSNT": {
                        "CST": item.CSTCOFINS || "08" // Default "08" se não houver dado
                    }
                }
            }
        });
    });
    
    return det;
}

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

/// GERAÇAO DA CHAVE

// Funções Auxiliares

/**
 * Formata uma data no formato "AAMM".
 * @param {Date} date - Objeto Date.
 * @returns {string} - Data formatada como "AAMM".
 */
function dateToS(date) {
    const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos do ano
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês com 2 dígitos
    return year + month;
}

/**
 * Remove todos os caracteres não numéricos de uma string.
 * @param {string} str - String de entrada.
 * @returns {string} - Apenas dígitos.
 */
function decToS(str) {
    return str.replace(/\D/g, '');
}

/**
 * Preenche uma string com um caractere específico até atingir o comprimento desejado.
 * @param {string} padChar - Caractere de preenchimento.
 * @param {string} str - String original.
 * @param {number} length - Comprimento desejado.
 * @returns {string} - String preenchida.
 */
function fill(padChar, str, length) {
    return str.padStart(length, padChar);
}

/**
 * Gera a chave da NFe.
 * @param {string} cUF - Código da UF.
 * @param {Date} emissao - Data de emissão.
 * @param {string} paramCNPJ - CNPJ do emitente.
 * @param {string} serie - Série da nota.
 * @param {number} nota - Número da nota.
 * @param {string} modo - Modo de emissão.
 * @param {number} hNotasNFe - Identificador ou contador de notas.
 * @returns {string} - Chave da NFe gerada.
 */
function geraChaveNFe(cUF, emissao, paramCNPJ, serie, nota, modo, hNotasNFe) {
    try {
        // 1. Construir a chave sem o DV
        let sChave = 
            cUF + 
            dateToS(emissao) + 
            decToS(paramCNPJ) + 
            "55" + 
            fill("0", serie, 3) + 
            fill("0", nota.toString(), 9) + 
            modo + 
            "1" + 
            fill("0", nota.toString(), 7);

        // 2. Calcular o dígito verificador (DV)
        let tam = 44;
        let mult = 2;
        let total = 0;

        // Iterar de trás para frente (último dígito antes do DV até o primeiro)
        for (let i = tam - 2; i >= 0; i--) { // índices 0 a 42 (43 dígitos)
            let digito = parseInt(sChave.charAt(i), 10);
            if (isNaN(digito)) {
                throw new Error(`Caractere não numérico encontrado na posição ${i + 1}`);
            }
            total += digito * mult;
            mult += 1;
            if (mult > 9) {
                mult = 2;
            }
        }

        let resto = total % 11;
        let dv = (resto <= 1) ? 0 : (11 - resto);

        // 3. Inserir o DV na posição 44
        sChave = sChave.substring(0, 43) + dv.toString();

        return sChave;
    } catch (error) {
        console.error("Erro ao gerar a chave da NFe:", error.message);
        return null;
    }
}

// Exemplo de Uso:

const cUF = "35"; // Exemplo: São Paulo
const emissao = new Date(2024, 9, 1); // Outubro 1, 2024 (meses são 0-based)
const paramCNPJ = "12345678000195"; // Exemplo de CNPJ
const serie = "001";
const nota = 123456789;
const modo = "1"; // Exemplo de modo
const hNotasNFe = 1; // Exemplo

const chaveNFe = geraChaveNFe(cUF, emissao, paramCNPJ, serie, nota, modo, hNotasNFe);
console.log("Chave da NFe:", chaveNFe);
