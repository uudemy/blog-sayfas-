<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Post.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "Veritabanı bağlantısı başarılı!\n";
    
    $post = new Post($db);
    $result = $post->read();
    $num = $result->rowCount();
    
    echo "Bulunan yazı sayısı: " . $num . "\n";
    
    while ($row = $result->fetch(PDO::FETCH_ASSOC)){
        print_r($row);
    }
} else {
    echo "Veritabanı bağlantısı başarısız!";
}
?> 