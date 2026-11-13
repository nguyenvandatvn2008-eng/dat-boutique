// =============================================
// DAT BOUTIQUE - SCRIPT.JS
// PHIEN BAN HOAN CHINH
// =============================================


// =============================================
// 1. KHOI TAO GIO HANG VA LUU DU LIEU
// =============================================

let gioHang = [];

function taiGioHang() {
    try {
        const duLieu = JSON.parse(
            localStorage.getItem("datBoutiqueGioHang")
        );

        if (!Array.isArray(duLieu)) return [];

        return duLieu
            .filter(sp => sp && typeof sp === "object")
            .map(sp => ({
                ten: String(sp.ten || "Sản phẩm"),
                gia: Math.max(0, Number(sp.gia) || 0),
                giaGoc: Math.max(0, Number(sp.giaGoc) || 0),
                anh: String(sp.anh || ""),
                soLuong: Math.max(
                    1,
                    Math.min(20, Math.floor(Number(sp.soLuong) || 1))
                ),
                mau: String(sp.mau || ""),
                size: String(sp.size || "")
            }));
    } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error);
        return [];
    }
}

gioHang = taiGioHang();


function luuGioHang() {
    try {
        localStorage.setItem(
            "datBoutiqueGioHang",
            JSON.stringify(gioHang)
        );

        return true;
    } catch (error) {
        console.error("Lỗi lưu giỏ hàng:", error);

        alert("Không thể lưu giỏ hàng. Hãy kiểm tra bộ nhớ trình duyệt.");

        return false;
    }
}


// =============================================
// 2. KHOI TAO EMAILJS
// =============================================

if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "uxPUUJpYMMZ3dycSn"
    });
}


// =============================================
// 3. CAC HAM HO TRO
// =============================================

function layPhanTu(...ids) {
    for (const id of ids) {
        const element = document.getElementById(id);

        if (element) return element;
    }

    return null;
}


function dinhDangTien(gia) {
    return Number(gia || 0).toLocaleString("vi-VN") + "đ";
}


function tinhGiaSale(giaGoc) {
    return Math.round(Number(giaGoc) * 0.7);
}


function lamSachHTML(noiDung) {
    return String(noiDung ?? "").replace(/[&<>"']/g, function (kyTu) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[kyTu];
    });
}


function anThongBaoCu() {
    const thongBao = layPhanTu("thongBao", "thong-bao");

    if (thongBao) {
        thongBao.style.display = "none";
    }
}


// =============================================
// 4. CHUYEN ANH SAN PHAM
// =============================================

function doiAnh(anhNho) {
    if (!anhNho) return;

    const khungAnh = anhNho.closest(".san-pham");

    if (!khungAnh) return;

    const anhChinh = khungAnh.querySelector(".anh-chinh");

    if (anhChinh) {
        anhChinh.src = anhNho.src;
    }

    khungAnh.querySelectorAll(".anh-phu img").forEach(function (anh) {
        anh.classList.remove("anh-dang-chon");
    });

    anhNho.classList.add("anh-dang-chon");
}


// =============================================
// 5. THEM SAN PHAM VAO GIO HANG
// =============================================

function themGioHang(
    ten,
    giaGoc,
    anh = "",
    soLuong = 1,
    mau = "",
    size = ""
) {

    giaGoc = Number(giaGoc);
    soLuong = Math.floor(Number(soLuong));

    if (!ten || !Number.isFinite(giaGoc) || giaGoc <= 0) {
        alert("Thông tin sản phẩm không hợp lệ!");
        return;
    }

    if (!Number.isFinite(soLuong) || soLuong < 1) {
        soLuong = 1;
    }

    if (soLuong > 20) {
        alert("Mỗi lần chỉ được thêm tối đa 20 sản phẩm!");
        return;
    }

    const giaSale = tinhGiaSale(giaGoc);

    const sanPhamCu = gioHang.find(function (sp) {
        return sp.ten === ten &&
            sp.mau === mau &&
            sp.size === size;
    });

    if (sanPhamCu) {

        if (sanPhamCu.soLuong + soLuong > 20) {
            alert("Số lượng sản phẩm này không được vượt quá 20!");
            return;
        }

        sanPhamCu.soLuong += soLuong;

    } else {

        gioHang.push({
            ten: String(ten),
            gia: giaSale,
            giaGoc: giaGoc,
            anh: String(anh || ""),
            soLuong: soLuong,
            mau: String(mau || ""),
            size: String(size || "")
        });
    }

    luuGioHang();

    hienThiGioHang();

    alert("Đã thêm " + ten + " vào giỏ hàng!");
}


