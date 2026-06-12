import { motion } from "framer-motion";
import { BarChart3, PieChart, ShieldCheck, Wallet } from "lucide-react";

export function AuthSidePanel() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
          Smart personal finance
        </div>
        <h1 className="max-w-xl text-5xl font-bold leading-tight">
          Take control of your money with beautiful insights.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/60">
          Track accounts, income, expenses, transfers, and reports in a modern dashboard built for clarity.
        </p>
      </div>

      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <Feature icon={<Wallet className="h-5 w-5" />} title="Accounts" text="Cash, bank, card, and mobile banking." />
        <Feature icon={<PieChart className="h-5 w-5" />} title="Reports" text="Charts that show where your money goes." />
        <Feature icon={<BarChart3 className="h-5 w-5" />} title="Dashboard" text="Everything in one smooth interface." />
        <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Secure" text="Protected routes with cookie auth." />
      </div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Live preview</p>
            <h3 className="text-2xl font-semibold">Finance Overview</h3>
          </div>
          <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniBox label="Income" value="৳128k" />
          <MiniBox label="Expense" value="৳72k" />
          <MiniBox label="Balance" value="৳56k" />
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      <div className="mb-3 inline-flex rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">{icon}</div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-white/60">{text}</p>
    </motion.div>
  );
}

function MiniBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1020] p-4">
      <p className="text-sm text-white/50">{label}</p>
      <h4 className="mt-2 text-2xl font-semibold">{value}</h4>
    </div>
  );
}