import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { http } from '../../Util/config';

export interface ProjectCategory {
    id:                  number;
    projectCategoryName: string;
}
export interface ProjectCategoryList {
    projectCategory : ProjectCategory[];
}

const initialState: ProjectCategoryList = {
    projectCategory: []
}

const projectCategoryReducer = createSlice({
  name: 'projectCategoryReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getProjectCategoryAsync.fulfilled, (state: ProjectCategoryList, action: PayloadAction<ProjectCategory[]>) => {
      state.projectCategory = action.payload;
    })
  },
});

export const {} = projectCategoryReducer.actions

export default projectCategoryReducer.reducer


export const getProjectCategoryAsync = createAsyncThunk('getProjectCategory', async () => {
    const res = await http.get('/api/ProjectCategory');
    return res.data.content;
})

