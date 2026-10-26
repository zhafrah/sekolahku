document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("schoolMap").setView([-7.1, 110.2], 6);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    const markers = new Map();

    // Membuat penanda lokasi sekolah
    schoolData.forEach(function (school) {
        const marker = L.marker([
            school.lat,
            school.lng
        ]).addTo(map);

        marker.bindPopup(`
            <b>${school.name}</b><br>
            ${school.level} · ${school.status}<br>
            ${school.city}<br>
            <a href="detail-sekolah.html?id=${school.id}">
                Lihat Detail →
            </a>
        `);

        markers.set(school.id, marker);
    });

    const $ = id => document.getElementById(id);

    // Menampilkan daftar sekolah di sebelah peta
    function renderMapList() {
        const keyword = $("mapSearch").value.trim().toLowerCase();
        const level = $("mapLevel").value;

        const filtered = schoolData.filter(function (school) {
            const searchable = [
                school.name,
                school.city,
                school.province
            ].join(" ").toLowerCase();

            return (
                searchable.includes(keyword) &&
                (!level || school.level === level)
            );
        });

        $("mapSchoolList").innerHTML = filtered.map(school => `
            <button
                class="map-school-item"
                data-id="${school.id}"
            >
                <span class="map-list-pin">⌖</span>

                <span>
                    <b>${school.name}</b>
                    <small>
                        ${school.level} · ${school.city}
                    </small>
                    <em>
                        Akreditasi ${school.accreditation}
                    </em>
                </span>

                <span class="arrow">›</span>
            </button>
        `).join("");

        if (filtered.length === 0) {
            $("mapSchoolList").innerHTML =
                '<p class="muted">Sekolah tidak ditemukan.</p>';
        }
    }

    $("mapSearch").addEventListener("input", renderMapList);
    $("mapLevel").addEventListener("change", renderMapList);

    // Klik daftar sekolah untuk mengarahkan peta
    $("mapSchoolList").addEventListener("click", function (event) {
        const button = event.target.closest("[data-id]");

        if (!button) return;

        const id = Number(button.dataset.id);
        const school = schoolData.find(s => s.id === id);

        if (!school) return;

        map.setView(
            [school.lat, school.lng],
            13
        );

        markers.get(school.id).openPopup();
    });

    // Jika peta dibuka dari halaman detail sekolah
    const selectedId = Number(
        new URLSearchParams(window.location.search).get("school")
    );

    if (selectedId && markers.has(selectedId)) {
        const school = schoolData.find(s => s.id === selectedId);

        map.setView([school.lat, school.lng], 13);
        markers.get(selectedId).openPopup();
    }

    const menuToggle = $("menuToggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            $("nav").classList.toggle("open");
        });
    }

    renderMapList();
});