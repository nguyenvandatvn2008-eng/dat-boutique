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
            <p>
                ${sp.ten} - ${sp.gia.toLocaleString("vi-VN")}đ
                <button onclick="xoaSanPham(${index})">Xóa</button>
            </p>
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
