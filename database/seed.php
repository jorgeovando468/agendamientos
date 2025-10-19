<?php

declare(strict_types=1);

require __DIR__ . '/../src/bootstrap.php';

$pdo = Database::getConnection();

try {
    $pdo->beginTransaction();

    // Ensure owner user exists
    $email = 'owner@example.com';
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $userId = (int) ($stmt->fetchColumn() ?: 0);
    if ($userId === 0) {
        $passwordHash = password_hash('secret123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO users (name, email, phone, password_hash, role, timezone, locale) VALUES (:name, :email, :phone, :password_hash, :role, :tz, :locale)');
        $stmt->execute([
            'name' => 'Propietario',
            'email' => $email,
            'phone' => '+000000000',
            'password_hash' => $passwordHash,
            'role' => 'owner',
            'tz' => 'Europe/Madrid',
            'locale' => 'es',
        ]);
        $userId = (int) $pdo->lastInsertId();
    }

    // Seed services
    $services = [
        ['Consulta inicial', 30, null, 'EUR'],
        ['Sesión estándar', 60, null, 'EUR'],
    ];
    $selectService = $pdo->prepare('SELECT id FROM services WHERE user_id = :user_id AND name = :name');
    $insertService = $pdo->prepare('INSERT INTO services (user_id, name, description, duration_minutes, price_cents, currency, active) VALUES (:user_id, :name, :description, :duration, :price, :currency, 1)');

    foreach ($services as [$name, $duration, $price, $currency]) {
        $selectService->execute(['user_id' => $userId, 'name' => $name]);
        $existingId = $selectService->fetchColumn();
        if (!$existingId) {
            $insertService->execute([
                'user_id' => $userId,
                'name' => $name,
                'description' => null,
                'duration' => $duration,
                'price' => $price,
                'currency' => $currency,
            ]);
        }
    }

    // Seed availability rules (Mon-Fri 09:00-13:00 and 15:00-18:00)
    $selectRule = $pdo->prepare('SELECT id FROM availability_rules WHERE user_id = :user_id AND weekday = :weekday AND start_time = :start_time AND end_time = :end_time');
    $insertRule = $pdo->prepare('INSERT INTO availability_rules (user_id, weekday, start_time, end_time, interval_minutes) VALUES (:user_id, :weekday, :start_time, :end_time, :interval)');
    $ranges = [
        ['09:00:00', '13:00:00'],
        ['15:00:00', '18:00:00'],
    ];
    for ($weekday = 1; $weekday <= 5; $weekday++) { // 1=Mon .. 5=Fri
        foreach ($ranges as [$start, $end]) {
            $selectRule->execute([
                'user_id' => $userId,
                'weekday' => $weekday,
                'start_time' => $start,
                'end_time' => $end,
            ]);
            $exists = $selectRule->fetchColumn();
            if (!$exists) {
                $insertRule->execute([
                    'user_id' => $userId,
                    'weekday' => $weekday,
                    'start_time' => $start,
                    'end_time' => $end,
                    'interval' => 30,
                ]);
            }
        }
    }

    $pdo->commit();
    echo "Seed de datos completado. Usuario: $email / contraseña: secret123\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, 'Error en seed: ' . $e->getMessage() . "\n");
    exit(1);
}
