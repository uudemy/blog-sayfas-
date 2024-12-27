<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    include_once '../../config/database.php';
    include_once '../../models/Category.php';

    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception("Veritabanı bağlantısı kurulamadı");
    }
    
    $category = new Category($db);
    $stmt = $category->read();
    
    $categories_arr = [
        "status" => "success",
        "records" => []
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $categories_arr["records"][] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "slug" => $row['slug'],
            "created_at" => $row['created_at']
        ];
    }

    echo json_encode($categories_arr);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>