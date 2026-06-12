import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseApi from "../../api/baseApi";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "subAdmin";
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
};

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  token: null,
};

export const getMe = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const res = await baseApi.get("/users/get-me");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Failed to load user");
  }
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await baseApi.post("/auth/login", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    payload: { fullName: string; email: string; phone?: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await baseApi.post("/users/register", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Register failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await baseApi.post("/auth/logout");
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user ?? action.payload;
        state.token = action.payload.token ?? state.token;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user ?? action.payload;
        state.token = action.payload.token ?? state.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user ?? action.payload;
        state.token = action.payload.token ?? state.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
      });
  },
});

export const { clearAuthError, clearUser } = authSlice.actions;
export default authSlice.reducer;