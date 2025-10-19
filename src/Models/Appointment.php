<?php

declare(strict_types=1);

final class Appointment
{
    public static function hasConflict(int $userId, string $startsAt, string $endsAt): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            "SELECT COUNT(*) AS c FROM appointments WHERE user_id = :user_id AND status IN ('pending','confirmed') AND (starts_at < :ends_at) AND (ends_at > :starts_at)"
        );
        $stmt->execute([
            'user_id' => $userId,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
        ]);
        $count = (int) $stmt->fetchColumn();
        return $count > 0;
    }

    public static function create(int $userId, int $clientId, int $serviceId, string $startsAt, string $endsAt, ?string $notes = null): int
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO appointments (user_id, client_id, service_id, starts_at, ends_at, status, notes, created_by) VALUES (:user_id, :client_id, :service_id, :starts_at, :ends_at, :status, :notes, :created_by)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'client_id' => $clientId,
            'service_id' => $serviceId,
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'status' => 'pending',
            'notes' => $notes,
            'created_by' => 'client',
        ]);
        return (int) $pdo->lastInsertId();
    }
}
