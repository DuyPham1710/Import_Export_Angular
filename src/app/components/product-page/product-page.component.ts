import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DialogComponent } from "../dialog/dialog.component";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from "@angular/common";
import { CreateProductRequest, Product } from "../../models/product";
import { CheckboxModule } from "primeng/checkbox";
import { ProductService } from "../../services/product.service";
import { ButtonModule } from "primeng/button";

@Component({
    selector: "app-product-page",
    standalone: true,
    templateUrl: "./product-page.component.html",
    styleUrls: ["./product-page.component.css"],
    imports: [TableModule, InputTextModule, CommonModule, CheckboxModule, ButtonModule, DialogComponent],
})
export class ProductPageComponent implements OnInit {
    constructor(
        private productService: ProductService,
        private cdr: ChangeDetectorRef
    ) { }

    products: Product[] = [];
    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.products = data;
                // this.cdr.detectChanges();
                this.cdr.markForCheck();
            },
            error: (err) => console.error(err)
        });
    }

    formatPrice(price: string): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(Number(price));
    }

    selectedProducts: Product[] = [];

    showDialog = false;

    openDialog() {
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
    }

    onDataImported(importedProducts: Product[]) {
        if (!importedProducts || importedProducts.length === 0) return;

        const request: CreateProductRequest = { products: importedProducts };
        console.log('Sản phẩm import nhận được:', importedProducts);
        // Gọi API để lưu vào DB
        this.productService.createProduct(request).subscribe({
            next: (res) => {
                console.log('Đã import và lưu', res.length, 'sản phẩm');
                this.loadProducts();
            },
            error: (err) => {
                console.error('Lỗi khi lưu sản phẩm import:', err);
            }
        });
        // // Thêm dữ liệu import vào danh sách hiện tại
        // this.products = [...this.products, ...importedProducts];
        // this.cdr.detectChanges();
        // console.log('Đã import', importedProducts.length, 'sản phẩm');
    }
}