document.addEventListener("DOMContentLoaded", function () {
    const $ = id => document.getElementById(id);

    const params = new URLSearchParams(window.location.search);
    const schoolId = Number(params.get("id"));

    const school = schoolData.find(s => s.id === schoolId)
        || schoolData[0];

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    let favorites;

    try {
        favorites = new Set(
            JSON.parse(
                localStorage.getItem("sekolahkuFavorites") || "[]"
            ).map(Number)
        );
    } catch {
        favorites = new Set();
    }

    function renderDetail() {
        const saved = favorites.has(school.id);

        $("detailContent").innerHTML = `
            <div class="detail-toolbar">
                <a href="sekolah.html">← Kembali ke Direktori</a>
                <span>KODE SEKOLAH · ${String(school.id).padStart(3, "0")}</span>
            </div>

            <section class="detail-hero">
                <img
                    src="${escapeHTML(school.image)}"
                    alt="Foto ilustrasi ${escapeHTML(school.name)}"
                >

                <div class="detail-summary">
                    <div class="tags">
                        <span class="tag ${
                            school.status === "Negeri" ? "green" : "purple"
                        }">${escapeHTML(school.status)}</span>

                        <span class="tag blue">
                            ${escapeHTML(school.level)}
                        </span>

                        <span class="tag green">
                            Akreditasi ${escapeHTML(school.accreditation)}
                        </span>
                    </div>

                    <h1>${escapeHTML(school.name)}</h1>

                    <p class="location">
                        ⌖ ${escapeHTML(school.address)}
                    </p>

                    <div class="rating">
                        <span>★</span>
                        <b>${school.rating.toFixed(1)}</b>
                        <small>(${school.reviews} ulasan contoh)</small>
                    </div>

                    <div class="detail-buttons">
                        <button class="btn primary" id="favDetail">
                            ${saved ? "♥ Tersimpan" : "♡ Simpan Favorit"}
                        </button>

                        <a
                            class="outline-btn"
                            href="peta.html?school=${school.id}"
                        >
                            Lihat di Peta ↗
                        </a>
                    </div>
                </div>
            </section>

            <div class="info-grid">
                <section class="info-panel">
                    <span class="section-label">PROFIL SEKOLAH</span>
                    <h2>Tentang Sekolah</h2>

                    <p>${escapeHTML(school.description)}</p>

                    <div class="info-rows">
                        <div>
                            <span>Jenjang</span>
                            <b>${escapeHTML(school.level)}</b>
                        </div>

                        <div>
                            <span>Status</span>
                            <b>${escapeHTML(school.status)}</b>
                        </div>

                        <div>
                            <span>Akreditasi</span>
                            <b>${escapeHTML(school.accreditation)}</b>
                        </div>

                        <div>
                            <span>Lokasi</span>
                            <b>
                                ${escapeHTML(school.city)},
                                ${escapeHTML(school.province)}
                            </b>
                        </div>
                    </div>
                </section>

                <section class="info-panel">
                    <span class="section-label">FASILITAS</span>
                    <h2>Fasilitas Sekolah</h2>

                    <p>
                        Informasi fasilitas berikut merupakan data contoh
                        yang perlu disesuaikan dengan sumber resmi sekolah.
                    </p>

                    <div class="facility-list">
                        ${school.facilities.map(f => `
                            <span>
                                <b>✓</b>
                                ${escapeHTML(f)}
                            </span>
                        `).join("")}
                    </div>

                    <div class="notice">
                        ⓘ Data pada halaman ini merupakan contoh prototipe.
                    </div>
                </section>
            </div>
        `;

        $("favDetail").addEventListener("click", function () {
            if (favorites.has(school.id)) {
                favorites.delete(school.id);
            } else {
                favorites.add(school.id);
            }

            localStorage.setItem(
                "sekolahkuFavorites",
                JSON.stringify([...favorites])
            );

            renderDetail();
        });
    }

    // Rekomendasi sekolah lainnya
    $("relatedGrid").innerHTML = schoolData
        .filter(s => s.id !== school.id)
        .slice(0, 4)
        .map(s => `
            <article class="school-card">
                <div class="school-photo">
                    <img
                        src="${escapeHTML(s.image)}"
                        alt="Foto ilustrasi ${escapeHTML(s.name)}"
                        loading="lazy"
                    >

                    <span class="level-pill">
                        ${escapeHTML(s.level)}
                    </span>
                </div>

                <div class="card-body">
                    <h3>${escapeHTML(s.name)}</h3>

                    <p class="location">
                        ⌖ ${escapeHTML(s.city)}
                    </p>

                    <div class="tags">
                        <span class="tag ${
                            s.status === "Negeri" ? "green" : "purple"
                        }">
                            ${escapeHTML(s.status)}
                        </span>

                        <span class="tag blue">
                            Akreditasi ${escapeHTML(s.accreditation)}
                        </span>
                    </div>

                    <a
                        class="detail-link"
                        href="detail-sekolah.html?id=${s.id}"
                    >
                        Lihat Detail →
                    </a>
                </div>
            </article>
        `).join("");

    const menuToggle = $("menuToggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            $("nav").classList.toggle("open");
        });
    }

    renderDetail();
});