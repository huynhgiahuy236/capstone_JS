// 1. Import module
import { filterEvents } from "./js/app/filter-flow.js";
import { layDanhSachSP, capNhatSoLuongGioHang } from "./js/app/product-flow.js";
import { renderGioHang } from "./js/app/card-flow.js";
import { initSlider } from "./js/app/ui-flow.js";
import { el, state } from "./js/app/core.js";


// --- 2. Xử lý UI (Popup / Modal) ---
const closeModals = () => {
    el.popup?.classList.add("hidden");
    el.popupGioHang?.classList.add("hidden");
    document.body.style.overflow = "auto";
};

// --- 3. Khởi tạo app ---
const initApp = async () => {

    const data = localStorage.getItem("GIO_HANG");

    if (data) {
        try {
            state.gioHang = JSON.parse(data);
        } catch (e) {
            console.error("Lỗi parse JSON:", e);
            state.gioHang = [];
        }
    }

    capNhatSoLuongGioHang();

    initSlider();

    filterEvents();

    // 🔥 CHỜ LOAD SP XONG
    await layDanhSachSP();

};
// --- 4. DOM READY ---
document.addEventListener("DOMContentLoaded", () => {
    // Gán event sau khi DOM load

    el.btnClosePopup?.addEventListener("click", closeModals);
    el.overlay?.addEventListener("click", closeModals);
    el.overlayGioHang?.addEventListener("click", closeModals);

    document.querySelector(".close-cart")?.addEventListener("click", closeModals);

    el.btnGioHang?.addEventListener("click", () => {
        renderGioHang();
        el.popupGioHang?.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    });

    // chạy app
    initApp();
});