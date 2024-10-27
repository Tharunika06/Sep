import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSplitterService {
  private apiUrl = 'http://localhost:3000/api'; // Your API base URL

  constructor(private http: HttpClient) {}

  addMember(member: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/members`, member);
  }

  addExpense(expense: Expense): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/expenses`, expense);
  }

  getRecentExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses/recent`);
  }
}
