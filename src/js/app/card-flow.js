import { el, state, showToast } from "./core.js";
import { renderDanhSachSP, capNhatSoLuongGioHang } from "./product-flow.js";

// 1. Hàm đóng giỏ hàng an toàn
export const dongGioHang = () => {
    if (el.popupGioHang) {
        el.popupGioHang.classList.add("hidden");
        // Quan trọng: Mở lại thanh cuộn cho body
        document.body.style.overflow = "auto";
    }
};

// 2. Hàm mở giỏ hàng an toàn
export const moGioHang = () => {
    renderGioHang();
    if (el.popupGioHang) {
        el.popupGioHang.classList.remove("hidden");
        // Khóa thanh cuộn body để tránh scroll nhầm bên dưới
        document.body.style.overflow = "hidden";
    }
};

const luuGioHang = () => {
    localStorage.setItem("GIO_HANG", JSON.stringify(state.gioHang));
    if (typeof capNhatSoLuongGioHang === "function") capNhatSoLuongGioHang();
};

export const renderGioHang = () => {
    if (!el.noiDungGioHang) return;

    if (state.gioHang.length === 0) {
        el.noiDungGioHang.innerHTML = `
            <div class="text-center py-20 text-gray-400">
                <p>Giỏ hàng trống</p>
            </div>`;
        return;
    }

    let html = "";
    state.gioHang.forEach(item => {
        const isMin = item.soLuong === 1;
        html += `
        <div class="item flex gap-4 p-4 bg-gray-50 rounded-xl mb-3 shadow-sm" data-id="${item.id}">
            <img src="${item.img}" class="w-20 h-full object-contain bg-white rounded-lg">
            <div class="flex-1">
                <h4 class="font-bold text-blue-500 pb-1">${item.name}</h4>
                <p class="text-green-600 font-semibold">${item.price.toLocaleString()}₫</p>
                <div class="flex items-center gap-3 mt-2">
                    <button class="giam w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-200 shadow-sm ${isMin ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50'}" 
                            ${isMin ? 'disabled' : ''}>-</button>
                    <span class="w-6 text-center font-bold">${item.soLuong}</span>
                    <button class="tang w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-200 shadow-sm hover:bg-blue-50">+</button>
                </div>
            </div>
            <button class="xoa text-red-400 hover:text-red-600 p-2 text-2xl  transition-colors"><i class="fa-solid fa-delete-left"></i></button>
        </div>`;
    });

    const tong = state.gioHang.reduce((t, i) => t + i.price * i.soLuong, 0);
    html += `
        <div class="mt-4 border p-4 sticky bottom-0 bg-gray-100 rounded-lg border-gray-300">
            <div class="flex justify-between items-center">
                <span class="text-gray-500 font-semibold">Tổng tiền:</span>
                <span class="font-bold text-xl text-green-700">${tong.toLocaleString()}₫</span>
            </div>
        </div>`;

    el.noiDungGioHang.innerHTML = html;
};

// ================== EVENT DELEGATION ==================
el.noiDungGioHang.addEventListener("click", (e) => {
    const itemEl = e.target.closest(".item");
    if (!itemEl) return;

    const id = itemEl.dataset.id;
    const item = state.gioHang.find(i => i.id == id);
    const spGoc = state.danhSachSP.find(p => p.id == id);

    if (e.target.classList.contains("tang")) {
        if (item.soLuong < spGoc.quantity) item.soLuong++;
        else showToast("Vượt quá tồn kho", "fa-warning");
    }

    if (e.target.classList.contains("giam") && item.soLuong > 1) {
        item.soLuong--;
    }

    if (e.target.classList.contains("xoa")) {
        confirm("Bạn có chắc xóa sản phẩm chứ")
        state.gioHang = state.gioHang.filter(p => p.id != id);
    }

    renderGioHang();
    luuGioHang();
});

// ================== THANH TOÁN  ==================
export const handleThanhToan = () => {
    if (state.gioHang.length === 0) return;

    state.gioHang.forEach(cartItem => {
        const sp = state.danhSachSP.find(p => p.id == cartItem.id);
        if (sp) sp.quantity = Math.max(0, sp.quantity - cartItem.soLuong);
    });

    state.gioHang = [];
    luuGioHang();

    // Fix lỗi đơ: Đóng theo hàm chuẩn để mở lại scroll
    dongGioHang();

    renderDanhSachSP(state.danhSachSP);
    showToast("Thanh toán thành công!", "fa-check");
};

export const themVaoGioHang = (id) => {
    const sp = state.danhSachSP.find(p => p.id == id);
    if (!sp || sp.quantity <= 0) return showToast("Hết hàng", "fa-xmark");

    const item = state.gioHang.find(p => p.id == id);
    if (item) {
        if (item.soLuong >= sp.quantity) return showToast("Hết hàng", "fa-warning");
        item.soLuong++;
    } else {
        state.gioHang.push({ ...sp, soLuong: 1 });
    }

    luuGioHang();
    showToast("Đã thêm vào giỏ", "fa-check");
};

// Gán sự kiện
if (el.btnThanhToan) el.btnThanhToan.onclick = handleThanhToan;

// Expose
window.themVaoGioHang = themVaoGioHang;
window.moGioHang = moGioHang;
window.dongGioHang = dongGioHang;