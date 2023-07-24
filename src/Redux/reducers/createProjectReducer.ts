import { createSlice } from '@reduxjs/toolkit'
import { DispatchType } from '../configStore';
import { httpAuth } from '../../Util/config';
import Swal from 'sweetalert2';
import { setIsFragProject } from './projectReducer';

export interface NewProject {
  projectName: string;
  description: string;
  categoryId: number;
  alias: string
}

export interface NewProjectInit {
  newProject: NewProject
}

const initialState:NewProjectInit = {
  newProject: {
    projectName:'',
    description:'',
    categoryId: 1,
    alias:''
  }
}

const createProjectReducer = createSlice({
  name: 'createProjectReducer',
  initialState,
  reducers: {
    changeNameAction: (state,action) => {
      state.newProject.projectName = action.payload;
    },
    changeCategoryIdAction: (state,action) => {
      state.newProject.categoryId = action.payload;
    },
    changeDescAction: (state,action) => {
      state.newProject.description = action.payload
    }
  }
});

export const {changeNameAction,changeCategoryIdAction,changeDescAction} = createProjectReducer.actions

export default createProjectReducer.reducer

export const createProjectApi = (values:NewProject) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.post('/api/Project/createProjectAuthorize',values);
      const action = setIsFragProject(true);
      dispatch(action)
      const action1 = changeNameAction('')
      dispatch(action1)
      const action2 = changeCategoryIdAction(1)
      dispatch(action2)
      const action3 = changeDescAction('')
      dispatch(action3)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message
      })
    }
    catch(err:any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response.data.content
      })
    }
  }
}