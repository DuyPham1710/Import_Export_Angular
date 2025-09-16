import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../../core/constants/constant";
import { CreateProductRequest, Product, PaginatedResponse } from "../models/product";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    getAllProducts(page: number, limit: number): Observable<PaginatedResponse<Product>> {
        return this.http.get<PaginatedResponse<Product>>(`${API_URL}/Product?page=${page}&limit=${limit}`);
    }

    createProduct(products: CreateProductRequest): Observable<Product[]> {
        return this.http.post<Product[]>(`${API_URL}/Product`, products);
    }
}