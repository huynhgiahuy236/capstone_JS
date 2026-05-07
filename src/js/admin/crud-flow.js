import { API_URL, el, errorEl, state } from "./core.js";
import {
  closeModal,
  renderProductList,
  resetForm,
  setupModal,
  showConfirm,
  showToast,
  toggleLoading,
  updateDashboard,
  updateImgHelper,
} from "./ui-flow.js";

export const fetchProductList = async () => {
  toggleLoading(true);
  el.productTableList.innerHTML = `
    <tr>
      <td colspan="7" class="loading-target py-10">
        <span class="spinner mx-auto"></span>
      </td>
    </tr>`;
  el.totalTypes.textContent = "";
  el.totalQuantity.textContent = "";
  el.maxPriceValue.textContent = "";
  el.maxPriceName.textContent = "";
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await axios.get(API_URL);
    state.productList = response.data;
    state.filteredList = [...response.data];
    renderProductList(state.filteredList);
    updateDashboard(state.productList);
  } catch (error) {
    el.productTableList.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4 text-red-500">Lỗi tải dữ liệu!</td>
        </tr>`;
    console.log(error);
  } finally {
    toggleLoading(false);
  }
};

const getFormData = () => {
  return {
    name: el.name.value.trim(),
    type: el.type.value.trim(),
    quantity: parseFloat(el.quantity.value),
    price: parseFloat(el.price.value),
    screen: el.screen.value.trim(),
    backCamera: el.backCamera.value.trim(),
    frontCamera: el.frontCamera.value.trim(),
    img: el.img.value.trim(),
    desc: el.desc.value.trim(),
  };
};

export const validationRules = {
  name: { noVietnamese: true, msg: "Tên sản phẩm không hợp lệ" },
  type: { noVietnamese: true, msg: "Tên hãng không hợp lệ" },
  price: { min: 1, msg: "Giá sản phẩm không hợp lệ" },
  quantity: { min: 0, msg: "Số lượng không hợp lệ" },
  screen: { noVietnamese: true, msg: "Thông số màn hình không hợp lệ" },
  backCamera: { noVietnamese: true, msg: "Thông số camera không hợp lệ" },
  frontCamera: { noVietnamese: true, msg: "Thông số camera không hợp lệ" },
  img: { noVietnamese: true, msg: "Link hình ảnh không hợp lệ" },
  desc: { msg: "Mô tả không hợp lệ" },
};

// hàm validate cho từng field
export const validateField = (field) => {
  const input = el[field];
  const errorTag = errorEl[field];
  const rule = validationRules[field];
  if (!input || !rule) return true;
  const rawValue = input.value.trim();
  let errorMessage = "";
  if (field === "img") updateImgHelper(rawValue);
  if (rawValue === "") {
    errorMessage = "Không được để trống";
  } else if (rule.noVietnamese) {
    const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    if (vnRegex.test(rawValue)) {
      errorMessage = rule.msg;
    }
  } else if (rule.min !== undefined) {
    const numValue = Number(rawValue);
    const isInvalidNumber = isNaN(numValue) || numValue < rule.min;
    const isDecimal = (field === "price" || field === "quantity") && !Number.isInteger(numValue);
    if (isInvalidNumber || isDecimal) {
      errorMessage = rule.msg;
    }
  }
  if (field === "name" && !errorMessage) {
    const isDuplicate = state.productList.some((product) => {
      const isSameName = product.name.toLowerCase() === rawValue.toLowerCase();
      const isNotCurrentProduct = product.name.toLowerCase() !== state.editingProduct?.name.toLowerCase();
      return isSameName && isNotCurrentProduct;
    });
    if (isDuplicate) {
      errorMessage = "Tên sản phẩm này đã tồn tại trong hệ thống";
    }
  }
  errorTag.innerHTML = errorMessage;
  errorTag.style.display = errorMessage ? "block" : "none";
  return errorMessage === "";
};

// hàm validate cho toàn bộ form
export const validateForm = () => {
  const fields = Object.keys(validationRules);
  let isValid = true;
  fields.forEach((field) => {
    const result = validateField(field);
    if (!result) isValid = false;
  });
  return isValid;
};

// hàm thêm sản phẩm
export const createProduct = async () => {
  const newProduct = getFormData();
  try {
    const response = await axios.post(API_URL, newProduct);
    resetForm();
    closeModal();
    showToast("Tạo mới sản phẩm thành công");
    await fetchProductList();
  } catch (error) {
    console.log(error);
    showToast("Có lỗi xảy ra khi tạo mới sản phẩm", "error");
  }
};

// hàm cập nhật sản phẩm
export const updateProduct = async () => {
  const updatedProduct = getFormData();
  try {
    await axios.put(`${API_URL}/${state.editingProduct.id}`, updatedProduct);
    showToast("Cập nhật sản phẩm thành công");
    resetForm();
    closeModal();
    await fetchProductList();
  } catch (error) {
    console.log(error);
    showToast("Có lỗi xảy ra khi cập nhật sản phẩm", "error");
  }
};

// hàm xoá sản phẩm
window.deleteProduct = async (productId) => {
  const isConfirmed = await showConfirm("Xác nhận xóa", "Bạn có chắc chắn muốn xoá sản phẩm này khỏi hệ thống không?");
  if (!isConfirmed) return;
  try {
    await axios.delete(`${API_URL}/${productId}`);
    showToast("Xoá sản phẩm thành công");
    await fetchProductList();
  } catch (error) {
    console.log(error);
    showToast("Có lỗi xảy ra khi xoá sản phẩm", "error");
  }
};

// hàm sửa thông tin sản phẩm
window.editProduct = async (productId) => {
  try {
    const product = await state.productList.find((phone) => phone.id == productId);
    if (!product) {
      showToast("Không tìm thấy sản phẩm");
      return;
    }
    state.editingProduct = product;
    Object.keys(validationRules).forEach((field) => {
      el[field].value = product[field];
    });
    setupModal("Cập nhật thông tin sản phẩm", true);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
};

// hàm submit form
export const submitForm = () => {
  if (!validateForm()) return;
  if (state.editingProduct) {
    updateProduct();
  } else {
    createProduct();
  }
};
