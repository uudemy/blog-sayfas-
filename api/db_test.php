<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if($db) {
        // Veritabanındaki tabloları listele
        $tables = $db->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        $tableList = $tables->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Veritabanı bağlantısı başarılı',
            'tables' => $tableList,
            'connection_info' => [
                'host' => $database->getHost(),
                'database' => $database->getDbName()
            ]
        ]);
    }
} catch(PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Bağlantı hatası: ' . $e->getMessage()
    ]);
}
?> 