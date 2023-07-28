import { createSlice } from '@reduxjs/toolkit'
import { http, httpAuth } from '../../Util/config';
import { DispatchType } from '../configStore';
import { Member } from './editProjectReducer';
import { openNotification } from '../../Util/notification/notification';
import { setIsFragProject } from './projectReducer';

export interface UserProject {
  projectId: number;
  userId: number
}
export interface UserEdit {
  id: string,
  passWord: string,
  email: string,
  name: string,
  phoneNumber: string
}

export interface UserList {
  isFragUser: boolean;
  visibleEditUser: boolean;
  userSearched: Member[];
  listUser: Member[];
  userEdit: UserEdit;
}

const initialState: UserList = {
  isFragUser: true,
  visibleEditUser: false,
  userSearched: [],
  listUser: [],
  userEdit: {
    id: '',
    name: '',
    passWord: '',
    email: '',
    phoneNumber: ''
  }
}

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setIsFragUser: (state,action) => {
      state.isFragUser = action.payload
    },
    getUserAction:(state,action) => {
      state.userSearched = action.payload
    },
    getUserByKeywordAction:(state,action) => {
      state.userSearched = action.payload
    },
    getUserByProjectIdAction:(state,action) => {
      state.listUser = action.payload
    },
    openModalEditUser: (state,action) => {
      state.visibleEditUser = action.payload
    },
    closeModalEditUser: (state,action) => {
      state.visibleEditUser = action.payload
    },
    getUserEditAction: (state,action) => {
      state.userEdit.id = action.payload.userId;
      state.userEdit.name = action.payload.name;
      state.userEdit.email = action.payload.email;
      state.userEdit.phoneNumber = action.payload.phoneNumber
    }
  }
});

export const {getUserAction,getUserByKeywordAction,getUserByProjectIdAction,openModalEditUser,closeModalEditUser,getUserEditAction,setIsFragUser} = userReducer.actions

export default userReducer.reducer


export const getUserApi = () => {
    return async (dispatch:DispatchType) => {
      try{
        const res = await httpAuth.get(`/api/Users/getUser`);
        const action = getUserAction(res.data.content);
        dispatch(action)
      }
      catch(err){
        return err
      }
    }
}

export const getUserByKeywordApi = (keyword:string) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.get(`/api/Users/getUser?keyword=${keyword}`);
      const action = getUserByKeywordAction(res.data.content);
      dispatch(action);
    }
    catch(err){
      return err
    }
  }
}

export const addUserToProjectApi = (value:UserProject) => {
  return async (dispatch:DispatchType) => {
    try {
      const res = await httpAuth.post('/api/Project/assignUserProject',value);
      const action = setIsFragProject(true);
      dispatch(action)
      openNotification('success','Success',res.data.content)
    }
    catch(err:any) {
      openNotification('error','Error',err.response.data.content)
    }
  }
}

export const removeUserFromProjectApi = (value:UserProject) => {
  return async (dispatch:DispatchType) => {
    try {
      const res = await httpAuth.post('/api/Project/removeUserFromProject',value);
      const action = setIsFragProject(true);
      dispatch(action)
      openNotification('success',"Succes",res.data.content)
    }
    catch(err:any) {
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const getUserByProjectIdApi = (id:number) => {
  return async (dispatch:DispatchType) => {
      try {
          const res = await httpAuth.get(`/api/Users/getUserByProjectId?idProject=${id}`);
          const action = getUserByProjectIdAction(res.data.content);
          dispatch(action);
      }
      catch(err) {
          return err;
      }
  }
  
} 

export const deleteUserApi = (id:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.delete(`/api/Users/deleteUser?id=${id}`);
      const action = setIsFragUser(true);
      dispatch(action)
      openNotification('success',"Success",res.data.content)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}

export const editUserApi = (values:any) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await http.put('/api/Users/editUser',values);
      const action = setIsFragUser(true);
      dispatch(action)
      openNotification('success',"Success",res.data.message)
    }
    catch(err:any){
      openNotification('error',"Error",err.response.data.content)
    }
  }
}