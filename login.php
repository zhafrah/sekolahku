<?php
session_start();
require_once __DIR__ . '/config/database.php';


if (isset($_SESSION['user_id'])) {
    $_SESSION = [];
    session_destroy();
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = 'Email dan password wajib diisi.';
    } else {
        $stmt = $pdo->prepare(
            'SELECT id, name, email, password, role
             FROM users
             WHERE email = ?
             LIMIT 1'
        );

        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_regenerate_id(true);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];

            if ($user['role'] === 'admin') {
                header('Location: admin/index.php');
            } else {
                header('Location: indeks.html');
            }
            exit;
        }

        $error = 'Email atau password tidak sesuai.';
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | SEKOLAHKU</title>
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
    <header class="auth-header">
        <a class="brand" href="indeks.html">
            <span class="brand-mark">S</span>
            SEKOLAH<span>KU</span>
        </a>

        <a class="back-link" href="indeks.html">
            ← Kembali ke Beranda
        </a>
    </header>

    <main class="auth-layout">
        <section class="auth-intro">
            <span class="eyebrow">SELAMAT DATANG KEMBALI</span>
            <h1>Temukan sekolah yang tepat untuk masa depanmu.</h1>
            <p>
                Masuk ke akun SEKOLAHKU untuk melanjutkan perjalanan
                mencari informasi SMA dan SMK.
            </p>
        </section>

        <section class="auth-card">
            <h2>Masuk ke Akun</h2>
            <p class="muted">Masukkan data akun yang sudah terdaftar.</p>

            <?php if ($error !== ''): ?>
                <div class="alert" role="alert">
                    <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="login.php">
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
                    placeholder="Masukkan password"
                    autocomplete="current-password"
                    required
                >

                <button type="submit" class="btn-primary">Masuk</button>
            </form>

            <p class="auth-switch">
                Belum punya akun?
                <a href="daftar.php">Daftar sekarang</a>
            </p>
        </section>
    </main>

    <footer class="auth-footer">
        &copy; <?= date('Y') ?> SEKOLAHKU.
        Informasi sekolah untuk masa depanmu.
    </footer>
</body>
</html>
