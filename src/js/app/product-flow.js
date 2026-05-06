import { el, state, API_URL } from "./core.js";

// 1. Hàm lấy danh sách sản phẩm từ API
export const layDanhSachSP = async () => {
    if (el.loading) el.loading.classList.remove("hidden");

    try {
        const res = await axios.get(API_URL);
        state.danhSachSP = res.data;

        // Khởi tạo trạng thái ban đầu
        state.currentPage = 1;
        state.danhSachHienThi = res.data;

        renderDanhSachSP(state.danhSachHienThi);
        capNhatSoLuongGioHang();

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        if (el.danhSachSP) {
            el.danhSachSP.innerHTML = `
                <div class="text-center col-span-full py-20">
                    <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
                    <p class="text-red-500 font-bold">Không thể tải danh sách sản phẩm. Vui lòng thử lại sau!</p>
                    <button onclick="location.reload()" 
                        class="mt-4 px-4 py-2 bg-blue-900 text-white rounded-xl">
                 Thử lại
                </button>
                </div>`;
        }
    } finally {
        if (el.loading) el.loading.classList.add("hidden");
    }
};

// 2. Hàm render danh sách sản phẩm 
export const renderDanhSachSP = (danhSach) => {
    state.danhSachHienThi = danhSach;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    const itemsToShow = danhSach.slice(startIndex, endIndex);

    if (itemsToShow.length === 0) {
        el.danhSachSP.innerHTML = `
            <div class="text-center col-span-full py-20">
                <i class="fa-solid fa-magnifying-glass text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-400 font-medium">Không tìm thấy sản phẩm nào phù hợp</p>
            </div>`;
        el.pagination.innerHTML = "";
        return;
    }

    el.danhSachSP.innerHTML = itemsToShow.map(phone => {
        const quantity = Number(phone.quantity);
        const isOutOfStock = quantity <= 0 || isNaN(quantity);

        return `
        <div class="product-card group bg-white p-4 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col ${isOutOfStock ? 'opacity-75' : ''}">
            <!-- Hình ảnh -->
            <div class="relative overflow-hidden rounded-2xl mb-4 bg-gray-50 flex items-center justify-center h-56 p-6">
                <img src="${phone.img}" 
                     class="w-full h-full object-contain transition-transform duration-700 ${isOutOfStock ? 'blur-[1px] grayscale' : 'group-hover:scale-110'}" 
                     alt="${phone.name}">
                
                <span class="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                    ${phone.type}
                </span>

                ${isOutOfStock ? `
                <div class="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span class="bg-black text-white font-black px-6 py-2 rounded-full text-xs shadow-xl tracking-widest uppercase transform -rotate-6">
                        Tạm hết hàng
                    </span>
                </div>
                ` : ''}
            </div>

            <!-- Thông tin sản phẩm -->
            <div class="flex flex-col flex-1">
                <h3 class="font-bold text-gray-800 text-lg mb-1 truncate ${!isOutOfStock ? 'group-hover:text-blue-900' : ''} transition-colors">
                    ${phone.name}
                </h3>
                
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-blue-900 font-black text-xl leading-none mb-1">
                            ${Number(phone.price).toLocaleString()} <span class="text-xs font-normal text-gray-400">₫</span>
                        </p>
                        <!-- Hiển thị số lượng kho -->
                        <p class="text-[10px] font-bold ${isOutOfStock ? 'text-red-500' : 'text-gray-400'} uppercase tracking-tight">
                            <i class="fa-solid fa-warehouse mr-1"></i>
                            ${isOutOfStock ? 'Hết hàng' : `Kho còn: ${quantity}`}
                        </p>
                    </div>
                </div>
                
                <!-- Bộ nút chức năng -->
                <div class="grid grid-cols-2 gap-2 mt-auto">
                    <button class="py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2" 
                            onclick="xemNhanhSanPham('${phone.id}')">
                        <i class="fa-solid fa-expand"></i> Chi tiết
                    </button>
                    
                    <button class="py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all 
                            ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-black shadow-md active:scale-95'}" 
                            ${isOutOfStock ? 'disabled' : `onclick="themVaoGioHang('${phone.id}')"`}>
                        <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i> 
                        ${isOutOfStock ? 'Hết' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>
        </div>
    `}).join("");

    renderPagination(danhSach.length);
};

// 3. Hàm cập nhật Badge giỏ hàng
export const capNhatSoLuongGioHang = () => {
    const tongSo = state.gioHang.reduce((sum, item) => sum + item.soLuong, 0);
    if (el.badgeGioHang) {
        el.badgeGioHang.textContent = tongSo;
        el.badgeGioHang.classList.toggle("hidden", tongSo === 0);
    }
};

