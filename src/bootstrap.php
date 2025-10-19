<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Simple autoloader for classes inside src/
spl_autoload_register(static function (string $className): void {
    $baseDir = __DIR__;
    $paths = [
        $baseDir . '/' . $className . '.php',
        $baseDir . '/Controllers/' . $className . '.php',
        $baseDir . '/Models/' . $className . '.php',
    ];
    foreach ($paths as $filePath) {
        if (is_file($filePath)) {
            require_once $filePath;
            return;
        }
    }
});

// Ensure timezone from config is applied early
$config = require __DIR__ . '/../config/config.php';
if (!empty($config['app']['timezone'])) {
    date_default_timezone_set((string) $config['app']['timezone']);
}
