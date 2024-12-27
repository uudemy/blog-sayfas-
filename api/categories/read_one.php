<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Category.php';

try {
    if(!isset($_GET['id'])) {
        throw new Exception("Kategori ID'si gerekli");
    }

    $database = new Database();
    $db = $database->getConnection();
    
    $category = new Category($db);
    $category->id = $_GET['id'];
    
    $stmt = $category->readOne();
    
    if($stmt) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "category" => $stmt
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Kategori bulunamadı"
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