// 4. Hàm render Phân trang
const renderPagination = (totalItems) => {
    const totalPages = Math.ceil(totalItems / state.pageSize);
    if (totalPages <= 1) {
        el.pagination.innerHTML = "";
        return;
    }

    let html = `
        <button onclick="changePage(${state.currentPage - 1})" 
            ${state.currentPage === 1 ? 'disabled' : ''} 
            class="p-2 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-blue-900 hover:bg-gray-100 disabled:opacity-0 transition-all">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button onclick="changePage(${i})" 
                class="w-10 h-10 rounded-full font-bold text-sm transition-all 
                ${state.currentPage === i ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}">
                ${i}
            </button>
        `;
    }

    html += `
        <button onclick="changePage(${state.currentPage + 1})" 
            ${state.currentPage === totalPages ? 'disabled' : ''} 
            class="p-2 w-10 h-10 flex items-center justify-center rounded-full text-blue-900 hover:bg-gray-100 disabled:opacity-0 transition-all">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    el.pagination.innerHTML = html;
};

//5. Window function cho phân trang

window.changePage = (page) => {
    const totalPages = Math.ceil(state.danhSachHienThi.length / state.pageSize);
    if (page < 1 || page > totalPages) return;

    state.currentPage = page;
    renderDanhSachSP(state.danhSachHienThi);
    window.scrollTo({ top: el.danhSachSP.offsetTop - 100, behavior: 'smooth' });
};

// 6. Hàm Xem chi tiet sản phẩm
window.xemNhanhSanPham = (id) => {
    const phone = state.danhSachSP.find(item => item.id == id);
    if (!phone) return;

    const quantity = Number(phone.quantity);
    const isOutOfStock = quantity <= 0 || isNaN(quantity);

    el.contentPopup.innerHTML = `
        <div class="flex flex-col md:flex-row gap-10">
            <!-- Khu vực ảnh -->
            <div class="w-full md:w-1/2 bg-gray-50 rounded-3xl p-10 flex items-center justify-center relative shadow-inner">
                <img src="${phone.img}" class="max-h-[350px] object-contain drop-shadow-2xl" alt="${phone.name}">
            </div>
            
            <!-- Khu vực thông tin -->
            <div class="w-full md:w-1/2 flex flex-col text-left">
                <div class="flex-1">
                    <span class="text-blue-900 font-black text-xs uppercase tracking-widest mb-2 block">${phone.type}</span>
                    <h2 class="text-3xl font-black text-gray-900 leading-tight mb-2">${phone.name}</h2>
                    <p class="text-2xl font-black text-red-600 mb-6">${Number(phone.price).toLocaleString()} ₫</p>
                    
                    <div class="grid grid-cols-1 gap-4 mb-8">
                        <div class="flex items-center justify-between border-b pb-2">
                            <span class="text-gray-400 text-sm flex items-center gap-2"><i class="fa-solid fa-box-open"></i> Kho hàng</span>
                            <span class="font-bold text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}">
                                ${isOutOfStock ? 'Hết hàng' : `${quantity} máy có sẵn`}
                            </span>
                        </div>
                        <div class="flex items-center justify-between border-b pb-2">
                            <span class="text-gray-400 text-sm flex items-center gap-2"><i class="fa-solid fa-mobile-screen"></i> Màn hình</span>
                            <span class="font-bold text-sm text-gray-800">${phone.screen || 'Retina XDR'}</span>
                        </div>
                        <div class="flex items-center justify-between border-b pb-2">
                            <span class="text-gray-400 text-sm flex items-center gap-2"><i class="fa-solid fa-camera"></i> Cam sau</span>
                            <span class="font-bold text-sm text-gray-800">${phone.backCamera || '12 MP'}</span>
                        </div>
                        <div class="flex items-center justify-between border-b pb-2">
                            <span class="text-gray-400 text-sm flex items-center gap-2"><i class="fa-solid fa-video"></i> Cam trước</span>
                            <span class="font-bold text-sm text-gray-800">${phone.frontCamera || '12 MP'}</span>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-blue-50/50 rounded-2xl mb-8">
                        <p class="text-gray-600 text-[13px] leading-relaxed italic">
                            <i class="fa-solid fa-quote-left mr-2 text-blue-200"></i>
                            ${phone.desc || 'Thông tin chi tiết sản phẩm đang được cập nhật.'}
                        </p>
                    </div>
                </div>
                
                <button class="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg
                        ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-900 text-white hover:bg-black active:scale-[0.98]'}" 
                        ${isOutOfStock ? 'disabled' : `onclick="themVaoGioHang('${phone.id}')"`}>
                    <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-shopping'}"></i> 
                    ${isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
            </div>
        </div>
    `;

    el.popup.classList.remove("hidden");
    document.body.style.overflow = "hidden";
};