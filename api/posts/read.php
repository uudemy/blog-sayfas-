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
    
    // Bağlantı kontrolü
    if(!$db) {
        throw new Exception("Veritabanı bağlantısı kurulamadı");
    }

    // Posts tablosundaki kayıtları say
    $count = $db->query("SELECT COUNT(*) FROM posts")->fetchColumn();

    $post = new Post($db);
    $stmt = $post->read();
    
    if(!$stmt) {
        throw new Exception("Sorgu çalıştırılamadı");
    }

    $num = $stmt->rowCount();
    $response = [
        "status" => "success",
        "total_posts" => $count,
        "records" => []
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $response["records"][] = [
            "id" => $row['id'],
            "title" => $row['title'],
            "slug" => $row['slug'] ?? '',
            "content" => html_entity_decode($row['content']),
            "status" => $row['status'],
            "category_name" => $row['category_name'] ?? 'Genel',
            "created_at" => $row['created_at']
        ];
    }

    if(empty($response["records"])) {
        $response["message"] = "Yazı bulunamadı";
    }

    http_response_code(200);
    echo json_encode($response);

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ]);
}
?> 