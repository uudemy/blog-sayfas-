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

if(
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->content)
) {
    // Post özelliklerini ayarla
    $post->id = $data->id;
    $post->title = $data->title;
    $post->slug = strtolower(str_replace(' ', '-', $data->title));
    $post->content = $data->content;
    $post->status = $data->status;

    // Post'u güncelle
    if($post->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Post başarıyla güncellendi."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Post güncellenemedi."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Post güncellenemedi. Veriler eksik."));
}
?> 