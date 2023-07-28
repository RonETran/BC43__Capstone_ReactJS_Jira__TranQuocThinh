import { Editor } from '@tinymce/tinymce-react';
import { Modal, Select, Slider } from 'antd';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../Redux/configStore';
import { Priority, Status, TaskFrm, TaskType, changeAssignAction, changeEditorAction, changeEstimateAction, changeInputAction, changePriorityAction, changeProjectIdAction, changeStatusAction, changeTaskTypeAction, changeTimeTrackingRemainingAction, changeTimeTrackingSpentAction, closeModalAction, createTaskApi, getPriorityApi, getStatusApi, getTaskTypeApi } from '../../Redux/reducers/taskReducer';
import { ProjectApi, getAllProjectAction } from '../../Redux/reducers/projectReducer';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { getUserApi, getUserByProjectIdApi } from '../../Redux/reducers/userReducer';
import { Member } from '../../Redux/reducers/editProjectReducer';

type Props = {}

export default function CreateTask({}: Props) {

    const projectList:ProjectApi[] = useSelector((state:RootState)=>state.projectReducer.projectList);
    const statusList:Status[] = useSelector((state:RootState)=>state.taskReducer.statusList)
    const priorityList:Priority[] = useSelector((state:RootState)=>state.taskReducer.priorityList)
    const taskTypeList:TaskType[] = useSelector((state:RootState)=>state.taskReducer.taskTypeList)
    const taskFrm:TaskFrm = useSelector((state:RootState)=>state.taskReducer.taskFrm)
    const visible = useSelector((state:RootState) => state.taskReducer.visibleModal);
    const listUser:Member[] = useSelector((state:RootState)=>state.userReducer.listUser)
    const [usersAssign, setUsersAssign] = useState<Member[]>([])
    const [timeTracking, setTimeTracking] = useState({
        timeTrackingSpent: 0,
        timeTrackingRemaining: 0,
    });

    const dispatch:DispatchType = useDispatch();

    const renderStatus = () => {
        return statusList.map((status,index) => {
            return <option key={index} value={status.statusId}>{status.statusName}</option>
        })
    }

    const renderPriority = () => {
        return priorityList.map((priority,index) => {
            return <option key={index} value={priority.priorityId}>{priority.priority}</option>
        })
    }

    const renderTaskType = () => {
        return taskTypeList.map((task,index) => {
            return <option key={index} value={task.id}>{task.taskType}</option>
        })
    }

    const getAllProject = () => {
        const actionApi = getAllProjectAction();
        dispatch(actionApi)
    }
    const getStatus = () => {
        const actionApi = getStatusApi();
        dispatch(actionApi)
    }
    const getPriority = () => {
        const actionApi = getPriorityApi();
        dispatch(actionApi)
    }
    const getTaskType = () => {
        const actionApi = getTaskTypeApi();
        dispatch(actionApi)
    }
    const getAllUser = () => {
        const actionApi = getUserApi();
        dispatch(actionApi)
    }

    useEffect(() => {
        getAllProject();
        getStatus();
        getPriority();
        getTaskType();
        getAllUser();
    }, [])

    const userOptions = listUser.map((user, index) => {
        return { value: user.userId, label: user.name, key: index };
    })

    const [size, setSize] = useState<SizeType>('large');

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        const action = changeInputAction(e.target.value);
        dispatch(action)
    }
    const handlePriorityChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const action = changePriorityAction(Number(e.target.value));
        dispatch(action)
    }
    const handleStatusChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const action = changeStatusAction(Number(e.target.value));
        dispatch(action)
    }
    const handleTaskTypeChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const action = changeTaskTypeAction(Number(e.target.value));
        dispatch(action)
    }
    const handleEstimateChange = (e:ChangeEvent<HTMLInputElement>) => {
        const action = changeEstimateAction(Number(e.target.value));
        dispatch(action)
    }
    const handleEditorChange = (content:string) => {
        const action = changeEditorAction(content);
        dispatch(action)
    }
    const handleAssignChange = (values:any) => {
        const action = changeAssignAction(values);
        dispatch(action)
    }
    const handleTimeTrackingSpentChange = (e:any) => {
        setTimeTracking({...timeTracking, timeTrackingSpent: Number(e.target.value)});
        const action = changeTimeTrackingSpentAction(Number(e.target.value));
        dispatch(action)
    }
    const handleTimeTrackingRemainingChange = (e:any) => {
        setTimeTracking({...timeTracking, timeTrackingRemaining: Number(e.target.value)})
        const action = changeTimeTrackingRemainingAction(Number(e.target.value));
        dispatch(action)
    }
    const handleProjectIdChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const actionChange = changeProjectIdAction(Number(e.target.value));
        dispatch(actionChange)
        const actionApi = getUserByProjectIdApi(Number(e.target.value));
        dispatch(actionApi);
    }
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const actionApi = createTaskApi(taskFrm);
        dispatch(actionApi)
    }

    const renderProjectOptions = () => {
        return projectList.map((project, index) => {
            return <option value={project.id} key={index}>{project.projectName}</option>
        })
    }


  return (
    <>
            <Modal
                title="Create Task"
                centered
                open={visible}
                bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
                onCancel={()=>{
                    const actionClose = closeModalAction(false);
                    dispatch(actionClose)
                }}
                width={1000}
                footer={null}
            >
                <form className="container create-modal" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <p className='mb-1 mt-3'>Task Name</p>
                        <input className="form-control" type="text" name="taskName" value={taskFrm.taskName}  onChange={handleChange} />
                    </div>
                    <div className="form-group position-relative">
                        <p className='mb-1 mt-3'>Project</p>
                        <select name="projectId" className="form-control" onChange={handleProjectIdChange}>
                            {renderProjectOptions()}
                        </select>
                        <i className="fa fa-angle-down icon-1"></i>
                    </div>
                    <div className="form-group position-relative">
                        <p className='mb-1 mt-3'>Status</p>
                        <select name="statusId" value={taskFrm.statusId} className="form-control" onChange={handleStatusChange}>
                            {renderStatus()}
                        </select>
                        <i className="fa fa-angle-down icon-1"></i>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-lg-6 position-relative">
                                <p className='mb-1 mt-3'>Priority</p>
                                <select name="priorityId" className="form-control" value={taskFrm.priorityId} onChange={handlePriorityChange}>
                                    {renderPriority()}
                                </select>
                                <i className="fa fa-angle-down icon-2"></i>
                            </div>
                            <div className="col-lg-6 position-relative">
                                <p className='mb-1 mt-3'>Task type</p>
                                <select className="form-control" name="typeId" value={taskFrm.typeId} onChange={handleTaskTypeChange}>
                                    {renderTaskType()}
                                </select>
                                <i className="fa fa-angle-down icon-2"></i>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-lg-6">
                                <p className='mb-1 mt-3'>Assignees</p>
                                <Select
                                    mode="multiple"
                                    size={size}
                                    options={userOptions}
                                    value={taskFrm.listUserAsign}
                                    placeholder="Please select"
                                    optionFilterProp="label"
                                    onChange={handleAssignChange}
                                    style={{ width: '100%' }}
                                >
                                </Select>
                            </div>
                            <div className="col-lg-6">
                                <p className='mb-1 mt-3'>Time tracking</p>
                                <Slider defaultValue={30} max={Number(timeTracking.timeTrackingSpent) + Number(timeTracking.timeTrackingRemaining)} value={timeTracking.timeTrackingSpent} />
                                <div className="row">
                                    <div className="col-6 text-left font-weight-bold">
                                        {timeTracking.timeTrackingSpent}h logged
                                    </div>
                                    <div className="col-6 text-right font-weight-bold">
                                        {timeTracking.timeTrackingRemaining}h logged
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-12">
                                        <p className='mb-1 mt-3'>Original Estimate</p>
                                        <input className="form-control" type="number" name="originalEstimate" value={taskFrm.originalEstimate} min={0} onChange={handleEstimateChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className='row'>
                                    <div className="col-6">
                                        <p className='mb-1 mt-3'>Time spent (hours)</p>
                                        <input className="form-control" type="number" name="timeTrackingSpent" value={taskFrm.timeTrackingSpent} min={0} onChange={handleTimeTrackingSpentChange} />
                                    </div>
                                    <div className="col-6">
                                        <p className='mb-1 mt-3'>Time remaining (hours)</p>
                                        <input className="form-control" type="number" name="timeTrackingRemaining" value={taskFrm.timeTrackingRemaining} min={0} onChange={handleTimeTrackingRemainingChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <p className='mb-1 mt-3'>Description</p>
                        <Editor
                            value={taskFrm.description}
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>
                    <div className='mt-4'>
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn btn-secondary ms-3"
                            onClick={() => {
                                const actionClose = closeModalAction(false);
                                dispatch(actionClose)
                            }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
  )
}