// =============================================
// 6. HIEN THI GIO HANG
// =============================================

function hienThiGioHang() {

    const danhSach = layPhanTu("danhSachGio", "danh-sach-gio");

    const soLuongElement = layPhanTu(
        "soluong",
        "soLuong",
        "so-luong-gio"
    );

    const tongTienElement = layPhanTu(
        "tongTien",
        "tong-tien"
    );

    let tongSoLuong = 0;
    let tongTien = 0;

    gioHang.forEach(function (sp) {
        tongSoLuong += sp.soLuong;
        tongTien += sp.gia * sp.soLuong;
    });

    // Cap nhat so luong
    if (soLuongElement) {
        soLuongElement.textContent = tongSoLuong;
    }

    // Cap nhat tong tien o khung tom tat
    if (tongTienElement) {
        tongTienElement.textContent = dinhDangTien(tongTien);
    }

    if (!danhSach) return;

    // Neu gio hang trong
    if (gioHang.length === 0) {

        danhSach.innerHTML = `
            <p class="gio-hang-trong">
                Giỏ hàng của bạn đang trống.
            </p>
        `;

        return;
    }

    // Hien thi tung san pham
    danhSach.innerHTML = gioHang.map(function (sp, index) {

        const ten = lamSachHTML(sp.ten);
        const anh = lamSachHTML(sp.anh);
        const mau = lamSachHTML(sp.mau);
        const size = lamSachHTML(sp.size);

        return `
            <div class="san-pham-gio-hang">

                ${anh ? `
                    <img src="${anh}" alt="${ten}">
                ` : ""}

                <div class="thong-tin-gio-hang">

                    <h4>${ten}</h4>

                    ${mau ? `<p>Màu: ${mau}</p>` : ""}

                    ${size ? `<p>Size: ${size}</p>` : ""}

                    <p>
                        Đơn giá:
                        ${dinhDangTien(sp.gia)}
                    </p>

                    <div class="nut-so-luong">

                        <button
                            type="button"
                            onclick="thayDoiSoLuong(${index}, -1)">
                            −
                        </button>

                        <span>${sp.soLuong}</span>

                        <button
                            type="button"
                            onclick="thayDoiSoLuong(${index}, 1)">
                            +
                        </button>

                    </div>

                    <p>
                        Thành tiền:
                        <strong>
                            ${dinhDangTien(sp.gia * sp.soLuong)}
                        </strong>
                    </p>

                    <button
                        type="button"
                        onclick="xoaSanPham(${index})">
                        Xóa sản phẩm
                    </button>

                </div>
            </div>
        `;

    }).join("");
}


// =============================================
// 7. TANG GIAM SO LUONG TRONG GIO
// =============================================

function thayDoiSoLuong(index, thayDoi) {

    const sp = gioHang[index];

    if (!sp) return;

    const soLuongMoi = sp.soLuong + Number(thayDoi);

    if (soLuongMoi <= 0) {

        gioHang.splice(index, 1);

    } else if (soLuongMoi > 20) {

        alert("Số lượng tối đa là 20!");

        return;

    } else {

        sp.soLuong = soLuongMoi;
    }

    luuGioHang();

    hienThiGioHang();
}


// =============================================
// 8. XOA SAN PHAM
// =============================================

function xoaSanPham(index) {

    if (!gioHang[index]) return;

    gioHang.splice(index, 1);

    luuGioHang();

    hienThiGioHang();
}


