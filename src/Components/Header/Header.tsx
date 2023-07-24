import React from 'react'
import {NavLink} from 'react-router-dom'
import {Dropdown,Avatar,Breadcrumb,Space} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import { USER_LOGIN, clearStorage, getStoreJson } from '../../Util/config';

type Props = {
    title: string;
}

export default function Header({title}: Props) {
    interface UserLogin {
        name: string,
        avatar:string
    }

    let userLogin:UserLogin = {
        name: '',
        avatar:''
    }

    if(localStorage.getItem(USER_LOGIN)){
        userLogin = getStoreJson(USER_LOGIN)
    }

    const items: MenuProps["items"] = [
        {
          key: "1",
          label: (
            <NavLink rel="noopener noreferrer" to="/login" className="t-dec" onClick={()=>{
                clearStorage(USER_LOGIN);
            }}>
              <i className="fa fa-sign-out-alt me-2"></i>
              Logout
            </NavLink>
          ),
        },
      ];
  return (
    <div className="header mt-4">
        <Breadcrumb className="text-dark"
          items={[
            {
              title: "Project",
            },
            {
              title: "Jira Clone",
            },
            {
              title: title,
            },
          ]}
        />
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space className='g-2'>
              <Avatar src={userLogin.avatar} style={{ width: 30, height: 30 }} />
              <span className="p-1">{userLogin.name.toLocaleUpperCase()}</span>
              <DownOutlined className='fs-10 ver-mid'/>
            </Space>
          </a>
        </Dropdown>
      </div>
  )
}