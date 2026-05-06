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
  const content = products
    .map((phone) => {
      const quantityDisplay =
        Number(phone.quantity) === 0 ? `<span class="text-red-500 font-bold">Hết hàng</span>` : phone.quantity;
      return `
        <tr class="text-left">
            <td>${phone.id}</td>
            <td><img src="${phone.img}" class="w-12 h-12 object-cover rounded"></td>
            <td class="font-medium">${phone.name}</td>
            <td>${phone.type}</td>
            <td>${phone.price.toLocaleString()} VND</td>
            <td>${quantityDisplay}</td>
            <td class="flex items-center gap-3 h-full mt-2">
                <button onclick="editProduct(${phone.id})" class="info-btn px-1.5 py-0.5"><i class="fa-solid fa-pencil fa-xs" style="color: white"></i></button>
                <button onclick="deleteProduct(${phone.id})" class="danger-btn px-1.5 py-0.5"><i class="fa-solid fa-trash fa-xs" style="color: white"></i></button>
            </td>
        </tr>
    `;
    })
    .join("");
  el.productTableList.innerHTML = content;
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

// hàm sort list sản phẩm
// export const sortProduct = (index, dir) => {
//   const keys = ["id", "name", "price", "quantity"];
//   const key = keys[index];
//   state.productList.sort((a, b) => {
//     const valA = key === "name" ? a[key].toLowerCase() : Number(a[key]);
//     const valB = key === "name" ? b[key].toLowerCase() : Number(b[key]);
//     return dir * (key === "name" ? valA.localeCompare(valB) : valA - valB);
//   });
//   renderProductList();
//   el.sortUp[index].style.display = dir === 1 ? "none" : "inline-block";
//   el.sortDown[index].style.display = dir === 1 ? "inline-block" : "none";
// };

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
};
