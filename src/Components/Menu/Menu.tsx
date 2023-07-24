import React from 'react'
import { NavLink} from 'react-router-dom'

type Props = {}

export default function Menu({}: Props) {
  
  return (
    <div className="menu">
        <div className="account">
          <div className="avatar">
            <i className="fab fa-jira"></i>
          </div>
          <div className="account-info">
            <p style={{ color: "rgb(66, 82, 110)", fontWeight: "bold" }}>
              Jira Clone
            </p>
            <p style={{ color: "rgb(94, 108, 132)" }}>Software Project</p>
          </div>
        </div>
        <div className="control">
          <NavLink
            end
            className={({isActive})=>isActive? 'font-weight-bold t-dec a-hover active' : 'font-weight-bold t-dec a-hover'}
            to="/project"
          >
            <div>
              <i className="fa fa-cog" />
              <span className="ms-2">Project Management</span>
            </div>
          </NavLink>
          <NavLink
            className={({isActive})=>isActive? 'font-weight-bold t-dec a-hover active' : 'font-weight-bold t-dec a-hover'}
            to="/createproject"
          >
            <div>
              <i className="fa fa-cog" />
              <span className="ms-2">Create Project</span>
            </div>
          </NavLink>
          <NavLink
            className={({isActive})=>isActive? 'font-weight-bold t-dec a-hover active' : 'font-weight-bold t-dec a-hover'}
            to="/usermanagement"
          >
            <div>
              <i className="fa fa-cog" />
              <span className="ms-2">User Management</span>
            </div>
          </NavLink>
        </div>
      </div>
  )
}