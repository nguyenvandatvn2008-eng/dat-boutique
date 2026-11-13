// =============================================
// DAT BOUTIQUE - SCRIPT.JS
// Giỏ hàng, chi tiết sản phẩm và thanh toán
// =============================================

"use strict";

const KHOA_GIO_HANG = "datBoutiqueGioHang";
const EMAILJS_PUBLIC_KEY = "uxPUUJpYMMZ3dycSn";
const EMAILJS_SERVICE_ID = "service_338elep";
const EMAILJS_TEMPLATE_ID = "template_0xjohd8";

const duLieuSanPham = {
    "bo-3-soc": {
        ten: "Bộ thể thao 3 sọc",
        ma: "DB-001",
        gia: 350000,
        anh: ["dobo1.jpg", "dobo2.jpg", "dobo3.jpg", "dobo4.jpg"],
        mau: ["Đen", "Trắng", "Xám"],
        size: ["S", "M", "L", "XL", "XXL"],
        moTa: "Bộ thể thao 3 sọc mang phong cách năng động, phù hợp mặc hằng ngày và khi vận động. Thiết kế dễ phối đồ, tạo cảm giác thoải mái khi sử dụng."
    },
    "adidas-den": {
        ten: "Bộ Adidas đen sọc trắng",
        ma: "DB-002",
        gia: 700000,
        anh: ["dobo1.1.jpg", "dobo1.2.jpg", "dobo1.3.jpg", "dobo1.4.jpg"],
        mau: ["Đen sọc trắng"],
        size: ["S", "M", "L", "XL", "XXL"],
        moTa: "Bộ Adidas tông đen phối sọc trắng, phong cách thể thao đơn giản và khỏe khoắn. Phù hợp mặc thường ngày hoặc hoạt động nhẹ."
    },
    "mu-adidas": {
        ten: "Mũ Adidas",
        ma: "DB-003",
        gia: 500000,
        anh: ["mu.jpg"],
        mau: ["Đen", "Trắng"],
        size: ["Free size"],
        moTa: "Mũ phong cách thể thao, dễ phối với nhiều trang phục. Sản phẩm có lựa chọn màu sắc và kích thước Free size."
    },
    "dep-adidas": {
        ten: "Dép Adidas",
        ma: "DB-004",
        gia: 700000,
        anh: ["dep.jpg"],
        mau: ["Đen", "Trắng"],
        size: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
        moTa: "Dép phong cách thể thao, phù hợp sử dụng hằng ngày. Vui lòng chọn màu sắc và kích thước trước khi thêm vào giỏ hàng."
    }
};

let gioHang = docGioHang();
let sanPhamDangXem = null;

function docGioHang() {
    try {
        const duLieu = JSON.parse(localStorage.getItem(KHOA_GIO_HANG) || "[]");
        if (!Array.isArray(duLieu)) return [];
        return duLieu
            .filter(sp => sp && typeof sp === "object")
            .map(sp => ({
                id: String(sp.id || ""),
                ten: String(sp.ten || "Sản phẩm"),
                gia: Math.max(0, Number(sp.gia) || 0),
                giaGoc: Math.max(0, Number(sp.giaGoc) || 0),
                anh: String(sp.anh || ""),
                soLuong: Math.max(1, Math.min(20, Math.floor(Number(sp.soLuong) || 1))),
                mau: String(sp.mau || ""),
                size: String(sp.size || "")
            }));
    } catch (error) {
        console.error("Không đọc được giỏ hàng:", error);
        return [];
    }
}

function luuGioHang() {
    try {
        localStorage.setItem(KHOA_GIO_HANG, JSON.stringify(gioHang));
        return true;
    } catch (error) {
        console.error("Không lưu được giỏ hàng:", error);
        alert("Không thể lưu giỏ hàng. Vui lòng kiểm tra bộ nhớ trình duyệt.");
        return false;
    }
}

function dinhDangTien(gia) {
    return Number(gia || 0).toLocaleString("vi-VN") + "đ";
}

function tinhGiaSale(giaGoc) {
    return Math.round(Number(giaGoc) * 0.7);
}

