import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "../../core/constants/constant";
import { CreateProductRequest, Product } from "../models/product";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${API_URL}/Product`);
    }

    createProduct(products: CreateProductRequest): Observable<Product[]> {
        return this.http.post<Product[]>(`${API_URL}/Product`, products);
    }
}