<?php
$config = require __DIR__ . '/../config/config.php';
$baseUrl = $config['app']['base_url'] ?: '';
?>
<section>
  <h2>Bienvenido</h2>
  <p>Gestiona tus servicios, disponibilidad y citas en un solo lugar.</p>
  <p>
    <a class="button" href="<?= $baseUrl ?>/index.php?r=booking/new">Reservar una cita</a>
  </p>
</section>
