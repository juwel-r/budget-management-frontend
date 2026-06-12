import { Outlet, NavLink, useNavigate } from "react-router";
import { LayoutDashboard, Wallet, Tags, ReceiptText, LogOut, UserCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutUser } from "../../redux/features/auth/authSlice";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
    isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-white/65 hover:bg-white/5"
  }`;

const bottomLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${isActive ? "text-indigo-300" : "text-white/55"}`;

export function DashboardLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const userName = user?.fullName || user?.email || "User";

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-80 border-r border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:flex lg:flex-col overflow-hidden">
          <div className="mb-8 rounded-3xl border border-white/10 bg-[#0b1020] p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold">Finance Manager</h1>
                <p className="truncate text-sm text-white/60">{userName}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
              <UserCircle2 className="h-4 w-4" />
              <span className="truncate capitalize">{user?.role || "user"}</span>
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
            <button
              onClick={handleLogout}
              className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80 transition hover:bg-white/15"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="flex-1 pb-24 lg:pb-0">
          {/* Mobile Header */}
          <header className="px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <div className="flex  items-center gap-4">
                <UserCircle2 className="h-6 w-6" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">Finance Manager</p>
                  <p className="text-sm font-semibold">{userName}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-indigo-500/20 px-3 py-2 text-xs font-medium text-indigo-200 capitalize">{user?.role || "user"}</div>
            </div>
          </header>

          <main className="px-4 py-6 lg:px-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile bottom navbar */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070b17]/95 px-3 py-3 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          <NavLink to="/dashboard" className={bottomLinkClass}>
            <LayoutDashboard className="h-5 w-5" />
            <span>Home</span>
          </NavLink>

          <NavLink to="/accounts" className={bottomLinkClass}>
            <Wallet className="h-5 w-5" />
            <span>Accounts</span>
          </NavLink>

          <NavLink to="/categories" className={bottomLinkClass}>
            <Tags className="h-5 w-5" />
            <span>Categories</span>
          </NavLink>

          <NavLink to="/transactions" className={bottomLinkClass}>
            <ReceiptText className="h-5 w-5" />
            <span>Transactions</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
