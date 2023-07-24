import React from 'react'
import { Drawer,Space,Button } from 'antd'
import EditProject from './EditProject'
import { DispatchType, RootState } from '../../Redux/configStore';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditProjectAction } from '../../Redux/reducers/editProjectReducer';

type Props = {}

export default function EditProjectDrawer({}: Props) {

    const visible = useSelector((state:RootState) => state.editProjectReducer.visibleDrawer);

    const dispatch: DispatchType = useDispatch();

    const onClose = () => {
        const actionClose = closeEditProjectAction(0);
        dispatch(actionClose)
    };


  return (
    <>
       <div>
                <Drawer
                    title='Edit Project'
                    width={720}
                    placement='right'
                    onClose={onClose}
                    open={visible}
                    bodyStyle={{ paddingBottom: 80 }}
                >

                    <EditProject/>

                </Drawer>
            </div>
    </>
  )
}