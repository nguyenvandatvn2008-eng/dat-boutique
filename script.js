// =====================================
// DAT BOUTIQUE - JAVASCRIPT
// =====================================

// 1. GIO HANG
let gioHang = [];

// 2. EMAILJS
if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "uxPUUJpYMMZ3dycSn"
    });
}

// 3. HAM HO TRO
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

// 4. DOI ANH TRONG THE SAN PHAM
function doiAnh(anh) {
    const theSanPham = anh.closest(".san-pham");

    if (!theSanPham) return;

    const anhChinh = theSanPham.querySelector(".anh-chinh");

    if (anhChinh) {
        anhChinh.src = anh.src;
        anhChinh.alt = anh.alt || "Ảnh sản phẩm";
    }
}

// 5. TINH GIA SALE 30%
function tinhGiaSale(giaGoc) {
    return Math.round(Number(giaGoc) * 0.7);
}

// 6. THEM VAO GIO HANG
function themGioHang(ten, giaGoc, anh = "", soLuong = 1, mau = "", size = "") {

    giaGoc = Number(giaGoc);
    soLuong = Number(soLuong);

    if (
        !ten ||
        !Number.isFinite(giaGoc) ||
        giaGoc <= 0 ||
        !Number.isInteger(soLuong) ||
        soLuong < 1
    ) {
        alert("Thông tin sản phẩm không hợp lệ!");
        return;
    }

    const giaSale = tinhGiaSale(giaGoc);

    const tenDayDu = ten + (mau ? " - " + mau : "") +
        (size ? " - Size " + size : "");

    const sanPhamCu = gioHang.find(function (sp) {
        return sp.ten === tenDayDu && sp.gia === giaSale;
    });

    if (sanPhamCu) {
        sanPhamCu.soLuong += soLuong;
    } else {
        gioHang.push({
            ten: tenDayDu,
            gia: giaSale,
            giaGoc: giaGoc,
            anh: anh,
            soLuong: soLuong
        });
    }

    hienThiGioHang();
    anThongBaoCu();
}

