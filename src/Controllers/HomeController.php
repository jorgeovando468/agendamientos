<?php

declare(strict_types=1);

final class HomeController
{
    public function index(): void
    {
        $pageTitle = 'Agenda y Reservas';
        $contentView = __DIR__ . '/../../views/home.php';
        require __DIR__ . '/../../views/layout/main.php';
    }
}
