export const API_URL = "https://69cfbef7a4647a9fc675e9d2.mockapi.io/phone/phone";

export const state = {
  productList: [],
  filteredList: [],
  editingProduct: null,
  currentPage: 1,
  pageSize: 10,
  sortConfig: { key: "id", direction: "asc" },
};

export const el = {
  // dark mode switcher
  darkModeBtn: document.getElementById("theme-toggle"),
  // render product list
  loadingTarget: document.querySelectorAll(".loading-target"),
  productTableList: document.getElementById("product-table-list"),
  // dashboard
  totalTypes: document.getElementById("total-types"),
  totalQuantity: document.getElementById("total-quantity"),
  maxPriceValue: document.getElementById("max-price-value"),
  maxPriceName: document.getElementById("max-price-name"),
  // search box
  searchInput: document.getElementById("search-input"),
  searchBtn: document.getElementById("search-btn"),
  // sort btn
  sortUp: document.querySelectorAll(".sort-up"),
  sortDown: document.querySelectorAll(".sort-down"),
  // filter btn
  filterIcon: document.getElementById("filter-icon"),
  filterDropdown: document.getElementById("filter-dropdown"),
  // modal
  openAddModalBtn: document.getElementById("add-new-product"),
  modal: document.getElementById("modal"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalTitle: document.getElementById("modal-title"),
  form: document.getElementById("product-form"),
  name: document.getElementById("product-name"),
  type: document.getElementById("product-type"),
  quantity: document.getElementById("product-quantity"),
  plusQuantity: document.getElementById("plus-quantity"),
  minusQuantity: document.getElementById("minus-quantity"),
  price: document.getElementById("product-price"),
  screen: document.getElementById("product-screen"),
  backCamera: document.getElementById("product-back-camera"),
  frontCamera: document.getElementById("product-front-camera"),
  img: document.getElementById("product-img"),
  imgPreview: document.getElementById("img-preview"),
  desc: document.getElementById("product-desc"),
  addBtn: document.getElementById("add-btn"),
  updateBtn: document.getElementById("update-btn"),
  resetBtn: document.getElementById("reset-btn"),
  cancelBtn: document.getElementById("cancel-btn"),
  // toast
  toastContainer: document.getElementById("toast-container"),
  confirmOverlay: document.getElementById("confirm-overlay"),
  confirmBox: document.getElementById("confirm-box"),
  confirmTitle: document.getElementById("confirm-title"),
  confirmMsg: document.getElementById("confirm-msg"),
  confirmYes: document.getElementById("confirm-yes"),
  confirmNo: document.getElementById("confirm-no"),
};

export const errorEl = {
  spans: document.querySelectorAll(".err-msg"),
  name: document.getElementById("name-error"),
  type: document.getElementById("type-error"),
  quantity: document.getElementById("quantity-error"),
  price: document.getElementById("price-error"),
  screen: document.getElementById("screen-error"),
  backCamera: document.getElementById("back-camera-error"),
  frontCamera: document.getElementById("front-camera-error"),
  img: document.getElementById("img-error"),
  desc: document.getElementById("desc-error"),
};
