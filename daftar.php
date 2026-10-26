<?php
session_start();
require_once __DIR__ . '/config/database.php';

if (isset($_SESSION['user_id'])) {
    header('Location: ' . ($_SESSION['role'] === 'admin'
        ? 'admin/index.php'
        : 'index.html'));
    exit;
}

$error = '';
$name = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if ($name === '' || $email === '' || $password === '') {
        $error = 'Semua kolom wajib diisi.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Format email tidak valid.';
    } elseif (strlen($password) < 8) {
        $error = 'Password minimal 8 karakter.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Konfirmasi password tidak sama.';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);

        if ($stmt->fetch()) {
            $error = 'Email sudah terdaftar. Silakan gunakan email lain.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare(
                'INSERT INTO users (name, email, password, role)
                 VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([$name, $email, $hashedPassword, 'user']);

            header('Location: login.php?registered=1');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Akun | SEKOLAHKU</title>
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
    <header class="auth-header">
        <a class="brand" href="index.html">
            <span class="brand-mark">S</span>
            SEKOLAH<span>KU</span>
        </a>
        <a class="back-link" href="index.html">← Kembali ke Beranda</a>
    </header>

    <main class="auth-layout">
        <section class="auth-intro">
            <span class="eyebrow">MULAI PERJALANANMU</span>
            <h1>Satu akun untuk langkah menuju sekolah impian.</h1>
            <p>Buat akun SEKOLAHKU agar kamu dapat mulai menjelajahi informasi sekolah.</p>
        </section>

        <section class="auth-card">
            <h2>Buat Akun Baru</h2>
            <p class="muted">Isi formulir berikut untuk mendaftar.</p>

            <?php if ($error !== ''): ?>
                <div class="alert" role="alert">
                    <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="daftar.php">
                <label for="name">Nama lengkap</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value="<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>"
                    placeholder="Masukkan nama lengkap"
                    autocomplete="name"
                    required
                >

                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>"
                    placeholder="nama@email.com"
                    autocomplete="email"
                    required
                >

                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Minimal 8 karakter"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >

                <label for="confirm_password">Konfirmasi password</label>
                <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Ulangi password"
                    minlength="8"
                    autocomplete="new-password"
                    required
                >

                <button type="submit" class="btn-primary">Daftar Sekarang</button>
            </form>

            <p class="auth-switch">
                Sudah punya akun?
                <a href="login.php">Masuk di sini</a>
            </p>
        </section>
    </main>

    <footer class="auth-footer">
        &copy; <?= date('Y') ?> SEKOLAHKU. Informasi sekolah untuk masa depanmu.
    </footer>
</body>
</html>