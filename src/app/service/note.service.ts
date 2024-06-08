import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './category.service';
import { environment } from '../../environments/environment';

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt?:string;
  isArchived?:boolean;
  categories?:Category[];
}

export interface NoteRequest {
  title: string;
  content: string;
  categoryIds:number[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = environment.API_URL;

  constructor(private http:HttpClient) { }

  getNotes(): Observable<Note[]>{
    return this.http.get<Note[]>(`${this.apiUrl}/notes`);
  }

  getNoteById(id:number): Observable<Note>{
    return this.http.get<Note>(`${this.apiUrl}/note/${id}`);
  }

  createNote(note:NoteRequest):Observable<Note>{
    return this.http.post<Note>(`${this.apiUrl}/note`,note);
  }

  updateNote(note:Note):Observable<Note>{
    return this.http.put<Note>(`${this.apiUrl}/note`,note);
  }

  deleteNoteById(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/note/${id}`);
  }

  getArchivedNotes():Observable<Note[]>{
    return this.http.get<Note[]>(`${this.apiUrl}/notes/archived`);
  }

  getUnarchivedNotes():Observable<Note[]>{
    return this.http.get<Note[]>(`${this.apiUrl}/notes/unarchived`);
  }

  archiveNoteById(id:number):Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/note/${id}/archive`,{});
  }

  unarchiveNoteById(id:number):Observable<void>{
    return this.http.post<void>(`${this.apiUrl}/note/${id}/unarchive`,{});
  }

  getNotesByCategories(categoryIds:number[]):Observable<Note[]>{
    return this.http.get<Note[]>(`${this.apiUrl}/note/filter?categoryIds=${categoryIds.join(',')}`);
  }

}
