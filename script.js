// =============================================
// DAT BOUTIQUE - SCRIPT.JS
// PHIEN BAN DA SUA LOI
// =============================================

// 1. KHOI TAO GIO HANG VA LUU DU LIEU

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

// 2. KHOI TAO EMAILJS

if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "uxPUUJpYMMZ3dycSn"
    });
}

// 3. CAC HAM HO TRO

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

// 4. CHUYEN ANH SAN PHAM TREN TRANG CHU

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

// 5. THEM SAN PHAM VAO GIO HANG

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
        return false;
    }

    if (!Number.isFinite(soLuong) || soLuong < 1) {
        soLuong = 1;
    }

    if (soLuong > 20) {
        alert("Mỗi lần chỉ được thêm tối đa 20 sản phẩm!");
        return false;
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
            return false;
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

    return true;
}

// 6. HIEN THI GIO HANG

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

    if (soLuongElement) {
        soLuongElement.textContent = tongSoLuong;
    }

    if (tongTienElement) {
        tongTienElement.textContent = dinhDangTien(tongTien);
    }

    if (!danhSach) return;

    if (gioHang.length === 0) {
        danhSach.innerHTML = `
            <p class="gio-hang-trong">
                Giỏ hàng của bạn đang trống.
            </p>
        `;

        return;
    }

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

// 7. TANG GIAM SO LUONG TRONG GIO

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

// 8. XOA SAN PHAM

function xoaSanPham(index) {
    if (!gioHang[index]) return;

    gioHang.splice(index, 1);

    luuGioHang();
    hienThiGioHang();
}
// 9. TIM KIEM VA LOC SAN PHAM

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
        const dungDanhMuc = danhMuc === "all" || loai === danhMuc;

        sp.style.display =
            dungTuKhoa && dungDanhMuc ? "" : "none";
    });
}

// 10. AP DUNG GIAM GIA 30%

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

// 11. DU LIEU CHI TIET SAN PHAM

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

