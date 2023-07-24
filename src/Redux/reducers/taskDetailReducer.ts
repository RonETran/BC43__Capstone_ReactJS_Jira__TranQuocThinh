import { createSlice } from '@reduxjs/toolkit'
import { DispatchType } from '../configStore';
import { http, httpAuth } from '../../Util/config';
import { getProjectDetailApi } from './editProjectReducer';
import Swal from 'sweetalert2';
import { openNotification } from '../../Util/notification/notification';

export interface TaskDetail {
    priorityTask:          PriorityTask;
    taskTypeDetail:        TaskTypeDetail;
    assigness:             Assignees[];
    lstComment:            any[];
    taskId:                number;
    taskName:              string;
    alias:                 string;
    description:           string;
    statusId:              string;
    originalEstimate:      number;
    timeTrackingSpent:     number;
    timeTrackingRemaining: number;
    typeId:                number;
    priorityId:            number;
    projectId:             number;
}

export interface Assignees {
    id:     number;
    avatar: string;
    name:   string;
    alias:  string;
}

export interface PriorityTask {
    priorityId: number;
    priority:   string;
}

export interface TaskTypeDetail {
    id:       number;
    taskType: string;
}

export interface listComments {
  user:           UserComment;
  id:             number;
  userId:         number;
  taskId:         number;
  contentComment: string;
  deleted:        boolean;
  alias:          string;
}

export interface UserComment {
  userId: number;
  name:   string;
  avatar: string;
}

const initialState = {
    visibleTask: false,
    task: {
      priorityTask: {
        priorityId: 0,
        priority: ""
      },
      taskTypeDetail: {
        id: 0,
        taskType: ""
      },
      assigness: [
        {
          id:     0,
          avatar: '',
          name:   '',
          alias:  '',
        }
      ],
      lstComment: [],
      taskId: 0,
      taskName: "",
      alias: "",
      description: "",
      statusId: "",
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      typeId: 0,
      priorityId: 0,
      projectId: 0
    },
    comments: [
      {
        user: {
          userId: 0,
          name: "",
          avatar: ""
        },
        id: 0,
        userId: 0,
        taskId: 0,
        contentComment: "",
        deleted: false,
        alias: ""
      }
    ]
}

const taskDetailReducer = createSlice({
  name: 'taskDetailReducer',
  initialState,
  reducers: {
    openModalTask:(state,action) => {
      state.visibleTask = action.payload;
    },
    closeModalTask:(state,action) => {
      state.visibleTask = action.payload
    },
    getTaskDetailAction:(state,action) => {
      state.task = action.payload;
    },
    updateTaskTypeAction:(state,action) => {
      state.task = action.payload;
    },
    changeTaskNameAction:(state,action) => {
      state.task.taskName = action.payload;
    },
    changeDescriptionAction:(state,action) => {
      state.task.description = action.payload
    },
    changeEstimateAction:(state,action) => {
      state.task.originalEstimate = action.payload
    },
    getCommentAction:(state,action) => {
      state.comments = action.payload
    },
    changeCommentAction:(state,action) => {
      const { index, newComment } = action.payload;
      state.comments[index].contentComment = newComment;
    }
  }
});

export const {openModalTask,closeModalTask,getTaskDetailAction,updateTaskTypeAction,changeTaskNameAction,changeDescriptionAction,changeEstimateAction,getCommentAction,changeCommentAction} = taskDetailReducer.actions

export default taskDetailReducer.reducer

export const getTaskDetailApi = (id:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.get(`/api/Project/getTaskDetail?taskId=${id}`);
      const action = getTaskDetailAction(res.data.content);
      dispatch(action);
    }
    catch(err){
      return err
    }
  }
}

export const updateTaskApi = (values:any) => {
  return async (dispatch:DispatchType) => {
      try{
          const res = await httpAuth.post('/api/Project/updateTask',values);
          const action = getTaskDetailApi(values.taskId)
          dispatch(action)
          const action1 = getProjectDetailApi(values.projectId);
          dispatch(action1)
          openNotification('success',"Success",res.data.message)
      }
      catch(err:any){
        openNotification('error',"Error",err.response.data.content)
      }
  }
}

export const updateDescriptionApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put('/api/Project/updateDescription',values);
      openNotification('success',"Success",res.data.content)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const updateStatusApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put('/api/Project/updateStatus',values);
      const action = getTaskDetailApi(values.taskId)
      dispatch(action)
      const action1 = getProjectDetailApi(values.projectId);
      dispatch(action1)
      openNotification('success',"Success",res.data.content)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const updatePriorityApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put('/api/Project/updatePriority',values);
      const action = getTaskDetailApi(values.taskId)
      dispatch(action)
      openNotification('success',"Success",res.data.content)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const updateEstimateApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put('/api/Project/updateEstimate',values);
      const action = getTaskDetailApi(values.taskId)
      dispatch(action)
      openNotification('success',"Success",res.data.content)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const updateTimeTracking = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put('/api/Project/updateTimeTracking',values);
      const action = getTaskDetailApi(values.taskId)
      dispatch(action)
      openNotification("success",'Success',res.data.content)
    }
    catch(err:any){
      openNotification("error",'Error',err.response.data.content)
    }
  }
}

export const removeTaskApi = (id:number,projectId:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.delete(`/api/Project/removeTask?taskId=${id}`);
      const action = getProjectDetailApi(projectId);
      dispatch(action);
      Swal.fire({
        icon:'success',
        title:'Success',
        text:res.data.message
      })
    }
    catch(err:any){
      Swal.fire({
        icon:'success',
        title:'Success',
        text:err.response.data.message
      })
    }
  }
}

export const getCommentApi = (id:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await http.get(`/api/Comment/getAll?taskId=${id}`);
      const action = getCommentAction(res.data.content);
      dispatch(action)
    }
    catch(err){
      return err
    }
  }
}

export const insertCommentApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.post(`/api/Comment/insertComment`,values);
      const action1 = getCommentApi(values.taskId);
      dispatch(action1);
      openNotification("success",'Success',res.data.message)
    }
    catch(err:any){
      openNotification("error",'Error',err.response.data.content)
    }
  }
}

export const deleteCommentApi = (idCmt:number,idProject:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.delete(`/api/Comment/deleteComment?idComment=${idCmt}`);
      const action = getCommentApi(idProject);
      dispatch(action);
      openNotification("success",'Success',res.data.content)
    }
    catch(err:any){
      openNotification("error",'Error',err.response.data.content)
    }
  }
}

export const updateCommentApi = (id:number,cmt:string) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put(`/api/Comment/updateComment?id=${id}&contentComment=${cmt}`);
      openNotification("success",'Success',res.data.message)
    }
    catch(err:any){
      openNotification("error",'Error',err.response.data.content)
    }
  }
}