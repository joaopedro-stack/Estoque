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

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    try{
        $decoded =  JWT::decode($token , new Key('7q5w87EDTG72UI6487EHD8TEASUGUIdts8Q7' , 'HS256'));

        $id = $_POST['id'] ?? '';
 
        if(empty($id)){
            echo json_encode([
                'sucesso' => false ,
                'mensagem' => 'Id vazio'
            ]);
        }

        $stmt = $conexao->prepare("DELETE FROM produtos WHERE id = :id");
        $stmt->bindParam(':id' , $id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0){
            echo json_encode([
                'sucesso' => true ,
                'mensagem' => 'Produto excluído com sucesso'
            ]);
        }else{
            echo json_encode([
                'sucesso' => true , 
                'mensagem' => 'Não houve alteração'
            ]);
        }

    }catch(PDOException $e){
        error_log('Erro no PDO' . $e->getMessage());
        echo json_encode([
            'sucesso' => false , 
            'erro' => "Erro no banco de dados" . $e->getMessage()
        ]);
    };

}else{
    echo json_encode([
        'sucesso' => false ,
        'erro' => 'Método não permitido'
    ]);
}
?>