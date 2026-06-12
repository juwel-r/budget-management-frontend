import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthSidePanel } from "../../components/auth/AuthSidePanel";
import { useAppDispatch } from "../../redux/hooks";
import { loginUser } from "../../redux/features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success(result?.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <AuthLayout side={<AuthSidePanel />}>
      <div className="mb-8">
        <p className="text-sm text-white/50">Welcome back</p>
        <h2 className="mt-2 text-3xl font-bold">Login to your account</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField label="Email" type="email" placeholder="you@example.com" register={register("email")} error={errors.email?.message} />
        <InputField label="Password" type="password" placeholder="••••••••" register={register("password")} error={errors.password?.message} />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-medium disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-indigo-300 hover:text-indigo-200">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

function InputField({
  label,
  type,
  placeholder,
  register,
  error,
}: {
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-indigo-400"
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}