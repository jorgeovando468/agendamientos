<?php
$config = require __DIR__ . '/../../config/config.php';
$baseUrl = $config['app']['base_url'] ?: '';
?>
<section class="card">
  <h2>Nueva Reserva</h2>
  <form id="booking-form" class="form">
    <div class="row">
      <div>
        <label for="service_id">Servicio</label>
        <select id="service_id" name="service_id" required>
          <option value="1">Consulta inicial (30 min)</option>
          <option value="2">Sesión estándar (60 min)</option>
        </select>
      </div>
      <div>
        <label for="date">Fecha</label>
        <input type="date" id="date" name="date" required />
      </div>
    </div>
    <div class="row">
      <div>
        <label for="name">Tu nombre</label>
        <input type="text" id="name" name="name" placeholder="Nombre y apellido" required />
      </div>
      <div>
        <label for="phone">WhatsApp</label>
        <input type="tel" id="phone" name="phone" placeholder="Ej: +34 600 000 000" required />
      </div>
    </div>
    <div>
      <label for="slot">Horario disponible</label>
      <select id="slot" name="slot" required>
        <option value="">Selecciona fecha y servicio…</option>
      </select>
    </div>
    <div style="margin-top:12px;">
      <button class="button" type="submit">Reservar</button>
    </div>
  </form>
</section>
<script>
const form = document.getElementById('booking-form');
const dateEl = document.getElementById('date');
const serviceEl = document.getElementById('service_id');
const slotEl = document.getElementById('slot');

async function fetchSlots() {
  const date = dateEl.value;
  const serviceId = serviceEl.value;
  if (!date || !serviceId) return;
  slotEl.innerHTML = '<option>Cargando…</option>';
  const url = '<?= $baseUrl ?>/index.php?r=booking/slots&date=' + encodeURIComponent(date) + '&service_id=' + encodeURIComponent(serviceId);
  const res = await fetch(url);
  const data = await res.json();
  slotEl.innerHTML = '';
  if (!data.slots || data.slots.length === 0) {
    slotEl.innerHTML = '<option>Sin disponibilidad</option>';
    return;
  }
  for (const s of data.slots) {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    slotEl.appendChild(opt);
  }
}

dateEl.addEventListener('change', fetchSlots);
serviceEl.addEventListener('change', fetchSlots);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    service_id: serviceEl.value,
    date: dateEl.value,
    slot: slotEl.value,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
  };
  const res = await fetch('<?= $baseUrl ?>/index.php?r=booking/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  alert(data.message || 'Hecho');
});
</script>
