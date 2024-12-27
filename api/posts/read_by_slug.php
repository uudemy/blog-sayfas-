<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Post.php';

try {
    if(!isset($_GET['slug'])) {
        throw new Exception("Slug parametresi gerekli");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    $post = new Post($db);
    $post->slug = $_GET['slug'];
    
    $result = $post->readBySlug();
    
    if($result) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "post" => $result
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Yazı bulunamadı"
        ]);
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 