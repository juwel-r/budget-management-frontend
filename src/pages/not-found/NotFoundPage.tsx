import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-3 text-white/60">Page not found</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-indigo-500 px-5 py-3 font-medium">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}