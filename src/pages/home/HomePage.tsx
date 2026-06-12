import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Shield, PieChart, Wallet, BarChart3, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <BackgroundGlow />

      <main className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Navbar />

        <section className="grid min-h-[85vh] items-center gap-16 py-16 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4 text-indigo-300" />
              Smart finance dashboard for modern users
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
            >
              Manage money with <span className="text-indigo-300">clarity</span> and control.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-8 text-white/65"
            >
              Track income, expenses, transfers, balances, and reports in one elegant dashboard built for speed and insight.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 font-medium shadow-lg shadow-indigo-500/30"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-medium backdrop-blur-xl"
                >
                  Login
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <StatMini label="Accounts" value="4+" />
              <StatMini label="Reports" value="Live" />
              <StatMini label="Security" value="Protected" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-10 top-10 h-44 w-44 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute -right-8 bottom-6 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            >
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1020] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50">Monthly overview</p>
                    <h3 className="mt-1 text-2xl font-semibold">Finance Snapshot</h3>
                  </div>
                  <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <GlassCard title="Income" value="৳128,400" accent="text-emerald-300" />
                  <GlassCard title="Expense" value="৳72,900" accent="text-rose-300" />
                  <GlassCard title="Balance" value="৳55,500" accent="text-cyan-300" />
                  <GlassCard title="Transactions" value="248" accent="text-violet-300" />
                </div>

                <div className="mt-6 grid gap-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "86%" }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-lime-300"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "54%" }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="h-3 rounded-full bg-gradient-to-r from-rose-400 to-orange-300"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid gap-5 md:grid-cols-3"
          >
            <FeatureCard
              icon={<Wallet className="h-5 w-5" />}
              title="Accounts"
              text="Cash, bank, mobile banking, and card accounts in one place."
            />
            <FeatureCard
              icon={<PieChart className="h-5 w-5" />}
              title="Reports"
              text="Charts and summaries that make your spending easy to understand."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Secure"
              text="Authentication-protected routes with cookie-based access."
            />
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-200">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Finance Manager</h1>
          <p className="text-sm text-white/50">Track. Save. Grow.</p>
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-white/70 hover:bg-white/5">
          Login
        </Link>
        <Link to="/register" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950">
          Start Free
        </Link>
      </div>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-8rem] right-[-8rem] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div className="mb-4 inline-flex rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
    </motion.div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <p className="text-sm text-white/50">{label}</p>
      <h4 className="mt-2 text-2xl font-semibold">{value}</h4>
    </div>
  );
}

function GlassCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/50">{title}</p>
      <h4 className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</h4>
    </div>
  );
}