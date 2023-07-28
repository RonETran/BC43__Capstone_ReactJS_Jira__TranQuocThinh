import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  USER_LOGIN,
  getStoreJson,
  http,
  httpAuth,
  setStoreJson,
} from "../../Util/config";
import { UserRegisterFrm } from "../../Pages/Register/Register";
import { UserLoginFrm } from "../../Pages/Login/Login";
import { history } from "../../index";
import { DispatchType } from "../configStore";
import { Member } from "./editProjectReducer";
import Swal from "sweetalert2";

export interface UserRegisterApi {
  email: string;
  passWord: string;
  name: string;
  phoneNumber: string;
}

export interface UserLoginApi {
  id: number;
  email: string;
  avatar: string;
  phoneNumber: string;
  name: string;
  accessToken: string;
}

export interface UserState {
  userRegister: UserRegisterApi;
  userLogin: UserLoginApi | undefined;
  isLoading: boolean;
}

const initialState: UserState = {
  userRegister: {
    email: "",
    passWord: "",
    name: "",
    phoneNumber: "",
  },
  userLogin: {
    id: 0,
    email: "",
    avatar: "",
    phoneNumber: "",
    name: "",
    accessToken: "",
  },
  isLoading: false,
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    loginAction:(state,action) => {
        state.userLogin = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsyncAction.pending, (state: UserState, action) => {
        state.isLoading = true;
      })
      .addCase(
        registerAsyncAction.fulfilled,
        (state: UserState, action: PayloadAction<UserRegisterApi>) => {
          state.userRegister = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(registerAsyncAction.rejected, (state: UserState, action) => {
        alert("Fail");
        state.isLoading = false;
      });

    builder
      .addCase(loginAsyncAction.pending, (state: UserState, action) => {
        state.isLoading = true;
      })
      .addCase(
        loginAsyncAction.fulfilled,
        (state: UserState, action: PayloadAction<UserLoginApi>) => {
          state.userLogin = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(loginAsyncAction.rejected, (state: UserState, action) => {
        alert("Fail");
        state.isLoading = false;
      });
  },
});

export const {loginAction} = userReducer.actions;

export default userReducer.reducer;

export const registerAsyncAction = createAsyncThunk(
  "registerAsyncAction",
  async (userRegister: UserRegisterFrm) => {
    try {
      const res = await http.post("/api/Users/signup", userRegister);
      history.push("/login");
      return res.data.content;
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
      });
    }
  }
);

export const loginAsyncAction = createAsyncThunk(
  "loginAsyncAction",
  async (userLogin: UserLoginFrm) => {
    try {
      const res = await http.post("/api/Users/signin", userLogin);
      setStoreJson(USER_LOGIN, res.data.content);
      history.push("/project");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });
      return res.data.content;
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
      });
    }
  }
);
