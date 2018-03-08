var usuarioSetado = '';

var ativarDataTable = function () {
    //$('#tblListarArquivos').DataTable().destroy();
    $('#tblListarArquivos').DataTable({ "iDisplayLength": 25, retrieve: true });
    $('div.dataTables_filter input').addClass('col-xs-12 form-control');
    $('div.dataTables_filter input').attr("placeholder", "Pesquisar...");
    $('div.dataTables_length select').addClass('form-control-datatable');
}

var carregarPaginaArquivo = function () {
    if (!JSON.parse(window.sessionStorage.getItem('usuario')).adm) {
        $('#btnEnviarArquivo').hide();
        $('#selectAdm').hide();
        $('#txtAnoUsuario').val(new Date().getFullYear());
        carregarSelectMesArquivoUsuario();

        var idUsuario = JSON.parse(window.sessionStorage.getItem('usuario'))._id;
        var ano = new Date().getFullYear();

        $.get("http://" + nodeJs + ":3000/arquivo/listarArquivosPorUsuario?idUsuario=" + idUsuario + "&ano=" + ano + "&mes=&idCategoria=", function (data) {
            var table = '';
            var json = JSON.parse(data);
            for (var i = 0; i < json.length; i++) {
                table += '<tr id=tr' + i + '>';
                table += '<th scope="row">' + (json.length - i) + '</th>';
                table += '<td>' + json[i].caminhoArquivo.split('/')[json[i].caminhoArquivo.split('/').length - 1] + '</td>';
                table += '<td>' + json[i].usuario[0].login + '</td>';
                table += '<td>' + json[i].categoria[0].nome + '</td>';
                table += '<td>' + json[i].ano + '</td>';
                table += '<td>' + json[i].mes + '</td>';
                table += '<td><audio controls preload="none"><source src="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" type="audio/mp3">Seu navegador não suporta este player.</audio></td>';
                table += '<td><img id="statusDelete' + i + '" src="' + pastaSite + '/imagens/loading.gif" style="visibility: hidden;" /></td>';
                table += '<td><a href="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" download><button type="button" id="btnBaixar' + i + '" class="btn btn-success"><span style="font-size:15px;" class="glyphicon glyphicon-download-alt"></span></button></a></td>';
                table += '</tr>';
            }
            $('#tbrArquivos').html(table);
            ativarDataTable();
        });

    } else {
        $('#selectAdm').show();
        $('#selectUsuario').hide();
        $('#txtAno').val(new Date().getFullYear());
        carregarSelectClienteArquivo();
    }
};

// carrega todos os arquivos do primeiro da lista do select cliente
var carregaArquivosAdm = function (id) {
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DESCOMENTA O ALERT AQUI EM BAIXO E ACESSA O LISTAR E O CADASTRAR DOS ARQUIVOS QUE TU VAI ENTENDER <<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //alert(id);
    $.get("http://" + nodeJs + ":3000/arquivo/listarArquivosPorUsuario?idUsuario=" + id, function (data) {
        var table = '';
        var json = JSON.parse(data);
        for (var i = 0; i < json.length; i++) {
            table += '<tr id=tr' + i + '>';
            table += '<th scope="row">' + (json.length - i) + '</th>';
            table += '<td>' + json[i].caminhoArquivo.split('/')[json[i].caminhoArquivo.split('/').length - 1] + '</td>';
            table += '<td>' + json[i].usuario[0].login + '</td>';
            table += '<td>' + json[i].categoria[0].nome + '</td>';
            table += '<td>' + json[i].ano + '</td>';
            table += '<td>' + json[i].mes + '</td>';
            table += '<td><audio controls preload="none"><source src="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" type="audio/mp3">Seu navegador não suporta este player.</audio></td>';
            table += '<td><img id="statusDelete' + i + '" src="' + pastaSite + '/imagens/loading.gif" style="visibility: hidden;" /></td>';
            table += '<td><a href="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" download><button type="button" id="btnBaixar' + i + '" class="btn btn-success"><span style="font-size:15px;" class="glyphicon glyphicon-download-alt"></span></button></a> <button type="button" id="btnExcluirArquivo" class="btn btn-danger" onclick="deletarArquivo(&#39;' + json[i].caminhoArquivo + '&#39;,' + i + ');"  ><span style="font-size:15px;" class="glyphicon glyphicon-trash"></span></button></td>';
            table += '</tr>';
        }
        $('#tbrArquivos').html(table);
        ativarDataTable();
    });
}

