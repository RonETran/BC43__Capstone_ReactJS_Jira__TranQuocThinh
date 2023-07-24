import React, {ChangeEvent, FormEvent, useEffect} from 'react'
import {Editor} from '@tinymce/tinymce-react';
import { DispatchType, RootState } from '../../Redux/configStore';
import { useDispatch, useSelector } from 'react-redux';
import { changeCategoryAction, changeDescriptionAction, changeProjectAction, closeEditProjectAction, updateProjectApi } from '../../Redux/reducers/editProjectReducer';
import { getProjectCategoryAsync } from '../../Redux/reducers/projectCategoryReducer';
import { setIsFragProject } from '../../Redux/reducers/projectReducer';

type Props = {};

export default function EditProject({}: Props) {

    const dispatch: DispatchType = useDispatch();
    const { projectCategory } = useSelector((state: RootState) => state.projectCategoryReducer);
    const {projectDetail,projectUpdate} = useSelector((state:RootState)=>state.editProjectReducer)

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
        const {name,value} = e.target;
        let values = {...projectDetail,[name]:value};
        const actionEdit = changeProjectAction(values);
        dispatch(actionEdit);
    }

    const handleSelectChange = (e:ChangeEvent<HTMLSelectElement>) => {
        const actionCategory = changeCategoryAction(Number(e.target.value));
        dispatch(actionCategory)
    }

    const handleEditorChange = (content:string) => {
        const actionEditor = changeDescriptionAction(content);
        dispatch(actionEditor)
    };

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const actionUpdate = updateProjectApi(projectDetail.id,projectUpdate);
        dispatch(actionUpdate)
    }

    useEffect(() => {
        getProjectCategory();
    }, []);  

  return (
    <form onSubmit={handleSubmit}>
            <div>
                <div className="mb-3">
                    <label className="form-label">Project id</label>
                    <input className="form-control" name="id" value={projectDetail.id} disabled/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Project name</label>
                    <input className="form-control" name="projectName" value={projectDetail.projectName} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control" name="projectCategory" value={projectDetail.projectCategory.id} onChange={handleSelectChange}>
                        {renderProjectCategory()}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <Editor
                        value={projectDetail.description}
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
                    onClick={() => {
                        const actionClose = closeEditProjectAction(1);
                        dispatch(actionClose)
                    }}>
                    Cancel
                </button>
            </div>
        </form>
  )
}