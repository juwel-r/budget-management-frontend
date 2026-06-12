import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearAuthError, loginUser } from "../../redux/features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, status, user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-white/60">Sign in to manage your finance data.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none" placeholder="Email" {...register("email")} />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none" type="password" placeholder="Password" {...register("password")} />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button disabled={status === "loading"} className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium disabled:opacity-60">
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-white/60">
          No account? <Link className="text-indigo-400" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}