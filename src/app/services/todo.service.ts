import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITodo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  baseApiUrl: string = 'https://localhost:7079';

  constructor(private http: HttpClient) { }

  getAllTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${this.baseApiUrl}/api/todo`);
  }

  getAllDeletedTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${this.baseApiUrl}/api/todo/get-deleted-todos`);
  }

  addTodo(newTodo: ITodo): Observable<ITodo> {
    newTodo.id = "00000000-0000-0000-0000-000000000000";

    return this.http.post<ITodo>(`${this.baseApiUrl}/api/todo`, newTodo);
  }

  onCompleteChange(id: string, todo: ITodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${this.baseApiUrl}/api/todo/${id}`, todo);
  }

  onDelete(id: string): Observable<ITodo> {
    return this.http.delete<ITodo>(`${this.baseApiUrl}/api/todo/${id}`);
  }

  onUndo(id: string): Observable<ITodo> {
    return this.http.put<ITodo>(`${this.baseApiUrl}/api/todo/undo-deleted-todo/${id}`, {});
  }
}