function lamSachHTML(noiDung) {
    return String(noiDung ?? "").replace(/[&<>"']/g, kyTu => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[kyTu]);
}

function layPhanTu(id) {
    return document.getElementById(id);
}

function hienThiGioHang() {
    const danhSach = layPhanTu("danhSachGio");
    const soLuongEl = layPhanTu("soluong");
    const tongTienEl = layPhanTu("tongTien");
    const khungTongKet = layPhanTu("khungTongKet");
    const soLuongMenu = layPhanTu("soLuongMenu");

    const tongSoLuong = gioHang.reduce((tong, sp) => tong + sp.soLuong, 0);
    const tongTien = gioHang.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0);

    if (soLuongEl) soLuongEl.textContent = tongSoLuong;
    if (tongTienEl) tongTienEl.textContent = dinhDangTien(tongTien);
    if (soLuongMenu) soLuongMenu.textContent = tongSoLuong;

    if (khungTongKet) khungTongKet.hidden = gioHang.length === 0;

    if (!danhSach) return;

    if (gioHang.length === 0) {
        danhSach.innerHTML = '<p class="gio-hang-trong">Giỏ hàng của bạn đang trống. Hãy khám phá sản phẩm nhé!</p>';
        anFormDatHang();
        return;
    }

    danhSach.innerHTML = gioHang.map((sp, index) => `
        <article class="san-pham-gio-hang">
            <img class="anh-gio-hang" src="./${lamSachHTML(sp.anh)}" alt="${lamSachHTML(sp.ten)}" onerror="this.style.display='none'">
            <div class="thong-tin-gio-hang">
                <h3>${lamSachHTML(sp.ten)}</h3>
                ${sp.mau ? `<p>Màu: ${lamSachHTML(sp.mau)}</p>` : ""}
                ${sp.size ? `<p>Kích thước: ${lamSachHTML(sp.size)}</p>` : ""}
                <p>Đơn giá: <strong>${dinhDangTien(sp.gia)}</strong></p>
                <p>Thành tiền: <strong>${dinhDangTien(sp.gia * sp.soLuong)}</strong></p>
            </div>
            <div class="nut-so-luong">
                <button type="button" aria-label="Giảm số lượng" onclick="thayDoiSoLuong(${index}, -1)">−</button>
                <span>${sp.soLuong}</span>
                <button type="button" aria-label="Tăng số lượng" onclick="thayDoiSoLuong(${index}, 1)">+</button>
            </div>
            <button type="button" class="nut-xoa-san-pham" onclick="xoaSanPham(${index})">XÓA</button>
        </article>
    `).join("");
}

function themGioHang(id, soLuong = 1, mau = "", size = "") {
    const sp = duLieuSanPham[id];
    if (!sp) {
        alert("Không tìm thấy thông tin sản phẩm.");
        return false;
    }

    soLuong = Math.floor(Number(soLuong));
    if (!Number.isFinite(soLuong) || soLuong < 1) soLuong = 1;
    if (soLuong > 20) {
        alert("Mỗi lần chỉ được thêm tối đa 20 sản phẩm.");
        return false;
    }

    const mauChon = mau || sp.mau[0] || "";
    const sizeChon = size || sp.size[0] || "";
    const gia = tinhGiaSale(sp.gia);

    const daCo = gioHang.find(item =>
        item.id === id && item.mau === mauChon && item.size === sizeChon
    );

    if (daCo) {
        if (daCo.soLuong + soLuong > 20) {
            alert("Số lượng mỗi lựa chọn không được vượt quá 20.");
            return false;
        }
        daCo.soLuong += soLuong;
    } else {
        gioHang.push({
            id,
            ten: sp.ten,
            gia,
            giaGoc: sp.gia,
            anh: sp.anh[0],
            soLuong,
            mau: mauChon,
            size: sizeChon
        });
    }

    if (!luuGioHang()) return false;
    hienThiGioHang();
    alert("Đã thêm " + sp.ten + " vào giỏ hàng!");
    return true;
}

function themNhanh(id) {
    const sp = duLieuSanPham[id];
    if (!sp) return;
    themGioHang(id, 1, sp.mau[0], sp.size[0]);
}

function thayDoiSoLuong(index, thayDoi) {
    if (!gioHang[index]) return;
    const moi = gioHang[index].soLuong + Number(thayDoi);
    if (moi <= 0) {
        gioHang.splice(index, 1);
    } else if (moi > 20) {
        alert("Số lượng tối đa là 20.");
        return;
    } else {
        gioHang[index].soLuong = moi;
    }
    luuGioHang();
    hienThiGioHang();
}

function xoaSanPham(index) {
    if (!gioHang[index]) return;
    gioHang.splice(index, 1);
    luuGioHang();
    hienThiGioHang();
}

function anFormDatHang() {
    const khuDatHang = layPhanTu("dat-hang");
    if (khuDatHang) khuDatHang.hidden = true;
    const ketQua = layPhanTu("ketQuaThanhToan");
    if (ketQua) {
        ketQua.innerHTML = "";
        ketQua.style.display = "none";
    }
}

function hienThiDatHang() {
    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống. Hãy thêm sản phẩm trước khi thanh toán.");
        return;
    }
    const khuDatHang = layPhanTu("dat-hang");
    if (!khuDatHang) return;
    khuDatHang.hidden = false;
    khuDatHang.scrollIntoView({ behavior: "smooth", block: "start" });
}

