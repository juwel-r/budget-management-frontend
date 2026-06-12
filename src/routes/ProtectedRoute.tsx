import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getMe } from "../redux/features/auth/authSlice";

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (!user && status === "idle") {
      dispatch(getMe());
    }
  }, [dispatch, user, status]);

  if (status === "loading" || status === "idle") {
    return <div className="flex min-h-screen items-center justify-center text-white">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}