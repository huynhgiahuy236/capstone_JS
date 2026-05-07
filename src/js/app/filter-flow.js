import { el, state } from "./core.js";
import { renderDanhSachSP } from "./product-flow.js";

// ================= FILTER + SORT =================
export const thucHienLocVaSapXep = () => {

    const activeBtn = document.querySelector(".brand-tab.active");

const brand = activeBtn
        ? activeBtn.dataset.brand
        : "all";
    const keyword = (
        el.searchSP?.value ||
        el.headerSearchInput?.value ||
        ""
    ).toLowerCase().trim();

    const sortValue = el.sortProduct
        ? el.sortProduct.value
        : "default";

    // FILTER
    let ketQua = state.danhSachSP.filter(phone => {

        const matchesKeyword =
            phone.name.toLowerCase().includes(keyword);

        const matchesBrand =
            brand === "all" ||
            phone.type.toLowerCase() === brand.toLowerCase();

        return matchesKeyword && matchesBrand;
    });

    // SORT
    switch (sortValue) {

        case "price-asc":
            ketQua.sort((a, b) => a.price - b.price);
            break;

        case "price-desc":
            ketQua.sort((a, b) => b.price - a.price);
            break;

        case "name-asc":
            ketQua.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case "name-desc":
            ketQua.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
            break;
    }

    state.currentPage = 1;

    renderDanhSachSP(ketQua);
};

// ================= Hiện thị btn-branch =================
export const renderBrandFilter = () => {

    const container = el.brandFilterContainer

    if (!container) return;

    // loại bỏ brand trùng
    const brands = [
        ...new Set(
            state.danhSachSP.map(sp => sp.type)
        )
    ];

    container.innerHTML = `
        <button class="brand-tab active" data-brand="all">
            Tất Cả
        </button>

        ${brands.map(brand => `
            <button
                class="brand-tab"
                data-brand="${brand.toLowerCase()}"
            >
                ${brand}
            </button>
        `).join("")}
    `;

    // EVENT CLICK BRAND
    const brandButtons = container.querySelectorAll(".brand-tab");
    brandButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            brandButtons.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            thucHienLocVaSapXep();
        });

    });
};

// ================= EVENTS =================
export const filterEvents = () => {
    // SORT
    if (el.sortProduct) {
        el.sortProduct.addEventListener(
            "change",
            thucHienLocVaSapXep
        );
    }
    // SEARCH
    const setupSearchEvent = (inputElement) => {
        if (!inputElement) return;
        inputElement.addEventListener("input", (e) => {

            const val = e.target.value;
            // sync 2 ô search
            const otherInput =
                inputElement.id === "searchInput"
                    ? el.headerSearchInput
                    : el.searchSP

            if (otherInput) {
                otherInput.value = val;
            }
            clearTimeout(state.timerId);
            state.timerId = setTimeout(
                thucHienLocVaSapXep,
                500
            );
        });
    };

    setupSearchEvent(el.searchSP);
    setupSearchEvent(el.headerSearchInput)

};

// ================= EXPORT =================
export const filterSanPham = thucHienLocVaSapXep;

export const bindFilterEvent = filterEvents;