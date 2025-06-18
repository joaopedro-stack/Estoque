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
        'mensagem' => 'Token não Permitido'
    ]);
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $decoded = JWT::decode($token, new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7', 'HS256'));
        $id = $_POST['id'] ?? '';
        $nome = $_POST['nome'] ?? '';
        $usuario = $_POST['usuario'] ?? '';
        $email = $_POST['email'] ?? '';
        $role = $_POST['role'] ?? '';

        if (empty($id)) {
            echo json_encode(['sucesso' => false, 'erro' => 'ID do usuário não fornecido para atualização.']);
            exit();
        }

        $verificacao = $conexao->prepare("SELECT * FROM usuarios WHERE usuario = :usuario and iduser != :id");
        $verificacao->bindParam(":usuario", $usuario);
        $verificacao->bindParam(":id", $id);
        $verificacao->execute();
        $result = $verificacao->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            $stmt = $conexao->prepare('UPDATE usuarios SET nome = :nome, usuario = :usuario, email = :email, role = :role WHERE iduser = :id');
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':usuario', $usuario);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':role', $role);
    
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'sucesso' => true,
                    'mensagem' => 'Usuário editado com sucesso!'
                ]);
            } else {
                echo json_encode([
                    'sucesso' => false,
                    'mensagem' => 'Nenhuma alteração feita ou usuário não encontrado.'
                ]);
            }

        }else{
            echo json_encode(['sucesso' => false, 'mensagem' => 'usuário já existe.']);
            exit;
        }

    } catch (PDOException $e) {
        error_log("Erro PDO na atualização de usuário: " . $e->getMessage());
        echo json_encode(['sucesso' => false, 'erro' => 'Erro no banco de dados: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido']);
}
