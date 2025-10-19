<?php

declare(strict_types=1);

final class BookingController
{
    public function new(): void
    {
        $pageTitle = 'Nueva Reserva';
        $contentView = __DIR__ . '/../../views/booking/new.php';
        require __DIR__ . '/../../views/layout/main.php';
    }

    // AJAX endpoint: get available slots for a given date and service
    public function slots(): void
    {
        header('Content-Type: application/json');
        $date = $_GET['date'] ?? '';
        $serviceId = (int)($_GET['service_id'] ?? 0);
        if (!$date || !$serviceId) {
            http_response_code(400);
            echo json_encode(['error' => 'Parámetros inválidos']);
            return;
        }

        // For now, return demo slots. Later we will compute using availability_rules and overrides.
        $demo = [
            '09:00', '09:30', '10:00', '10:30', '11:00',
            '15:00', '15:30', '16:00'
        ];
        echo json_encode(['slots' => $demo]);
    }

    public function create(): void
    {
        header('Content-Type: application/json');
        $input = json_decode(file_get_contents('php://input') ?: '[]', true);
        $serviceId = (int)($input['service_id'] ?? 0);
        $date = (string)($input['date'] ?? '');
        $slot = (string)($input['slot'] ?? '');
        $name = trim((string)($input['name'] ?? ''));
        $phone = trim((string)($input['phone'] ?? ''));

        if ($serviceId <= 0 || $date === '' || $slot === '' || $name === '' || $phone === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Datos incompletos']);
            return;
        }

        // For MVP assume single-owner business with user_id=1
        $userId = 1;

        $service = Service::findById($serviceId);
        if (!$service) {
            http_response_code(404);
            echo json_encode(['error' => 'Servicio no encontrado']);
            return;
        }

        $startsAt = $date . ' ' . $slot . ':00';
        $duration = (int)$service['duration_minutes'];
        $endsAt = date('Y-m-d H:i:s', strtotime($startsAt . ' +' . $duration . ' minutes'));

        if (Appointment::hasConflict($userId, $startsAt, $endsAt)) {
            http_response_code(409);
            echo json_encode(['error' => 'Horario no disponible']);
            return;
        }

        $client = Client::findOrCreate($userId, $name, null, $phone);
        $appointmentId = Appointment::create($userId, (int)$client['id'], $serviceId, $startsAt, $endsAt);

        echo json_encode(['status' => 'ok', 'message' => 'Reserva registrada', 'appointment_id' => $appointmentId]);
    }
}
