import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectTransactions = (state: RootState) => state.transactions.items;
const selectAccounts = (state: RootState) => state.accounts.items;
const selectCategories = (state: RootState) => state.categories.items;

export const selectDashboardSummary = createSelector(
  [selectTransactions, selectAccounts],
  (transactions, accounts) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const transfer = transactions
      .filter((t) => t.type === "transfer")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    return {
      income,
      expense,
      transfer,
      balance,
      count: transactions.length,
    };
  }
);

export const selectMonthlyChartData = createSelector(
  [selectTransactions],
  (transactions) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const map = new Map<string, { month: string; income: number; expense: number }>();

    months.forEach((m) => map.set(m, { month: m, income: 0, expense: 0 }));

    transactions.forEach((t) => {
      const month = months[new Date(t.transactionDate).getMonth()];
      const current = map.get(month);
      if (!current) return;

      if (t.type === "income") current.income += t.amount;
      if (t.type === "expense") current.expense += t.amount;
    });

    return Array.from(map.values());
  }
);

export const selectCategoryBreakdown = createSelector(
  [selectTransactions, selectCategories],
  (transactions, categories) => {
    const expenseTransactions = transactions.filter((t) => t.type === "expense");

    return categories
      .map((cat) => ({
        name: cat.name,
        value: expenseTransactions
          .filter((t) => t.categoryId === cat._id)
          .reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((item) => item.value > 0);
  }
);

export const selectRecentTransactions = createSelector(
  [selectTransactions],
  (transactions) =>
    [...transactions]
      .sort((a, b) => +new Date(b.transactionDate) - +new Date(a.transactionDate))
      .slice(0, 5)
);