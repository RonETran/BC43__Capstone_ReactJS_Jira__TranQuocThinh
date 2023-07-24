import React from "react";
import { NavLink } from "react-router-dom";
import { DispatchType } from "../../Redux/configStore";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { loginAsyncAction } from "../../Redux/reducers/userLoginReducer";
import * as yup from 'yup';

type Props = {};

export interface UserLoginFrm {
  email:string,
  passWord:string
}

export default function Login({}: Props) {
  const dispatch:DispatchType = useDispatch();

  const loginFrm = useFormik<UserLoginFrm>({
    initialValues:{
      email:'',
      passWord:''
    },

    validationSchema:yup.object().shape({
      email:yup.string().required("Email cannot be blank!").email("Email is invalid!"),
      passWord:yup.string().required("Password cannot be blank!").min(8,"Password must be at least 8 characters")
    }),

    onSubmit:(values:UserLoginFrm) => {
      const actionApi = loginAsyncAction(values);
      dispatch(actionApi);
    }
  })

  return (
    <div className="login">
      <div className="login-box">
        <form onSubmit={loginFrm.handleSubmit}>
          <h2>Login</h2>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-envelope"></i>
            </span>
            <input type="email" name="email" id="email" onInput={loginFrm.handleChange} />
            <label>Email</label>
            {loginFrm.errors.email && loginFrm.touched.email && <p className='err text-danger ms-1'>{loginFrm.errors.email}</p>}
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-lock"></i>
            </span>
            <input type="password" name="passWord" id="passWord" onInput={loginFrm.handleChange}/>
            <label>Password</label>
            {loginFrm.errors.passWord && loginFrm.touched.passWord && <p className='err text-danger ms-1'>{loginFrm.errors.passWord}</p>}
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <NavLink to="/">Forgot Password</NavLink>
          </div>
          <button type="submit">Sign In</button>
          <div className="register-link">
            <p>
              Don't have an account? <NavLink to="/register">Register</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
