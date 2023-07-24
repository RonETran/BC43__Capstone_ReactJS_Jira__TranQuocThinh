import {configureStore} from '@reduxjs/toolkit'
import userReducer from './reducers/userReducer';
import projectReducer from './reducers/projectReducer';
import editProjectReducer from './reducers/editProjectReducer';
import projectCategoryReducer from './reducers/projectCategoryReducer';
import userLoginReducer from './reducers/userLoginReducer';
import createProjectReducer from './reducers/createProjectReducer';
import taskReducer from './reducers/taskReducer';
import taskDetailReducer from './reducers/taskDetailReducer';

export const store = configureStore({
    reducer: {
        userReducer:userReducer,
        userLoginReducer:userLoginReducer,
        projectReducer:projectReducer,
        editProjectReducer:editProjectReducer,
        projectCategoryReducer:projectCategoryReducer,
        createProjectReducer:createProjectReducer,
        taskReducer:taskReducer,
        taskDetailReducer:taskDetailReducer,
    }
});


export type RootState = ReturnType<typeof store.getState>

export type DispatchType = typeof store.dispatch;
