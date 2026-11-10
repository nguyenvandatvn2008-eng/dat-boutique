// ==============================
// DAT BOUTIQUE - JAVASCRIPT
// ==============================

// GIO HANG
let gioHang = [];

// KHOI TAO EMAILJS
emailjs.init({
    publicKey: "uxPUUJpYMMZ3dycSn"
});


// ==============================
// HAM HO TRO
// ==============================

function dinhDangTien(gia) {
    return Number(gia).toLocaleString("vi-VN") + "đ";
}

function anThongBaoCu() {
    let ketQua = document.getElementById("ketQuaThanhToan");

    if (ketQua) {
        ketQua.innerHTML = "";
        ketQua.style.display = "none";
    }
}


// ==============================
// DOI ANH SAN PHAM
// ==============================

function doiAnh(anh) {
    let anhChinh = document.getElementById("anhChinh");

    if (anhChinh && anh) {
        anhChinh.src = anh.src;
    }
}


// ==============================
// THEM SAN PHAM VAO GIO
// ==============================

function themGioHang(ten, gia, anh = "") {

    gia = Number(gia);

    let sanPhamCu = gioHang.find(function(sp) {
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

    let gio = document.getElementById("giohang");

    if (gio) {
        gio.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}


// ==============================
// HIEN THI GIO HANG
// ==============================

function hienThiGioHang() {

    let danhSach = document.getElementById("danhSachGio");
    let soLuong = document.getElementById("soluong");
    let tongTien = document.getElementById("tongTien");

    if (!danhSach || !soLuong || !tongTien) return;

    danhSach.innerHTML = "";

    let tong = 0;
    let tongSanPham = 0;

    gioHang.forEach(function(sp, index) {

        tong += sp.gia * sp.soLuong;
        tongSanPham += sp.soLuong;

        danhSach.innerHTML += `
            <div class="san-pham-gio">

                <div class="thong-tin-sp">
                    <strong>${sp.ten}</strong>
                    <span>${dinhDangTien(sp.gia)}</span>
                </div>

                <div class="cart-quantity">

                    <button type="button"
                        onclick="thayDoiSoLuong(${index}, -1)">
                        −
                    </button>

                    <span>${sp.soLuong}</span>

                    <button type="button"
                        onclick="thayDoiSoLuong(${index}, 1)">
                        +
                    </button>

                </div>

                <button type="button"
                    class="nut-xoa"
                    onclick="xoaSanPham(${index})">
                    Xóa
                </button>

            </div>
        `;
    });

    soLuong.innerText = tongSanPham;
    tongTien.innerText = dinhDangTien(tong);

    if (gioHang.length === 0) {
        danhSach.innerHTML = `
            <p style="text-align:center; padding:25px;">
                Giỏ hàng của bạn đang trống.
                <br>
                Hãy khám phá sản phẩm nhé!
            </p>
        `;
    }
}


// ==============================
// TANG GIAM SO LUONG
// ==============================

function thayDoiSoLuong(index, thayDoi) {

    if (!gioHang[index]) return;

    gioHang[index].soLuong += thayDoi;

    if (gioHang[index].soLuong <= 0) {
        gioHang.splice(index, 1);
    }

    hienThiGioHang();
    anThongBaoCu();
}


// ==============================
// XOA SAN PHAM
// ==============================

function xoaSanPham(index) {

    if (!gioHang[index]) return;

    gioHang.splice(index, 1);

    hienThiGioHang();
    anThongBaoCu();
}


// ==============================
// TIM KIEM SAN PHAM
// ==============================

let oTimKiem = document.getElementById("timKiem");

if (oTimKiem) {
    oTimKiem.addEventListener("input", locSanPham);
}


// ==============================
// LOC DANH MUC
// ==============================

let danhMuc = document.querySelectorAll(".loc");

danhMuc.forEach(function(nut) {

    nut.addEventListener("click", function() {

        danhMuc.forEach(function(item) {
            item.classList.remove("active");
        });

        nut.classList.add("active");

        locSanPham();
    });

});


// ==============================
// HAM LOC SAN PHAM
// ==============================

function locSanPham() {

    let oTimKiem = document.getElementById("timKiem");

    let tuKhoa = oTimKiem
        ? oTimKiem.value.toLowerCase().trim()
        : "";

    let danhMucDangChon = document.querySelector(".loc.active");

    let loai = danhMucDangChon
        ? danhMucDangChon.dataset.category
        : "all";

    let sanPhams = document.querySelectorAll(".danh-sach .san-pham");

    let dem = 0;

    sanPhams.forEach(function(sp) {

        let theTen = sp.querySelector("h3");

        let ten = theTen
            ? theTen.innerText.toLowerCase()
            : "";

        let dungTuKhoa = ten.includes(tuKhoa);

        let dungDanhMuc =
            loai === "all" || sp.dataset.category === loai;

        if (dungTuKhoa && dungDanhMuc) {
            sp.style.display = "";
            dem++;
        } else {
            sp.style.display = "none";
        }

    });

    let thongBao = document.getElementById("khongTimThay");

    if (thongBao) {
        thongBao.hidden = dem !== 0;
    }
}


// ==============================
// DAT HANG
// ==============================

async function datHang() {

    let hoTen = document.getElementById("hoTen").value.trim();

    let soDienThoai = document.getElementById("soDienThoai").value.trim();

    let diaChi = document.getElementById("diaChi").value.trim();

    let phuongThuc = document.querySelector(
        'input[name="thanhToan"]:checked'
    );

    let ketQua = document.getElementById("ketQuaThanhToan");

    let nutDatHang = document.querySelector(".order-button");


    // KIEM TRA GIO HANG

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }


    // KIEM TRA THONG TIN

    if (!hoTen || !soDienThoai || !diaChi) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }


    // KIEM TRA SO DIEN THOAI

    let soDienThoaiChuan = soDienThoai.replace(/\s/g, "");

    if (!/^(0\d{9}|\+84\d{9})$/.test(soDienThoaiChuan)) {
        alert("Vui lòng nhập số điện thoại hợp lệ!");
        return;
    }


    // KIEM TRA PHUONG THUC

    if (!phuongThuc) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }


    // KIEM TRA EMAILJS

    if (typeof emailjs === "undefined") {
        alert("Không tải được EmailJS. Vui lòng tải lại trang!");
        return;
    }


    // TINH TONG TIEN

    let tong = gioHang.reduce(function(sum, sp) {
        return sum + sp.gia * sp.soLuong;
    }, 0);

    let tongTien = dinhDangTien(tong);


    // DANH SACH SAN PHAM GUI EMAIL

    let danhSachSanPham = gioHang.map(function(sp) {

        return sp.ten +
            " - SL: " + sp.soLuong +
            " - " + dinhDangTien(sp.gia * sp.soLuong);

    }).join("\n");


    // PHUONG THUC THANH TOAN

    let thanhToan = phuongThuc.value === "QR"
        ? "Vietcombank QR"
        : "Thanh toán khi nhận hàng (COD)";


    // HIEN THI TRANG THAI

    ketQua.style.display = "block";

    ketQua.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <h3>ĐANG GỬI ĐƠN HÀNG...</h3>
            <p>Vui lòng chờ trong giây lát.</p>
        </div>
    `;

    nutDatHang.disabled = true;
    nutDatHang.innerText = "ĐANG XỬ LÝ...";


    // GUI EMAIL QUA EMAILJS

    try {

        await emailjs.send(
            "service_338elep",
            "template_0xjohd8",
            {
                ten_khach: hoTen,
                so_dien_thoai: soDienThoai,
                dia_chi: diaChi,
                san_pham: danhSachSanPham,
                tong_tien: tongTien,
                thanh_toan: thanhToan
            }
        );


        // THONG TIN THANH TOAN

        let thongTinThanhToan =
            phuongThuc.value === "QR" ? `

                <h3 style="color:#287a4b;">
                    VIETCOMBANK QR
                </h3>

                <p>Vui lòng quét mã QR để thanh toán:</p>

                <img
                    src="./qr.jpg"
                    alt="Mã QR Vietcombank"
                    style="
                        display:block;
                        width:220px;
                        max-width:100%;
                        height:auto;
                        margin:15px auto;
                    "
                >

                <p>Vui lòng kiểm tra đúng số tiền trước khi chuyển khoản.</p>

            ` : `

                <h3>THANH TOÁN KHI NHẬN HÀNG (COD)</h3>

                <p>Bạn sẽ thanh toán khi nhận được sản phẩm.</p>

            `;


        // DANH SACH SAN PHAM HIEN THI

        let danhSachHienThi = gioHang.map(function(sp) {

            return `
                <li>
                    ${sp.ten}
                    - ${sp.soLuong} sản phẩm
                    - ${dinhDangTien(sp.gia * sp.soLuong)}
                </li>
            `;

        }).join("");


        // HIEN THI KET QUA

        ketQua.innerHTML = `

            <div style="text-align:center; padding:20px;">

                <h2 style="color:#287a4b;">
                    ✓ ĐẶT HÀNG THÀNH CÔNG!
                </h2>

                <p>
                    Cảm ơn ${hoTen} đã mua hàng tại DAT BOUTIQUE!
                </p>

                <hr style="margin:20px 0;">

                <h3>THÔNG TIN ĐƠN HÀNG</h3>

                <p><strong>Họ tên:</strong> ${hoTen}</p>

                <p><strong>Số điện thoại:</strong> ${soDienThoai}</p>

                <p><strong>Địa chỉ:</strong> ${diaChi}</p>

                <h4>Sản phẩm đã đặt:</h4>

                <ul style="text-align:left;">
                    ${danhSachHienThi}
                </ul>

                <h3>Tổng tiền: ${tongTien}</h3>

                ${thongTinThanhToan}

                <p>
                    DAT BOUTIQUE sẽ sớm liên hệ xác nhận đơn hàng!
                </p>

            </div>

        `;


        // XOA GIO HANG SAU KHI GUI EMAIL THANH CONG

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

            <div style="text-align:center; padding:20px;">

                <h3 style="color:red;">
                    KHÔNG GỬI ĐƯỢC EMAIL!
                </h3>

                <p>
                    Vui lòng thử lại.
                    Giỏ hàng của bạn vẫn được giữ nguyên.
                </p>

            </div>

        `;

        alert("Gửi email thất bại! Vui lòng kiểm tra lại EmailJS.");

    } finally {

        nutDatHang.disabled = false;

        nutDatHang.innerText = "XÁC NHẬN ĐẶT HÀNG →";

    }

}


// ==============================
// KHOI TAO GIO HANG
// ==============================

hienThiGioHang();
