<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Post.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $post = new Post($db);
    $count = $post->getCount();
    
    echo json_encode([
        "status" => "success",
        "count" => $count
    ]);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 