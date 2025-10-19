<?php

declare(strict_types=1);

require __DIR__ . '/../src/bootstrap.php';

$pdo = Database::getConnection();
$schemaPath = __DIR__ . '/schema.sql';

if (!is_file($schemaPath)) {
    fwrite(STDERR, "No se encontró schema.sql\n");
    exit(1);
}

$sql = file_get_contents($schemaPath);
if ($sql === false) {
    fwrite(STDERR, "No se pudo leer schema.sql\n");
    exit(1);
}

try {
    $pdo->beginTransaction();
    $pdo->exec($sql);
    $pdo->commit();
    echo "Esquema creado/actualizado correctamente.\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "Error al aplicar el esquema: " . $e->getMessage() . "\n");
    exit(1);
}
