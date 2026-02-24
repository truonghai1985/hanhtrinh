// Chờ HTML load xong để tương tác Dom
document.addEventListener('DOMContentLoaded', () => {

    // 1. Quản lý lõi thanh tiến trình (Progress Bar)
    const container = document.querySelector('.timeline-container');
    const progressBar = document.getElementById('progressBar');

    if (container && progressBar) {
        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            // Tính số phần trăm cuộn
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercentage + '%';
        });
    }

    // 2. Sử dụng Intersection Observer để phát hiện phần tử đi vào khung nhìn (Viewport)
    // Threshold 0.35 nghĩa là khi thấy 35% diện tích phần tử thì sẽ kích hoạt hiệu ứng
    const observerOptions = {
        root: container,
        rootMargin: '0px',
        threshold: 0.35
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class để khởi động CSS Animation Fade In
                entry.target.classList.add('is-visible');
            } else {
                // Xoá class đi khi ra khỏi tầm nhìn để lần lướt lại vẫn có hiệu ứng
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Kích hoạt theo dõi trên tất cả các section toàn khung
    const sections = document.querySelectorAll('.fullscreen-section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Scroll Spy cho Menu Sang trọng
    const menuItems = document.querySelectorAll('.menu-item');
    const menuObserverOptions = {
        root: container,
        rootMargin: '0px',
        threshold: 0.5 // Kích hoạt khi phân cảnh chiếm 50% khung nhìn
    };

    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let targetMenu = '';
                if (entry.target.classList.contains('hero-section')) {
                    targetMenu = 'intro';
                } else if (entry.target.classList.contains('timeline-section')) {
                    targetMenu = 'journey';
                } else if (entry.target.classList.contains('roadmap-section') || entry.target.classList.contains('outro-section')) {
                    targetMenu = 'roadmap';
                }

                if (targetMenu) {
                    menuItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('data-target') === targetMenu) {
                            item.classList.add('active');
                        }
                    });
                }
            }
        });
    }, menuObserverOptions);

    sections.forEach(section => menuObserver.observe(section));

    // Cố ý kích hoạt section đầu tiên (Hero Section) hiển thị sau 100ms khi trang vừa load xong
    setTimeout(() => {
        const firstSec = document.querySelector('.hero-section');
        if (firstSec) firstSec.classList.add('is-visible');
    }, 100);

    // 3. Xử lý nút Trở lên đầu trang (Back to top)
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            // Cuộn ngược về phân cảnh 1985 (timeline-section đầu tiên)
            const targetSection = document.querySelector('.timeline-section');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // LOGIC CHO TRANG BLOG (CHIÊM NGHIỆM)
    // ==========================================
    const blogSearch = document.getElementById('blogSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    // Hàm dùng chung để lọc bài viết
    function filterArticles() {
        if (!blogSearch) return; // Nếu không phải trang blog thì bỏ qua

        const searchTerm = blogSearch.value.toLowerCase();
        let activeFilter = 'all';

        // Tìm button filter đang active
        filterBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                activeFilter = btn.getAttribute('data-filter');
            }
        });

        blogCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
            const category = card.getAttribute('data-category');

            // Kiểm tra điều kiện Search
            const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);

            // Kiểm tra điều kiện Filter
            const matchesCategory = (activeFilter === 'all') || (activeFilter === category);

            // Nếu thỏa mãn cả 2 điều kiện thì hiện, ngược lại thì ẩn
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Gắn sự kiện gõ phím vào thanh Search
    if (blogSearch) {
        blogSearch.addEventListener('input', filterArticles);
    }

    // Gắn sự kiện click vào các nút Filter
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Xoá active ở nút cũ
                filterBtns.forEach(b => b.classList.remove('active'));
                // Thêm active vào nút mới
                btn.classList.add('active');

                // Gọi hàm lọc
                filterArticles();
            });
        });
    }

});

// Hàm giúp nhấn menu là trang web tự cuộn ngang đến phần đó
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Bổ sung hàm chuyển đổi ngôn ngữ
function changeLang(lang) {
    // Cập nhật nút active
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');

    // Sử dụng CSS class trên body để điều khiển ẩn hiện thay vì dùng inline styles (tránh lỗi hiển thị None)
    if (lang === 'en') {
        document.body.classList.add('lang-en');
    } else {
        document.body.classList.remove('lang-en');
    }
}