// 12. KHOI TAO TRANG CHI TIET SAN PHAM

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

    if (giaCu) {
        giaCu.textContent = dinhDangTien(sp.gia);
    }

    if (giaMoi) {
        giaMoi.textContent = dinhDangTien(tinhGiaSale(sp.gia));
    }

    if (moTa) {
        moTa.textContent = sp.moTa;
    }

    if (soLuong) {
        soLuong.value = 1;
    }

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

    if (anhLon && sp.anh.length) {
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
                    onclick="chonAnhChiTiet('${lamSachHTML(anh)}', this)"
                >
            `;
        }).join("");
    }

    khungChiTiet.dataset.productId = maSanPham;
}

function chonAnhChiTiet(duongDan, anhNho) {
    const anhLon = layPhanTu("chiTietAnhLon");

    if (anhLon) {
        anhLon.src = duongDan;
    }

    document.querySelectorAll(".chi-tiet-anh-nho img").forEach(function (anh) {
        anh.classList.remove("anh-dang-chon");
    });

    if (anhNho) {
        anhNho.classList.add("anh-dang-chon");
    }
}

function doiSoLuongChiTiet(thayDoi) {
    const oSoLuong = layPhanTu("chiTietSoLuong");

    if (!oSoLuong) return;

    let soLuong = Number(oSoLuong.value) || 1;

    soLuong += Number(thayDoi);

    if (soLuong < 1) soLuong = 1;
    if (soLuong > 20) soLuong = 20;

    oSoLuong.value = soLuong;
}

function themTuTrangChiTiet() {
    const khung = layPhanTu("trangChiTietSanPham");

    if (!khung) return false;

    const maSanPham = khung.dataset.productId;
    const sp = duLieuSanPham[maSanPham];

    if (!sp) return false;

    const mau = layPhanTu("chiTietMau");
    const size = layPhanTu("chiTietSize");
    const soLuong = layPhanTu("chiTietSoLuong");
    const anh = layPhanTu("chiTietAnhLon");

    return themGioHang(
        sp.ten,
        sp.gia,
        anh ? anh.getAttribute("src") : sp.anh[0],
        soLuong ? soLuong.value : 1,
        mau ? mau.value : "",
        size ? size.value : ""
    );
}

function muaNgayTrangChiTiet() {
    const daThem = themTuTrangChiTiet();

    if (daThem) {
        window.location.href = "./index.html#gio-hang";
    }
}// 13. HIEN THI / AN FORM DAT HANG

function layKhuVucDatHang() {
    return document.getElementById("dat-hang") ||
        document.getElementById("formDatHang");
}

function hienThiDatHang() {
    if (gioHang.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return false;
    }

    const form = layKhuVucDatHang();

    if (!form) {
        alert("Không tìm thấy khu vực đặt hàng!");
        return false;
    }

    form.hidden = false;
    form.style.display = "block";

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    return false;
}

function anFormDatHang() {
    const form = layKhuVucDatHang();

    if (!form) return;

    form.hidden = true;
    form.style.display = "none";
}

function dongFormDatHang() {
    anFormDatHang();
}

function layPhuongThucThanhToan() {
    const luaChon = document.querySelector(
        'input[name="thanhToan"]:checked'
    );

    return luaChon
        ? luaChon.value
        : "Thanh toán khi nhận hàng";
}

function capNhatPhuongThucThanhToan() {
    const phuongThuc = layPhuongThucThanhToan().toLowerCase();
    const khungQR = layPhanTu("khungQR", "thanhToanQR");

    if (khungQR) {
        khungQR.style.display =
            phuongThuc.includes("qr") ||
            phuongThuc.includes("chuyển khoản")
                ? "block"
                : "none";
    }
}

function taoNoiDungDonHang() {
    return gioHang.map(function (sp, index) {
        return (
            (index + 1) + ". " +
            sp.ten +
            (sp.mau ? " - Màu: " + sp.mau : "") +
            (sp.size ? " - Size: " + sp.size : "") +
            " - SL: " + sp.soLuong +
            " - " + dinhDangTien(sp.gia * sp.soLuong)
        );
    }).join("\n");
}

function tinhTongTien() {
    return gioHang.reduce(function (tong, sp) {
        return tong + sp.gia * sp.soLuong;
    }, 0);
}

// 14. GUI DON HANG QUA EMAILJS

function guiDonHang(event) {
    if (event) event.preventDefault();

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước!");
        return;
    }

    const ten = layPhanTu("tenKhach", "ten-khach");
    const dienThoai = layPhanTu("soDienThoai", "so-dien-thoai");
    const diaChi = layPhanTu("diaChi", "dia-chi");
    const email = layPhanTu("emailKhach", "email-khach");

    if (!ten || !dienThoai || !diaChi) {
        alert("Không tìm thấy đầy đủ ô thông tin đặt hàng.");
        return;
    }

    const tenKhach = ten.value.trim();
    const soDienThoai = dienThoai.value.trim();
    const diaChiKhach = diaChi.value.trim();
    const emailKhach = email ? email.value.trim() : "";

    if (!tenKhach || !soDienThoai || !diaChiKhach) {
        alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
        return;
    }

    if (!/^(0\d{9}|\+84\d{9})$/.test(soDienThoai)) {
        alert("Số điện thoại chưa đúng định dạng. Vui lòng kiểm tra lại.");
        return;
    }

    if (
        emailKhach &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKhach)
    ) {
        alert("Email chưa đúng định dạng. Vui lòng kiểm tra lại.");
        return;
    }

    if (typeof emailjs === "undefined") {
        alert("Chức năng gửi đơn hàng chưa được kết nối. Vui lòng thử lại sau.");
        return;
    }

    const thamSoEmail = {
        ten_khach: tenKhach,
        so_dien_thoai: soDienThoai,
        dia_chi: diaChiKhach,
        email_khach: emailKhach,
        san_pham: taoNoiDungDonHang(),
        tong_tien: dinhDangTien(tinhTongTien()),
        thanh_toan: layPhuongThucThanhToan()
    };

    emailjs.send(
        "service_338elep",
        "template_0xjohd8",
        thamSoEmail
    ).then(function () {
        alert("Đặt hàng thành công! Thông tin đơn hàng đã được gửi.");

        gioHang = [];

        luuGioHang();
        hienThiGioHang();
        anFormDatHang();

        const form = layPhanTu("formDatHang", "dat-hang");

        if (form && typeof form.reset === "function") {
            form.reset();
        }

        capNhatPhuongThucThanhToan();

    }).catch(function (error) {
        console.error("Lỗi gửi đơn hàng:", error);

        alert("Không gửi được đơn hàng. Vui lòng kiểm tra lại kết nối và thử lại.");
    });
}

// 15. CAC SU KIEN KHI TRANG WEB DUOC TAI

// Dam bao form dat hang duoc an khi moi mo trang

(function themCSSAnForm() {
    if (document.getElementById("dat-boutique-hidden-style")) return;

    const style = document.createElement("style");

    style.id = "dat-boutique-hidden-style";

    style.textContent = `
        #dat-hang[hidden],
        #formDatHang[hidden] {
            display: none !important;
        }
    `;

    document.head.appendChild(style);
})();

document.addEventListener("DOMContentLoaded", function () {

    hienThiGioHang();
    anFormDatHang();
    apDungSale();

    // Tim kiem san pham

    const oTimKiem = layPhanTu("timKiem", "tim-kiem");

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

    // Bam vao san pham de mo trang chi tiet

    document.querySelectorAll(".danh-sach .san-pham").forEach(function (sp) {

        const anh = sp.querySelector(".anh-chinh");
        const ten = sp.querySelector("h3");

        let id = sp.dataset.productId || sp.dataset.product || "";

        // Tu nhan dien theo ten san pham neu HTML chua co ma ID

        if (!id) {
            const noiDung = (ten ? ten.textContent : sp.textContent)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            if (noiDung.includes("bo the thao 3 soc")) {
                id = "bo-3-soc";

            } else if (noiDung.includes("bo adidas den soc trang")) {
                id = "adidas-den";

            } else if (noiDung.includes("mu adidas")) {
                id = "mu-adidas";

            } else if (noiDung.includes("dep adidas")) {
                id = "dep-adidas";
            }
        }

        if (id) sp.dataset.productId = id;

        function moTrangRieng(event) {

            // Khong chuyen trang khi bam nut, link hoac dieu khien ben trong

            if (event.target.closest("button, a, select, input, textarea, .anh-phu")) {
                return;
            }

            if (!id) {
                alert("Chua xac dinh duoc ma san pham. Hay kiem tra ten san pham trong HTML.");
                return;
            }

            window.location.href =
                "./san-pham.html?id=" + encodeURIComponent(id);
        }

        sp.style.cursor = "pointer";

        sp.addEventListener("click", moTrangRieng);

        if (anh) anh.style.cursor = "pointer";
        if (ten) ten.style.cursor = "pointer";
    });

    // Nut tien hanh thanh toan

    document.querySelectorAll(".nut-tien-hanh-thanh-toan").forEach(function (nutThanhToan) {
        nutThanhToan.addEventListener("click", function (event) {
            event.preventDefault();
            hienThiDatHang();
        });
    });

    // Nut dong form dat hang

    const nutDong = layPhanTu("dongFormDatHang", "nutDongFormDatHang");

    if (nutDong) {
        nutDong.addEventListener("click", dongFormDatHang);
    }

    // Cap nhat phuong thuc thanh toan

    document.querySelectorAll('input[name="thanhToan"]').forEach(function (radio) {
        radio.addEventListener("change", capNhatPhuongThucThanhToan);
    });

    capNhatPhuongThucThanhToan();

    // Khoi tao trang chi tiet san pham

    khoiTaoTrangChiTiet();

});
