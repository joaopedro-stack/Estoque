<?php
include_once('config.php');

$nome = $_POST['nome'] ?? '';
$usuario = $_POST['user'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

if (empty($nome) || empty($usuario) || empty($email) || empty($senha)) {
    echo "<script>
        alert('Preencha todos os campos!');
        window.location.href = '../index.html';
    </script>";
    exit;
}

$stmt = $conexao->prepare("SELECT iduser FROM usuarios WHERE usuario = :usuario");
$stmt->bindParam(":usuario", $usuario);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result->num_rows > 0) {
    echo "<script>
        alert('Usuário já existe!');
        window.location.href = '../index.html';
    </script>";
    exit;
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $conexao->prepare("INSERT INTO usuarios (nome, usuario, email, senha, role) VALUES (:nome, :usuario, :email, :senha, :role)");
$stmt->bindParam(":nome", $nome);
$stmt->bindParam(":usuario", $usuario);
$stmt->bindParam(":email", $email);
$stmt->bindParam(":senha", $senhaHash);
$stmt->bindParam(":role", $role);

if ($stmt->execute()) {
    echo "<script>
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '../index.html';
    </script>";
} else {
    echo "<script>
        alert('Erro ao cadastrar usuário.');
        window.location.href = '../index.html';
    </script>";
}
?>
