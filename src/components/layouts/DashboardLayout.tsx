import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Wallet, Tags, ReceiptText, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutUser } from "../../redux/features/auth/authSlice";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
    isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
  }`;

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 border-r border-white/10 p-6 md:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Finance Manager</h1>
              <p className="text-sm text-white/60">{user?.fullName || "User"}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/accounts" className={linkClass}>
              <Wallet className="h-4 w-4" />
              Accounts
            </NavLink>
            <NavLink to="/categories" className={linkClass}>
              <Tags className="h-4 w-4" />
              Categories
            </NavLink>
            <NavLink to="/transactions" className={linkClass}>
              <ReceiptText className="h-4 w-4" />
              Transactions
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white/80"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 p-4 md:hidden">
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="rounded-xl bg-white/10 p-2"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-right">
              <p className="text-sm font-medium">{user?.fullName || "User"}</p>
              <p className="text-xs text-white/60">Finance Manager</p>
            </div>
          </header>

          {mobileOpen && (
            <div className="border-b border-white/10 bg-slate-900 p-4 md:hidden">
              <nav className="space-y-2">
                <NavLink onClick={() => setMobileOpen(false)} to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/accounts" className={linkClass}>Accounts</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/categories" className={linkClass}>Categories</NavLink>
                <NavLink onClick={() => setMobileOpen(false)} to="/transactions" className={linkClass}>Transactions</NavLink>
              </nav>
              <button onClick={handleLogout} className="mt-4 flex w-full items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}

          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}