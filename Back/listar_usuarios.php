<?php
header('Content-Type: application/json');
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
    $token = str_replace('Bearer ' , '', $authHeader);

    try{
        $decoded = JWT::decode($token , new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7' , 'HS256'));
        
        $sql = "SELECT * FROM usuarios";
        $stmt = $conexao->query($sql);
        $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if(count($usuarios) !== 0){
            echo json_encode([
                'sucesso' => true , 'Usuarios' => $usuarios]);
        }else{
            echo json_encode([
                'sucesso' => false , 
                'mensagem' => '0 usuarios Encontrados'
            ]);
        }
    }catch(Exception $e){
        http_response_code(401);
        echo json_encode([
            'sucesso' => false ,
            'mensagem' => 'Token Inválido'
        ]);
        exit;
    }


?>