function dongFormDatHang() {
    anFormDatHang();
    const gio = layPhanTu("giohang");
    if (gio) gio.scrollIntoView({ behavior: "smooth", block: "start" });
}

function locSanPham() {
    const oTimKiem = layPhanTu("timKiem");
    const tuKhoa = oTimKiem ? oTimKiem.value.toLocaleLowerCase("vi").trim() : "";
    const nutDangChon = document.querySelector(".loc.active");
    const danhMuc = nutDangChon ? nutDangChon.dataset.category : "all";
    const cards = document.querySelectorAll(".danh-sach .san-pham");
    let dem = 0;

    cards.forEach(card => {
        const ten = card.textContent.toLocaleLowerCase("vi");
        const loai = card.dataset.category || "all";
        const hopTuKhoa = ten.includes(tuKhoa);
        const hopDanhMuc = danhMuc === "all" || loai === danhMuc;
        card.hidden = !(hopTuKhoa && hopDanhMuc);
        if (!card.hidden) dem++;
    });

    const thongBao = layPhanTu("khongTimThay");
    if (thongBao) thongBao.hidden = dem !== 0;
}

function doiAnh(anhNho) {
    const anhLon = layPhanTu("chiTietAnhLon");
    if (anhLon && anhNho) {
        anhLon.src = anhNho.src;
        anhLon.alt = anhNho.alt || "Ảnh sản phẩm";
    }
    if (anhNho) {
        document.querySelectorAll(".chi-tiet-anh-nho img").forEach(img => img.classList.remove("anh-dang-chon"));
        anhNho.classList.add("anh-dang-chon");
    }
}

function khoiTaoTrangChiTiet() {
    const khung = layPhanTu("trangChiTietSanPham");
    if (!khung) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const sp = duLieuSanPham[id];
    const loi = layPhanTu("loiChiTiet");

    if (!sp) {
        khung.hidden = true;
        if (loi) {
            loi.hidden = false;
            loi.textContent = "Không tìm thấy sản phẩm. Vui lòng quay lại trang chủ và chọn sản phẩm khác.";
        }
        return;
    }

    sanPhamDangXem = id;
    document.title = sp.ten + " | DAT BOUTIQUE";

    layPhanTu("chiTietTen").textContent = sp.ten;
    layPhanTu("chiTietMa").textContent = sp.ma;
    layPhanTu("chiTietGiaCu").textContent = dinhDangTien(sp.gia);
    layPhanTu("chiTietGiaMoi").textContent = dinhDangTien(tinhGiaSale(sp.gia));
    layPhanTu("chiTietMoTa").textContent = sp.moTa;

    const mauSelect = layPhanTu("chiTietMau");
    mauSelect.innerHTML = sp.mau.map(mau => `<option value="${lamSachHTML(mau)}">${lamSachHTML(mau)}</option>`).join("");

    const sizeSelect = layPhanTu("chiTietSize");
    sizeSelect.innerHTML = sp.size.map(size => `<option value="${lamSachHTML(size)}">${lamSachHTML(size)}</option>`).join("");

    layPhanTu("khungChonSize").hidden = sp.size.length === 1 && sp.size[0] === "Free size";
    layPhanTu("chiTietAnhLon").src = "./" + sp.anh[0];
    layPhanTu("chiTietAnhLon").alt = sp.ten;

    const anhNho = layPhanTu("chiTietAnhNho");
    anhNho.innerHTML = sp.anh.map((anh, index) => `
        <img src="./${lamSachHTML(anh)}"
             alt="${lamSachHTML(sp.ten)} - ảnh ${index + 1}"
             class="${index === 0 ? "anh-dang-chon" : ""}"
             onclick="doiAnh(this)"
             onerror="this.style.display='none'">
    `).join("");

    const oSoLuong = layPhanTu("chiTietSoLuong");
    oSoLuong.value = 1;
    oSoLuong.addEventListener("change", chuanHoaSoLuongChiTiet);
}

