// Plugins usados: cordova plugin add cordova-plugin-file
//                 cordova plugin add cordova-plugin-file-transfer
//                 cordova plugin add cordova-plugin-android-permissions


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
    }, function (error) {
        alert("Erro ao acessar o diretório: " + error);
    });
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


// Usos
// salvar_arquivo_json_data(json_a_ser_salvo);
// dowload_arquivo_json(); vai fazer o download do último json que foi salvo