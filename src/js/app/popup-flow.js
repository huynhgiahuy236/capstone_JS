// src/js/app/popup.js
import { el } from "./core.js";

export const closePopupChiTiet = () => {
    if (el.popup) {
        el.popup.classList.add("hidden");
        document.body.style.overflow = "auto"; // Cho phép cuộn trang lại
    }
};

export const closePopupGioHang = () => {
    if (el.popupGioHang) {
        el.popupGioHang.classList.add("hidden");
        document.body.style.overflow = "auto"; // Cho phép cuộn trang lại
    }
};

export const popupEvents = () => {
    // 1. Đóng khi click vào Overlay
    if (el.overlay) el.overlay.addEventListener("click", closePopupChiTiet);
    if (el.overlayGioHang) el.overlayGioHang.addEventListener("click", closePopupGioHang);

    // 2. Đóng khi nhấn phím ESC (Trải nghiệm người dùng tốt hơn)
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closePopupChiTiet();
            closePopupGioHang();
        }
    });

};