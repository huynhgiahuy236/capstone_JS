import { el, state } from "./core.js";
import { renderDanhSachSP } from "./product-flow.js";

// ================= HÀM HỖ TRỢ (UTILITIES) =================
const getSearchKeyword = () =>
    (el.searchSP?.value || el.headerSearchInput?.value || "").toLowerCase().trim();

// ================= FILTER + SORT =================
export const thucHienLocVaSapXep = () => {
    const activeBtn = document.querySelector(".brand-tab.active");
    const brand = activeBtn?.dataset.brand || "all";
    const keyword = getSearchKeyword();
    const sortValue = el.sortProduct?.value || "default";

    // 1. FILTER: Lọc dữ liệu
    let ketQua = state.danhSachSP.filter(({ name, type }) => {
        const matchesKeyword = name.toLowerCase().includes(keyword);
        const matchesBrand = brand === "all" || type.toLowerCase() === brand.toLowerCase();
        return matchesKeyword && matchesBrand;
    });

    // 2. SORT: Sắp xếp dữ liệu
    const sortStrategies = {
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        "name-asc": (a, b) => a.name.localeCompare(b.name),
        "name-desc": (a, b) => b.name.localeCompare(a.name),
    };

    if (sortStrategies[sortValue]) {
        ketQua.sort(sortStrategies[sortValue]);
    }

    // 3. RENDER: Reset trang và hiển thị
    state.currentPage = 1;
    renderDanhSachSP(ketQua);
};

// ================= RENDER BRAND BUTTONS =================
export const renderBrandFilter = () => {
    const container = el.brandFilterContainer;
    if (!container) return;

    // Lấy danh sách brand duy nhất
    const brands = [...new Set(state.danhSachSP.map(sp => sp.type))];

    container.innerHTML = `
        <button class="brand-tab active" data-brand="all">Tất Cả</button>
        ${brands.map(brand => `
            <button class="brand-tab" data-brand="${brand.toLowerCase()}">${brand}</button>
        `).join("")}
    `;

    // Event Delegation (Gắn sự kiện tập trung vào container)
    container.addEventListener("click", (e) => {
        const btn = e.target.closest(".brand-tab");
        if (!btn) return;

        container.querySelectorAll(".brand-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        thucHienLocVaSapXep();
    });
};

// ================= EVENTS =================
export const filterEvents = () => {
    // 1. Sự kiện Sắp xếp
    el.sortProduct?.addEventListener("change", thucHienLocVaSapXep);

    // 2. Hàm xử lý Search & Sync
    const handleSearchSync = (e) => {
        const value = e.target.value;

        // Đẩy giá trị sang ô còn lại nếu nó tồn tại
        if (el.searchSP && e.target !== el.searchSP) {
            el.searchSP.value = value;
        }
        if (el.headerSearchInput && e.target !== el.headerSearchInput) {
            el.headerSearchInput.value = value;
        }

        // Debounce để tránh render liên tục khi đang gõ
        clearTimeout(state.timerId);
        state.timerId = setTimeout(() => {
            thucHienLocVaSapXep();
        }, 300);
    };

    // Gán sự kiện cho cả 2 ô
    [el.searchSP, el.headerSearchInput].forEach(inputElement => {
        inputElement?.addEventListener("input", handleSearchSync);
    });
};
// ================= EXPORT =================
export const filterSanPham = thucHienLocVaSapXep;
export const bindFilterEvent = filterEvents;