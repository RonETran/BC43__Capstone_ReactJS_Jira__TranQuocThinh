import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/configStore'

type Props = {}

export default function Loading({}: Props) {
  const {isLoading} = useSelector((state:RootState)=>state.userLoginReducer);
  return (
    <div className='bg-load' style={{display:isLoading ? 'flex' : 'none'}}>
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </div>
  )
}