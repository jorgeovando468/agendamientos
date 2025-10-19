<?php
/** @var string $pageTitle */
/** @var string $contentView */
$config = require __DIR__ . '/../../config/config.php';
$baseUrl = $config['app']['base_url'] ?: '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><?= htmlspecialchars($pageTitle ?? 'App', ENT_QUOTES, 'UTF-8') ?></title>
  <link rel="stylesheet" href="<?= $baseUrl ?>/assets/css/app.css" />
</head>
<body>
  <header class="container">
    <h1>Agenda y Reservas</h1>
    <nav>
      <a href="<?= $baseUrl ?>/index.php?r=home">Inicio</a>
      <a href="<?= $baseUrl ?>/index.php?r=booking/new">Reservar</a>
    </nav>
  </header>
  <main class="container">
    <?php require $contentView; ?>
  </main>
  <footer class="container">
    <small>&copy; <?= date('Y') ?> Agenda App</small>
  </footer>
  <script src="<?= $baseUrl ?>/assets/js/app.js"></script>
</body>
</html>
