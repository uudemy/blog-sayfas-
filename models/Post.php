<?php
class Post {
    private $conn;
    private $table_name = "posts";

    public $id;
    public $title;
    public $slug;
    public $content;
    public $image_url;
    public $status;
    public $user_id;
    public $category_id;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Tüm yazıları getir
    public function read() {
        try {
            $query = "SELECT 
                        p.id, p.title, p.slug, p.content, p.image_url, 
                        p.status, p.created_at, p.updated_at,
                        c.name as category_name, u.username as author
                    FROM 
                        " . $this->table_name . " p
                        LEFT JOIN categories c ON p.category_id = c.id
                        LEFT JOIN users u ON p.user_id = u.id
                    ORDER BY 
                        p.created_at DESC";

            $stmt = $this->conn->prepare($query);
            
            if(!$stmt) {
                throw new Exception("Sorgu hazırlanamadı");
            }
            
            if(!$stmt->execute()) {
                throw new Exception("Sorgu çalıştırılamadı");
            }
            
            return $stmt;
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return false;
        }
    }

    // Yeni yazı ekle
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (title, slug, content, image_url, status, user_id, category_id)
                VALUES
                (:title, :slug, :content, :image_url, :status, :user_id, :category_id)
                RETURNING id";

        $stmt = $this->conn->prepare($query);

        // Verileri temizle
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Parametreleri bağla
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":category_id", $this->category_id);

        if($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['id'];
        }
        return false;
    }

    // Yazı güncelle
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET 
                    title = :title,
                    slug = :slug,
                    content = :content,
                    image_url = :image_url,
                    status = :status,
                    category_id = :category_id,
                    updated_at = CURRENT_TIMESTAMP
                WHERE 
                    id = :id";

        $stmt = $this->conn->prepare($query);

        // Parametreleri bağla
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Yazı sil
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Tek bir yazıyı getir
    public function readOne() {
        $query = "SELECT 
                    p.id, p.title, p.content, p.status, 
                    p.category_id, c.name as category_name,
                    p.created_at
                FROM 
                    " . $this->table_name . " p
                    LEFT JOIN categories c ON p.category_id = c.id
                WHERE 
                    p.id = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->title = $row['title'];
            $this->content = $row['content'];
            $this->status = $row['status'];
            $this->category_id = $row['category_id'];
            $this->category_name = $row['category_name'];
            $this->created_at = $row['created_at'];
        }
    }

    // Slug'a göre yazı getir
    public function readBySlug() {
        try {
            $query = "SELECT 
                        p.id, p.title, p.slug, p.content, p.image_url, 
                        p.status, p.created_at, p.updated_at,
                        c.name as category_name, u.username as author
                    FROM 
                        " . $this->table_name . " p
                        LEFT JOIN categories c ON p.category_id = c.id
                        LEFT JOIN users u ON p.user_id = u.id
                    WHERE 
                        p.slug = :slug
                    LIMIT 1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":slug", $this->slug);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return false;
        }
    }

    // Toplam yazı sayısını getir
    public function getCount() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }

    // Toplam görüntülenme sayısını getir
    public function getTotalViews() {
        $query = "SELECT SUM(view_count) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'] ?? 0;
    }

    // Öne çıkan yazıyı getir
    public function getFeatured() {
        try {
            $query = "SELECT 
                        p.*, c.name as category_name,
                        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
                    FROM 
                        " . $this->table_name . " p
                        LEFT JOIN categories c ON p.category_id = c.id
                    WHERE 
                        p.is_featured = 1
                    LIMIT 1";

            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return false;
        }
    }

    // Yazıları ara
    public function search() {
        try {
            $query = "SELECT 
                        p.id, p.title, p.excerpt, p.created_at,
                        c.name as category_name
                    FROM 
                        " . $this->table_name . " p
                        LEFT JOIN categories c ON p.category_id = c.id
                    WHERE 
                        p.title LIKE :term OR
                        p.content LIKE :term OR
                        p.excerpt LIKE :term
                    ORDER BY 
                        p.created_at DESC
                    LIMIT 10";

            $term = "%" . $this->search_term . "%";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":term", $term);
            $stmt->execute();
            
            return $stmt;
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return false;
        }
    }

    // Görüntülenme sayısını artır
    public function incrementViews($ip_address, $user_agent) {
        try {
            // Son 24 saatte aynı IP'den görüntüleme var mı kontrol et
            $check_query = "SELECT id FROM post_views 
                           WHERE post_id = :post_id 
                           AND ip_address = :ip_address 
                           AND viewed_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)";
            
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(":post_id", $this->id);
            $check_stmt->bindParam(":ip_address", $ip_address);
            $check_stmt->execute();
            
            if($check_stmt->rowCount() == 0) {
                // Görüntülenme ekle
                $view_query = "INSERT INTO post_views 
                              (post_id, ip_address, user_agent) 
                              VALUES (:post_id, :ip_address, :user_agent)";
                
                $view_stmt = $this->conn->prepare($view_query);
                $view_stmt->bindParam(":post_id", $this->id);
                $view_stmt->bindParam(":ip_address", $ip_address);
                $view_stmt->bindParam(":user_agent", $user_agent);
                $view_stmt->execute();
                
                // Post görüntülenme sayısını güncelle
                $update_query = "UPDATE " . $this->table_name . " 
                               SET view_count = view_count + 1 
                               WHERE id = :id";
                
                $update_stmt = $this->conn->prepare($update_query);
                $update_stmt->bindParam(":id", $this->id);
                return $update_stmt->execute();
            }
            
            return true;
        } catch(PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return false;
        }
    }
}
?> 