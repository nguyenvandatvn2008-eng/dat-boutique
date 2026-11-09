let gioHang = [];

// THEM SAN PHAM VAO GIO HANG
function themGioHang(ten, gia) {
    gioHang.push({
        ten: ten,
        gia: gia
    });

    hienThiGioHang();

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
