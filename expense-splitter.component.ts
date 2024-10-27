import { Component } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { Member } from '../../models/member.model';
import { ExpenseSplitterService } from '../../services/expense-splitter.service';

@Component({
  selector: 'app-expense-splitter',
  templateUrl: './expense-splitter.component.html',
  styleUrls: ['./expense-splitter.component.css']
})
export class ExpenseSplitterComponent {
  members: Member[] = [];
  expenses: Expense[] = [];
  recentExpenses: Expense[] = []; // Holds recent expenses history
  settlements: any[] = [];
  newMemberName: string = '';
  newExpenseAmount: number | null = null;
  paidBy: string = '';
  splitAmong: string[] = [];
  totalExpenses: number = 0;
  expensesByMember: { [key: string]: number } = {};

  constructor(private expenseSplitterService: ExpenseSplitterService) {}

  addMember(name: string): void {
    if (!name.trim()) return;
    this.expenseSplitterService.addMember({ name }).subscribe(response => {
      console.log(response.message); // Success message from the server
      this.members.push(new Member(name));
      this.expensesByMember[name] = 0;
      this.newMemberName = '';
    }, error => {
      console.error('Error adding member:', error);
    });
  }

  addExpense(amount: number | null, paidBy: string, splitAmong: string[]): void {
    if (amount === null || paidBy === '' || splitAmong.length === 0) return;
    const expense = { amount, paidBy, splitAmong };
    
    this.expenseSplitterService.addExpense(expense).subscribe(response => {
      console.log(response.message); // Success message from the server
      this.expenses.push(new Expense(amount, paidBy, splitAmong));
      this.totalExpenses += amount;
      this.expensesByMember[paidBy] += amount;
      this.newExpenseAmount = null;
      this.paidBy = '';
      this.splitAmong = [];
      this.calculateSettlements();
    }, error => {
      console.error('Error adding expense:', error);
    });
  }

  onMemberSelectionChange(memberName: string, isChecked: boolean): void {
    if (isChecked) {
      this.splitAmong.push(memberName);
    } else {
      this.splitAmong = this.splitAmong.filter(m => m !== memberName);
    }
  }

  calculateSettlements(): void {
    const balances: { [key: string]: { [key: string]: number } } = {};
    
    // Initialize balances
    this.members.forEach(member => {
      balances[member.name] = {};
      this.members.forEach(innerMember => {
        if (member.name !== innerMember.name) {
          balances[member.name][innerMember.name] = 0;
        }
      });
    });

    // Calculate balances from expenses
    this.expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach(person => {
        if (person !== expense.paidBy) {
          balances[person][expense.paidBy] += amountPerPerson;
        }
      });
    });

    // Determine settlements
    const settlements = [];
    for (const debtor in balances) {
      for (const creditor in balances[debtor]) {
        if (balances[debtor][creditor] > 0) {
          settlements.push(`${debtor} owes ${creditor}: ${balances[debtor][creditor].toFixed(2)}`);
        }
      }
    }
    this.settlements = settlements;
  }

  fetchExpenseHistory(): void {
    this.expenseSplitterService.getRecentExpenses().subscribe(
      (expenses: Expense[]) => {
        this.recentExpenses = expenses;
      },
      error => {
        console.error('Error fetching expense history:', error);
      }
    );
  }
}
