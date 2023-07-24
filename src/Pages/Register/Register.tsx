import React from 'react';
import {useFormik} from 'formik';
import { NavLink } from 'react-router-dom';
import { DispatchType } from '../../Redux/configStore';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { registerAsyncAction } from '../../Redux/reducers/userLoginReducer';

type Props = {}

export interface UserRegisterFrm {
  email: string,
  passWord: string,
  name: string,
  phoneNumber: string
}

export default function Register({}: Props) {
  const dispatch:DispatchType = useDispatch();

  const registerFrm = useFormik<UserRegisterFrm>({
    initialValues:{
      email:'',
      passWord:'',
      name:'',
      phoneNumber:''
    },

    validationSchema:yup.object().shape({
      email:yup.string().required("Email cannot be blank!").email("Email is invalid!"),
      name:yup.string().required("Name cannot be blank!"),
      phoneNumber:yup.number().required("Phone number cannot be blank!"),
      passWord:yup.string().required("Password cannot be blank!").min(6,"Password must be at least 6 characters")
    }),

    onSubmit:(values:UserRegisterFrm) =>{
      const actionApi = registerAsyncAction(values);
      dispatch(actionApi)
    }
  })

  return (
    <div className="register">
      <div className="register-box">
        <form onSubmit={registerFrm.handleSubmit}>
          <h2>Register</h2>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-user"></i>
            </span>
            <input type="text" name='name' onInput={registerFrm.handleChange}/>
            <label>Name</label>
            {registerFrm.errors.name && registerFrm.touched.name && <p className='err text-danger ms-1'>{registerFrm.errors.name}</p>}
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-envelope"></i>
            </span>
            <input type="email" name='email' onInput={registerFrm.handleChange}/>
            <label>Email</label>
            {registerFrm.errors.email && registerFrm.touched.email && <p className='err text-danger ms-1'>{registerFrm.errors.email}</p>}
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-phone"></i>
            </span>
            <input type="text" name='phoneNumber' onInput={registerFrm.handleChange}/>
            <label>Phone</label>
            {registerFrm.errors.phoneNumber && registerFrm.touched.phoneNumber && <p className='err text-danger ms-1'>{registerFrm.errors.phoneNumber}</p>}
          </div>
          <div className="input-box">
            <span className="icon">
              <i className="fa fa-lock"></i>
            </span>
            <input type="password" name='passWord' onInput={registerFrm.handleChange}/>
            <label>Password</label>
            {registerFrm.errors.passWord && registerFrm.touched.passWord && <p className='err text-danger ms-1'>{registerFrm.errors.passWord}</p>}
          </div>
          <button type="submit">Sign Up</button>
          <div className="login-link">
            <p>
              Already have an account? <NavLink to="/login">Login now</NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}