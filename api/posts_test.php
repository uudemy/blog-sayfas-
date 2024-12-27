<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Direkt SQL sorgusu ile posts tablosunu kontrol et
    $query = "SELECT * FROM posts";
    $stmt = $db->query($query);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'count' => count($posts),
        'posts' => $posts
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorgu hatası: ' . $e->getMessage()
    ]);
}
?> 