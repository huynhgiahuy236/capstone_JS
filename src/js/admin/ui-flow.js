import { el, errorEl, state } from "./core.js";
import { validateField } from "./crud-flow.js";

// dark mode switcher
export const darkModeSwitcher = () => {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const isDark = root.classList.contains("dark");
  if (isDark) {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

// loading spinner
export const toggleLoading = (isLoading) => {
  el.loadingTarget.forEach((t) => {
    if (isLoading) {
      t.classList.remove("hidden");
    } else {
      t.classList.add("hidden");
    }
  });
};

export const renderProductList = (products) => {
  el.productTableList.innerHTML = "";

  if (products.length === 0) {
    el.productTableList.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">Không tìm thấy sản phẩm nào</td>
      </tr>`;
    return;
  }

  // ===== PAGINATION LOGIC =====
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  const items = products.slice(start, end);

  const content = items
    .map((phone) => {
      const quantityDisplay =
        Number(phone.quantity) === 0 ? `<span class="text-red-500 font-bold">Hết hàng</span>` : phone.quantity;

      return `
      <tr class="text-left">
        <td>${phone.id}</td>
        <td class="hidden sm:table-cell"><img src="${phone.img}" class="w-12 h-12 object-cover rounded"></td>
        <td class="font-medium">${phone.name}</td>
        <td>${phone.type}</td>
        <td>${phone.price.toLocaleString()} VND</td>
        <td>${quantityDisplay}</td>
        <td class="flex items-center gap-1 sm:gap-3 mt-2">
          <button onclick="editProduct(${phone.id})" class="info-btn px-1 sm:px-1.5 py-0.5">
            <i class="fa-solid fa-pencil fa-xs text-white"></i>
          </button>
          <button onclick="deleteProduct(${phone.id})" class="danger-btn px-1 sm:px-1.5 py-0.5">
            <i class="fa-solid fa-trash fa-xs text-white"></i>
          </button>
        </td>
      </tr>
    `;
    })
    .join("");

  el.productTableList.innerHTML = content;

  renderPagination(products.length);
};
export const renderPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / state.pageSize);

  const container = document.getElementById("pagination");
  if (!container) return;

  let html = "";

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button 
        onclick="changePage(${i})"
        class="px-3 py-1 rounded-lg text-sm font-medium cursor-pointer 
        ${i === state.currentPage ? "bg-blue-600 text-white" : "bg-gray-200"}">
        ${i}
      </button>
    `;
  }

  container.innerHTML = html;
};
window.changePage = (page) => {
  state.currentPage = page;
  renderProductList(state.filteredList);
};

export const updateDashboard = (products) => {
  const types = [...new Set(products.map((p) => p.type))].length;
  const quantity = products.reduce((sum, p) => sum + Number(p.quantity), 0);
  const mostExpensive =
    products.length > 0 ? [...products].sort((a, b) => b.price - a.price)[0] : { price: 0, name: "Chưa có sản phẩm" };
  el.totalTypes.textContent = types;
  el.totalQuantity.textContent = quantity;
  el.maxPriceValue.textContent = `${mostExpensive.price.toLocaleString()} VND`;
  el.maxPriceName.textContent = mostExpensive.name;
};

// hàm reset form
export const resetForm = () => {
  if (el.form) el.form.reset();
};

// cập nhật giao diện Preview ảnh
export const updateImgHelper = (value) => {
  if (!el.imgPreview) return;
  const hasUrl = value.trim() !== "";
  el.imgPreview.classList.toggle("hidden", !hasUrl);
  if (hasUrl) el.imgPreview.querySelector("img").src = value;
};

// cập nhật trạng thái nút tăng giảm
const updateQuantityHelper = (value) => {
  if (!el.minusQuantity) return;
  const val = Number(value) || 0;
  const isZero = val <= 0;
  el.minusQuantity.disabled = isZero;
  el.minusQuantity.style.opacity = isZero ? "0.5" : "1";
  el.minusQuantity.style.cursor = isZero ? "not-allowed" : "pointer";
};

// hàm setup giao diện modal (dùng cho hàm openmodal và hàm sửa thông tin sản phẩm)
export const setupModal = (title, isEdit = false) => {
  // mở modal
  el.modal.classList.remove("hidden");
  el.modalOverlay.classList.remove("hidden");
  el.modalTitle.innerHTML = title;
  updateQuantityHelper(el.quantity.value);
  validateField("img");
  // toggle nút bấm
  el.addBtn.style.display = isEdit ? "none" : "inline-block";
  el.updateBtn.style.display = isEdit ? "inline-block" : "none";
  el.resetBtn.style.display = isEdit ? "none" : "inline-block";
  // dọn dẹp lỗi cũ (nếu có)
  errorEl.spans.forEach((span) => {
    span.innerHTML = "";
    span.style.display = "none";
  });
};

// hàm mở modal
export const openModal = () => {
  resetForm();
  state.editingProduct = null;
  setupModal("Thêm sản phẩm mới", false);
  el.name.focus();
};

// hàm đóng modal
export const closeModal = () => {
  el.modal.classList.add("hidden");
  el.modalOverlay.classList.add("hidden");
};

// hàm search sản phẩm
export const searchProduct = () => {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const filteredList = state.productList.filter((phone) => {
    const id = phone.id.toString().toLowerCase();
    const name = phone.name.toLowerCase();
    return id.includes(keyword) || name.includes(keyword);
  });

  renderProductList(filteredList);
};

// hàm filter sản phẩm
export const renderFilterMenu = () => {
  const types = ["Tất cả", ...new Set(state.productList.map((p) => p.type))];
  el.filterDropdown.innerHTML = types
    .map(
      (type) => `
    <li class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer" 
        onclick="handleFilterType('${type}')">
      ${type}
    </li>
  `,
    )
    .join("");
};

window.handleFilterType = (type) => {
  el.filterDropdown.classList.add("hidden");

  state.filteredList = type === "Tất cả" ? [...state.productList] : state.productList.filter((p) => p.type === type);

  if (type === "Tất cả") el.filterIcon.parentElement.classList.remove("active");
  else el.filterIcon.parentElement.classList.add("active");

  state.currentPage = 1;
  renderProductList(state.filteredList);
};

export const toggleFilterDropdown = (e) => {
  e.stopPropagation();
  const isHidden = el.filterDropdown.classList.contains("hidden");
  if (isHidden) {
    renderFilterMenu();
    el.filterDropdown.classList.remove("hidden");
  } else {
    el.filterDropdown.classList.add("hidden");
  }
};

// hàm sort list sản phẩm
export const sortProduct = (index) => {
  const keys = ["id", "name", "price", "quantity"];
  const key = keys[index];

  if (state.sortConfig.key === key) {
    state.sortConfig.direction = state.sortConfig.direction === "asc" ? "desc" : "asc";
  } else {
    state.sortConfig = { key, direction: "desc" };
  }

  const { direction } = state.sortConfig;

  state.filteredList.sort((a, b) => {
    let vA = a[key],
      vB = b[key];
    if (["id", "price", "quantity"].includes(key)) {
      return direction === "asc" ? Number(vA) - Number(vB) : Number(vB) - Number(vA);
    }
    vA = String(vA).toLowerCase();
    vB = String(vB).toLowerCase();
    return direction === "asc" ? vA.localeCompare(vB) : vB.localeCompare(vA);
  });

  // cập nhật UI Icon
  el.sortUp.forEach((upBtn, i) => {
    const downBtn = el.sortDown[i];

    if (i === index) {
      const isAsc = direction === "asc";
      upBtn.classList.toggle("hidden", isAsc);
      upBtn.classList.toggle("inline-block", !isAsc);
      downBtn.classList.toggle("hidden", !isAsc);
      downBtn.classList.toggle("inline-block", isAsc);
    } else {
      upBtn.classList.add("hidden");
      upBtn.classList.remove("inline-block");
      downBtn.classList.remove("hidden");
      downBtn.classList.add("inline-block");
    }
  });

  state.currentPage = 1;
  renderProductList(state.filteredList); // Render mảng đã sort
};

// hàm tăng/giảm số lượng
export const handleQuantityChange = (action) => {
  const input = el.quantity;
  if (!input) return;
  let val = Math.floor(Number(input.value)) || 0;
  if (action === "increase") {
    val++;
  } else if (action === "decrease" && val > 0) {
    val--;
  }
  input.value = val;
  if (el.minusQuantity) {
    el.minusQuantity.disabled = val <= 0;
    el.minusQuantity.style.opacity = val <= 0 ? "0.5" : "1";
  }
  validateField("quantity");
  setTimeout(() => {
    input.focus(); 
  }, 0);
};

// hàm toast (thay thế alert)
export const showToast = (message, type = "success") => {
  const toast = document.createElement("div");

  const borderCol = type === "success" ? "border-l-blue-500" : "border-l-red-600";
  const icon = type === "success" ? "fa-circle-check text-blue-500" : "fa-circle-xmark text-red-600";

  toast.className = `card flex items-center gap-4 min-w-[280px] border-l-4 ${borderCol} mb-3 py-3 shadow-2xl`;
  toast.innerHTML = `
  <span class="font-medium text-sm">${message}</span>
  <i class="fa-solid ${icon} fa-lg"></i>
  `;

  el.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    toast.style.transition = "all 0.5s ease";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
};

// hàm confirm (thay thế confirm)
export const showConfirm = (title, message) => {
  return new Promise((resolve) => {
    el.confirmTitle.innerText = title;
    el.confirmMsg.innerText = message;

    el.confirmOverlay.classList.remove("hidden");
    // Animation scale nhẹ
    el.confirmBox.classList.remove("scale-95", "opacity-0");
    el.confirmBox.classList.add("scale-100", "opacity-100");

    const handleClose = (result) => {
      el.confirmOverlay.classList.add("hidden");
      el.confirmBox.classList.add("scale-95", "opacity-0");
      resolve(result);
    };

    el.confirmYes.onclick = () => handleClose(true);
    el.confirmNo.onclick = () => handleClose(false);
  });
};
