// ===== 1. SLIDER =====
export const initSlider = () => {
    const el = document.querySelector(".myBanner");
    if (!el) return;

    new Swiper(el, {
        loop: true,
        grabCursor: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        effect: "creative",
        creativeEffect: {
            prev: { shadow: true, translate: ["-20%", 0, -1] },
            next: { translate: ["100%", 0, 0] },
        },
    });
};

// ===== 2. SEARCH FLOW =====
export const initSearchFlow = () => {
    const header = document.getElementById("headerSearchInput");
    const main = document.getElementById("searchInput");
    const target = document.getElementById("sanPham");

    const handle = (input, other) => (e) => {
        if (e.key !== "Enter") return;

        const keyword = input.value.trim();
        if (other) other.value = keyword;

        target?.scrollIntoView({ behavior: "smooth" });

        window.thucHienFilterTongHop?.(); // gọi nếu tồn tại
        input.blur();
    };

    header?.addEventListener("keypress", handle(header, main));
    main?.addEventListener("keypress", handle(main, header));
};

// ===== 3. DARK MODE =====
export const initDarkMode = () => {
    const btn = document.getElementById("toggleTheme");
    if (!btn) return;

    const root = document.documentElement;

    const setTheme = (mode) => {
        root.classList.toggle("dark", mode === "dark");
        localStorage.setItem("theme", mode);
        btn.textContent = mode === "dark" ? "☀️" : "🌙";
    };

    // load lần đầu
    setTheme(localStorage.getItem("theme") || "light");

    btn.onclick = () => {
        const isDark = root.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
    };
};

// ===== AUTO RUN =====
document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    initSearchFlow();
    initDarkMode();
});
const btn = document.getElementById("toggleTheme");

btn.onclick = () => {
    document.documentElement.classList.toggle("dark");
};