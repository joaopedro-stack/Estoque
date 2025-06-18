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
        'mensagem' => 'Token não fornecido'
    ]);
    exit;
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ' , '' , $authHeader);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $decoded = JWT::decode($token , new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7' , 'HS256'));
        
        $nome = $_POST['nome'] ?? '';
        $usuario = $_POST['usuario'] ?? '';
        $email = $_POST['email'] ?? '';
        $senha = $_POST['senha'] ?? '';
        $role = $_POST['role'] ?? '';

        $verificacao = $conexao->prepare("SELECT * FROM usuarios WHERE usuario = :usuario");
        $verificacao->bindParam(":usuario", $usuario);
        $verificacao->execute();
        $result = $verificacao->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            echo json_encode(['sucesso' => false, 'erro' => 'Usuário já existe.']);
            exit;
        }

        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        $stmt = $conexao->prepare("INSERT INTO usuarios (nome, usuario, email, senha, role) VALUES (:nome, :usuario, :email, :senha, :role)");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':senha', $senhaHash);
        $stmt->bindParam(':role', $role);
        $stmt->execute();

        $ultimoId = $conexao->lastInsertId();

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Usuário cadastrado com sucesso!',
            'usuario' => [
                'id' => $ultimoId,
                'nome' => $nome,
                'usuario' => $usuario,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
    }
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido.']);
}
