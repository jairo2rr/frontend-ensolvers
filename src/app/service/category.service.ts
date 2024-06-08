import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category{
  id?:number;
  name:string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.API_URL;

  constructor(private http:HttpClient) { }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category:Category):Observable<Category>{
    return this.http.post<Category>(`${this.apiUrl}/category`,category);
  }
}
