import React from 'react'
import ProjectManagement from '../Pages/ProjectManagement/ProjectManagement'
import { Outlet } from 'react-router-dom'

type Props = {}

const ProjectTemplate = (props: Props) => {
  return (
    <Outlet></Outlet>
  )
}

export default ProjectTemplate