<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    !empty($data->title) &&
    !empty($data->content)
) {
    // Post özelliklerini ayarla
    $post->title = $data->title;
    $post->slug = strtolower(str_replace(' ', '-', $data->title)); // Başlıktan slug oluştur
    $post->content = $data->content;
    $post->status = $data->status;
    $post->category_id = $data->category_id;
    $post->user_id = 1; // Şimdilik sabit kullanıcı ID'si

    // Post'u oluştur
    if($post->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Post başarıyla oluşturuldu."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Post oluşturulamadı."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Post oluşturulamadı. Veriler eksik."));
}
?> 