// =============================================
// 9. TIM KIEM VA LOC SAN PHAM
// =============================================

function locSanPham() {

    const oTimKiem = layPhanTu("timKiem", "tim-kiem");

    const tuKhoa = oTimKiem
        ? oTimKiem.value.toLowerCase().trim()
        : "";

    const danhMucDangChon = document.querySelector(".loc.dang-chon");

    const danhMuc = danhMucDangChon
        ? danhMucDangChon.dataset.category
        : "all";

    document.querySelectorAll(".danh-sach .san-pham").forEach(function (sp) {

        const ten = sp.textContent.toLowerCase();

        const loai = sp.dataset.category || "all";

        const dungTuKhoa = ten.includes(tuKhoa);

        const dungDanhMuc =
            danhMuc === "all" || loai === danhMuc;

        sp.style.display =
            dungTuKhoa && dungDanhMuc ? "" : "none";
    });
}


// =============================================
// 10. AP DUNG GIAM GIA 30%
// =============================================

function apDungSale() {

    document.querySelectorAll(".danh-sach .san-pham").forEach(function (sp) {

        const giaGoc = Number(sp.dataset.giaGoc);

        if (!Number.isFinite(giaGoc) || giaGoc <= 0) return;

        const giaSale = tinhGiaSale(giaGoc);

        const khungGia = sp.querySelector(".gia-san-pham");

        if (khungGia) {

            khungGia.innerHTML = `
                <del>${dinhDangTien(giaGoc)}</del>

                <strong>${dinhDangTien(giaSale)}</strong>

                <span class="nhan-giam-gia">-30%</span>
            `;
        }
    });
}


// =============================================
// 11. DU LIEU CHI TIET SAN PHAM
// =============================================

const duLieuSanPham = {

    "bo-3-soc": {
        ten: "Bộ thể thao 3 sọc",
        ma: "DB-001",
        gia: 350000,
        anh: [
            "dobo1.jpg",
            "dobo2.jpg",
            "dobo3.jpg",
            "dobo4.jpg"
        ],
        mau: ["Đen", "Trắng", "Xám"],
        size: ["S", "M", "L", "XL", "XXL"],
        moTa: "Bộ thể thao phong cách năng động, phù hợp mặc hằng ngày và vận động."
    },

    "adidas-den": {
        ten: "Bộ Adidas đen sọc trắng",
        ma: "DB-002",
        gia: 700000,
        anh: [
            "dobo1.1.jpg",
            "dobo1.2.jpg",
            "dobo1.3.jpg",
            "dobo1.4.jpg"
        ],
        mau: ["Đen sọc trắng"],
        size: ["S", "M", "L", "XL", "XXL"],
        moTa: "Bộ thể thao phối màu đen và sọc trắng, phong cách đơn giản và khỏe khoắn."
    },

    "mu-adidas": {
        ten: "Mũ Adidas",
        ma: "DB-003",
        gia: 500000,
        anh: ["mu.jpg"],
        mau: ["Đen", "Trắng"],
        size: ["Free size"],
        moTa: "Mũ phong cách thể thao, dễ phối với nhiều trang phục."
    },

    "dep-adidas": {
        ten: "Dép Adidas",
        ma: "DB-004",
        gia: 700000,
        anh: ["dep.jpg"],
        mau: ["Đen", "Trắng"],
        size: [
            "36", "37", "38", "39", "40",
            "41", "42", "43", "44", "45"
        ],
        moTa: "Dép phong cách thể thao, phù hợp sử dụng hằng ngày."
    }

};


// =============================================
// 12. KHOI TAO TRANG CHI TIET
// =============================================

