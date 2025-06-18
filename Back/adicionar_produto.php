<?php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\Key;
use Firebase\JWT\JWT;

include_once('config.php');

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Token não fornecido'
    ]);
    exit;
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $decoded = JWT::decode($token, new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7', 'HS256'));
    $sku = $_POST['sku'] ?? '';
    $nome = $_POST['nome'] ?? '';
    $tipo = $_POST['tipo'] ?? '';
    $qtd = $_POST['qtd'] ?? 0;
    $preco_compra = $_POST['preco-compra'] ?? '';
    $preco_venda = $_POST['preco-venda'] ?? '';

    try {
        $verificacao = $conexao->prepare("SELECT * FROM produtos WHERE sku = :sku");
        $verificacao->bindParam(':sku', $sku);
        $verificacao->execute();

        $resultado = $verificacao->fetch(PDO::FETCH_ASSOC);

        if(!$resultado){
            $stmt = $conexao->prepare("INSERT INTO produtos (sku, nome, tipo, quantidade, preco_compra, preco_venda)VALUES (:sku, :nome, :tipo, :quantidade, :preco_compra, :preco_venda)");
            $stmt->bindParam(':sku', $sku);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':tipo', $tipo);
            $stmt->bindParam(':quantidade', $qtd);
            $stmt->bindParam(':preco_compra', $preco_compra);
            $stmt->bindParam(':preco_venda', $preco_venda);
            $stmt->execute();
    
            $last_id = $conexao->lastInsertId();
    
            echo json_encode([
                'sucesso' => true,
                'produto' => [
                    'id' => $last_id,
                    'sku' => $sku,
                    'nome' => $nome,
                    'tipo' => $tipo,
                    'quantidade' => $qtd,
                    'preco_compra' => $preco_compra,
                    'preco_venda' => $preco_venda
                ]
            ]);
        }else{
            echo json_encode([
                'sucesso' => false ,
                'mensagem' => 'já existe um produto com esse código'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
    }
}
