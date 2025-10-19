<?php

declare(strict_types=1);

final class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $config = require __DIR__ . '/../config/config.php';
        $db = $config['db'];

        $dsn = sprintf(
            '%s:host=%s;port=%s;dbname=%s;charset=%s',
            $db['driver'],
            $db['host'],
            $db['port'],
            $db['database'],
            $db['charset']
        );

        // Initialize timezone for PHP side
        date_default_timezone_set((string)($config['app']['timezone'] ?? 'UTC'));

        self::$connection = new PDO($dsn, $db['username'], $db['password'], $db['options']);
        // Enforce collation where applicable
        self::$connection->exec('SET NAMES ' . $db['charset'] . ' COLLATE ' . $db['collation']);

        return self::$connection;
    }
}
