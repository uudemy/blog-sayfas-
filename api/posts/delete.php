<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Post.php';

$database = new Database();
$db = $database->getConnection();

$post = new Post($db);

// POST verilerini al
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $post->id = $data->id;

    // Post'u sil
    if($post->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Post başarıyla silindi."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Post silinemedi."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Post silinemedi. ID eksik."));
}
?> 