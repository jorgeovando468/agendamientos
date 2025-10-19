<?php

declare(strict_types=1);

final class Client
{
    public static function findByPhone(int $userId, string $phone): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM clients WHERE user_id = :user_id AND phone = :phone');
        $stmt->execute(['user_id' => $userId, 'phone' => $phone]);
        $row = $stmt->fetch();
        return $row !== false ? $row : null;
    }

    public static function create(int $userId, string $name, ?string $email, ?string $phone, ?string $notes = null): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('INSERT INTO clients (user_id, name, email, phone, notes) VALUES (:user_id, :name, :email, :phone, :notes)');
        $stmt->execute([
            'user_id' => $userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'notes' => $notes,
        ]);
        $id = (int) $pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM clients WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return (array) $stmt->fetch();
    }

    public static function findOrCreate(int $userId, string $name, ?string $email, string $phone): array
    {
        $existing = self::findByPhone($userId, $phone);
        if ($existing) {
            return $existing;
        }
        return self::create($userId, $name, $email, $phone);
    }
}
