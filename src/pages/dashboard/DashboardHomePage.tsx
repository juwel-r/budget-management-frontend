import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyTransactions } from "../../redux/features/transactions/transactionSlice";
import { fetchMyAccounts } from "../../redux/features/accounts/accountSlice";
import { fetchMyCategories } from "../../redux/features/categories/categorySlice";
import {
  selectCategoryBreakdown,
  selectDashboardSummary,
  selectMonthlyChartData,
  selectRecentTransactions,
} from "../../redux/features/reports/reportSelectors";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export function DashboardHomePage() {
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectDashboardSummary);
  const monthlyData = useAppSelector(selectMonthlyChartData);
  const categoryData = useAppSelector(selectCategoryBreakdown);
  const recentTransactions = useAppSelector(selectRecentTransactions);

  useEffect(() => {
    dispatch(fetchMyTransactions());
    dispatch(fetchMyAccounts());
    dispatch(fetchMyCategories());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-1 text-white/60">Track your income, expenses, transfers, and balances.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Income" value={`৳${summary.income.toLocaleString()}`} />
        <StatCard title="Total Expense" value={`৳${summary.expense.toLocaleString()}`} />
        <StatCard title="Net Balance" value={`৳${summary.balance.toLocaleString()}`} />
        <StatCard title="Transactions" value={summary.count.toString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">Income vs Expense</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">Expense by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={60}
                  paddingAngle={4}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div key={t._id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div>
                  <p className="font-medium capitalize">{t.type}</p>
                  <p className="text-sm text-white/60">{t.note || "No note"}</p>
                </div>
                <p className="font-semibold">৳{t.amount.toLocaleString()}</p>
              </div>
            ))}
            {!recentTransactions.length && (
              <div className="rounded-xl border border-dashed border-white/15 p-6 text-center text-white/60">
                No recent transactions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-white/60">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold">{value}</h3>
    </div>
  );
}