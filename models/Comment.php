<?php

class Comment {
    private $conn;
    private $table_name = "comments";

    public $id;
    public $content;
    public $post_id;
    public $user_id;
    public $author_name;
    public $author_email;
    public $status;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tüm yorumları getir
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Yeni yorum ekle
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                (content, post_id, user_id, author_name, author_email, status) 
                VALUES 
                (:content, :post_id, :user_id, :author_name, :author_email, :status)";

        $stmt = $this->conn->prepare($query);

        // Verileri temizle
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->author_name = htmlspecialchars(strip_tags($this->author_name));
        $this->author_email = htmlspecialchars(strip_tags($this->author_email));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Parametreleri bağla
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":post_id", $this->post_id);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":author_name", $this->author_name);
        $stmt->bindParam(":author_email", $this->author_email);
        $stmt->bindParam(":status", $this->status);

        return $stmt->execute();
    }

    // Yorum güncelle
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                SET 
                    content = :content,
                    status = :status
                WHERE 
                    id = :id";

        $stmt = $this->conn->prepare($query);

        // Parametreleri bağla
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Yorum sil
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Toplam yorum sayısını getir
    public function getCount() {
        try {
            $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['total'];
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return 0;
        }
    }

    // Yazıya ait yorumları getir
    public function getPostComments($post_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE post_id = :post_id AND status = 'approved' 
                ORDER BY created_at DESC";
                
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":post_id", $post_id);
        $stmt->execute();
        return $stmt;
    }
} 