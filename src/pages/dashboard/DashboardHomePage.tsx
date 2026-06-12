import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMyTransactions } from "../../redux/features/transactions/transactionSlice";
import { fetchMyAccounts } from "../../redux/features/accounts/accountSlice";
import { fetchMyCategories } from "../../redux/features/categories/categorySlice";
import {
  selectDashboardSummary,
  selectMonthlyChartData,
  selectCategoryBreakdown,
  selectRecentTransactions,
} from "../../redux/features/reports/reportSelectors";

const COLORS = ["#6366f1", "#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

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
    <motion.div initial="hidden" animate="visible" variants={container} className="space-y-6">
      <motion.div variants={item} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hidden lg:block text-sm text-white/50">Overview</p>
          <h2 className="mt-1 text-3xl font-bold">Finance Dashboard</h2>
          <p className="hidden lg:block mt-2 max-w-2xl text-white/60">
            A clean snapshot of your money flow, account balance, and spending behavior.
          </p>
        </div>

        <div className="hidden lg:flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            This month
          </div>
          <div className="rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-medium">
            Refresh
          </div>
        </div>
      </motion.div>

      <motion.div variants={container} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Income" value={`৳${summary.income.toLocaleString()}`} tone="text-emerald-300" />
        <StatCard title="Expense" value={`৳${summary.expense.toLocaleString()}`} tone="text-rose-300" />
        <StatCard title="Net Balance" value={`৳${summary.balance.toLocaleString()}`} tone="text-cyan-300" />
        <StatCard title="Transactions" value={summary.count.toString()} tone="text-violet-300" />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-12">
        <motion.div variants={item} className="xl:col-span-8 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Cash Flow Trend</h3>
              <p className="text-sm text-white/50">Income and expense by month.</p>
            </div>
          </div>

          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#incomeFill)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Expense Split</h3>
          <p className="text-sm text-white/50">Where your expenses go.</p>

          <div className="mt-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={120}
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
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <motion.div variants={item} className="xl:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
          <p className="text-sm text-white/50">Bar view for quick comparison.</p>

          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-5 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <p className="text-sm text-white/50">Latest activity from your account.</p>

          <div className="mt-4 space-y-3">
            {recentTransactions.map((t) => (
              <div
                key={t._id}
                className="rounded-2xl border border-white/10 bg-[#0b1020] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize">{t.type}</p>
                    <p className="mt-1 text-sm text-white/50">{t.note || "No note"}</p>
                  </div>
                  <span className="font-semibold">৳{t.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}

            {!recentTransactions.length && (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/50">
                No recent transactions found.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <p className="text-sm text-white/50">{title}</p>
      <h3 className={`mt-2 text-3xl font-bold ${tone}`}>{value}</h3>
    </motion.div>
  );
}