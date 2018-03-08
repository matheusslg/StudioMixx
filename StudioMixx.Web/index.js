$(document).ready(function () {
    var adm = false;
    if (window.sessionStorage.getItem('usuario') != null) {
        adm = JSON.parse(window.sessionStorage.getItem('usuario')).adm;
    }
    else {
        sair();
    }

    if (adm) {
        sidebarAdm();
        $("#dvConteudo").load($(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/usuario/listar.html');        
    } else {
        sidebarUsuario();
        $("#dvConteudo").load($(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/arquivo/listar.html');
    }

    tk = token();
    tk.setToken(getUrlParameter('tk'))

    if (!validarToken())
        sair();
});

var sidebarUsuario = function () {
    var txt = '';
    txt += '<ul class="nav navbar-nav" id="menuSidebar">';
    txt += '<li class="active"><a onclick="carregarConteudo(&#39;arquivo/listar.html&#39;);">Início<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-home"></span></a></li>';
    txt += '<li class="dropdown">';
    txt += '<a class="dropdown-toggle" data-toggle="dropdown">Arquivos <span class="caret"></span><span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-th-list"></span></a>';
    txt += '<ul class="dropdown-menu forAnimate" role="menu">';
    txt += '<li><a onclick="carregarConteudo(&#39;arquivo/listar.html&#39;);">Ver Todos</a></li>';
    txt += '</ul>';
    txt += '</li>';
    txt += '<li><a onclick="sair();" >Sair<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-log-out"></span></a></li>';
    txt += '</ul>';
    $('#bs-sidebar-navbar-collapse-1').html(txt);
}

var sidebarAdm = function () {
    var txt = '';
    txt += '<ul class="nav navbar-nav" id="menuSidebar">';
    txt += '<li class="active"><a onclick="carregarConteudo(&#39;usuario/listar.html&#39;);">Início<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-home"></span></a></li>';
    txt += '<li class="dropdown">';
    txt += '<a class="dropdown-toggle" data-toggle="dropdown">Usuários <span class="caret"></span><span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-user"></span></a>';
    txt += '<ul class="dropdown-menu forAnimate" role="menu">';
    txt += '<li><a onclick="carregarConteudo(&#39;usuario/listar.html&#39;);">Ver Todos</a></li>';
    txt += '<li><a onclick="carregarConteudo(&#39;usuario/cadastro.html&#39;);">Cadastrar Novo</a></li>';
    txt += '</ul>';
    txt += '</li>';
    txt += '<li class="dropdown">';
    txt += '<a class="dropdown-toggle" data-toggle="dropdown">Arquivos <span class="caret"></span><span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-th-list"></span></a>';
    txt += '<ul class="dropdown-menu forAnimate" role="menu">';
    txt += '<li><a onclick="carregarConteudo(&#39;arquivo/listar.html&#39;);">Ver Todos</a></li>';
    txt += '<li><a onclick="carregarConteudo(&#39;arquivo/cadastrar.html&#39;);">Enviar Novo</a></li>';
    txt += '</ul>';
    txt += '</li>';
    txt += '<li class="dropdown">';
    txt += '<a class="dropdown-toggle" data-toggle="dropdown">Categorias <span class="caret"></span><span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-indent-left"></span></a>';
    txt += '<ul class="dropdown-menu forAnimate" role="menu">';
    txt += '<li><a onclick="carregarConteudo(&#39;categoria/listar.html&#39;);">Ver Todas</a></li>';
    txt += '<li><a onclick="carregarConteudo(&#39;categoria/cadastrar.html&#39;);">Criar Nova</a></li>';
    txt += '</ul>';
    txt += '</li>';
    txt += '<li><a onclick="sair();" >Sair<span style="font-size:16px;" class="pull-right hidden-xs showopacity glyphicon glyphicon-log-out"></span></a></li>';
    txt += '</ul>';
    $('#bs-sidebar-navbar-collapse-1').html(txt);
}

var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var sair = function () {
    token = token();
    window.location = $(location).attr('protocol') + '//' + $(location).attr('host') + pastaSite + '/login';
}

var carregarConteudo = function (pagina) {
    if (!validarToken())
        sair();
    else {
        $.get($(location).attr('protocol') + '//' + $(location).attr('host') + '/'+ pastaSite +'/' + pagina, function (html) {            
            $('#dvConteudo').html(html);
        });
    }
};

var validarToken = function () {
    var diff = Math.abs(Date.now() - tk.getToken());
    if (diff > 21600000)
        return false;
    else
        return true;
};