<?php
session_start();
require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}

if (($_SESSION['role'] ?? '') !== 'admin') {
    header('Location: ../index.html');
    exit;
}

$totalUsers = (int) $pdo->query(
    "SELECT COUNT(*) FROM users WHERE role = 'user'"
)->fetchColumn();

$totalAdmins = (int) $pdo->query(
    "SELECT COUNT(*) FROM users WHERE role = 'admin'"
)->fetchColumn();

$users = $pdo->query(
    'SELECT id, name, email, role, created_at
     FROM users ORDER BY id DESC'
)->fetchAll();

function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin | SEKOLAHKU</title>
    <link rel="stylesheet" href="../css/auth.css">
</head>
<body>
    <header class="auth-header">
        <a class="brand" href="../index.html">
            <span class="brand-mark">S</span>
            SEKOLAH<span>KU</span>
        </a>

        <div class="admin-header-actions">
            <span class="admin-greeting">
                Halo, <?= e($_SESSION['name'] ?? 'Admin') ?>
            </span>
            <a class="back-link" href="../index.html">Lihat Website</a>
            <form action="../logout.php" method="POST">
                <button class="btn-logout" type="submit">Keluar</button>
            </form>
        </div>
    </header>

    <main class="admin-container">
        <span class="eyebrow">PANEL PENGELOLAAN</span>
        <h1>Dashboard Admin</h1>
        <p class="muted">
            Selamat datang di panel administrasi SEKOLAHKU.
        </p>

        <section class="stats-grid">
            <article class="stat-card">
                <span>Total Pengguna</span>
                <strong><?= $totalUsers ?></strong>
                <p>Akun pengguna terdaftar</p>
            </article>

            <article class="stat-card">
                <span>Total Admin</span>
                <strong><?= $totalAdmins ?></strong>
                <p>Akun dengan akses admin</p>
            </article>
        </section>

        <section class="table-card">
            <h2>Daftar Akun</h2>
            <p class="muted">Informasi akun yang terdaftar di SEKOLAHKU.</p>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Tanggal Daftar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (count($users) > 0): ?>
                            <?php foreach ($users as $index => $user): ?>
                                <tr>
                                    <td><?= $index + 1 ?></td>
                                    <td><?= e($user['name']) ?></td>
                                    <td><?= e($user['email']) ?></td>
                                    <td>
                                        <span class="role-badge">
                                            <?= e($user['role']) ?>
                                        </span>
                                    </td>
                                    <td><?= e($user['created_at']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="5">Belum ada akun terdaftar.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </section>
    </main>
</body>
</html>