function chuanHoaSoLuongChiTiet() {
    const o = layPhanTu("chiTietSoLuong");
    if (!o) return;
    let so = Math.floor(Number(o.value));
    if (!Number.isFinite(so) || so < 1) so = 1;
    if (so > 20) so = 20;
    o.value = so;
}

function doiSoLuongChiTiet(thayDoi) {
    const o = layPhanTu("chiTietSoLuong");
    if (!o) return;
    const hienTai = Math.floor(Number(o.value)) || 1;
    o.value = Math.max(1, Math.min(20, hienTai + Number(thayDoi)));
}

function themTuTrangChiTiet() {
    if (!sanPhamDangXem) return;
    chuanHoaSoLuongChiTiet();
    const soLuong = Number(layPhanTu("chiTietSoLuong").value);
    const mau = layPhanTu("chiTietMau").value;
    const size = duLieuSanPham[sanPhamDangXem].size[0] === "Free size"
        ? "Free size"
        : layPhanTu("chiTietSize").value;
    if (themGioHang(sanPhamDangXem, soLuong, mau, size)) {
        // Giỏ hàng được lưu lại, người dùng vẫn ở trang chi tiết.
    }
}

function muaNgayTrangChiTiet() {
    if (!sanPhamDangXem) return;
    chuanHoaSoLuongChiTiet();
    const soLuong = Number(layPhanTu("chiTietSoLuong").value);
    const mau = layPhanTu("chiTietMau").value;
    const size = duLieuSanPham[sanPhamDangXem].size[0] === "Free size"
        ? "Free size"
        : layPhanTu("chiTietSize").value;
    if (themGioHang(sanPhamDangXem, soLuong, mau, size)) {
        window.location.href = "./index.html#giohang";
    }
}