var carregarSelectClienteArquivo = function () {

    $.ajax({
        type: 'GET',
        url: "http://" + nodeJs + ":3000/usuario/listartodosativos",
        success: function (data) {
            if (data != 'null') {
                var table = '';
                table += "";
                var json = JSON.parse(data);
                for (var i = 0; i < json.length; i++) {
                    table += "<option value='" + json[i]._id + "'>" + json[i].login + '</option>';
                }
                $('#selCliente').html(table);
                carregarSelectMesArquivoAdm();
                carregarSelectCategoriaArquivo();

            }
            else {
                sweetAlert("Ops!", "Erro ao carregar os usuarios!", "error");
            }
        },
        error: function (erro) {
            sweetAlert("Ops!", "Usuário ou senha inválido!", "error");
        }
    });

};

var carregarSelectClienteInserir = function () {
    
    $.ajax({
        type: 'GET',
        url: "http://" + nodeJs + ":3000/usuario/listartodosativos",
        success: function (data) {
            if (data != 'null') {
                var table = '';
                table += "";
                var json = JSON.parse(data);
                for (var i = 0; i < json.length; i++) {
                    table += "<option value='" + json[i]._id + "'>" + json[i].login + '</option>';
                }
                $('#selCliente').html(table);

                if (usuarioSetado != '') {
                    $('#selCliente').val(usuarioSetado)
                    usuarioSetado = '';
                }
                else if (window.sessionStorage.getItem('usuarioArquivo') != 'null') {
                    $('#selCliente').val(window.sessionStorage.getItem('usuarioArquivo'));                    
                    window.sessionStorage.setItem('usuarioArquivo', null);
                }

            }
            else {
                sweetAlert("Ops!", "Erro ao carregar os usuarios!", "error");
            }
        },
        error: function (erro) {
            sweetAlert("Ops!", "Usuário ou senha inválido!", "error");
        }
    });

};

var carregarSelectMesArquivoAdm = function () {
    var txt = '';
    txt += '<option value="00" selected>Todos</option>';
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
    $('#selMesFiltro').html(txt);
}

var carregarSelectMesArquivoUsuario = function () {
    var txt = '';
    txt += '<option value="00" selected>Todos</option>';
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
    $('#selMesFiltroUsuario').html(txt);
}

var carregarSelectCategoriaArquivo = function () {

    $.ajax({
        type: 'GET',
        processData: false, // important
        contentType: false, // important        
        url: "http://" + nodeJs + ":3000/categoria/listartodosativos",
        success: function (data) {
            if (data != 'null') {
                var table = '';
                var json = JSON.parse(data);
                table += '<option value="todas" selected>Todas</option>';
                for (var i = 0; i < json.length; i++) {
                    table += '<option value=' + json[i]._id + '>' + json[i].nome + '</option>';
                }
                $('#selCategoriaFiltro').html(table);
                //Função que carrega a tabela do primeiro usuário da select com todos os arquivos dele. Desativada pois gera lentidão.
                //aplicarFiltroArquivoAdm();
            }
            else {
                sweetAlert("Ops!", "Não existe categoria cadastrada", "error");
            }
        },
        error: function (erro) {
            sweetAlert("Ops!", "Erro ao resgatar categorias!", "error");
        }
    });
}

