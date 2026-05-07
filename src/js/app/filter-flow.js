import { el, state } from "./core.js";
import { renderDanhSachSP } from "./product-flow.js";

// ================= FILTER + SORT =================
export const thucHienLocVaSapXep = (keyword = "") => {
    const activeBtn = document.querySelector(".brand-tab.active");
    const brand = activeBtn?.dataset.brand || "all";
    const sortValue = el.sortProduct?.value || "default";

    // 1. FILTER
    let ketQua = state.danhSachSP.filter(({ name, type }) => {
        const matchesKeyword = name.toLowerCase().includes(keyword);
        const matchesBrand = brand === "all" || type.toLowerCase() === brand.toLowerCase();
        return matchesKeyword && matchesBrand;
    });

    // 2. SORT
    const sortStrategies = {
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        "name-asc": (a, b) => a.name.localeCompare(b.name),
        "name-desc": (a, b) => b.name.localeCompare(a.name),
    };

    if (sortStrategies[sortValue]) {
        ketQua.sort(sortStrategies[sortValue]);
    }

    // 3. RENDER
    state.currentPage = 1;
    renderDanhSachSP(ketQua);
};

// ================= RENDER BRAND BUTTONS =================
export const renderBrandFilter = () => {
    const container = el.brandFilterContainer;
    if (!container) return;

    const brands = [...new Set(state.danhSachSP.map(sp => sp.type))];

    container.innerHTML = `
        <button class="brand-tab active" data-brand="all">Tất Cả</button>
        ${brands.map(brand => `
            <button class="brand-tab" data-brand="${brand.toLowerCase()}">${brand}</button>
        `).join("")}
    `;

    container.addEventListener("click", (e) => {
        const btn = e.target.closest(".brand-tab");
        if (!btn) return;

        container.querySelectorAll(".brand-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Lấy keyword hiện tại từ bất kỳ ô nào đang có value
        const keyword = (el.searchSP?.value || el.headerSearchInput?.value || "")
            .toLowerCase()
            .trim();
        thucHienLocVaSapXep(keyword);
    });
};

// ================= EVENTS =================
export const filterEvents = () => {
    // 1. Sort — giữ keyword hiện tại
    el.sortProduct?.addEventListener("change", () => {
        const keyword = (el.searchSP?.value || el.headerSearchInput?.value || "")
            .toLowerCase()
            .trim();
        thucHienLocVaSapXep(keyword);
    });

    // 2. Search sync + filter
    const searchInputs = [el.searchSP, el.headerSearchInput].filter(Boolean);

    const handleSearchSync = (e) => {
        const value = e.target.value;

        // Sync value sang ô còn lại
        searchInputs.forEach(input => {
            if (input !== e.target) input.value = value;
        });

        // Debounce — truyền keyword trực tiếp, không đọc lại từ DOM
        clearTimeout(state.timerId);
        state.timerId = setTimeout(() => {
            thucHienLocVaSapXep(value.toLowerCase().trim());
        }, 300);
    };

    searchInputs.forEach(input => {
        input.addEventListener("input", handleSearchSync);
    });
};

// ================= EXPORT =================
export const filterSanPham = thucHienLocVaSapXep;
export const bindFilterEvent = filterEvents;