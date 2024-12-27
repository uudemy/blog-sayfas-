<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Post.php';

$database = new Database();
$db = $database->getConnection();

$post = new Post($db);

// URL'den ID'yi al
$post->id = isset($_GET['id']) ? $_GET['id'] : die();

// Post detaylarını al
$post->readOne();

if($post->title != null) {
    $post_arr = array(
        "id" =>  $post->id,
        "title" => $post->title,
        "content" => $post->content,
        "status" => $post->status,
        "category_id" => $post->category_id,
        "category_name" => $post->category_name,
        "created_at" => $post->created_at
    );

    http_response_code(200);
    echo json_encode($post_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Post bulunamadı."));
}
?> 