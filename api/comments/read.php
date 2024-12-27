<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Comment.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $comment = new Comment($db);
    $stmt = $comment->read();
    
    $comments_arr = [
        "status" => "success",
        "records" => []
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $comments_arr["records"][] = [
            "id" => $row['id'],
            "content" => $row['content'],
            "post_id" => $row['post_id'],
            "user_id" => $row['user_id'],
            "author_name" => $row['author_name'],
            "author_email" => $row['author_email'],
            "status" => $row['status'],
            "created_at" => $row['created_at']
        ];
    }

    echo json_encode($comments_arr);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 