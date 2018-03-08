var user = usuario();

var carregarPaginaUsuario = function () {
    $.get("http://"+ nodeJs +":3000/usuario/listartodosativos", function (data) {

        var table = '';
        var json = JSON.parse(data);
        for (var i = 0; i < json.length; i++) {

            table += '<tr><th scope="row">' + (i + 1) + '</th>';
            table += '<td>' + json[i].login + '</td>';
            table += '<td>' + json[i].senha + '</td>';
            table += '<td>';
            if (json[i].adm)
                table += 'Administrador';
            else
                table += 'Usuário';
            table += '</td>';
            table += '<td>';
            table += '<button type="button" id="btnUpload' + i + '" class="btn btn-info" onclick="uploadArquivoListar(&#39;' + json[i]._id + '&#39;)"><span style="font-size:15px;" class="glyphicon glyphicon-upload"></span></button> ';
            table += '<button type="button" id="btnEditar' + i + '" class="btn btn-warning" onclick="modificarUsuario(&#39;' + json[i]._id + '&#39;,&#39;' + json[i].login + '&#39;,&#39;' + json[i].senha + '&#39;,&#39;' + json[i].adm + '&#39;);" ><span style="font-size:15px;" class="glyphicon glyphicon-edit"></span></button> ';
            table += '<button type="button" id="btnInativar' + i + '" class="btn btn-danger" onclick="inativarUsuario(&#39;' + json[i]._id + '&#39;,&#39;' + json[i].login + '&#39;,&#39;' + json[i].senha + '&#39;,&#39;' + json[i].adm + '&#39;);"><span style="font-size:15px;" class="glyphicon glyphicon-trash"></span></button>';
            table += '</td>';
            table += '</tr>';
        }

        $('#tbrUsuario').html(table);
        user = usuario();
        $('#tblListarUsuarios').DataTable({ "iDisplayLength": 25 });;
        $('div.dataTables_filter input').addClass('col-xs-12 form-control');
        $('div.dataTables_filter input').attr("placeholder", "Pesquisar...");
        $('div.dataTables_length select').addClass('form-control-datatable');
    });

};

var uploadArquivoListar = function (login) {
    window.sessionStorage.setItem('usuarioArquivo', login);
    $("#dvConteudo").load($(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/arquivo/cadastrar.html');
}

var inserirUsuario = function (login, senha) {
    var msgUser = '';
    if ($('#txtLogin').val().length === 0) {
        msgUser += '<div class="collapse" id="loginMsgColl">';
        msgUser += '<div class="alert alert-warning" role="alert">';
        msgUser += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        msgUser += ' Você deve preencher o usuário!';
        msgUser += '</div></div>';
        $('#msgUsuario').html(msgUser);
        $('#loginMsgColl').collapse("show");
    } else if ($('#txtSenha').val().length === 0) {
        msgUser += '<div class="collapse" id="senhaMsgColl">';
        msgUser += '<div class="alert alert-warning" role="alert">';
        msgUser += '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
        msgUser += ' Você deve preencher a senha!';
        msgUser += '</div></div>';
        $('#msgUsuario').html(msgUser);
        $('#senhaMsgColl').collapse("show");
    } else {
        $('#msgUsuario').html("");
        user.login = $('#txtLogin').val();
        user.senha = $('#txtSenha').val();
        user.adm = $('#chkAdministrador')[0].checked;

        if (user.id) {
            $.get("http://"+ nodeJs +":3000/usuario/modificar?id=" + user.id + "&login=" + user.login + "&senha=" + user.senha + "&adm=" + user.adm, function (data) {
                carregarConteudo('usuario/listar.html');
            });

            user = usuario();
        }
        else {
            $.get("http://"+ nodeJs +":3000/usuario/cadastrar?login=" + user.login + "&senha=" + user.senha + "&adm=" + $('#chkAdministrador')[0].checked + '&status=A', function (data) {
                carregarConteudo('usuario/listar.html');
            });
        }
    }
};

var modificarUsuario = function (_id, _login, _senha, _adm) {
    var pagina = 'usuario/cadastro.html';
    user.id = _id;
    user.login = _login;
    user.senha = _senha;
    user.adm = _adm;

    carregarConteudo(pagina);

};

var verificarCadastroUsuario = function () {
    if (user.id) {
        $('#txtLogin').val(user.login);
        $('#txtSenha').val(user.senha);
        if (user.adm === "true")
            $('#chkAdministrador')[0].checked = true;
    }
};

var inativarUsuario = function (_id, _login, _senha, _adm) {
    swal({
        title: "Você tem certeza?",
        text: "Deseja mesmo inativar o usuário " + _login + "?",
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
            $.get("http://" + nodeJs + ":3000/usuario/modificar?id=" + _id + "&login=" + _login + "&senha=" + _senha + "&adm=" + _adm + "&status=I", function (data) {
                carregarConteudo('usuario/listar.html');
            });
            swal("Inativado!", "O usuário não tem mais acesso ao painel.", "success");
        } else {
            swal("Cancelado", "O usuário continua ativo!", "error");
        }
    });
};