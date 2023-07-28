import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, Avatar, Breadcrumb, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { USER_LOGIN, clearStorage, getStoreJson } from "../../Util/config";
import { openModalAction } from "../../Redux/reducers/taskReducer";
import { useDispatch } from "react-redux";
import { DispatchType } from "../../Redux/configStore";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  const dispatch: DispatchType = useDispatch();
  interface UserLogin {
    name: string;
    avatar: string;
  }

  let userLogin: UserLogin = {
    name: "",
    avatar: "",
  };

  if (localStorage.getItem(USER_LOGIN)) {
    userLogin = getStoreJson(USER_LOGIN);
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <NavLink
          rel="noopener noreferrer"
          to="/login"
          className="t-dec"
          onClick={() => {
            clearStorage(USER_LOGIN);
          }}
        >
          <i className="fa fa-sign-out-alt me-2"></i>
          Logout
        </NavLink>
      ),
    },
  ];
  return (
    <div className="header mt-4">
      <Breadcrumb
        className="text-dark"
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
      <div>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space className="g-2">
              <Avatar
                src={userLogin.avatar}
                style={{ width: 30, height: 30 }}
              />
              <span className="p-1">{userLogin.name.toLocaleUpperCase()}</span>
              <DownOutlined className="fs-10 ver-mid" />
            </Space>
          </a>
        </Dropdown>
        <button
          className="btn-menu"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#AsideOffcanvasMenu"
          aria-controls="AsideOffcanvasMenu"
        >
          <i className="fa fa-bars fs-icon" />
        </button>
      </div>
      <div
        className="off-canvas-wrapper offcanvas offcanvas-start"
        tabIndex={-1}
        id="AsideOffcanvasMenu"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <button
            className="btn-menu-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            Jira Menu <i className="fa fa-chevron-left" />
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="mobile-menu-items">
            <ul className="nav-menu">
              <li className="menu-item-has-children">
                <NavLink to="/project">Project Management</NavLink>
              </li>
              <li>
                <NavLink to="/usermanagement">User Management</NavLink>
              </li>
              <li className="menu-item-has-children">
                <NavLink to="/createproject">Create Project</NavLink>
              </li>
              <li className="menu-item-has-children">
                <span
                  onClick={() => {
                    const actionOpen = openModalAction(true);
                    dispatch(actionOpen);
                  }}
                >
                  Create Task
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
