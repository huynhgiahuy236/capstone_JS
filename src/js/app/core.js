export const API_URL = "https://69cfbef7a4647a9fc675e9d2.mockapi.io/phone/phone";

export const el = {
    danhSachSP: document.getElementById("danhSachSP"),
    loading: document.getElementById("loading"),
    searchSP: document.getElementById("searchInput"),
    filterSanPham: document.getElementById("filterSelect"),

    // Popup chi tiết
    popup: document.getElementById("popupChiTiet"),
    btnClosePopup: document.getElementById("btnClose"),
    contentPopup: document.getElementById("popupContent"),
    overlay: document.getElementById("overlay"),

    // Giỏ hàng
    popupGioHang: document.getElementById("popupGioHang"),
    overlayGioHang: document.getElementById("overlayGioHang"),
    noiDungGioHang: document.getElementById("noiDungGioHang"),
    btnGioHang: document.getElementById("btnGioHang"),
    badgeGioHang: document.getElementById("badgeGioHang"),
    btnThanhToan :document.getElementById("btnThanhToan"),
    //ui-flow
    pagination: document.getElementById("pagination"),

    //select_option
    sortProduct: document.getElementById("sortProduct"), 
    searchSP: document.getElementById("searchSP"),

    //fallback tự tạo container cho toast
    toastContainer: document.getElementById("toast-container") || (() => {
        const div = document.createElement("div");
        div.id = "toast-container";
        document.body.appendChild(div);
        return div;
    })(),
};

export const state = {
    danhSachSP: [],
    danhSachHienThi: [], // Danh sách sau khi lọc/tìm kiếm
    gioHang: [],
    currentPage: 1,
    pageSize: 9 // Số lượng sản phẩm mỗi trang
};

export const showToast = (message, icon = "fa-check-circle") => {
    const toast = document.createElement("div");
    toast.className = "toast-item";
    toast.innerHTML = `
        <i class="fa-solid ${icon} text-blue-900 text-lg"></i>
        <span>${message}</span>
    `;
    el.toastContainer.appendChild(toast);

    // Tự xóa sau 3 giây
    setTimeout(() => {
        toast.remove();
    }, 3000);
};
