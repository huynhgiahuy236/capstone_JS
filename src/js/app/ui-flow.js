// 1. Khởi tạo Slider (Swiper)
export const initSlider = () => {
    if (document.querySelector(".myBanner")) {
        new Swiper(".myBanner", {
            loop: true,               // Lặp vô tận
            grabCursor: true,         // Hiện bàn tay khi rê vào (kéo thả)
            autoplay: {
                delay: 3000,          // 3 giây chuyển 1 lần
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            effect: "creative",       // Hiệu ứng chuyển động hiện đại
            creativeEffect: {
                prev: { shadow: true, translate: ["-20%", 0, -1] },
                next: { translate: ["100%", 0, 0] },
            },
        });
    }
};

// 2. Logic xử lý tìm kiếm và cuộn trang
export const initSearchFlow = () => {
    const headerSearch = document.getElementById('headerSearchInput');
    const mainSearch = document.getElementById('searchInput');
    const targetSection = document.getElementById('sanPham');

    //Hàm xử lý khi nhấn Enter ở bất kỳ ô search nào
     
    const handleSearchEvent = (event, currentInput, otherInput) => {
        if (event.key === 'Enter') {
            const keyword = currentInput.value.trim();

            // Đồng bộ nội dung giữa 2 ô input
            if (otherInput) {
                otherInput.value = keyword;
            }

            // Cuộn màn hình xuống phần danh mục điện thoại (id="sanPham")
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Gọi hàm lọc sản phẩm tổng hợp.
            if (typeof thucHienFilterTongHop === 'function') {
                thucHienFilterTongHop();
            }

            // Bỏ focus khỏi ô input để đóng bàn phím ảo (trên mobile)
            currentInput.blur();
        }
    };

    // Gán sự kiện Keypress cho ô ở Header
    if (headerSearch) {
        headerSearch.addEventListener('keypress', (e) => {
            handleSearchEvent(e, headerSearch, mainSearch);
        });
    }

    // Gán sự kiện Keypress cho ô ở khu vực sản phẩm
    if (mainSearch) {
        mainSearch.addEventListener('keypress', (e) => {
            handleSearchEvent(e, mainSearch, headerSearch);
        });
    }
};

/**
 * Tự động khởi chạy khi file được load (nếu không dùng type="module" 
 * hoặc muốn chạy trực tiếp thì có thể dùng DOMContentLoaded)
 */
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initSearchFlow();
});