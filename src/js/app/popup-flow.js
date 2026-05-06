// src/js/app/popup.js
import { el } from "./core.js";

/**
 * Hàm đóng Popup Chi tiết sản phẩm
 */
export const closePopupChiTiet = () => {
    if (el.popup) {
        el.popup.classList.add("hidden");
        document.body.style.overflow = "auto"; // Cho phép cuộn trang lại
    }
};

/**
 * Hàm đóng Popup Giỏ hàng
 */
export const closePopupGioHang = () => {
    if (el.popupGioHang) {
        el.popupGioHang.classList.add("hidden");
        document.body.style.overflow = "auto"; // Cho phép cuộn trang lại
    }
};

/**
 * Hàm tổng hợp các sự kiện cho Popup
 */
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

    // 3. Nếu Huy có nút close (X) trong HTML, có thể thêm vào đây
    const closeBtns = document.querySelectorAll(".btn-close-popup");
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            closePopupChiTiet();
            closePopupGioHang();
        });
    });
};