var aplicarFiltroArquivoAdm = function () {
    var idUsuario = $('#selCliente :selected').val();
    var mes = $('#selMesFiltro :selected').html();
    var categoria = $('#selCategoriaFiltro :selected').val();
    var ano = $('#txtAno').val();    

    if (mes.toUpperCase() == "TODOS")
        mes = "";

    if (categoria.toUpperCase() == "TODAS")
        categoria = "";

    $.ajax({
        type: 'GET',
        url: "http://" + nodeJs + ":3000/arquivo/listarArquivosPorUsuario?idUsuario=" + idUsuario + "&ano=" + ano + "&mes=" + mes + "&idCategoria=" + categoria,
        success: function (data) {
            if (data != 'null') {
                $('#tblListarArquivos').DataTable().destroy();
                var table = '';
                var json = JSON.parse(data);
                for (var i = 0; i < json.length; i++) {
                    table += '<tr id=tr' + i + '>';
                    table += '<th scope="row">' + (json.length - i) + '</th>';
                    table += '<td>' + json[i].caminhoArquivo.split('/')[json[i].caminhoArquivo.split('/').length - 1] + '</td>';
                    table += '<td>' + json[i].usuario[0].login + '</td>';
                    table += '<td>' + json[i].categoria[0].nome + '</td>';
                    table += '<td>' + json[i].ano + '</td>';
                    table += '<td>' + json[i].mes + '</td>';
                    table += '<td><audio controls preload="none"><source src="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" type="audio/mp3">Seu navegador não suporta este player.</audio></td>';
                    table += '<td><img id="statusDelete' + i + '" src="' + pastaSite + '/imagens/loading.gif" style="visibility: hidden;" /></td>';
                    table += '<td><a href="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" download><button type="button" id="btnBaixar' + i + '" class="btn btn-success"><span style="font-size:15px;" class="glyphicon glyphicon-download-alt"></span></button></a> <button type="button" id="btnExcluirArquivo" class="btn btn-danger" onclick="deletarArquivo(&#39;' + json[i].caminhoArquivo + '&#39;,' + i + ');"  ><span style="font-size:15px;" class="glyphicon glyphicon-trash"></span></button></td>';
                    table += '</tr>';
                }
                $('#tbrArquivos').html(table);
                ativarDataTable();
            }
            else {
                sweetAlert("Ops!", "Não existe categoria cadastrada", "error");
            }
        },
        error: function (erro) {
            sweetAlert("Ops!", "Erro ao aplicar filtro de arquivos!", "error");
        }
    });
}

var aplicarFiltroArquivoUsuario = function () {
    var idUsuario = JSON.parse(window.sessionStorage.getItem('usuario'))._id;
    var mes = $('#selMesFiltroUsuario :selected').html();
    var ano = $('#txtAnoUsuario').val();

    if (mes.toUpperCase() == "TODOS")
        mes = "";

    $.ajax({
        type: 'GET',
        url: "http://" + nodeJs + ":3000/arquivo/listarArquivosPorUsuario?idUsuario=" + idUsuario + "&ano=" + ano + "&mes=" + mes + "&idCategoria=",
        success: function (data) {
            if (data != 'null') {
                $('#tblListarArquivos').DataTable().destroy();
                var table = '';
                var json = JSON.parse(data);
                for (var i = 0; i < json.length; i++) {
                    table += '<tr id=tr' + i + '>';
                    table += '<th scope="row">' + (json.length - i) + '</th>';
                    table += '<td>' + json[i].caminhoArquivo.split('/')[json[i].caminhoArquivo.split('/').length - 1] + '</td>';
                    table += '<td>' + json[i].usuario[0].login + '</td>';
                    table += '<td>' + json[i].categoria[0].nome + '</td>';
                    table += '<td>' + json[i].ano + '</td>';
                    table += '<td>' + json[i].mes + '</td>';
                    table += '<td><audio controls preload="none"><source src="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" type="audio/mp3">Seu navegador não suporta este player.</audio></td>';
                    table += '<td><img id="statusDelete' + i + '" src="' + pastaSite + '/imagens/loading.gif" style="visibility: hidden;" /></td>';
                    table += '<td><a href="' + $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + json[i].caminhoArquivo + '" download><button type="button" id="btnBaixar' + i + '" class="btn btn-success"><span style="font-size:15px;" class="glyphicon glyphicon-download-alt"></span></button></a></td>';
                    table += '</tr>';
                }
                $('#tbrArquivos').html(table);
                ativarDataTable();
            }
            else {
                sweetAlert("Ops!", "Não existe categoria cadastrada", "error");
            }
        },
        error: function (erro) {
            sweetAlert("Ops!", "Erro ao aplicar filtro de arquivos!", "error");
        }
    });
}

