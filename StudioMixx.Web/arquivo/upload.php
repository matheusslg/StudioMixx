<?php
if (isset($_FILES['upload_file'])) {
    $id_cliente = $_GET['id_cliente'];
    $nome_cliente = $_GET['nome_cliente'];
    $ano = $_GET['ano'];
    $mes = $_GET['mes'];
    $categoria = $_GET['categoria'];
    $diretorio = "uploads/clientes/$nome_cliente/$ano/$mes/$categoria";
	  if (!is_dir ($diretorio)) {
     	  $mode = 0777;
     	  mkdir($diretorio, $mode, true);
	  }
    if(move_uploaded_file($_FILES['upload_file']['tmp_name'], "uploads/clientes/" . $nome_cliente . "/" . $ano . "/" . $mes . "/" . $categoria . "/" . $_FILES['upload_file']['name'])){
        $nome = $_FILES['upload_file']['name'];
        echo "$id_cliente&$nome_cliente&$ano&$mes&$categoria";
    } else {
        echo "Ops, ocorreu um erro com o upload do arquivo " . $nome . "!";
    }
    exit;
} else {
    echo "Selecione pelo menos um arquivo para enviar!";
}
?>