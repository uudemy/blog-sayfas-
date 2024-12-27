<?php
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if($db) {
    echo "Veritabanı bağlantısı başarılı!";
} else {
    echo "Bağlantı hatası!";
}
?> 