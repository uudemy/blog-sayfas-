<?php
require_once 'vendor/autoload.php';
require_once 'config/database.php';

// Temel rota yönlendirmesi
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/':
        require __DIR__ . '/views/home.php';
        break;
    case '/about':
        require __DIR__ . '/views/about.php';
        break;
    default:
        http_response_code(404);
        require __DIR__ . '/views/404.php';
        break;
}

// Supabase bağlantısını test et
try {
    $database = new SupabaseDatabase();
    $connectionTest = $database->testConnection();
    
    if ($connectionTest['status']) {
        // Bağlantı başarılı
        error_log($connectionTest['message']);
    } else {
        // Bağlantı hatası
        error_log($connectionTest['message']);
    }
} catch (Exception $e) {
    error_log("Veritabanı bağlantı hatası: " . $e->getMessage());
}
