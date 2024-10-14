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
    let baseFileName = "dados";
    let fileExtension = ".json";
    
    // Caminho do arquivo no diretório de dados do aplicativo
    let sourceFile = cordova.file.dataDirectory + baseFileName + fileExtension;

    // Caminho de destino na pasta de Downloads
    let downloadDirPath = cordova.file.externalRootDirectory + "Download/";

    // Verifica se o diretório de Downloads está acessível
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {
        // Cria o diretório de Downloads se não existir
        dirEntry.getDirectory("Download", { create: true }, function (downloadDir) {
            // Função para verificar a existência de arquivos e criar um novo nome se necessário
            function getNextAvailableFileName(callback) {
                let counter = 0;
                let newFileName;

                // Função recursiva para verificar a existência do arquivo
                function checkFile() {
                    newFileName = `${baseFileName}${counter === 0 ? '' : `(${counter})`}${fileExtension}`;
                    window.resolveLocalFileSystemURL(downloadDir.toURL() + newFileName, function () {
                        counter++; // Arquivo existe, incrementa o contador
                        checkFile(); // Verifica o próximo
                    }, function () {
                        callback(newFileName); // Arquivo não existe, retorna o nome disponível
                    });
                }

                checkFile();
            }

            // Obtém um nome de arquivo disponível
            getNextAvailableFileName(function (finalFileName) {
                // Copia o arquivo do diretório de dados para o diretório de Downloads
                window.resolveLocalFileSystemURL(sourceFile, function (fileEntry) {
                    fileEntry.copyTo(downloadDir, finalFileName, function (newFileEntry) {
                        alert("Arquivo JSON baixado com sucesso em " + newFileEntry.nativeURL);
                    }, function (error) {
                        alert("Erro ao copiar o arquivo: " + error);
                    });
                }, function (error) {
                    alert("Erro ao acessar o arquivo de origem: " + error);
                });
            });
        }, function (error) {
            alert("Erro ao acessar o diretório de Downloads: " + error);
        });
    }, function (error) {
        alert("Erro ao acessar o diretório raiz externo: " + error);
    });
}


// Usos
// salvar_arquivo_json_data(json_a_ser_salvo);
// dowload_arquivo_json(); vai fazer o download do último json que foi salvo