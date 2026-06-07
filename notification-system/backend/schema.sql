CREATE DATABASE IF NOT EXISTS notification_db;
USE notification_db;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification ON notifications(student_id, is_read, created_at);

INSERT INTO students (id, name, email)
VALUES (1, 'Rohit R', 'rohit66523@gmail.com')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

INSERT INTO notifications(student_id, title, notification_type, message)
VALUES
(1, 'Placement Drive', 'Placement', 'New placement drive is open now.'),
(1, 'Result Published', 'Result', 'Your result has been published.'),
(1, 'Campus Event', 'Event', 'Join the campus event this week.');