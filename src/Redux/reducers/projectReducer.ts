import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http, httpAuth } from "../../Util/config";
import { DispatchType } from "../configStore";
import { openNotification } from "../../Util/notification/notification";

export interface ProjectApi {
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
}
export interface Creator {
  id: number;
  name: string;
}

export interface Member {
  userId: number;
  name: string;
  avatar: string;
}

export interface ProjectList{
  isFragProject:boolean;
    projectList: ProjectApi[];
    isLoading: boolean
}

const initialState = {
  isFragProject: true,
    projectList: [],
    isLoading:false
};

const projectReducer = createSlice({
  name: "projectReducer",
  initialState,
  reducers: {
    setIsFragProject:(state,action) => {
      state.isFragProject = action.payload
    },
    getProjectByKeywordAction:(state,action) => {
      state.projectList = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(getAllProjectAction.pending, (state:ProjectList, action)=>{
        state.isLoading = true;
    }).addCase(getAllProjectAction.fulfilled, (state:ProjectList, action:PayloadAction<ProjectApi[]>)=>{
        state.isLoading = false;
        state.projectList = action.payload
    }).addCase(getAllProjectAction.rejected, (state:ProjectList,action)=>{
        alert('Fail');
        state.isLoading = false;
    })
  },
});

export const {setIsFragProject,getProjectByKeywordAction} = projectReducer.actions;

export default projectReducer.reducer;

export const getAllProjectAction = createAsyncThunk('getAllProjectAction', async () => {
    const res = await http.get(`/api/Project/getAllProject`);
    return res.data.content;
})

export const getProjectByKeywordApi = (keyword:string) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await http.get(`/api/Project/getAllProject?keyword=${keyword}`);
      const action = getProjectByKeywordAction(res.data.content);
      dispatch(action)
    }
    catch(err){
      return err
    }
  }
}

export const deleteProjectApi = (id:number) => {
  return async (dispatch:DispatchType) => {
    try{
      const resDel = await httpAuth.delete(`/api/Project/deleteProject?projectId=${id}`);
      const action = setIsFragProject(true);
      dispatch(action)
      openNotification('success',"Success",resDel.data.message)
    }
    catch(err:any) {
      openNotification('error',"Error",err.response.data.content)
    }
  }
}
