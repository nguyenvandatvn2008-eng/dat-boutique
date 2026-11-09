let gioHang = [];

// THEM SAN PHAM VAO GIO HANG
function themGioHang(ten, gia) {
    gioHang.push({
        ten: ten,
        gia: gia
    });

    hienThiGioHang();document.getElementById("gioHang").scrollIntoView({
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
        tong = tong + sp.gia;

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

    if (gioHang.length === 0) {
        danhSach.innerText = "Chưa có sản phẩm nào.";
    }
}

// XOA SAN PHAM
function xoaSanPham(index) {
    gioHang.splice(index, 1);
    hienThiGioHang();
}
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

    if (phuongThuc.value === "QR") {
        ketQua.innerHTML = `
            <h3>THANH TOÁN VIETCOMBANK</h3>
            <p>Vui lòng quét mã QR để chuyển khoản.</p>
            <img src="images/qr-vcb.jpg"
                 alt="Mã QR Vietcombank"
                 style="width:220px; max-width:100%;">
            <p>Số tiền: <strong>${document.getElementById("tongTien").innerText}</strong></p>
            <p>Sau khi chuyển khoản, vui lòng chờ xác nhận đơn hàng.</p>
        `;
    } else {
        ketQua.innerHTML = `
            <h3>ĐẶT HÀNG THÀNH CÔNG</h3>
            <p>Bạn đã chọn thanh toán khi nhận hàng (COD).</p>
            <p>Chúng tôi sẽ liên hệ xác nhận đơn hàng.</p>
        `;
    }
}
