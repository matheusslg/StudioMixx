var cat = categoria();

var carregarPaginaCategoria = function () {
    $.get("http://" + nodeJs + ":3000/categoria/listartodosativos", function (data) {

        var table = '';
        var json = JSON.parse(data);
        for (var i = 0; i < json.length; i++) {

            table += '<tr><th scope="row">' + (i + 1) + '</th><td>';
            table += json[i].nome + '</td>';
            table += '<td>';
            table += '<button type="button" id="btnEditar' + i + '" class="btn btn-warning" onclick="modificarCategoria(&#39;' + json[i]._id + '&#39;,&#39;' + json[i].nome + '&#39;);" ><span style="font-size:15px;" class="glyphicon glyphicon-edit"></span></button> ';
            table += '<button type="button" id="btnInativar' + i + '" class="btn btn-danger" onclick="inativarCategoria(&#39;' + json[i]._id + '&#39;,&#39;' + json[i].nome + '&#39;);"  ><span style="font-size:15px;" class="glyphicon glyphicon-trash"></span></button>';
            table += '</td></tr>';
        }

        $('#tbrCategorias').html(table);
        cat = categoria();
        $('#tblListarCategorias').DataTable({ "iDisplayLength": 25 });;
        $('div.dataTables_filter input').addClass('col-xs-12 form-control');
        $('div.dataTables_filter input').attr("placeholder", "Pesquisar...");
        $('div.dataTables_length select').addClass('form-control-datatable');
    });

};

var modificarCategoria = function (_id, _nome) {
    var pagina = '/categoria/cadastrar.html';
    cat.id = _id;
    cat.nome = _nome;
    carregarConteudo(pagina);
}

var verificarCadastroCategoria = function () {
    if (cat.id) {
        $('#txtcategoria').val(cat.nome);
    }

};

var inserirCategoria = function (nome) {
    if (cat.id) {
        var msgCat = '';
        if ($('#txtcategoria').val().length === 0) {
            msgCat += '<div class="collapse">';
            msgCat += '<div class="alert alert-warning" role="alert">';
            msgCat += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
            msgCat += ' Você deve preencher o nome da categoria!';
            msgCat += '</div></div>';
            $('#msgCategoria').html(msgCat);
            $('.collapse').collapse("show");
        } else {
            $.get("http://" + nodeJs + ":3000/categoria/modificar?id=" + cat.id + "&nome=" + nome, function (data) {
                carregarConteudo('categoria/listar.html');
            });
            cat = categoria();
        }
    }
    else {
        var msgCat = '';
        if ($('#txtcategoria').val().length === 0) {
            msgCat += '<div class="collapse">';
            msgCat += '<div class="alert alert-warning" role="alert">';
            msgCat += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
            msgCat += ' Você deve preencher o nome da categoria!';
            msgCat += '</div></div>';
            $('#msgCategoria').html(msgCat);
            $('.collapse').collapse("show");
        } else {
            $.get("http://" + nodeJs + ":3000/categoria/cadastrar?nome=" + nome + "&status=A", function (data) {
                carregarConteudo('categoria/listar.html');
            });
        }
    }
};

var inativarCategoria = function (id, nome) {
    swal({
        title: "Você tem certeza?",
        text: "Deseja mesmo inativar a categoria " + nome + "?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function (isConfirm) {
        if (isConfirm) {
            $.get("http://" + nodeJs + ":3000/categoria/modificar?id=" + id + "&nome=" + nome + "&status=I", function (data) {
                carregarConteudo('categoria/listar.html');
            });
            swal("Inativada!", "A categoria não está mais disponível para os usuários.", "success");
        } else {
            swal("Cancelado", "A categoria continua ativa!", "error");
        }
    });
};