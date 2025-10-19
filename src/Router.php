<?php

declare(strict_types=1);

final class Router
{
    public static function dispatch(): void
    {
        $route = isset($_GET['r']) ? trim((string)$_GET['r'], '/') : '';
        if ($route === '' || $route === 'home') {
            require __DIR__ . '/Controllers/HomeController.php';
            (new HomeController())->index();
            return;
        }

        if ($route === 'booking/new') {
            require __DIR__ . '/Controllers/BookingController.php';
            (new BookingController())->new();
            return;
        }

        if ($route === 'booking/slots') {
            require __DIR__ . '/Controllers/BookingController.php';
            (new BookingController())->slots();
            return;
        }

        if ($route === 'booking/create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            require __DIR__ . '/Controllers/BookingController.php';
            (new BookingController())->create();
            return;
        }

        http_response_code(404);
        echo '404 - Página no encontrada';
    }
}