function khoiTaoTrangChiTiet() {

    const khungChiTiet = layPhanTu("trangChiTietSanPham");

    if (!khungChiTiet) return;

    const thamSo = new URLSearchParams(window.location.search);

    const maSanPham = thamSo.get("id");

    const sp = duLieuSanPham[maSanPham];

    if (!sp) {

        khungChiTiet.innerHTML = `
            <h2>Không tìm thấy sản phẩm.</h2>
            <a href="./index.html">Quay lại trang chủ</a>
        `;

        return;
    }

    const ten = layPhanTu("chiTietTen");
    const ma = layPhanTu("chiTietMa");
    const giaCu = layPhanTu("chiTietGiaCu");
    const giaMoi = layPhanTu("chiTietGiaMoi");
    const anhLon = layPhanTu("chiTietAnhLon");
    const anhNho = layPhanTu("chiTietAnhNho");
    const mauSelect = layPhanTu("chiTietMau");
    const sizeSelect = layPhanTu("chiTietSize");
    const moTa = layPhanTu("chiTietMoTa");
    const soLuong = layPhanTu("chiTietSoLuong");

    if (ten) ten.textContent = sp.ten;

    if (ma) ma.textContent = sp.ma;

    if (giaCu) giaCu.textContent = dinhDangTien(sp.gia);

    if (giaMoi) {
        giaMoi.textContent = dinhDangTien(tinhGiaSale(sp.gia));
    }

    if (moTa) moTa.textContent = sp.moTa;

    if (soLuong) soLuong.value = 1;

    if (mauSelect) {

        mauSelect.innerHTML = sp.mau.map(function (mau) {

            return `
                <option value="${lamSachHTML(mau)}">
                    ${lamSachHTML(mau)}
                </option>
            `;

        }).join("");
    }

    if (sizeSelect) {

        sizeSelect.innerHTML = sp.size.map(function (size) {

            return `
                <option value="${lamSachHTML(size)}">
                    ${lamSachHTML(size)}
                </option>
            `;

        }).join("");
    }

    if (anhLon && sp.anh.length > 0) {
        anhLon.src = sp.anh[0];
        anhLon.alt = sp.ten;
    }

    if (anhNho) {

        anhNho.innerHTML = sp.anh.map(function (anh, index) {

            return `
                <img
                    src="${lamSachHTML(anh)}"
                    alt="${lamSachHTML(sp.ten)}"
                    class="${index === 0 ? "anh-dang-chon" : ""}"
                    onclick="chonAnhChiTiet(this)"
                >
            `;

        }).join("");
    }

    khungChiTiet.dataset.productId = maSanPham;
}


// =============================================
// 13. CHON ANH TRANG CHI TIET
// =============================================

function chonAnhChiTiet(anhNho) {

    const anhLon = layPhanTu("chiTietAnhLon");

    if (!anhLon || !anhNho) return;

    anhLon.src = anhNho.src;

    document.querySelectorAll("#chiTietAnhNho img").forEach(function (anh) {
        anh.classList.remove("anh-dang-chon");
    });

    anhNho.classList.add("anh-dang-chon");
}


// =============================================
// 14. TANG GIAM SO LUONG TRANG CHI TIET
// =============================================

function doiSoLuongChiTiet(thayDoi) {

    const oSoLuong = layPhanTu("chiTietSoLuong");

    if (!oSoLuong) return;

    let soLuong = Math.floor(Number(oSoLuong.value));

    if (!Number.isFinite(soLuong) || soLuong < 1) {
        soLuong = 1;
    }

    soLuong += Number(thayDoi);

    soLuong = Math.max(1, Math.min(20, soLuong));

    oSoLuong.value = soLuong;
}


// =============================================
// 15. LAY THONG TIN TRANG CHI TIET
// =============================================

function layThongTinChiTiet() {

    const khungChiTiet = layPhanTu("trangChiTietSanPham");

    if (!khungChiTiet) return null;

    const maSanPham = khungChiTiet.dataset.productId;

    const sp = duLieuSanPham[maSanPham];

    if (!sp) return null;

    const oSoLuong = layPhanTu("chiTietSoLuong");

    let soLuong = Math.floor(Number(oSoLuong?.value));

    if (!Number.isFinite(soLuong) || soLuong < 1) {
        soLuong = 1;
    }

    if (soLuong > 20) {
        alert("Số lượng tối đa là 20!");
        return null;
    }

    return {
        sp: sp,
        mau: layPhanTu("chiTietMau")?.value || "",
        size: layPhanTu("chiTietSize")?.value || "",
        soLuong: soLuong
    };
}