var obterlistaCategoriasAtivas = function () {
    $.get('http://' + nodeJs + ':3000/categoria/listartodosativos', function (data) {
        var txt = '';
        var json = JSON.parse(data);
        txt += '';
        for (var i = 0; i < json.length; i++) {
            txt += '<option id=' + json[i]._id + '>' + json[i].nome + '</option>';
        }
        $('.selectCategoria').html(txt);
    });


}

var selecionarArquivos = function () {
    $('#msgUpload').html("");
    var mes = new Date().getMonth();
    var ano = new Date().getFullYear();
    var x = $('#btnArquivos')[0];
    var txt = "";
    if (x.files.length == 0) {
        txt = "Selecione um ou mais arquivos.";
    } else {
        txt += '<div class="collapse">';
        txt += '<table class="table table-striped">';
        txt += '<thead>';
        txt += '<tr>';
        txt += '<th style="width: 5%">Status</th>';
        txt += '<th style="width: 2%">#</th>';
        txt += '<th style="width: 35%">Nome</th>';
        txt += '<th style="width: 10%">Tamanho</th>';
        txt += '<th style="width: 7%">Ano</th>';
        txt += '<th style="width: 10%">Mês</th>';
        txt += '<th style="width: 20%">Categoria</th>';
        txt += '</tr>';
        txt += '</thead>';
        txt += '<tbody>';
        for (var i = 0; i < x.files.length; i++) {
            var a = i + 1;
            txt += '<tr>';
            txt += '<td><img id="statusUpload' + i + '" src="' + pastaSite + '/imagens/clock.png" /></td>';
            txt += '<th scope="row">' + a + '</th>';
            var file = x.files[i];
            if ('name' in file) {
                txt += "<td style='width: 30%'>" + file.name + "</td>";
            }
            if ('size' in file) {
                if (file.size <= 1048576)
                    txt += '<td>' + parseFloat((file.size / 1024)).toFixed(2) + ' Kb</td>';
                else if (file.size <= 1073741824)
                    txt += '<td>' + parseFloat((file.size / 1024 / 1024)).toFixed(2) + ' Mb</td>';
            }

            txt += '<td><div class="form-group">';
            txt += "<input type='number' id='txtAno" + i + "' class='form-control' maxlength='4' value='" + ano + "' required>";

            txt += '</div>';
            txt += '</td>';

            txt += '<td><div class="form-group">';
            txt += '<select class="form-control" id="selMes' + i + '">';

            if (mes == 0)
                txt += '<option value="01" selected>Janeiro</option>';
            else
                txt += '<option value="01">Janeiro</option>';

            if (mes == 1)
                txt += '<option value="02" selected>Fevereiro</option>';
            else
                txt += '<option value="02">Fevereiro</option>';

            if (mes == 2)
                txt += '<option value="03" selected>Março</option>';
            else
                txt += '<option value="03">Março</option>';

            if (mes == 3)
                txt += '<option value="04" selected>Abril</option>';
            else
                txt += '<option value="04">Abril</option>';

            if (mes == 4)
                txt += '<option value="05" selected>Maio</option>';
            else
                txt += '<option value="05">Maio</option>';

            if (mes == 5)
                txt += '<option value="06" selected>Junho</option>';
            else
                txt += '<option value="06">Junho</option>';

            if (mes == 6)
                txt += '<option value="07" selected>Julho</option>';
            else
                txt += '<option value="07">Julho</option>';

            if (mes == 7)
                txt += '<option value="08" selected>Agosto</option>';
            else
                txt += '<option value="08">Agosto</option>';

            if (mes == 8)
                txt += '<option value="09" selected>Setembro</option>';
            else
                txt += '<option value="09">Setembro</option>';

            if (mes == 9)
                txt += '<option value="10" selected>Outubro</option>';
            else
                txt += '<option value="10">Outubro</option>';

            if (mes == 10)
                txt += '<option value="11" selected>Novembro</option>';
            else
                txt += '<option value="11">Novembro</option>';

            if (mes == 11)
                txt += '<option value="12" selected>Dezembro</option>';
            else
                txt += '<option value="12">Dezembro</option>';

            txt += '</select>';
            txt += '</div>';
            txt += '</td>';
            txt += '<td><div class="form-group">';
            txt += '<select class="form-control selectCategoria" id="selCat' + i + '">';
            txt += '</select>';
            txt += '</div>';
            txt += '</td>';
            txt += '</tr>';
        }
        txt += '</tbody>';
        txt += '</table>';
        txt += '</div>';

        $('#selMes0').val('05')
        obterlistaCategoriasAtivas();
    }

    $('#tabelaArquivos').html(txt);
    $('.collapse').collapse("show");
}

