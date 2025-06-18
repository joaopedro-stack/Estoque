<?php
include_once('config.php');
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = '7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7';

$usuario = $_POST['user'] ?? '';
$senha = $_POST['senha'] ?? '';

if (empty($usuario) || empty($senha)) {
    header('Location: ../index.html');
    exit;
}

$stmt = $conexao->prepare("SELECT iduser, usuario, senha, role FROM usuarios WHERE usuario = :usuario");
$stmt->bindParam(':usuario', $usuario);
$stmt->execute();
$dados = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$dados || !password_verify($senha, $dados['senha'])) {
    echo "<script>alert('Usuário ou senha incorretos'); window.location.href = '../index.html';</script>";
    exit;
}

$iduser = $dados['iduser'];
$role = $dados['role'];
$user = $dados['usuario'];

$payload = [
    'iduser' => $iduser,
    'usuario' => $usuario,
    'iat' => time(),
    'exp' => time() + 3600
];

$jwt = JWT::encode($payload, $key, 'HS256');

echo "<script>
    localStorage.setItem('token', '$jwt');
    localStorage.setItem('iduser','$iduser');
    localStorage.setItem('username','$user');
</script>";

if ($role !== 'admin') {
    echo "<script>window.location.href = '../operator/dashboard.html'</script>";
} else {
    echo "<script>window.location.href = '../admin/dashboard.html'</script>";
}
?>
