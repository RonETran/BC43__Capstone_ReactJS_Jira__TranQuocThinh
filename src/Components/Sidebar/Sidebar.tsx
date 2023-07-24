import React from 'react'
import { openModalAction } from '../../Redux/reducers/taskReducer'
import { DispatchType } from '../../Redux/configStore'
import { useDispatch } from 'react-redux'

type Props = {}

export default function Sidebar({}: Props) {
  const dispatch:DispatchType = useDispatch();
  return (
    <div className="sideBar">
        <div className="sideBar-item">
          <div className="mt-4 pb-3">
            <i
              className="fab fa-jira text-white"
              style={{ fontSize: 18, cursor: "pointer" }}
            />
            <span className='ms-2'>Jira</span>
          </div>
          <div className="py-3" style={{cursor: "pointer"}} onClick={()=>{
            const actionOpen = openModalAction(true);
            dispatch(actionOpen);
          }}>
            <i
              className="fa fa-plus text-white"
              style={{ fontSize: 18}}
            />
            <span className='ms-2'>Create Task</span>
          </div>
        </div>
      </div>
  )
}