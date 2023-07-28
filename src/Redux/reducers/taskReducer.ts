import { createSlice } from '@reduxjs/toolkit'
import { http, httpAuth } from '../../Util/config';
import { DispatchType } from '../configStore';
import Swal from 'sweetalert2';
import { getProjectDetailApi } from './editProjectReducer';

export interface Status {
    statusId:   string;
    statusName: string;
    alias:      string;
    deleted:    string;
}

export interface Priority {
    priorityId:  number;
    priority:    string;
    description: string;
    deleted:     boolean;
    alias:       string;
}

export interface TaskType {
    id:       number;
    taskType: string;
}

export interface TaskFrm {
    listUserAsign:         number[];
    taskName:              string;
    description:           string;
    statusId:              string;
    originalEstimate:      number;
    timeTrackingSpent:     number;
    timeTrackingRemaining: number;
    projectId:             number;
    typeId:                number;
    priorityId:            number;
}

export interface TaskState {
    visibleModal: boolean;
    statusList:Status[];
    priorityList:Priority[];
    taskTypeList:TaskType[];
    taskFrm:TaskFrm
}

const initialState = {
    visibleModal: false,
    statusList: [],
    priorityList: [],
    taskTypeList: [],
    taskFrm:{
        listUserAsign:         [],
        taskName:              '',
        description:           '',
        statusId:              '1',
        originalEstimate:      0,
        timeTrackingSpent:     0,
        timeTrackingRemaining: 0,
        projectId:             0,
        typeId:                1,
        priorityId:            1,
    },
}

const taskReducer = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    openModalAction: (state,action) => {
        state.visibleModal = true;
    },
    closeModalAction: (state,action) => {
        state.visibleModal = false;
        state.taskFrm = initialState.taskFrm
    },
    getStatusAction: (state,action) => {
        state.statusList = action.payload
    },
    getPriorityAction: (state,action) => {
        state.priorityList = action.payload
    },
    getTaskTypeAction: (state,action) => {
        state.taskTypeList = action.payload
    },
    changeInputAction: (state,action) => {
        state.taskFrm.taskName = action.payload
    },
    changePriorityAction:(state,action) => {
        state.taskFrm.priorityId = action.payload
    },
    changeStatusAction:(state,action) => {
        state.taskFrm.statusId = action.payload
    },
    changeTaskTypeAction:(state,action) => {
        state.taskFrm.typeId = action.payload
    },
    changeProjectIdAction:(state,action) => {
        state.taskFrm.projectId = action.payload
    },
    changeEditorAction:(state,action) => {
        state.taskFrm.description = action.payload
    },
    changeEstimateAction:(state,action) => {
        state.taskFrm.originalEstimate = action.payload
    },
    changeAssignAction:(state,action) => {
        state.taskFrm.listUserAsign = action.payload
    },
    changeTimeTrackingSpentAction:(state,action) => {
        state.taskFrm.timeTrackingSpent = action.payload
    },
    changeTimeTrackingRemainingAction:(state,action) => {
        state.taskFrm.timeTrackingRemaining = action.payload
    },
    createTaskAction:(state,action) => {
        state.taskFrm = action.payload
    },
    resetFormCreateTask:(state,action) => {
        state.taskFrm = initialState.taskFrm
    }
  }
});

export const {openModalAction,closeModalAction,getStatusAction,getPriorityAction,getTaskTypeAction,changeInputAction,changeProjectIdAction,changeEditorAction,changePriorityAction,changeStatusAction,changeTaskTypeAction,changeEstimateAction,changeAssignAction,changeTimeTrackingRemainingAction,changeTimeTrackingSpentAction,createTaskAction,resetFormCreateTask} = taskReducer.actions

export default taskReducer.reducer


export const getStatusApi = () => {
    return async (dispatch:DispatchType) => {
        try{
            const res = await http.get('/api/Status/getAll');
            const action = getStatusAction(res.data.content);
            dispatch(action)
        }
        catch(err){
            return err
        }
    }
}

export const getPriorityApi = () => {
    return async (dispatch:DispatchType) => {
        try{
            const res = await http.get('/api/Priority/getAll');
            const action = getPriorityAction(res.data.content);
            dispatch(action)
        }
        catch(err){
            return err
        }
    }
}

export const getTaskTypeApi = () => {
    return async (dispatch:DispatchType) => {
        try{
            const res = await http.get('/api/TaskType/getAll');
            const action = getTaskTypeAction(res.data.content);
            dispatch(action)
        }
        catch(err){
            return err
        }
    }
}

export const createTaskApi = (values:TaskFrm) => {
    return async (dispatch:DispatchType) => {
        try{
            const res = await httpAuth.post('/api/Project/createTask',values);
            const action = createTaskAction(res.data.content);
            dispatch(action)
            const action1 = getProjectDetailApi(values.projectId);
            dispatch(action1)
            const action2 = resetFormCreateTask(1);
            dispatch(action2)
            Swal.fire({
                icon:'success',
                title:'Success',
                text:res.data.message
            })
        }
        catch(err:any) {
            Swal.fire({
                icon:'error',
                title:'Error',
                text:err.response?.data.content
            })
            return err
        }
    }
}

