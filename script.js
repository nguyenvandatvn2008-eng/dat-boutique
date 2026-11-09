let gioHang = [];

// THEM SAN PHAM VAO GIO HANG
function themGioHang(ten, gia) {
    gioHang.push({
        ten: ten,
        gia: Number(gia)
    });

    hienThiGioHang();

    document.getElementById("gioHang").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// HIEN THI GIO HANG
function hienThiGioHang() {
    let danhSach = document.getElementById("danhSachGio");
    let soLuong = document.getElementById("soluong");
    let tongTien = document.getElementById("tongTien");
    let ketQua = document.getElementById("ketQuaThanhToan");

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
    tongTien.innerText = tong.toLocaleString("vi-VN") + "đ";

    // NEU GIO HANG TRONG
    if (gioHang.length === 0) {
        danhSach.innerText = "Chưa có sản phẩm nào.";
        ketQua.innerHTML = "";
        ketQua.style.display = "none";
    }
}

// XOA SAN PHAM
function xoaSanPham(index) {
    gioHang.splice(index, 1);
    hienThiGioHang();
}

// DAT HANG
function datHang() {
    let hoTen = document.getElementById("hoTen").value.trim();
    let soDienThoai = document.getElementById("soDienThoai").value.trim();
    let diaChi = document.getElementById("diaChi").value.trim();

    let phuongThuc = document.querySelector(
        'input[name="thanhToan"]:checked'
    );

    let ketQua = document.getElementById("ketQuaThanhToan");

    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống!");
        ketQua.innerHTML = "";
        ketQua.style.display = "none";
        return;
    }

    if (!hoTen || !soDienThoai || !diaChi) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (!phuongThuc) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }

    let tongTien = document.getElementById("tongTien").innerText;

    let danhSachSanPham = gioHang.map(sp =>
        `<li>${sp.ten} - ${sp.gia.toLocaleString("vi-VN")}đ</li>`
    ).join("");

    ketQua.style.display = "block";

    ketQua.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <h2 style="color:green;">✓ ĐẶT HÀNG THÀNH CÔNG!</h2>

            <p>Cảm ơn ${hoTen} đã mua hàng tại DAT BOUTIQUE!</p>

            <hr>

            <h3>THÔNG TIN ĐƠN HÀNG</h3>

            <p>Họ tên: ${hoTen}</p>
            <p>Số điện thoại: ${soDienThoai}</p>
            <p>Địa chỉ: ${diaChi}</p>

            <h4>Sản phẩm đã đặt:</h4>
            <ul style="text-align:left;">
                ${danhSachSanPham}
            </ul>

            <h3>Tổng tiền: ${tongTien}</h3>

            <p>Phương thức thanh toán:
                ${phuongThuc.value === "QR" ? "Vietcombank QR" : "COD"}
            </p>

            <p>DAT BOUTIQUE sẽ sớm liên hệ xác nhận đơn hàng!</p>
        </div>
    `;

    gioHang = [];
    hienThiGioHang();
}
