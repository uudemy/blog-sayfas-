<?php
class Category {
    private $conn;
    private $table_name = "categories";

    public $id;
    public $name;
    public $slug;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            if ($stmt->errorCode() !== '00000') {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            return $stmt;
        } catch(Exception $e) {
            error_log("Kategori okuma hatası: " . $e->getMessage());
            throw $e;
        }
    }

    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . " (name, slug) VALUES (:name, :slug)";
            $stmt = $this->conn->prepare($query);

            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->slug = htmlspecialchars(strip_tags($this->slug));

            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":slug", $this->slug);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            return true;
        } catch(Exception $e) {
            error_log("Kategori oluşturma hatası: " . $e->getMessage());
            throw $e;
        }
    }

    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . " SET name = :name, slug = :slug WHERE id = :id";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":slug", $this->slug);
            $stmt->bindParam(":id", $this->id);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            return true;
        } catch(Exception $e) {
            error_log("Kategori güncelleme hatası: " . $e->getMessage());
            throw $e;
        }
    }

    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $this->id);

            if (!$stmt->execute()) {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            return true;
        } catch(Exception $e) {
            error_log("Kategori silme hatası: " . $e->getMessage());
            throw $e;
        }
    }

    public function readOne() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":id", $this->id);
            $stmt->execute();
            
            if ($stmt->errorCode() !== '00000') {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(Exception $e) {
            error_log("Kategori okuma hatası: " . $e->getMessage());
            throw $e;
        }
    }

    // Toplam kategori sayısını getir
    public function getCount() {
        try {
            $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            if ($stmt->errorCode() !== '00000') {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("SQL Hatası: " . $errorInfo[2]);
            }
            
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['total'];
        } catch(Exception $e) {
            error_log("Kategori sayısı okuma hatası: " . $e->getMessage());
            throw $e;
        }
    }
}
?>