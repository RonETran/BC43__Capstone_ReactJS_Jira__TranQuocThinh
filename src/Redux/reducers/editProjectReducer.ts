import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { httpAuth } from "../../Util/config";
import { DispatchType } from "../configStore";
import { openNotification } from "../../Util/notification/notification";
import { setIsFragProject } from "./projectReducer";

export interface ProjectUpdate {
  id:          number;
  projectName: string;
  creator:     number;
  description: string;
  categoryId:  number;
}

export interface ProjectDetail {
  lstTask: LstTask[];
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  projectCategory: Creator;
  alias: string;
}

export interface Creator {
  id: number;
  name: string;
}

export interface LstTask {
  lstTaskDeTail: any[];
  statusId: string;
  statusName: string;
  alias: string;
}

export interface Member {
  userId: number;
  name: string;
  avatar: string;
  email: string | null;
  phoneNumber: string | null;
}

export interface TaskUpdate {
  taskId: number;
  statusId: string
}

export interface ProjectDetailInit {
  isFrag: boolean;
  visibleDrawer: boolean;
  projectDetail: ProjectDetail;
  projectUpdate: ProjectUpdate;
}


const initialState: ProjectDetailInit = {
  isFrag: true,
  visibleDrawer: false,
  projectDetail: {
    lstTask: [],
    members: [],
    creator: {
      id: 0,
      name: "",
    },
    id: 0,
    projectName: "",
    description: "",
    projectCategory: {
      id: 0,
      name: "",
    },
    alias: "",
  },
  projectUpdate: {
    id: 0,
    projectName: "",
    creator: 0,
    description: "",
    categoryId: 1,
  }
};

const editProjectReducer = createSlice({
  name: "editProjectReducer",
  initialState,
  reducers: {
    setIsFragAction:(state,action) => {
      state.isFrag = action.payload
    },
    showEditProjectAction: (state,action) => {
      state.visibleDrawer = true;
    },
    closeEditProjectAction: (state,action) =>{
      state.visibleDrawer = false;
    },
    getProjectDetailAction: (state,action) => {
      state.projectDetail = action.payload;
      state.projectUpdate.id = state.projectDetail.id;
      state.projectUpdate.projectName = state.projectDetail.projectName;
      state.projectUpdate.creator = state.projectDetail.creator.id;
      state.projectUpdate.categoryId = state.projectDetail.projectCategory.id;
      state.projectUpdate.description = state.projectDetail.description;
    },
    changeProjectAction: (state,action) => {
      state.projectDetail = action.payload;
      state.projectUpdate.id = state.projectDetail.id;
      state.projectUpdate.projectName = state.projectDetail.projectName;
      state.projectUpdate.creator = state.projectDetail.creator.id;
    },
    changeCategoryAction: (state,action) => {
      state.projectDetail.projectCategory.id = action.payload;
      state.projectUpdate.categoryId = action.payload;
    },
    changeDescriptionAction: (state,action) => {
      state.projectDetail.description = action.payload;
      state.projectUpdate.description = state.projectDetail.description;
    },
  }
});

export const {showEditProjectAction,closeEditProjectAction,getProjectDetailAction,changeProjectAction,changeDescriptionAction,changeCategoryAction,setIsFragAction} = editProjectReducer.actions;

export default editProjectReducer.reducer;

export const getProjectDetailApi = (id:number) => {
    return async (dispatch:DispatchType) => {
      try{
        const res = await httpAuth.get(`/api/Project/getProjectDetail?id=${id}`);
        const action = getProjectDetailAction(res.data.content);
        dispatch(action);
      }
      catch(err:any){
        openNotification('error','Error',err.response.data.content)
      }
    }
}

export const updateProjectApi = (id:number, values:ProjectUpdate) => {
  return async (dispatch:DispatchType) => {
    try{
      const res = await httpAuth.put(`/api/Project/updateProject?projectId=${id}`,values);
      openNotification('success','Success',res.data.message)
      const action = setIsFragProject(true);
      dispatch(action)
    }
    catch(err:any){
      openNotification('error','Error',err.response.data.content)
    }
  }
}

export const updateStatusApi = (value:TaskUpdate) => {
  return async () => {
      try{
        const res = await httpAuth.put('/api/Project/updateStatus',value);
        openNotification('success','Success',res.data.message)
      }
      catch(err:any) {
        openNotification('error','Error',err.response.data.content)
      }
  }
}