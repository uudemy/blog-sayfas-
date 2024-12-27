<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Post.php';

try {
    if(!isset($_GET['q'])) {
        throw new Exception("Arama terimi gerekli");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    $post = new Post($db);
    $post->search_term = $_GET['q'];
    
    $stmt = $post->search();
    $posts_arr = [
        "status" => "success",
        "records" => []
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $posts_arr["records"][] = [
            "id" => $row['id'],
            "title" => $row['title'],
            "excerpt" => $row['excerpt'],
            "category_name" => $row['category_name']
        ];
    }

    echo json_encode($posts_arr);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 