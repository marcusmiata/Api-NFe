// Funções Auxiliares

/**
 * Formata uma data no formato "AAMM".
 * @param {string} date - String com Date AAAAMMDD.
 * @returns {string} - Data formatada como "AAMM".
 */

function dateToS(dateStr) {
    const year = dateStr.slice(2, 4); // Pega os dois últimos dígitos do ano
    const month = dateStr.slice(5, 7); // Pega o mês
    return year + month; // Retorna no formato AAMM
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
            emissao + 
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

const cUF = "31"; // Exemplo: Minas Gerais
const emissao = "2024-10-10"; //AAAA-MM-DD
const paramCNPJ = "12225678000195"; // Exemplo de CNPJ
const serie = "001";
const nota = "123456789";
const modo = "1"; // Exemplo de modo
const hNotasNFe = 1; // Exemplo

console.log("Parametros: " + cUF + " " + emissao + " " + paramCNPJ + " " + serie + " " + nota + " " + modo + " " + hNotasNFe);
const chaveNFe = geraChaveNFe(cUF, emissao, paramCNPJ, serie, nota, modo, hNotasNFe);
console.log("Chave da NFe:", chaveNFe);
