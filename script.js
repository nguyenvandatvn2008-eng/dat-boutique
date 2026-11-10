let gioHang = [];

// KHOI TAO EMAILJS
emailjs.init({
    publicKey: "uxPUUJpYMMZ3dycSn"
});


// THEM SAN PHAM VAO GIO HANG
function themGioHang(ten, gia) {
    gioHang.push({
        ten: ten,
        gia: Number(gia)
    });

    hienThiGioHang();

    let ketQua = document.getElementById("ketQuaThanhToan");
    ketQua.innerHTML = "";
    ketQua.style.display = "none";

    document.getElementById("giohang").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// HIEN THI GIO HANG
function hienThiGioHang() {
    let danhSach = document.getElementById("danhSachGio");
    let soLuong = document.getElementById("soluong");
    let tongTien = document.getElementById("tongTien");

    danhSach.innerHTML = "";

    let tong = 0;

    gioHang.forEach(function(sp, index) {
        tong += sp.gia;

        danhSach.innerHTML += `
            <div class="san-pham-gio">
                <div class="thong-tin-sp">
                    <strong>${sp.ten}</strong>
                    <span>${sp.gia.toLocaleString("vi-VN")}đ</span>
                </div>

                <button class="nut-xoa"
                    onclick="xoaSanPham(${index})">
                    Xóa
                </button>
            </div>
        `;
    });

    soLuong.innerText = gioHang.length;

    tongTien.innerText =
        tong.toLocaleString("vi-VN") + "đ";

    if (gioHang.length === 0) {
        danhSach.innerText = "Chưa có sản phẩm nào.";
    }
}


// XOA SAN PHAM
function xoaSanPham(index) {
    gioHang.splice(index, 1);

    hienThiGioHang();

    let ketQua = document.getElementById("ketQuaThanhToan");
    ketQua.innerHTML = "";
    ketQua.style.display = "none";
}


// DAT HANG
async function datHang() {

    let hoTen = document.getElementById("hoTen").value.trim();

    let soDienThoai = document.getElementById("soDienThoai").value.trim();

    let diaChi = document.getElementById("diaChi").value.trim();

    let phuongThuc = document.querySelector(
        'input[name="thanhToan"]:checked'
    );

    let ketQua = document.getElementById("ketQuaThanhToan");


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


    if (!phuongThuc) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }


    // TINH TONG TIEN
    let tong = gioHang.reduce(function(sum, sp) {
        return sum + sp.gia;
    }, 0);

    let tongTien = tong.toLocaleString("vi-VN") + "đ";


    // DANH SACH SAN PHAM
    let danhSachSanPham = gioHang.map(function(sp) {
        return sp.ten + " - " +
            sp.gia.toLocaleString("vi-VN") + "đ";
    }).join("\n");


    // PHUONG THUC THANH TOAN
    let thanhToan = "";

    if (phuongThuc.value === "QR") {
        thanhToan = "Vietcombank QR";
    } else {
        thanhToan = "Thanh toán khi nhận hàng (COD)";
    }


    // HIEN THI TRANG THAI DANG GUI
    ketQua.style.display = "block";

    ketQua.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <h3>Đang gửi đơn hàng...</h3>
            <p>Vui lòng chờ trong giây lát.</p>
        </div>
    `;


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


        // TAO THONG TIN THANH TOAN
        let thongTinThanhToan = "";

        if (phuongThuc.value === "QR") {

            thongTinThanhToan = `
                <p><strong>Phương thức thanh toán:</strong></p>

                <h3 style="color:#2563eb;">
                    Vietcombank QR
                </h3>

                <p>Vui lòng quét mã QR để thanh toán:</p>

                <img src="./qr.jpg"
                     alt="Mã QR Vietcombank"
                     style="display:block;
                     width:220px;
                     max-width:100%;
                     height:auto;
                     margin:15px auto;">
            `;

        } else {

            thongTinThanhToan = `
                <p><strong>Phương thức thanh toán:</strong></p>

                <h3 style="color:#2563eb;">
                    Thanh toán khi nhận hàng (COD)
                </h3>
            `;
        }


        // DANH SACH SAN PHAM HIEN THI
        let danhSachHienThi = gioHang.map(function(sp) {
            return `
                <li>
                    ${sp.ten} - ${sp.gia.toLocaleString("vi-VN")}đ
                </li>
            `;
        }).join("");


        // HIEN THI THONG BAO DAT HANG
        ketQua.style.display = "block";

        ketQua.innerHTML = `
            <div style="text-align:center; padding:20px;">

                <h2 style="color:green;">
                    ✓ ĐẶT HÀNG THÀNH CÔNG!
                </h2>

                <p>
                    Cảm ơn ${hoTen} đã mua hàng tại DAT BOUTIQUE!
                </p>

                <hr>

                <h3>THÔNG TIN ĐƠN HÀNG</h3>

                <p>Họ tên: ${hoTen}</p>

                <p>Số điện thoại: ${soDienThoai}</p>

                <p>Địa chỉ: ${diaChi}</p>

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


        // CUON DEN THONG BAO
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
                    Không gửi được thông báo email!
                </h3>

                <p>
                    Vui lòng thử lại. Giỏ hàng của bạn vẫn được giữ nguyên.
                </p>
            </div>
        `;

        alert("Gửi email thất bại! Vui lòng kiểm tra lại kết nối EmailJS.");
    }
}
