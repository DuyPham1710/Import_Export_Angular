import { Component, EventEmitter, Output, Input, ChangeDetectorRef, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Product } from '../../models/product';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.css"],
    imports: [CommonModule, TableModule, ButtonModule]
})
export class DialogComponent implements OnInit {
    @Input() mode: 'import' | 'export' = 'import';
    @Input() exportData: Product[] = [];
    @Output() close = new EventEmitter<void>();
    @Output() dataImported = new EventEmitter<Product[]>();

    selectedFileName: string = '';
    previewData: Product[] = [];
    isLoading: boolean = false;
    validationErrors: string[] = [];
    isValidData: boolean = false;
    listSheets: string[] = [];
    selectedSheet: string = '';
    workbook: any = null;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        if (this.mode === 'export' && this.exportData) {
            this.previewData = this.exportData;
            this.isValidData = true;
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFileName = file.name;
            this.isLoading = true;
            this.validationErrors = [];
            this.previewData = [];
            this.listSheets = [];
            this.selectedSheet = '';

            this.readExcelFile(file);
        }
    }

    private readExcelFile(file: File): void {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const data = new Uint8Array(e.target.result);
                this.workbook = XLSX.read(data, { type: 'array' });
                this.listSheets = this.workbook.SheetNames;
                this.selectedSheet = this.workbook.SheetNames[0]; // Chọn sheet đầu tiên mặc định

                this.processSelectedSheet();
            } catch (error) {
                this.validationErrors.push('Lỗi đọc file Excel: ' + error);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        };
        reader.readAsArrayBuffer(file);
    }

    selectSheet(sheetName: string): void {
        this.selectedSheet = sheetName;
        this.processSelectedSheet();
    }

    private processSelectedSheet(): void {
        if (!this.workbook || !this.selectedSheet) return;

        const worksheet = this.workbook.Sheets[this.selectedSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.processExcelData(jsonData);
    }

    private processExcelData(data: any[]): void {
        // Reset validation errors khi chuyển sheet
        this.validationErrors = [];

        if (data.length < 2) {
            this.validationErrors.push('File Excel phải có ít nhất 2 dòng (header và dữ liệu)');
            this.isLoading = false;
            return;
        }

        // Lấy header từ dòng đầu tiên
        // const headers = data[0];
        const headers: string[] = data[0].map((h: any) => String(h).trim().toLowerCase());
        const expectedHeaders = ['productname', 'description', 'price', 'stock', 'images', 'createdat', 'isactive'];

        // Map header -> index
        const headerIndex: { [key: string]: number } = {};
        headers.forEach((h, i) => {
            headerIndex[h] = i;
        });

        // Kiểm tra header
        const missingHeaders = expectedHeaders.filter(header =>
            !headers.some((h: string) => h.toLowerCase().trim() === header.toLowerCase())
        );

        if (missingHeaders.length > 0) {
            this.validationErrors.push(`Thiếu các cột bắt buộc: ${missingHeaders.join(', ')}`);
        }

        // Xử lý dữ liệu từ dòng thứ 2
        const products: Product[] = [];
        const errors: string[] = [];

        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (row.length === 0) continue; // Bỏ qua dòng trống

            try {
                const product: Product = {
                    productName: this.parseString(row[headerIndex['productname']]),
                    description: this.parseString(row[headerIndex['description']]),
                    price: this.parseString(row[headerIndex['price']]),
                    stock: this.parseString(row[headerIndex['stock']]),
                    images: this.parseString(row[headerIndex['images']]),
                    createdAt: this.formatDate(row[headerIndex['createdat']]) || new Date(),
                    isActive: Boolean(row[headerIndex['isactive']]) || false
                };

                // Validate từng field
                const productErrors = this.validateProduct(product, i + 1);
                if (productErrors.length > 0) {
                    errors.push(...productErrors);
                } else {
                    products.push(product);
                }
            } catch (error) {
                errors.push(`Dòng ${i + 1}: Lỗi xử lý dữ liệu - ${error}`);
            }
        }

        this.previewData = products;
        this.validationErrors = [...this.validationErrors, ...errors];
        this.isValidData = this.validationErrors.length === 0 && products.length > 0;
        this.isLoading = false;
        this.cdr.detectChanges();
    }

    private formatDate(value: any): Date | null {
        if (value === null || value === undefined || value === '') return null;

        // Nếu là số (Excel date serial)
        if (typeof value === 'number') {
            const dateObj = XLSX.SSF.parse_date_code(value);
            if (dateObj) {
                // Dùng Date.UTC để tránh lệch múi giờ
                return new Date(Date.UTC(dateObj.y, dateObj.m - 1, dateObj.d));
            }
        }

        // Nếu là string thì parse bình thường
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }

        return null;
    }

    private parseNumber(value: any): number {
        if (value === null || value === undefined || value === '') return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }

    private parseString(value: any): string {
        if (value === null || value === undefined) return '';
        return String(value).trim();
    }

    private validateProduct(product: Product, rowNumber: number): string[] {
        const errors: string[] = [];

        // if (!product.id || product.id <= 0) {
        //     errors.push(`Dòng ${rowNumber}: ID phải là số dương`);
        // }

        if (!product.productName || product.productName.trim() === '') {
            errors.push(`Dòng ${rowNumber}: Tên sản phẩm không được để trống`);
        }

        if (!product.description || product.description.trim() === '') {
            errors.push(`Dòng ${rowNumber}: Mô tả không được để trống`);
        }

        if (!product.price || product.price.trim() === '') {
            errors.push(`Dòng ${rowNumber}: Giá không được để trống`);
        }

        if (!product.stock || product.stock.trim() === '') {
            errors.push(`Dòng ${rowNumber}: Số lượng không được để trống`);
        }

        if (!product.images || product.images.trim() === '') {
            errors.push(`Dòng ${rowNumber}: Hình ảnh không được để trống`);
        }

        return errors;
    }

    isValidProduct(product: Product): boolean {
        return this.validateProduct(product, 0).length === 0;
    }

    saveData(): void {
        if (this.isValidData && this.previewData.length > 0) {
            this.dataImported.emit(this.previewData);
            this.closeDialog();
        }
    }

    closeDialog(): void {
        this.close.emit();
    }

    exportToExcel(): void {
        if (this.mode === 'export' && this.previewData.length > 0) {
            // Loại bỏ trường id khỏi mỗi sản phẩm
            const exportData = this.previewData.map(({ id, ...rest }) => ({
                ...rest,
                price: Number(rest.price),
                stock: Number(rest.stock),
                createdAt: this.formatDate(rest.createdAt),
                isActive: Boolean(rest.isActive) || false
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            saveAs(blob, 'products.xlsx');
            this.closeDialog();
        }
    }
}