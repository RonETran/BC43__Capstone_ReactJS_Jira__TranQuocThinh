import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const LoginTemplate = (props: Props) => {
  return (
    <Outlet></Outlet>
  )
}

export default LoginTemplate