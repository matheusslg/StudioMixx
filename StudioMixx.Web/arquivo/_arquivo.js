var carregarSelectClienteArquivo = function () {

    $.get("http://"+ nodeJs +":3000/usuario/listartodosativos", function (data) {
        var table = '';
        table += "<option id='0' value='nenhum'>Nenhum</option>";
        var json = JSON.parse(data);
        for (var i = 0; i < json.length; i++) {

            table += "<option id='" + json[i]._id + "'>" + json[i].login + '</option>';

        }

        $('#selCliente').html(table);

    });

};

var uploadArquivo = function (data) {
    var x = $('#meuArquivo1')[0];

    if (x.files.length > 0) {
        if (window.FormData !== undefined) {
            
            $.ajax({
                type: "POST",
                url: 'http://"+ nodeJs +":3000/arquivo/ftp',
                //contentType: false,
                //processData: false,
                data: { nome: fileData1, nome: fileData2, nome: fileData3, nome: fileData4, nome: fileData5 },
                success: function (result) {
                    console.log(result);
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });

        };
        reader.readAsArrayBuffer(fileInput.files[0]);

    } else {
        alert("This browser doesn't support HTML5 file uploads!");
    }
}


function getFileBuffer() {
    var deferred = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e) {
        deferred.resolve(e.target.result);
    }
    reader.onerror = function (e) {
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(fileInput[0].files[0]);
    return deferred.promise();
}

var mostrarLoading = function (i) {
    var table = '';
    table = "<img src='/imagens/loading.gif' />";
    $("#statusUpload" + i + "").html(table);
}

var mostrarEnviado = function (i) {
    var table = '';
    table = "<img src='/imagens/enviado.png' />";
    $("#statusUpload" + i + "").html(table);
}

var mostrarErro = function (i) {
    var table = '';
    table = "<img src='/imagens/erro.png' />";
    $("#statusUpload" + i + "").html(table);
}

var selecionarArquivos = function () {
    $('#msgUpload').html("");
    var mes = currentTime.getMonth() + 1;
    var x = $('#meuArquivo')[0];
    var txt = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Selecione um ou mais arquivos.";
        } else {
            txt += '<div class="collapse">';
            txt += '<table class="table table-striped">';
            txt += '<thead>';
            txt += '<tr>';
            txt += '<th>Status</th>';
            txt += '<th>#</th>';
            txt += '<th>Nome</th>';
            txt += '<th>Tamanho</th>';
            txt += '<th>Mês</th>';
            txt += '<th>Categoria</th>';
            txt += '</tr>';
            txt += '</thead>';
            txt += '<tbody>';
            for (var i = 0; i < x.files.length; i++) {
                var a = i + 1;
                txt += '<tr>';
                txt += '<td id="statusUpload' + i + '"><img src="/imagens/clock.png" /></td>';
                txt += '<th scope="row">' + a + '</th>';
                var file = x.files[i];
                if ('name' in file) {
                    txt += '<td>' + file.name + '</td>';
                }
                if ('size' in file) {
                    if (file.size <= 1048576)
                        txt += '<td>' + parseFloat((file.size / 1024)).toFixed(2) + ' Kb</td>';
                    else if (file.size <= 1073741824)
                        txt += '<td>' + parseFloat((file.size / 1024)).toFixed(2) + ' Mb</td>';
                }
                txt += '<td><div class="form-group">';
                txt += '<select class="form-control" id="selMes' + i + '">';
                txt += '<option value="' + mes + '" selected>Mês Atual</option>';
                txt += '<option value="01">Janeiro</option>';
                txt += '<option value="02">Fevereiro</option>';
                txt += '<option value="03">Março</option>';
                txt += '<option value="04">Abril</option>';
                txt += '<option value="05">Maio</option>';
                txt += '<option value="06">Junho</option>';
                txt += '<option value="07">Julho</option>';
                txt += '<option value="08">Agosto</option>';
                txt += '<option value="09">Setembro</option>';
                txt += '<option value="10">Outubro</option>';
                txt += '<option value="11">Novembro</option>';
                txt += '<option value="12">Dezembro</option>';
                txt += '</select>';
                txt += '</div>';
                txt += '</td>';
                txt += '<td><div class="form-group">';
                txt += '<select class="form-control selectCategoria" id="selCat' + i +'">';
                txt += '</select>';
                txt += '</div>';
                txt += '</td>';
                txt += '</tr>';
            }
            txt += '</tbody>';
            txt += '</table>';
            txt += '</div>';

            obterlistaCategoriasAtivas();
        }
    }
    else {
        if (x.value == "") {
            txt += "Selecione um ou mais arquivos.";
        } else {
            txt += "Os arquivos selecionados não são suportados pelo seu navegador!";
            txt += "<br>Caminho do Arquivo: " + x.value;
        }
    }
    $('#tabelaArquivos').html(txt);
    $('.collapse').collapse("show");
}

