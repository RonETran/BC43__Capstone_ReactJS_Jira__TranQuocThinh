import React from 'react';
import {useFormik} from 'formik';
import { NavLink } from 'react-router-dom';
import { DispatchType } from '../../Redux/configStore';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { registerAsyncAction } from '../../Redux/reducers/userLoginReducer';
import { Button, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

type Props = {}

export interface UserRegisterFrm {
  email: string,
  passWord: string,
  name: string,
  phoneNumber: string
}

export default function Register({}: Props) {
  const dispatch:DispatchType = useDispatch();

  const onFinish = (values:UserRegisterFrm) => {
    const action = registerAsyncAction(values);
    dispatch(action)
  };

  return (
    <div className="register">
      <div className="register-box">
        <Form labelAlign="left" layout="vertical" onFinish={onFinish} className="form-antd">
          <h2>Register</h2>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
          </Form.Item>

          <Form.Item
          className="form-item"
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />}/>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input prefix={<PhoneOutlined className="site-form-item-icon" />}/>
          </Form.Item>

          <Form.Item
            name="passWord"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />}/>
          </Form.Item>

          <Form.Item  className="mt-5">
            <Button type="primary" htmlType="submit">
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item>
          <div className="login-link">
            <p>
              Already have an account? <NavLink to="/login">Login now</NavLink>
            </p>
          </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}