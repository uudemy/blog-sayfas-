<?php
class EnvironmentManager {
    private $envFile;
    private $requiredVars = [
        'DB_HOST', 
        'DB_PORT', 
        'DB_NAME', 
        'DB_USER', 
        'DB_PASSWORD',
        'SUPABASE_URL', 
        'SUPABASE_KEY'
    ];

    public function __construct($envFile = '.env') {
        $this->envFile = $envFile;
    }

    public function validateEnvironment() {
        $missingVars = [];
        
        foreach ($this->requiredVars as $var) {
            if (empty(getenv($var))) {
                $missingVars[] = $var;
            }
        }

        if (!empty($missingVars)) {
            throw new Exception("Eksik ortam değişkenleri: " . implode(', ', $missingVars));
        }

        return true;
    }

    public function generateSecureEnv() {
        $envContent = "";
        foreach ($this->requiredVars as $var) {
            $value = getenv($var);
            if ($value) {
                $envContent .= "{$var}=" . escapeshellarg($value) . "\n";
            }
        }

        file_put_contents($this->envFile, $envContent);
        chmod($this->envFile, 0600); // Dosya izinlerini güvenli yap
    }

    public function logSecurityEvent($message) {
        $logFile = 'security.log';
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "[{$timestamp}] {$message}\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
}

try {
    $envManager = new EnvironmentManager();
    $envManager->validateEnvironment();
    $envManager->generateSecureEnv();
    $envManager->logSecurityEvent("Ortam değişkenleri başarıyla güncellendi.");
} catch (Exception $e) {
    error_log($e->getMessage());
    exit(1);
}