var salvarDadosArquivoBD = function (dados) {
    var sepDados = dados.split("&");
    var id_cliente = sepDados[0];
    var nome_cliente = sepDados[1];
    var ano = sepDados[2];
    var mes = sepDados[3];
    var categoria = sepDados[4];
    alert(id_cliente);
    alert(nome_cliente);
    alert(ano);
    alert(mes);
    alert(categoria);
}

var erro = false; // define qual mensagem vai aparecer pro usuário
var verificaMes = false; // manda o cara colocar o mês nos arquivos
var currentTime = new Date(); // função que chama as datas

var uploadFile = function (file, i) {
    var selID = document.getElementById("selCliente");
    var id_cliente = selID.options[selID.selectedIndex].id;
    var nome_cliente = $('#selCliente').val();
    var ano = currentTime.getFullYear();
    var selMes = document.getElementById("selMes" + i + "");
    var mes = selMes.options[selMes.selectedIndex].value;
    var selCategoria = document.getElementById("selCat" + i + "");
    var categoria = selCategoria.options[selCategoria.selectedIndex].value;
    if (mes == "Nenhum") {
        verificaMes = true;
    } else {
        var url = 'arquivo/upload.php?nome_cliente=' + nome_cliente + '&id_cliente=' + id_cliente + '&ano=' + ano + '&mes=' + mes + '&categoria=' + categoria;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        mostrarLoading(i);
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                mostrarEnviado(i);
                erro = false;
                var dados = xhr.responseText;
                if (dados.indexOf('&') > -1) {
                    salvarDadosArquivoBD(dados);     
                } else {
                    alert(dados);
                    mostrarErro(i);
                    erro = true;
                }
            } else {
                mostrarErro(i);
                erro = true;
            }
        };
        fd.append("upload_file", file);
        xhr.send(fd);
    }
}

var enviarArquivos = function () {
    var msgUp = '';
    if ($('#selCliente').val() == 'nenhum') {
        msgUp += '<div class="collapse">';
        msgUp += '<div class="alert alert-warning" role="alert">';
        msgUp += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        msgUp += ' Selecione um cliente!';
        msgUp += '</div></div>';
        $('#msgUpload').html(msgUp);
        $('.collapse').collapse("show");
    } else if ($('#meuArquivo').get(0).files.length === 0) {
        msgUp += '<div class="collapse">';
        msgUp += '<div class="alert alert-warning" role="alert">';
        msgUp += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        msgUp += ' Selecione pelo menos um arquivo para enviar!';
        msgUp += '</div></div>';
        $('#msgUpload').html(msgUp);
        $('.collapse').collapse("show");
    } else if ($('#checkArquivos').not(':checked').length) {
        msgUp += '<div class="collapse">';
        msgUp += '<div class="alert alert-warning" role="alert">';
        msgUp += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        msgUp += ' Você precisa marcar o campo acima para enviar os arquivos!';
        msgUp += '</div></div>';
        $('#msgUpload').html(msgUp);
        $('.collapse').collapse("show");
    } else {
        mostrarLoading();

        var inputArquivos = document.querySelector('#meuArquivo');
        var files = inputArquivos.files;
        for (var i = 0; i < files.length; i++) {
            uploadFile(inputArquivos.files[i], i);
        }

        if (verificaMes) {
            var msgUp = '';
            msgUp += '<div class="collapse">';
            msgUp += '<div class="alert alert-warning" role="alert">';
            msgUp += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
            msgUp += ' Selecione o mês para os arquivos!';
            msgUp += '</div></div>';
            verificaMes = false;
        } else if (!erro) {
            msgUp += '<div class="collapse">';
            msgUp += '<div class="alert alert-success" role="alert">';
            msgUp += '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
            msgUp += ' Todos os arquivos foram enviados com sucesso!';
            msgUp += '</div></div>';
            erro = false;
        } else if (erro) {
            msgUp += '<div class="collapse">';
            msgUp += '<div class="alert alert-danger" role="alert">';
            msgUp += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
            msgUp += ' Ops, parece que houve um problema com algum arquivo. Tente enviar ele novamente...';
            msgUp += '</div></div>';
            erro = false;
        }

        $('#msgUpload').html(msgUp);
        $('.collapse').collapse("show");

    }

}

var obterlistaCategoriasAtivas = function () {
    $.get('http://"+ nodeJs +":3000/categoria/listartodosativos', function (data) {
        var txt = '';
        var json = JSON.parse(data);
        txt += '<option id=0>Sem categoria</option>';
        for (var i = 0; i < json.length; i++) {
            txt += '<option id=' + json[i]._id + '>' + json[i].nome + '</option>';
        }
        $('.selectCategoria').html(txt);
    });
}