// =============================================
// 16. THEM HANG TU TRANG CHI TIET
// =============================================

function themTuTrangChiTiet() {

    const duLieu = layThongTinChiTiet();

    if (!duLieu) return;

    themGioHang(
        duLieu.sp.ten,
        duLieu.sp.gia,
        duLieu.sp.anh[0],
        duLieu.soLuong,
        duLieu.mau,
        duLieu.size
    );
}


// =============================================
// 17. MUA NGAY TU TRANG CHI TIET
// =============================================

function muaNgayTrangChiTiet() {

    const duLieu = layThongTinChiTiet();

    if (!duLieu) return;

    themGioHang(
        duLieu.sp.ten,
        duLieu.sp.gia,
        duLieu.sp.anh[0],
        duLieu.soLuong,
        duLieu.mau,
        duLieu.size
    );

    window.location.href = "./index.html#giohang";
}


// =============================================
// 18. HIEN THI FORM DAT HANG
// =============================================

function hienThiDatHang() {

    if (gioHang.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return false;
    }

    const khuVucDatHang = layPhanTu("dat-hang");

    if (!khuVucDatHang) {
        alert("Không tìm thấy khu vực đặt hàng!");
        return false;
    }

    khuVucDatHang.style.display = "block";

    khuVucDatHang.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    return false;
}


// =============================================
// 19. AN FORM DAT HANG
// =============================================

function anFormDatHang() {

    const khuVucDatHang = layPhanTu("dat-hang");

    if (khuVucDatHang) {
        khuVucDatHang.style.display = "none";
    }
}


// =============================================
// 20. HIEN THI MA QR THANH TOAN
// =============================================

function hienThiThanhToan() {

    const hinhThuc = layPhanTu(
        "thanhToan",
        "phuongThucThanhToan"
    );

    const khungQR = layPhanTu(
        "khungQR",
        "qrThanhToan"
    );

    if (!hinhThuc || !khungQR) return;

    khungQR.style.display =
        hinhThuc.value === "qr" ? "block" : "none";
}


// =============================================
// 21. DAT HANG
// =============================================