var uploadArquivos = function (data) {
    var msgUp = '';
    if ($('#btnArquivos').get(0).files.length === 0) {
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
        $('#msgUpload').html('');
        var x = $('#btnArquivos')[0];
        for (var i = 0; i < x.files.length; i++) {
            var arq = arquivo();
            arq.idUsuario = $('#selCliente').val()
            arq.idCategoria = $('#selCat' + i)[0][$('#selCat' + i)[0].selectedIndex].id;
            arq.mes = $('#selMes' + i)[0][$('#selMes' + i)[0].selectedIndex].text
            arq.ano = $('#txtAno' + i).val().trim();
            arq.caminhoArquivo = "/" + $('#selCliente')[0][$('#selCliente')[0].selectedIndex].text + "/" + arq.ano + "/" + arq.mes + "/"
                                     + $('#selCat' + i)[0][$('#selCat' + i)[0].selectedIndex].value;
            enviarArquivo(i, x, arq);
        }
    }
}

var enviarArquivo = function (i, x, arquivoModel) {
    var formData = new FormData();
    var arquivo = x.files[i];
    formData.append("file", arquivo);
    formData.append("modelArquivo", JSON.stringify(arquivoModel));
    $('#statusUpload' + i).prop('src', pastaSite + '/imagens/loading.gif');

    $.ajax({
        type: 'POST',
        processData: false, // important
        contentType: false, // important
        data: formData,
        url: "http://" + nodeJs + ":3000/arquivo/upload",
        dataType: 'json',
        success: function (data) {
            $('#statusUpload' + i).prop('src', pastaSite + '/imagens/enviado.png');
        },
        error: function (erro) {
            $('#statusUpload' + i).prop('src', pastaSite + '/imagens/erro.png');
        }
    });
}

var deletarArquivo = function (caminhoArquivo, i) {
    $('#statusDelete' + i).css('visibility', '')
    $.ajax({
        type: 'POST',
        data: {
            caminhoArquivo: caminhoArquivo
        },
        url: "http://" + nodeJs + ":3000/arquivo/deletararquivo",
        success: function (data) {
            $('#statusDelete' + i).prop('src', $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/imagens/enviado.png');
            $('#tr' + i).html('');
        },
        error: function (erro) {
            $('#statusDelete' + i).prop('src', $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/imagens/erro.png');
        }
    });
}

var setarUsuario = function (usuario) {
    usuarioSetado = usuario;
}

