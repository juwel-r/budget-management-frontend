import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectTransactions = (state: RootState) => state.transactions.items;
const selectAccounts = (state: RootState) => state.accounts.items;
const selectCategories = (state: RootState) => state.categories.items;

export const selectDashboardSummary = createSelector(
  [selectTransactions, selectAccounts],
  (transactions, accounts) => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const balance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    return { income, expense, balance, count: transactions.length };
  }
);

export const selectMonthlyChartData = createSelector([selectTransactions], (transactions) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = months.map((month) => ({ month, income: 0, expense: 0 }));

  transactions.forEach((t) => {
    const monthIndex = new Date(t.transactionDate).getMonth();
    if (t.type === "income") data[monthIndex].income += t.amount;
    if (t.type === "expense") data[monthIndex].expense += t.amount;
  });

  return data;
});

export const selectCategoryBreakdown = createSelector(
  [selectTransactions, selectCategories],
  (transactions, categories) => {
    const expenses = transactions.filter((t) => t.type === "expense");
    return categories
      .map((c) => ({
        name: c.name,
        value: expenses.filter((t) => t.categoryId === c._id).reduce((sum, t) => sum + t.amount, 0),
      }))
      .filter((item) => item.value > 0);
  }
);

export const selectRecentTransactions = createSelector([selectTransactions], (transactions) =>
  [...transactions]
    .sort((a, b) => +new Date(b.transactionDate) - +new Date(a.transactionDate))
    .slice(0, 6)
);