async function datHang() {

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    const tenKhach = layPhanTu(
        "tenKhach",
        "ten_khach",
        "hoTen"
    )?.value.trim() || "";

    const soDienThoai = layPhanTu(
        "soDienThoai",
        "so_dien_thoai",
        "dienThoai"
    )?.value.trim() || "";

    const diaChi = layPhanTu(
        "diaChi",
        "dia_chi"
    )?.value.trim() || "";

    const hinhThuc = layPhanTu(
        "thanhToan",
        "phuongThucThanhToan"
    )?.value || "cod";

    if (!tenKhach || !soDienThoai || !diaChi) {

        alert(
            "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ!"
        );

        return;
    }

    if (!/^(0\d{9}|\+84\d{9})$/.test(soDienThoai)) {

        alert("Số điện thoại không hợp lệ!");

        return;
    }

    if (typeof emailjs === "undefined") {

        alert("EmailJS chưa được tải. Hãy kiểm tra lại HTML!");

        return;
    }

    const tongTien = gioHang.reduce(function (tong, sp) {
        return tong + sp.gia * sp.soLuong;
    }, 0);

    const danhSachSanPham = gioHang.map(function (sp) {

        return (
            sp.ten +
            (sp.mau ? " - Màu: " + sp.mau : "") +
            (sp.size ? " - Size: " + sp.size : "") +
            " - SL: " + sp.soLuong +
            " - Giá: " + dinhDangTien(sp.gia)
        );

    }).join("\n");

    const duLieuDonHang = {
        ten_khach: tenKhach,
        so_dien_thoai: soDienThoai,
        dia_chi: diaChi,
        san_pham: danhSachSanPham,
        tong_tien: dinhDangTien(tongTien),
        thanh_toan: hinhThuc === "qr"
            ? "Chuyển khoản QR"
            : "Thanh toán khi nhận hàng"
    };

    const nutDatHang = layPhanTu(
        "nutDatHang",
        "btnDatHang"
    );

    const noiDungNutCu = nutDatHang
        ? nutDatHang.textContent
        : "";

    try {

        if (nutDatHang) {
            nutDatHang.disabled = true;
            nutDatHang.textContent = "ĐANG GỬI ĐƠN...";
        }

        await emailjs.send(
            "service_338elep",
            "template_0xjohd8",
            duLieuDonHang
        );

        alert(
            "Đặt hàng thành công! DAT BOUTIQUE đã nhận được thông tin đơn hàng."
        );

        // Xoa gio hang sau khi gui don thanh cong
        gioHang = [];

        luuGioHang();

        hienThiGioHang();

        // Lam moi form
        const form = layPhanTu(
            "formDatHang",
            "form-dat-hang"
        );

        if (form) {
            form.reset();
        }

        // An QR
        hienThiThanhToan();

        // An form dat hang
        anFormDatHang();

        // Cuon ve gio hang
        const khuVucGioHang = layPhanTu("giohang");

        if (khuVucGioHang) {
            khuVucGioHang.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    } catch (error) {

        console.error("Lỗi gửi đơn hàng:", error);

        alert(
            "Chưa gửi được đơn hàng. Vui lòng kiểm tra kết nối hoặc thử lại sau."
        );

    } finally {

        if (nutDatHang) {
            nutDatHang.disabled = false;
            nutDatHang.textContent = noiDungNutCu || "ĐẶT HÀNG";
        }
    }
}


// =============================================
// 22. KHOI TAO CAC CHUC NANG KHI MO TRANG
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    // Hien thi gio hang
    hienThiGioHang();

    // An form dat hang khi moi vao website
    anFormDatHang();

    // Ap dung giam gia
    apDungSale();

    // Tim kiem san pham
    const oTimKiem = layPhanTu(
        "timKiem",
        "tim-kiem"
    );

    if (oTimKiem) {
        oTimKiem.addEventListener("input", locSanPham);
    }

    // Loc danh muc
    document.querySelectorAll(".loc").forEach(function (nut) {

        nut.addEventListener("click", function () {

            document.querySelectorAll(".loc").forEach(function (item) {
                item.classList.remove("dang-chon");
            });

            nut.classList.add("dang-chon");

            locSanPham();
        });
    });

    // Chuyen sang trang chi tiet
    document.querySelectorAll(
        ".danh-sach .san-pham"
    ).forEach(function (sp) {

        const id = sp.dataset.productId;

        const anh = sp.querySelector(".anh-chinh");

        const ten = sp.querySelector("h3");

        function moTrangRieng() {

            if (!id) {
                alert(
                    "Sản phẩm chưa có mã data-product-id trong HTML."
                );

                return;
            }

            window.location.href =
                "./san-pham.html?id=" +
                encodeURIComponent(id);
        }

        if (anh) {
            anh.style.cursor = "pointer";
            anh.addEventListener("click", moTrangRieng);
        }

        if (ten) {
            ten.style.cursor = "pointer";
            ten.addEventListener("click", moTrangRieng);
        }
    });

    // Xu ly nut tien hanh thanh toan
    const nutThanhToan = document.querySelector(
        ".nut-tien-hanh-thanh-toan"
    );

    if (nutThanhToan) {

        nutThanhToan.addEventListener("click", function (event) {

            event.preventDefault();

            hienThiDatHang();
        });
    }

    // Hien thi QR khi chon phuong thuc
    const hinhThuc = layPhanTu(
        "thanhToan",
        "phuongThucThanhToan"
    );

    if (hinhThuc) {

        hinhThuc.addEventListener(
            "change",
            hienThiThanhToan
        );

        hienThiThanhToan();
    }

    // Khoi tao trang chi tiet
    khoiTaoTrangChiTiet();

});
