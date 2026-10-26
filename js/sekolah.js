document.addEventListener("DOMContentLoaded", function () {
    const $ = id => document.getElementById(id);

    const grid = $("schoolGrid");
    const search = $("searchInput");
    const province = $("provinceFilter");
    const level = $("levelFilter");
    const status = $("statusFilter");

    let favoritesOnly = false;

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

    // Mengisi pilihan provinsi secara otomatis
    [...new Set(schoolData.map(s => s.province))]
        .sort()
        .forEach(function (namaProvinsi) {
            const option = document.createElement("option");
            option.value = namaProvinsi;
            option.textContent = namaProvinsi;
            province.appendChild(option);
        });

    $("provinceCount").textContent =
        new Set(schoolData.map(s => s.province)).size;

    // Membuat kartu sekolah
    function createCard(school) {
        const saved = favorites.has(school.id);

        return `
            <article class="school-card">
                <div class="school-photo">
                    <img
                        src="${escapeHTML(school.image)}"
                        alt="Foto ilustrasi ${escapeHTML(school.name)}"
                        loading="lazy"
                    >

                    <span class="level-pill">
                        ${escapeHTML(school.level)}
                    </span>

                    <button
                        class="favorite ${saved ? "saved" : ""}"
                        data-fav="${school.id}"
                        aria-label="Simpan sekolah ke favorit"
                    >
                        ${saved ? "♥" : "♡"}
                    </button>
                </div>

                <div class="card-body">
                    <h3>${escapeHTML(school.name)}</h3>

                    <p class="location">
                        ⌖ ${escapeHTML(school.city)}
                        · ${escapeHTML(school.province)}
                    </p>

                    <div class="tags">
                        <span class="tag ${
                            school.status === "Negeri"
                                ? "green"
                                : "purple"
                        }">
                            ${escapeHTML(school.status)}
                        </span>

                        <span class="tag ${
                            school.accreditation === "A"
                                ? "green"
                                : "blue"
                        }">
                            Akreditasi ${escapeHTML(school.accreditation)}
                        </span>
                    </div>

                    <div class="rating">
                        <span>★</span>
                        <b>${school.rating.toFixed(1)}</b>
                        <small>(${school.reviews} ulasan contoh)</small>
                    </div>

                    <div class="facilities">
                        ${school.facilities
                            .slice(0, 2)
                            .map(f => `<span>✓ ${escapeHTML(f)}</span>`)
                            .join("")}
                    </div>

                    <a
                        class="detail-link"
                        href="detail-sekolah.html?id=${school.id}"
                    >
                        Lihat Detail →
                    </a>
                </div>
            </article>
        `;
    }

    // Menampilkan sekolah berdasarkan filter
    function renderSchools() {
        const keyword = search.value.trim().toLowerCase();

        const filtered = schoolData.filter(function (school) {
            const searchable = [
                school.name,
                school.city,
                school.province,
                school.level,
                school.status
            ].join(" ").toLowerCase();

            return (
                searchable.includes(keyword) &&
                (!province.value || school.province === province.value) &&
                (!level.value || school.level === level.value) &&
                (!status.value || school.status === status.value) &&
                (!favoritesOnly || favorites.has(school.id))
            );
        });

        grid.innerHTML = filtered.map(createCard).join("");

        $("schoolCount").textContent = filtered.length;

        $("resultText").textContent =
            `Menampilkan ${filtered.length} dari ${schoolData.length} sekolah contoh`;

        $("emptyState").hidden = filtered.length > 0;
    }

    // Menghapus semua filter
    function resetFilters() {
        search.value = "";
        province.value = "";
        level.value = "";
        status.value = "";

        favoritesOnly = false;

        $("allBtn").classList.add("active");
        $("favBtn").classList.remove("active");

        renderSchools();
    }

    search.addEventListener("input", renderSchools);

    province.addEventListener("change", renderSchools);
    level.addEventListener("change", renderSchools);
    status.addEventListener("change", renderSchools);

    $("searchButton").addEventListener("click", renderSchools);
    $("resetBtn").addEventListener("click", resetFilters);
    $("emptyReset").addEventListener("click", resetFilters);

    $("allBtn").addEventListener("click", function () {
        favoritesOnly = false;

        $("allBtn").classList.add("active");
        $("favBtn").classList.remove("active");

        renderSchools();
    });

    $("favBtn").addEventListener("click", function () {
        favoritesOnly = true;

        $("favBtn").classList.add("active");
        $("allBtn").classList.remove("active");

        renderSchools();
    });

    // Menyimpan atau menghapus favorit
    grid.addEventListener("click", function (event) {
        const button = event.target.closest("[data-fav]");

        if (!button) return;

        const id = Number(button.dataset.fav);

        if (favorites.has(id)) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }

        localStorage.setItem(
            "sekolahkuFavorites",
            JSON.stringify([...favorites])
        );

        renderSchools();
    });

    // Menu navigasi untuk layar HP
    const menuToggle = $("menuToggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            $("nav").classList.toggle("open");
        });
    }

    renderSchools();
});