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
    
    if(!empty($data->id)) {
        $category->id = $data->id;
        
        if($category->delete()) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Kategori başarıyla silindi"
            ]);
        } else {
            throw new Exception("Kategori silinemedi");
        }
    } else {
        throw new Exception("Kategori ID'si gerekli");
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?> 