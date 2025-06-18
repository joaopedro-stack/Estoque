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
    try {
        $decoded =  JWT::decode($token, new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7', 'HS256'));

        $id = $_POST['id'] ?? '';

        if (empty($id)) {
            echo json_encode(['sucesso' => false, 'erro' => 'ID do usuário não fornecido para atualização.']);
            exit();
        }

        $stmt = $conexao->prepare("DELETE FROM usuarios WHERE iduser = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Usuário excluído com sucesso'
            ]);
        } else {
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Nenhuma mudança foi feita'
            ]);
        }
    } catch (PDOException $e) {
        error_log("Erro PDO na atualização de usuário: " . $e->getMessage());
        echo json_encode(['sucesso' => false, 'erro' => 'Erro no banco de dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Método não permitido'
    ]);
}
