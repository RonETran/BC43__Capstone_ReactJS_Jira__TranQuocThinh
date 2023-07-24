import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Header from '../Header/Header'
import { Editor } from '@tinymce/tinymce-react';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../Redux/configStore';
import { getProjectCategoryAsync } from '../../Redux/reducers/projectCategoryReducer';
import { changeCategoryIdAction, changeDescAction, changeNameAction, createProjectApi } from '../../Redux/reducers/createProjectReducer';
import { history } from '../../index';

type Props = {}

export default function NewProject({}: Props) {
  const dispatch: DispatchType = useDispatch();
  const { projectCategory } = useSelector((state: RootState) => state.projectCategoryReducer);
  const newProject = useSelector((state:RootState) => state.createProjectReducer.newProject);

  const getProjectCategory = () => {
    const actionApi = getProjectCategoryAsync();
    dispatch(actionApi);
  } 

  const renderProjectCategory= () => {
    return projectCategory.map((projectCategory, index) => {
        return <option key={index} value={projectCategory.id}>{projectCategory.projectCategoryName}</option>
    });
  };

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const actionApi = changeNameAction(e.target.value);
    dispatch(actionApi)
  }

  const handleSelectChange = (e:ChangeEvent<HTMLSelectElement>) => {
    const actionApi = changeCategoryIdAction(e.target.value);
    dispatch(actionApi)
  }

  const handleEditorChange = (content:string) => {
    const actionApi = changeDescAction(content);
    dispatch(actionApi)
  }

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const actionApi = createProjectApi(newProject);
    dispatch(actionApi)
  }

  useEffect(() => {
    getProjectCategory();
  }, []);  

  return (
    <div>
      <Header title='Create Project'/>
      <h4 className='title'>Create Project</h4>
      <form onSubmit={handleSubmit}>
            <div>
                <div className="mb-3">
                    <label className="form-label">Project name</label>
                    <input className="form-control" value={newProject.projectName} name="projectName" onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control" name="projectCategory" value={newProject.categoryId} onChange={handleSelectChange}>
                      {renderProjectCategory()}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <Editor
                        value={newProject.description}
                        init={{
                            height: 300,
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
                <button className="btn btn-primary" type="submit">
                    Save
                </button>
                <button type="button" className="btn btn-secondary ms-3"
                    onClick={()=>{
                        history.push('/project')
                    }}>
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}