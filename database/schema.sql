-- Booking Platform Database Schema
-- Engine: MySQL 8+
-- Charset: utf8mb4

-- Users/Providers table (single-user small biz can be provider too)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('owner','staff','client') NOT NULL DEFAULT 'owner',
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  locale VARCHAR(10) NOT NULL DEFAULT 'es',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services offered for booking
CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  duration_minutes INT NOT NULL,
  price_cents INT NULL,
  currency CHAR(3) DEFAULT 'USD',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Client records
CREATE TABLE IF NOT EXISTS clients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(30) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_phone (user_id, phone),
  CONSTRAINT fk_clients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Availability windows (weekly recurring)
CREATE TABLE IF NOT EXISTS availability_rules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  weekday TINYINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  interval_minutes INT NOT NULL DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_availability_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Specific exceptions (closures or extra openings)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '00:00:00',
  end_time TIME NOT NULL DEFAULT '23:59:59',
  is_closed TINYINT(1) NOT NULL DEFAULT 0,
  note VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_overrides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_override (user_id, date, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  client_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  status ENUM('pending','confirmed','cancelled','completed','no_show') NOT NULL DEFAULT 'pending',
  location VARCHAR(255) NULL,
  notes TEXT NULL,
  created_by ENUM('client','staff','system') NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
  INDEX idx_user_starts_at (user_id, starts_at),
  INDEX idx_client_starts_at (client_id, starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reminders (WhatsApp or SMS/email fallbacks)
CREATE TABLE IF NOT EXISTS reminders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  appointment_id BIGINT UNSIGNED NOT NULL,
  channel ENUM('whatsapp','sms','email') NOT NULL DEFAULT 'whatsapp',
  send_at DATETIME NOT NULL,
  delivered_at DATETIME NULL,
  status ENUM('scheduled','sent','failed','cancelled') NOT NULL DEFAULT 'scheduled',
  provider_message_id VARCHAR(191) NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reminder_appt FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  INDEX idx_send_at (send_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Simple API tokens (for webhooks/integrations)
CREATE TABLE IF NOT EXISTS api_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token VARCHAR(191) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME NULL,
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
