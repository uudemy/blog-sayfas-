<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Category.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $category = new Category($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->name) && !empty($data->slug)) {
        $category->name = $data->name;
        $category->slug = $data->slug;
        
        if($category->create()) {
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Kategori başarıyla oluşturuldu"
            ]);
        } else {
            throw new Exception("Kategori oluşturulamadı");
        }
    } else {
        throw new Exception("Eksik veri");
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 