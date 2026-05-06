import { el, state } from "./core.js";
import { renderDanhSachSP } from "./product-flow.js";

//Hàm xử lý chính: Kết hợp Lọc (Thương hiệu + Tìm kiếm) và Sắp xếp

export const thucHienLocVaSapXep = () => {
    // 1. Lấy Thương hiệu từ nút đang Active
    const activeBtn = document.querySelector(".brand-tab.active");
    const brand = activeBtn ? activeBtn.getAttribute("data-brand") : "all";

    // 2. Lấy Từ khóa tìm kiếm
    // Ưu tiên ô tìm kiếm ở phần sản phẩm (searchInput), nếu trống thì lấy ở header
    const searchInput = document.getElementById('searchInput');
    const headerSearch = document.getElementById('headerSearchInput');

    const keyword = (searchInput?.value || headerSearch?.value || "").toLowerCase().trim();

    // 3. Lấy giá trị Sắp xếp từ Select Option
    const sortValue = el.sortProduct ? el.sortProduct.value : "default";

    // --- Bắt đầu lọc dữ liệu ---
    let ketQua = state.danhSachSP.filter(phone => {
        const matchesKeyword = phone.name.toLowerCase().includes(keyword);
        const matchesBrand = brand === "all" || phone.type.toLowerCase() === brand.toLowerCase();
        return matchesKeyword && matchesBrand;
    });

    // --- Bắt đầu sắp xếp dữ liệu ---
    if (sortValue === "price-asc") {
        ketQua.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
        ketQua.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
        ketQua.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
        ketQua.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Cập nhật trạng thái trang và render
    state.currentPage = 1;
    renderDanhSachSP(ketQua);
};

// Đăng ký tất cả sự kiện lọc
export const filterEvents = () => {
    // A. Sự kiện cho các nút Tab Brand
    const brandButtons = document.querySelectorAll(".brand-tab");
    brandButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            brandButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            thucHienLocVaSapXep();
        });
    });

    // B. Sự kiện cho Select Sort (Sắp xếp)
    if (el.sortProduct) {
        el.sortProduct.addEventListener("change", thucHienLocVaSapXep);
    }

    // C. Sự kiện cho ô Search (Xử lý đồng bộ và Debounce)
    const setupSearchEvent = (inputElement) => {
        if (!inputElement) return;
        inputElement.addEventListener("input", (e) => {
            const val = e.target.value;

            // Đồng bộ text sang ô search còn lại
            const otherInput = (inputElement.id === 'searchInput')
                ? document.getElementById('headerSearchInput')
                : document.getElementById('searchInput');

            if (otherInput) otherInput.value = val;

            // Debounce để tránh render quá nhiều lần khi gõ nhanh
            clearTimeout(state.timerId);
            state.timerId = setTimeout(thucHienLocVaSapXep, 500);
        });
    };

    setupSearchEvent(document.getElementById('searchInput'));
    setupSearchEvent(document.getElementById('headerSearchInput'));
};

//export const
export const filterSanPham = () => thucHienLocVaSapXep();
export const bindFilterEvent = () => filterEvents();