import { el } from "./js/admin/core.js";
import { fetchProductList, submitForm, validateField, validationRules } from "./js/admin/crud-flow.js";
import {
  closeModal,
  darkModeSwitcher,
  handleQuantityChange,
  openModal,
  resetForm,
  searchProduct,
} from "./js/admin/ui-flow.js";

// hàm xử lý form
const handleFormAction = (e, callback) => {
  e.preventDefault();
  callback();
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") document.documentElement.classList.add("dark");
  // render product list
  fetchProductList();
  // event dark mode
  el.darkModeBtn.addEventListener("click", darkModeSwitcher);
  // open modal
  el.openAddModalBtn.addEventListener("click", openModal);
  // close modal
  el.cancelBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === el.modalOverlay) closeModal();
  });
  // validation khi user nhập input
  Object.keys(validationRules).forEach((field) => {
    if (el[field]) {
      el[field].addEventListener("input", () => validateField(field));
    }
  });
  // tăng/giảm số lượng
  el.minusQuantity.addEventListener("click", () => handleQuantityChange("decrease"));
  el.plusQuantity.addEventListener("click", () => handleQuantityChange("increase"));
  // thêm sản phẩm
  el.addBtn.addEventListener("click", (e) => handleFormAction(e, submitForm));
  el.form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleFormAction(e, submitForm);
    }
  });
  // cập nhật thông tin sản phẩm
  el.updateBtn.addEventListener("click", (e) => handleFormAction(e, submitForm));
  // reset btn
  el.resetBtn.addEventListener("click", resetForm);
  // search sản phẩm
  el.searchInput.addEventListener("input", searchProduct);
  el.searchBtn.addEventListener("click", searchProduct);
  // sort sản phẩm
//   el.sortUp.forEach((btn, index) => btn.addEventListener("click", () => sortProduct(index, 1)));
//   el.sortDown.forEach((btn, index) => btn.addEventListener("click", () => sortProduct(index, -1)));
});
