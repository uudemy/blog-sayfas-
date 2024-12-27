<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

class SupabaseDatabase {
    private $supabaseUrl;
    private $supabaseKey;
    private $conn;

    public function __construct() {
        // Supabase bağlantı parametreleri
        $this->supabaseUrl = 'https://crrnxxcsesxkcarwutda.supabase.co';
        $this->supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycm54eGNzZXN4a2Nhcnd1dGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODY0MzcsImV4cCI6MjA1MDg2MjQzN30.MX7R3uUxLm56RrwcpW5k9IGcA2tPlWCp61SH2BzxUME';
    }

    public function getConnection() {
        try {
            // PostgreSQL bağlantısı
            $dsn = "pgsql:host=" . parse_url($this->supabaseUrl, PHP_URL_HOST) . 
                   ";port=5432" . 
                   ";dbname=postgres" . 
                   ";sslmode=require";

            $this->conn = new PDO($dsn, 'postgres', $this->supabaseKey, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => true
            ]);

            return $this->conn;
        } catch(PDOException $exception) {
            error_log("Supabase Bağlantı Hatası: " . $exception->getMessage());
            throw $exception;
        }
    }

    public function testConnection() {
        try {
            $conn = $this->getConnection();
            $stmt = $conn->query("SELECT version()");
            $version = $stmt->fetchColumn();
            return [
                'status' => true, 
                'message' => "Supabase bağlantısı başarılı. PostgreSQL Versiyon: {$version}"
            ];
        } catch(Exception $e) {
            return [
                'status' => false, 
                'message' => "Bağlantı hatası: " . $e->getMessage()
            ];
        }
    }

    // Supabase özel sorgu metotları
    public function select($table, $columns = '*', $conditions = []) {
        $conn = $this->getConnection();
        $query = "SELECT {$columns} FROM {$table}";
        
        if (!empty($conditions)) {
            $whereClause = [];
            foreach ($conditions as $key => $value) {
                $whereClause[] = "{$key} = :{$key}";
            }
            $query .= " WHERE " . implode(' AND ', $whereClause);
        }

        $stmt = $conn->prepare($query);
        
        foreach ($conditions as $key => $value) {
            $stmt->bindValue(":{$key}", $value);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }
}