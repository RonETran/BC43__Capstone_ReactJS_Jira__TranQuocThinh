import React, { useEffect } from "react";
import Header from "../Header/Header";
import { Avatar } from "antd";
import {DragDropContext,Droppable,Draggable} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../Redux/configStore";
import { useParams } from "react-router-dom";
import { getProjectDetailApi, setIsFragAction} from "../../Redux/reducers/editProjectReducer";
import { TaskUpdate, updateStatusApi } from "../../Redux/reducers/editProjectReducer";
import { getCommentApi, getTaskDetailApi, openModalTask } from "../../Redux/reducers/taskDetailReducer";
import { getUserByProjectIdApi } from "../../Redux/reducers/userReducer";

type Props = {};

export default function Board({}: Props) {
  const { projectDetail } = useSelector(
    (state: RootState) => state.editProjectReducer
  );
  const {isFrag} = useSelector((state:RootState) => state.editProjectReducer)
  const dispatch: DispatchType = useDispatch();
  const params = useParams();

  const getProjectDetail = (id:number) => {
    const actionApi = getProjectDetailApi(id);
    dispatch(actionApi);
  };

  useEffect(() => {
    if(isFrag){

      getProjectDetail(Number(params.id));
      const action = setIsFragAction(false);
      dispatch(action)
    }
  }, [isFrag,params.id]);


  const handleDragEnd = (result: { destination: any; source?: any; draggableId?: any; }) => {
      let {source, destination, draggableId} = result;

      if (!result.destination) {
        return ;
      }
      if(source.index === destination.index && source.droppableId === destination.droppableId) {
        return ;
      }
      
      let taskUpdate:TaskUpdate = {
        taskId: Number(draggableId),
        statusId: destination.droppableId,
      }
      
      const actionApi = updateStatusApi(taskUpdate);
      dispatch(actionApi)

      const action = setIsFragAction(true);
      dispatch(action)
  }

  const renderCardTaskList = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="container">
        <div className="row">
        {projectDetail.lstTask?.map((taskListDetail, index) => {
          return (
            <div
              key={index}
              className="col-lg-3 col-md-6 col-sm-12"
              style={{ marginBottom: "20px" }}
            >
            <Droppable droppableId={taskListDetail.statusId} key={index}>
              {(provided) => {
                return (
                    <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    key={index}
                    className="card"
                  >
                    <div className="card-header">
                      {taskListDetail.statusName}
                      <span className="ms-2">{taskListDetail.lstTaskDeTail.length}</span>
                    </div>
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      key={index}
                      className="list-group list-group-flush"
                    >
                      {taskListDetail.lstTaskDeTail.map((task, index) => {
                        return (
                          <Draggable
                            key={task.taskId.toString()}
                            index={index}
                            draggableId={task.taskId.toString()}
                          >
                            {(provided) => {
                              return (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="list-group-item"
                                  onClick={() => {
                                    const action = openModalTask(true);
                                    dispatch(action)
                                    const actionApi = getTaskDetailApi(task.taskId);
                                    dispatch(actionApi);
                                    const action1 = getUserByProjectIdApi(task.projectId);
                                    dispatch(action1);
                                    const action2 = getCommentApi(task.taskId);
                                    dispatch(action2)
                                  }}
                                >
                                  <p>{task.taskName}</p>
                                  <div
                                    className="block"
                                    style={{ display: "flex" }}
                                  >
                                    <div className="block-right">
                                      <div
                                        className="avatar-group"
                                        style={{ display: "flex" }}
                                      >
                                        <div className="avatar-block">
                                          <Avatar.Group
                                            maxCount={2}
                                            maxStyle={{
                                              color: "#f56a00",
                                              backgroundColor: "#fde3cf",
                                            }}
                                            key={index}
                                          >
                                            {task.assigness.map(
                                              (member:any, index:any) => {
                                                return (<Avatar
                                                  src={member.avatar}
                                                  key={index}
                                                />)
                                              }
                                            )}
                                          </Avatar.Group>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: 24,
                                          height: 24,
                                          lineHeight: "34px",
                                        }}
                                      >
                                        <div style={{ cursor: "pointer" }}>
                                          <i
                                            className="fa fa-bookmark"
                                            style={{ fontSize: 18 }}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          width: 24,
                                          height: 24,
                                          lineHeight: "34px",
                                        }}
                                      >
                                        <div style={{ cursor: "pointer" }}>
                                          <i
                                            className="fa fa-check-square"
                                            style={{ fontSize: 18 }}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          width: 24,
                                          height: 24,
                                          lineHeight: "34px",
                                        }}
                                      >
                                        <div style={{ cursor: "pointer" }}>
                                          <i
                                            className="fa fa-arrow-up"
                                            style={{ fontSize: 18 }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    </ul>

                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
            </div>
          );
        })}
        </div>
        </div>
      </DragDropContext>
    );
  };
  return (
    <div>
      <Header title="Project Detail" />
      <h4 className="title">Board - {projectDetail.projectName}</h4>
      <div className="info" style={{ display: "flex" }}>
        <div className="avatar-group" style={{ display: "flex" }}>
          <p className="cus-p">Members:</p>
          <Avatar.Group
            maxCount={4}
            size="large"
            maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
          >
            {projectDetail.members?.map((member, index) => {
              return <Avatar src={member.avatar} key={index} />;
            })}
          </Avatar.Group>
        </div>
      </div>
      <div className="content" style={{ display: "flex" }}>
        {renderCardTaskList()}
      </div>
    </div>
  );
}