async function datHang(event) {
    if (event) event.preventDefault();

    const form = layPhanTu("formDatHang");
    const ketQua = layPhanTu("ketQuaThanhToan");
    const nut = layPhanTu("nutXacNhanDon");
    if (!form || !ketQua || !nut) return;

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống!");
        anFormDatHang();
        return;
    }

    if (!form.reportValidity()) return;

    const hoTen = layPhanTu("hoTen").value.trim();
    const soDienThoai = layPhanTu("soDienThoai").value.trim();
    const diaChi = layPhanTu("diaChi").value.trim();
    const phuongThuc = form.querySelector('input[name="thanhToan"]:checked');

    if (!phuongThuc) {
        alert("Vui lòng chọn phương thức thanh toán.");
        return;
    }

    const sdtChuan = soDienThoai.replace(/[\s.-]/g, "");
    if (!/^(0\d{9}|\+84\d{9})$/.test(sdtChuan)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10 số hoặc +84 kèm 9 số).");
        return;
    }

    if (typeof emailjs === "undefined" || typeof emailjs.send !== "function") {
        alert("Không tải được EmailJS. Vui lòng tải lại trang và thử lại.");
        return;
    }

    const tong = gioHang.reduce((sum, sp) => sum + sp.gia * sp.soLuong, 0);
    const tongTienDinhDang = dinhDangTien(tong);
    const danhSachSanPham = gioHang.map(sp => {
        return `${sp.ten} | Màu: ${sp.mau || "Không chọn"} | Size: ${sp.size || "Không chọn"} | SL: ${sp.soLuong} | Thành tiền: ${dinhDangTien(sp.gia * sp.soLuong)}`;
    }).join("\n");

    const thanhToan = phuongThuc.value === "QR"
        ? "Chuyển khoản Vietcombank bằng mã QR (chưa xác minh giao dịch)"
        : "Thanh toán khi nhận hàng (COD)";

    nut.disabled = true;
    nut.textContent = "ĐANG GỬI ĐƠN...";
    ketQua.hidden = false;
    ketQua.style.display = "block";
    ketQua.textContent = "Đang gửi thông tin đơn hàng. Vui lòng chờ.";

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            ten_khach: hoTen,
            so_dien_thoai: soDienThoai,
            dia_chi: diaChi,
            san_pham: danhSachSanPham,
            tong_tien: tongTienDinhDang,
            thanh_toan: thanhToan
        });

        const thongTinDon = gioHang.map(sp => `
            <li>${lamSachHTML(sp.ten)} — ${sp.soLuong} sản phẩm — ${dinhDangTien(sp.gia * sp.soLuong)}</li>
        `).join("");

        ketQua.innerHTML = `
            <div class="ket-qua-thanh-cong">
                <h3>ĐÃ GỬI THÔNG TIN ĐẶT HÀNG!</h3>
                <p>Cảm ơn ${lamSachHTML(hoTen)}. DAT BOUTIQUE sẽ liên hệ để xác nhận đơn hàng.</p>
                <ul>${thongTinDon}</ul>
                <p><strong>Tổng tiền: ${tongTienDinhDang}</strong></p>
                <p>${phuongThuc.value === "QR"
                    ? "Bạn đã chọn chuyển khoản QR. Vui lòng hoàn tất chuyển khoản và chờ cửa hàng xác nhận; website chưa tự xác minh giao dịch."
                    : "Bạn đã chọn thanh toán khi nhận hàng (COD)."}</p>
            </div>
        `;

        gioHang = [];
        luuGioHang();
        hienThiGioHang();
        form.reset();
        const qr = layPhanTu("khungQR");
        if (qr) qr.hidden = true;
    } catch (error) {
        console.error("Lỗi gửi đơn hàng:", error);
        ketQua.textContent = "Chưa gửi được đơn hàng. Vui lòng thử lại. Giỏ hàng của bạn vẫn được giữ nguyên.";
    } finally {
        nut.disabled = false;
        nut.textContent = "XÁC NHẬN ĐẶT HÀNG";
    }
}

function khoiTaoSuKien() {
    hienThiGioHang();
    anFormDatHang();
    khoiTaoTrangChiTiet();

    const timKiem = layPhanTu("timKiem");
    if (timKiem) timKiem.addEventListener("input", locSanPham);

    document.querySelectorAll(".loc").forEach(nut => {
        nut.addEventListener("click", () => {
            document.querySelectorAll(".loc").forEach(item => item.classList.remove("active"));
            nut.classList.add("active");
            locSanPham();
        });
    });

    document.querySelectorAll("[data-add-product]").forEach(nut => {
        nut.addEventListener("click", event => {
            event.stopPropagation();
            themNhanh(nut.dataset.addProduct);
        });
    });

    document.querySelectorAll(".san-pham[data-product-id]").forEach(card => {
        const id = card.dataset.productId;
        const apri = () => window.location.href = "./san-pham.html?id=" + encodeURIComponent(id);
        card.addEventListener("click", event => {
            if (event.target.closest("button, a")) return;
            apri();
        });
        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                apri();
            }
        });
    });

    const nutThanhToan = layPhanTu("nutTienHanhThanhToan");
    if (nutThanhToan) nutThanhToan.addEventListener("click", hienThiDatHang);

    const nutDong = layPhanTu("nutDongThanhToan");
    if (nutDong) nutDong.addEventListener("click", dongFormDatHang);

    const form = layPhanTu("formDatHang");
    if (form) form.addEventListener("submit", datHang);

    document.querySelectorAll('input[name="thanhToan"]').forEach(input => {
        input.addEventListener("change", () => {
            const qr = layPhanTu("khungQR");
            if (qr) qr.hidden = input.value !== "QR" || !input.checked;
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", khoiTaoSuKien);
} else {
    khoiTaoSuKien();
}
