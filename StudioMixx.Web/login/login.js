var tk = '';
//var pastaSite = '/painel';// sempre com / antes do nome da pasta EX: /painel e '' para nenhuma pasta
var pastaSite = '';
//var nodeJs = '192.169.177.204'; //server NodeJs studioMixx
var nodeJs = 'localhost';

$(document).ready(function () {
    $(".form-control").keypress(function (event) {
        if (event.keyCode == 13) {
            textboxes = $("input.form-control");
            currentBoxNumber = textboxes.index(this);
            if (textboxes[currentBoxNumber + 1] != null) {
                nextBox = textboxes[currentBoxNumber + 1]
                nextBox.focus();
                nextBox.select();
                event.preventDefault();
                return false
            } else {
                encaminhar();
            }
        }
    });
})

var encaminhar = function () {
    var usuario = $('#txtUsuario').val();
    var senha = $('#txtSenha').val();
    if (usuario != "" && senha != "") {
        $.ajax({
            type: 'GET',
            processData: false, // important
            contentType: false, // important        
            url: "http://" + nodeJs + ":3000/usuario/login?login=" + $('#txtUsuario').val() + '&senha=' + $('#txtSenha').val(),
            async: false,
            success: function (data) {
                if (data != 'null') {
                    var objUsuario = JSON.parse(data);
                    var adm = objUsuario.adm;
                    var tk = token();
                    tk.setToken(Date.now());
                    window.sessionStorage.setItem('usuario', data);
                    window.location = $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/?tk=' + tk.getToken();
                }
                else {
                    alert('Usuário ou senha inválido!');
                }
            },
            error: function (erro) {
                sweetAlert("Ops!", "Usuário ou senha inválido!", "error");
            }
        });
    } else {
        sweetAlert("Ops!", "Você deve preencher os campos para fazer login.", "error");
    }
};
