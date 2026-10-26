document.addEventListener("DOMContentLoaded", function () {
  // Menu hamburger untuk tampilan HP
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Tahun otomatis di footer
  const yearElements = document.querySelectorAll("#year");

  yearElements.forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });

  // Form pencarian sekolah di halaman beranda
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const jenjangSelect = document.getElementById("jenjang");

  if (searchForm && searchInput && jenjangSelect) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const keyword = searchInput.value.trim();
      const jenjang = jenjangSelect.value;

      const params = new URLSearchParams();

      if (keyword !== "") {
        params.set("q", keyword);
      }

      if (jenjang !== "all") {
        params.set("jenjang", jenjang);
      }

      let tujuan = "pages/sekolah.html";
      const queryString = params.toString();

      if (queryString !== "") {
        tujuan += "?" + queryString;
      }

      window.location.href = tujuan;
    });
  }

  // Menandai menu navigasi yang sedang dibuka
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage) {
      const linkFile = linkPage.split("/").pop().split("?")[0];

      if (linkFile === currentPage) {
        link.classList.add("active");
      }
    }
  });
});