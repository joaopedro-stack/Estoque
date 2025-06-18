<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\Key;
use Firebase\JWT\JWT;

include_once('config.php');

$headers = getallheaders();

if(!isset($headers['Authorization'])){
    http_response_code(401);
    echo json_encode([
        'sucesso' => false ,
        'mensagem' => 'Token não Permitido'
    ]);
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ' , '' , $authHeader);

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    try {
        $decoded = JWT::decode($token , new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7' , 'HS256'));
        $id = $_POST['id'] ?? '';
        $sku = $_POST['sku'] ?? '';
        $nome = $_POST['nome'] ?? '';
        $tipo = $_POST['tipo'] ?? '';
        $qtd = $_POST['qtd'] ?? '';
        $precoCompra = str_replace(['R$', ',', ' '], ['', '.', ''], $_POST['preco-compra'] ?? '');
        $precoVenda = str_replace(['R$', ',', ' '], ['', '.', ''], $_POST['preco-venda'] ?? '');

        $verificacao = $conexao->prepare("SELECT * FROM produtos WHERE sku = :sku and id != :id");
        $verificacao->bindParam(':id' , $id);
        $verificacao->bindParam(':sku' , $sku);
        $verificacao->execute();

        $resultado = $verificacao->fetch(PDO::FETCH_ASSOC);

        if(!$resultado){
            $stmt = $conexao->prepare("UPDATE produtos SET nome = :nome , sku = :sku , tipo = :tipo , quantidade = :qtd , preco_compra = :precoCompra , preco_venda = :precoVenda  WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':sku', $sku);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':tipo', $tipo);
            $stmt->bindParam(':qtd', $qtd);
            $stmt->bindParam(':precoCompra', $precoCompra);
            $stmt->bindParam(':precoVenda', $precoVenda);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'sucesso' => true,
                    'mensagem' => 'Produto editado com sucesso'
                ]);
            } else {
                echo json_encode([
                    'sucesso' => false,
                    'mensagem' => 'Nenhuma alteração feita ou produto não encontrado.'
                ]);
            }
        }else{
            echo json_encode([
                'sucesso' => false ,
                'mensagem' => 'Já existe um produto com esse código'
            ]);
        }

    } catch (PDOException $e) {
        error_log("Erro PDO na atualização do produto: " . $e->getMessage());
        echo json_encode(['sucesso' => false, 'erro' => 'Erro no banco de dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido']);
}
