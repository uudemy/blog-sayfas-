<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

class SupabaseDatabase {
    private $host;
    private $port;
    private $dbname;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Ortam değişkenlerini güvenli bir şekilde al
        $this->host = getenv('DB_HOST') ?: 'aws-0-us-west-1.pooler.supabase.com';
        $this->port = getenv('DB_PORT') ?: '6543';
        $this->dbname = getenv('DB_NAME') ?: 'postgres';
        $this->username = getenv('DB_USER') ?: 'postgres.crrnxxcsesxkcarwutda';
        $this->password = getenv('DB_PASSWORD') ?: '';
    }

    public function getConnection() {
        try {
            // PDO bağlantısı
            $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname};sslmode=require";

            $this->conn = new PDO($dsn, $this->username, $this->password, [
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