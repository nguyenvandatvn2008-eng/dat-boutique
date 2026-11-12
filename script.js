// ==============================
// DAT BOUTIQUE - JAVASCRIPT
// ==============================

// GIO HANG
let gioHang = [];

// KHOI TAO EMAILJS
if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "uxPUUJpYMMZ3dycSn"
    });
}

// HAM HO TRO
function dinhDangTien(gia) {
    return Number(gia).toLocaleString("vi-VN") + "đ";
}

function anThongBaoCu() {
    const ketQua = document.getElementById("ketQuaThanhToan");
    if (ketQua) {
        ketQua.innerHTML = "";
        ketQua.style.display = "none";
    }
}

// Tranh chen noi dung nhap vao HTML
function lamSachHTML(noiDung) {
    return String(noiDung).replace(/[&<>"']/g, function (kyTu) {
        const bangMa = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return bangMa[kyTu];
    });
}

// DOI ANH SAN PHAM
function doiAnh(anh) {
    const anhChinh = document.getElementById("anhChinh");
    if (anhChinh && anh && anh.src) {
        anhChinh.src = anh.src;
        anhChinh.alt = anh.alt || "Ảnh sản phẩm";
    }
}

// THEM SAN PHAM VAO GIO
function themGioHang(ten, gia, anh = "") {
    gia = Number(gia);
    if (!ten || !Number.isFinite(gia) || gia < 0) {
        alert("Thông tin sản phẩm không hợp lệ.");
        return;
    }

    const sanPhamCu = gioHang.find(function (sp) {
        return sp.ten === ten && sp.gia === gia;
    });

    if (sanPhamCu) {
        sanPhamCu.soLuong++;
    } else {
        gioHang.push({
            ten: ten,
            gia: gia,
            anh: anh,
            soLuong: 1
        });
    }

    hienThiGioHang();
    anThongBaoCu();

    const gio = document.getElementById("giohang");
    if (gio) {
        gio.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// HIEN THI GIO HANG
function hienThiGioHang() {
    const danhSach = document.getElementById("danhSachGio");
    const soLuong = document.getElementById("soluong");
    const tongTien = document.getElementById("tongTien");

    if (!danhSach || !soLuong || !tongTien) return;

    danhSach.innerHTML = "";
    let tong = 0;
    let tongSanPham = 0;

    gioHang.forEach(function (sp, index) {
        tong += sp.gia * sp.soLuong;
        tongSanPham += sp.soLuong;

        danhSach.innerHTML += `
            <div class="san-pham-gio">
                <div class="thong-tin-sp">
                    <strong>${lamSachHTML(sp.ten)}</strong>
                    <span>${dinhDangTien(sp.gia)}</span>
                </div>
                <div class="cart-quantity">
                    <button type="button" aria-label="Giảm số lượng" onclick="thayDoiSoLuong(${index}, -1)">−</button>
                    <span>${sp.soLuong}</span>
                    <button type="button" aria-label="Tăng số lượng" onclick="thayDoiSoLuong(${index}, 1)">+</button>
                </div>
                <button type="button" class="nut-xoa" onclick="xoaSanPham(${index})">Xóa</button>
            </div>
        `;
    });

    soLuong.innerText = tongSanPham;
    tongTien.innerText = dinhDangTien(tong);

    if (gioHang.length === 0) {
        danhSach.innerHTML = `
            <p style="text-align:center; padding:25px;">
                Giỏ hàng của bạn đang trống.<br>
                Hãy khám phá sản phẩm nhé!
            </p>
        `;
    }
}

// TANG GIAM SO LUONG
function thayDoiSoLuong(index, thayDoi) {
    if (!gioHang[index]) return;

    gioHang[index].soLuong += Number(thayDoi);
    if (gioHang[index].soLuong <= 0) {
        gioHang.splice(index, 1);
    }

    hienThiGioHang();
    anThongBaoCu();
}

// XOA SAN PHAM
function xoaSanPham(index) {
    if (!gioHang[index]) return;
    gioHang.splice(index, 1);
    hienThiGioHang();
    anThongBaoCu();
}

// TIM KIEM VA LOC DANH MUC
function locSanPham() {
    const oTimKiem = document.getElementById("timKiem");
    const tuKhoa = oTimKiem ? oTimKiem.value.toLowerCase().trim() : "";
    const danhMucDangChon = document.querySelector(".loc.active");
    const loai = danhMucDangChon ? danhMucDangChon.dataset.category : "all";
    const sanPhams = document.querySelectorAll(".danh-sach .san-pham");
    let dem = 0;

    sanPhams.forEach(function (sp) {
        const theTen = sp.querySelector("h3");
        const ten = theTen ? theTen.innerText.toLowerCase() : "";
        const dungTuKhoa = ten.includes(tuKhoa);
        const dungDanhMuc = loai === "all" || sp.dataset.category === loai;

        if (dungTuKhoa && dungDanhMuc) {
            sp.style.display = "";
            dem++;
        } else {
            sp.style.display = "none";
        }
    });

    const thongBao = document.getElementById("khongTimThay");
    if (thongBao) thongBao.hidden = dem !== 0;
}

// DAT HANG
async function datHang() {
    const oHoTen = document.getElementById("hoTen");
    const oSoDienThoai = document.getElementById("soDienThoai");
    const oDiaChi = document.getElementById("diaChi");
    const phuongThuc = document.querySelector('input[name="thanhToan"]:checked');
    const ketQua = document.getElementById("ketQuaThanhToan");
    const nutDatHang = document.querySelector(".order-button");

    if (!oHoTen || !oSoDienThoai || !oDiaChi || !ketQua || !nutDatHang) return;

    const hoTen = oHoTen.value.trim();
    const soDienThoai = oSoDienThoai.value.trim();
    const diaChi = oDiaChi.value.trim();

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    if (!hoTen || !soDienThoai || !diaChi) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Chap nhan so dien thoai 0xxxxxxxxx hoac +84xxxxxxxxx
    const soDienThoaiChuan = soDienThoai.replace(/[\s.-]/g, "");
    if (!/^(0\d{9}|\+84\d{9})$/.test(soDienThoaiChuan)) {
        alert("Vui lòng nhập số điện thoại hợp lệ (10 số hoặc +84 kèm 9 số)!");
        return;
    }

    if (!phuongThuc) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }

    if (typeof emailjs === "undefined") {
        alert("Không tải được EmailJS. Vui lòng tải lại trang!");
        return;
    }

    const tong = gioHang.reduce(function (sum, sp) {
        return sum + sp.gia * sp.soLuong;
    }, 0);
    const tongTienDinhDang = dinhDangTien(tong);

    const danhSachSanPham = gioHang.map(function (sp) {
        return sp.ten + " - SL: " + sp.soLuong + " - " + dinhDangTien(sp.gia * sp.soLuong);
    }).join("\n");

    const thanhToan = phuongThuc.value === "QR"
        ? "Vietcombank QR"
        : "Thanh toán khi nhận hàng (COD)";

    ketQua.style.display = "block";
    ketQua.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <h3>ĐANG GỬI ĐƠN HÀNG...</h3>
            <p>Vui lòng chờ trong giây lát.</p>
        </div>
    `;

    nutDatHang.disabled = true;
    nutDatHang.innerText = "ĐANG XỬ LÝ...";

    try {
        await emailjs.send(
            "service_338elep",
            "template_0xjohd8",
            {
                ten_khach: hoTen,
                so_dien_thoai: soDienThoai,
                dia_chi: diaChi,
                san_pham: danhSachSanPham,
                tong_tien: tongTienDinhDang,
                thanh_toan: thanhToan
            }
        );

        const thongTinThanhToan = phuongThuc.value === "QR" ? `
            <h3 style="color:#287a4b;">VIETCOMBANK QR</h3>
            <p>Vui lòng quét mã QR để thanh toán:</p>
            <img src="./qr.jpg" alt="Mã QR Vietcombank"
                style="display:block; width:220px; max-width:100%; height:auto; margin:15px auto;">
            <p>Vui lòng kiểm tra đúng số tiền trước khi chuyển khoản.</p>
        ` : `
            <h3>THANH TOÁN KHI NHẬN HÀNG (COD)</h3>
            <p>Bạn sẽ thanh toán khi nhận được sản phẩm.</p>
        `;

        const danhSachHienThi = gioHang.map(function (sp) {
            return `
                <li>
                    ${lamSachHTML(sp.ten)} - ${sp.soLuong} sản phẩm
                    - ${dinhDangTien(sp.gia * sp.soLuong)}
                </li>
            `;
        }).join("");

        ketQua.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="color:#287a4b;">✓ ĐẶT HÀNG THÀNH CÔNG!</h2>
                <p>Cảm ơn ${lamSachHTML(hoTen)} đã mua hàng tại DAT BOUTIQUE!</p>
                <hr style="margin:20px 0;">
                <h3>THÔNG TIN ĐƠN HÀNG</h3>
                <p><strong>Họ tên:</strong> ${lamSachHTML(hoTen)}</p>
                <p><strong>Số điện thoại:</strong> ${lamSachHTML(soDienThoai)}</p>
                <p><strong>Địa chỉ:</strong> ${lamSachHTML(diaChi)}</p>
                <h4>Sản phẩm đã đặt:</h4>
                <ul style="text-align:left;">${danhSachHienThi}</ul>
                <h3>Tổng tiền: ${tongTienDinhDang}</h3>
                ${thongTinThanhToan}
                <p>DAT BOUTIQUE sẽ sớm liên hệ xác nhận đơn hàng!</p>
            </div>
        `;

        // Chi xoa gio hang khi EmailJS gui thanh cong
        gioHang = [];
        hienThiGioHang();
        ketQua.scrollIntoView({ behavior: "smooth", block: "center" });
        alert("Đặt hàng thành công! Email thông báo đã được gửi.");

    } catch (error) {
        console.error("Lỗi gửi email:", error);
        ketQua.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h3 style="color:red;">KHÔNG GỬI ĐƯỢC EMAIL!</h3>
                <p>Vui lòng thử lại. Giỏ hàng của bạn vẫn được giữ nguyên.</p>
            </div>
        `;
        alert("Gửi email thất bại! Vui lòng kiểm tra lại EmailJS.");
    } finally {
        nutDatHang.disabled = false;
        nutDatHang.innerText = "XÁC NHẬN ĐẶT HÀNG →";
    }
}

// KHOI TAO CAC SU KIEN KHI TRANG DA SAN SANG
const oTimKiem = document.getElementById("timKiem");
if (oTimKiem) {
    oTimKiem.addEventListener("input", locSanPham);
}

const danhMuc = document.querySelectorAll(".loc");
danhMuc.forEach(function (nut) {
    nut.addEventListener("click", function () {
        danhMuc.forEach(function (item) {
            item.classList.remove("active");
        });
        nut.classList.add("active");
        locSanPham();
    });
});

// KHOI TAO GIO HANG
hienThiGioHang();
