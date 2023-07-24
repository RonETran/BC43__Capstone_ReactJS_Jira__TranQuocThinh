import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Menu from '../../Components/Menu/Menu'
import NewProject from '../../Components/NewProject/NewProject'

type Props = {}

export default function CreateProject({}: Props) {
  return (
    <div className='jira'>
      <Sidebar/>
      <Menu/>
      <div className='main'>
        <div className='mb-4'>
          <NewProject/>
        </div>
      </div>
    </div>
  )
}