// 7. HIEN THI GIO HANG
function hienThiGioHang() {
    const danhSach = document.getElementById("danhSachGio");
    const oSoLuong = document.getElementById("soluong");
    const oTongTien = document.getElementById("tongTien");

    if (!danhSach || !oSoLuong || !oTongTien) return;

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
                    <span>Giá: ${dinhDangTien(sp.gia)}</span>
                    <span>Số lượng: ${sp.soLuong}</span>
                </div>

                <div class="cart-quantity">
                    <button type="button"
                        onclick="thayDoiSoLuong(${index}, -1)">−</button>

                    <span>${sp.soLuong}</span>

                    <button type="button"
                        onclick="thayDoiSoLuong(${index}, 1)">+</button>
                </div>

                <strong>${dinhDangTien(sp.gia * sp.soLuong)}</strong>

                <button type="button"
                    class="nut-xoa"
                    onclick="xoaSanPham(${index})">
                    Xóa
                </button>
            </div>
        `;
    });

    oSoLuong.innerText = tongSanPham;
    oTongTien.innerText = dinhDangTien(tong);

    if (gioHang.length === 0) {
        danhSach.innerHTML = `
            <p style="text-align:center;padding:25px;">
                Giỏ hàng của bạn đang trống.
                <br>
                Hãy khám phá sản phẩm nhé!
            </p>
        `;
    }
}

// 8. TANG GIAM SO LUONG
function thayDoiSoLuong(index, thayDoi) {
    if (!gioHang[index]) return;

    gioHang[index].soLuong += Number(thayDoi);

    if (gioHang[index].soLuong <= 0) {
        gioHang.splice(index, 1);
    }

    hienThiGioHang();
    anThongBaoCu();
}

// 9. XOA SAN PHAM
function xoaSanPham(index) {
    if (!gioHang[index]) return;

    gioHang.splice(index, 1);

    hienThiGioHang();
    anThongBaoCu();
}

// 10. TIM KIEM VA LOC
function locSanPham() {
    const oTimKiem = document.getElementById("timKiem");

    const tuKhoa = oTimKiem
        ? oTimKiem.value.toLowerCase().trim()
        : "";

    const nutDangChon = document.querySelector(".loc.active");

    const loai = nutDangChon
        ? nutDangChon.dataset.category
        : "all";

    const cacSanPham = document.querySelectorAll(
        ".danh-sach .san-pham"
    );

    let dem = 0;

    cacSanPham.forEach(function (sp) {
        const oTen = sp.querySelector("h3");

        const ten = oTen
            ? oTen.innerText.toLowerCase()
            : "";

        const dungTuKhoa = ten.includes(tuKhoa);

        const dungDanhMuc =
            loai === "all" ||
            sp.dataset.category === loai;

        if (dungTuKhoa && dungDanhMuc) {
            sp.style.display = "";
            dem++;
        } else {
            sp.style.display = "none";
        }
    });

    const thongBao = document.getElementById("khongTimThay");

    if (thongBao) {
        thongBao.hidden = dem !== 0;
    }
}

// 11. HIEN THI GIA SALE
function apDungSale() {
    document.querySelectorAll(".danh-sach .san-pham").forEach(
        function (sp) {
            const giaGoc = Number(sp.dataset.giaGoc);
            const oGia = sp.querySelector(".gia-san-pham");

            if (!giaGoc || !oGia) return;

            const giaSale = tinhGiaSale(giaGoc);

            oGia.innerHTML = `
                <span class="gia-cu">${dinhDangTien(giaGoc)}</span>
                <span class="gia-moi">${dinhDangTien(giaSale)}</span>
            `;
        }
    );
}

// 12. TRANG CHI TIET SAN PHAM
let sanPhamDangXem = null;

function moChiTiet(theSanPham) {
    if (!theSanPham) return;

    const oTen = theSanPham.querySelector("h3");
    const oAnh = theSanPham.querySelector(".anh-chinh");

    if (!oTen || !oAnh) return;

    const giaGoc = Number(theSanPham.dataset.giaGoc);

    if (!giaGoc || !Number.isFinite(giaGoc)) {
        alert("Sản phẩm chưa có giá hợp lệ!");
        return;
    }

    const danhSachAnh = Array.from(
        theSanPham.querySelectorAll(".anh-nho img")
    ).map(function (anh) {
        return anh.src;
    });

    if (!danhSachAnh.includes(oAnh.src)) {
        danhSachAnh.unshift(oAnh.src);
    }

    sanPhamDangXem = {
        ten: oTen.innerText.trim(),
        giaGoc: giaGoc,
        giaSale: tinhGiaSale(giaGoc),
        anh: oAnh.src,
        danhSachAnh: danhSachAnh
    };

    document.getElementById("chiTietTen").innerText =
        sanPhamDangXem.ten;

    document.getElementById("chiTietGiaCu").innerText =
        dinhDangTien(sanPhamDangXem.giaGoc);

    document.getElementById("chiTietGiaMoi").innerText =
        dinhDangTien(sanPhamDangXem.giaSale);

    document.getElementById("chiTietAnhLon").src =
        sanPhamDangXem.anh;

    // ANH THU NH0
    const khungAnhNho = document.getElementById("chiTietAnhNho");

    khungAnhNho.innerHTML = "";

    sanPhamDangXem.danhSachAnh.forEach(function (duongDan) {
        const anh = document.createElement("img");

        anh.src = duongDan;
        anh.alt = sanPhamDangXem.ten;

        anh.addEventListener("click", function () {
            document.getElementById("chiTietAnhLon").src = duongDan;
        });

        khungAnhNho.appendChild(anh);
    });

    // CHON SIZE THEO SAN PHAM
    const oSize = document.getElementById("chiTietSize");

    oSize.innerHTML = "";

    const ten = sanPhamDangXem.ten.toLowerCase();

    let cacSize;

    if (ten.includes("mũ")) {
        cacSize = ["Free size"];
    } else if (ten.includes("dép")) {
        cacSize = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
    } else {
        cacSize = ["S", "M", "L", "XL", "XXL"];
    }

    cacSize.forEach(function (size) {
        const luaChon = document.createElement("option");

        luaChon.value = size;
        luaChon.textContent = size;

        oSize.appendChild(luaChon);
    });

    document.getElementById("chiTietSoLuong").value = 1;

    const overlay = document.getElementById("chiTietOverlay");

    overlay.classList.add("dang-mo");
    overlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

// 13. DONG TRANG CHI TIET
function dongChiTiet() {
    const overlay = document.getElementById("chiTietOverlay");

    if (overlay) {
        overlay.classList.remove("dang-mo");
        overlay.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";
}

// 14. THEM SAN PHAM TU TRANG CHI TIET
function themTuChiTiet() {
    if (!sanPhamDangXem) return;

    const mau = document.getElementById("chiTietMau").value;
    const size = document.getElementById("chiTietSize").value;

    const soLuong = Number(
        document.getElementById("chiTietSoLuong").value
    );

    if (!Number.isInteger(soLuong) || soLuong < 1 || soLuong > 20) {
        alert("Vui lòng chọn số lượng từ 1 đến 20!");
        return;
    }

    themGioHang(
        sanPhamDangXem.ten,
        sanPhamDangXem.giaGoc,
        sanPhamDangXem.anh,
        soLuong,
        mau,
        size
    );

    dongChiTiet();

    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

// 15. MUA NGAY
function muaNgayChiTiet() {
    themTuChiTiet();

    const gio = document.getElementById("giohang");

    if (gio) {
        gio.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// 16. DAT HANG
async function datHang() {
    const oHoTen = document.getElementById("hoTen");
    const oSoDienThoai = document.getElementById("soDienThoai");
    const oDiaChi = document.getElementById("diaChi");

    const phuongThuc = document.querySelector(
        'input[name="thanhToan"]:checked'
    );

    const ketQua = document.getElementById("ketQuaThanhToan");
    const nutDatHang = document.querySelector(".order-button");

    if (!oHoTen || !oSoDienThoai || !oDiaChi || !ketQua || !nutDatHang) {
        return;
    }

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

    const soChuan = soDienThoai.replace(/[\s.-]/g, "");

    if (!/^(0\d{9}|\+84\d{9})$/.test(soChuan)) {
        alert("Vui lòng nhập số điện thoại hợp lệ!");
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
        return sp.ten +
            " - SL: " + sp.soLuong +
            " - " + dinhDangTien(sp.gia * sp.soLuong);
    }).join("\n");

    const thanhToan = phuongThuc.value === "QR"
        ? "Vietcombank QR"
        : "Thanh toán khi nhận hàng (COD)";

    ketQua.style.display = "block";

    ketQua.innerHTML = `
        <div style="text-align:center;padding:20px;">
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

        const thongTinThanhToan = phuongThuc.value === "QR"
            ? `
                <h3>VIETCOMBANK QR</h3>
                <p>Vui lòng quét mã QR để thanh toán:</p>
                <img src="./qr.jpg"
                    alt="Mã QR Vietcombank"
                    style="display:block;width:220px;max-width:100%;height:auto;margin:15px auto;">
                <p>Vui lòng kiểm tra đúng số tiền trước khi chuyển khoản.</p>
            `
            : `
                <h3>THANH TOÁN KHI NHẬN HÀNG (COD)</h3>
                <p>Bạn sẽ thanh toán khi nhận được sản phẩm.</p>
            `;

        const danhSachHienThi = gioHang.map(function (sp) {
            return `
                <li>
                    ${lamSachHTML(sp.ten)}
                    - ${sp.soLuong} sản phẩm
                    - ${dinhDangTien(sp.gia * sp.soLuong)}
                </li>
            `;
        }).join("");

        ketQua.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <h2 style="color:#287a4b;">✓ ĐẶT HÀNG THÀNH CÔNG!</h2>

                <p>
                    Cảm ơn ${lamSachHTML(hoTen)}
                    đã mua hàng tại DAT BOUTIQUE!
                </p>

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

        gioHang = [];
        hienThiGioHang();

        ketQua.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert("Đặt hàng thành công! Email thông báo đã được gửi.");

    } catch (error) {
        console.error("Lỗi gửi email:", error);

        ketQua.innerHTML = `
            <div style="text-align:center;padding:20px;">
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

// 17. KHOI TAO CAC CHUC NANG
document.addEventListener("DOMContentLoaded", function () {

    // Tim kiem
    const oTimKiem = document.getElementById("timKiem");

    if (oTimKiem) {
        oTimKiem.addEventListener("input", locSanPham);
    }

    // Loc danh muc
    const cacNutLoc = document.querySelectorAll(".loc");

    cacNutLoc.forEach(function (nut) {
        nut.addEventListener("click", function () {
            cacNutLoc.forEach(function (item) {
                item.classList.remove("active");
            });

            nut.classList.add("active");
            locSanPham();
        });
    });

    // Bam anh va ten de mo chi tiet
    document.querySelectorAll(".danh-sach .san-pham").forEach(
        function (sp) {
            const anh = sp.querySelector(".anh-chinh");
            const ten = sp.querySelector("h3");

            if (anh) {
                anh.addEventListener("click", function () {
                    moChiTiet(sp);
                });
            }

            if (ten) {
                ten.addEventListener("click", function () {
                    moChiTiet(sp);
                });
            }
        }
    );

    // Ap dung SALE
    apDungSale();

    // Hien thi gio hang
    hienThiGioHang();

    // Bam nen toi de dong chi tiet
    const overlay = document.getElementById("chiTietOverlay");

    if (overlay) {
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                dongChiTiet();
            }
        });
    }
