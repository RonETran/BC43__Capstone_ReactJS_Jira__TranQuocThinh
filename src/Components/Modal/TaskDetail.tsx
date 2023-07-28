import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGIN } from "../../Util/config";
import { Avatar, Button, Input, Modal, Popconfirm, Select } from "antd";
import { DispatchType, RootState } from "../../Redux/configStore";
import { openNotification } from "../../Util/notification/notification";
import { Editor } from "@tinymce/tinymce-react";
import {
  changeCommentAction,
  changeDescriptionAction,
  changeTaskNameAction,
  closeModalTask,
  deleteCommentApi,
  insertCommentApi,
  removeTaskApi,
  updateCommentApi,
  updateDescriptionApi,
  updateEstimateApi,
  updatePriorityApi,
  updateStatusApi,
  updateTimeTracking,
} from "../../Redux/reducers/taskDetailReducer";
import { updateTaskApi } from "../../Redux/reducers/taskDetailReducer";
import { changeAssignAction } from "../../Redux/reducers/taskReducer";
import { Member } from "../../Redux/reducers/editProjectReducer";
import { UserLoginApi } from "../../Redux/reducers/userLoginReducer";

type Props = {};
const { Option } = Select;

export default function TaskDetail({}: Props) {
  const { visibleTask, task } = useSelector(
    (state: RootState) => state.taskDetailReducer
  );
  const [visibleEditTaskName, setVisibleEditTaskName] = useState(false);
  const [visibleEditComment, setVisibleEditComment] = useState(false);
  const [taskName, setTaskName] = useState(task.taskName);
  const [commentContent, setCommentContent] = useState("");
  const listUser: Member[] = useSelector(
    (state: RootState) => state.userReducer.listUser
  );
  const comments = useSelector(
    (state: RootState) => state.taskDetailReducer.comments
  );
  const userLogin:UserLoginApi | undefined = useSelector((state:RootState)=>state.userLoginReducer.userLogin)

  const dispatch: DispatchType = useDispatch();

  const changeTimeSpent = (e: any) => {
    let values = {
      taskId: task.taskId,
      timeTrackingSpent: e.target.value,
      timeTrackingRemaining: task.timeTrackingRemaining,
    };
    const action1 = updateTimeTracking(values);
    dispatch(action1);
  };
  const changeTimeRemaining = (e: any) => {
    let values = {
      taskId: task.taskId,
      timeTrackingSpent: task.timeTrackingSpent,
      timeTrackingRemaining: e.target.value,
    };
    const action1 = updateTimeTracking(values);
    dispatch(action1);
  };

  const renderTimeTracking = () => {
    const timeTrackingSpent = task?.timeTrackingSpent;
    const timeTrackingRemaining = task?.timeTrackingRemaining;
    const max = Number(timeTrackingSpent) + Number(timeTrackingRemaining);
    const percent = Math.round((Number(timeTrackingSpent) / max) * 100);

    return (
      <div style={{ display: "flex" }}>
        <i className="fa fa-clock" />
        <div style={{ width: "100%" }}>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${percent}%` }}
              aria-valuenow={25}
              aria-valuemin={Number(timeTrackingSpent)}
              aria-valuemax={max}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className="logged">{timeTrackingSpent}h logged</p>
            <p className="estimate-time">{timeTrackingRemaining}h remaining</p>
          </div>
          <div className="col-12">
            <p className="mb-1 mt-3">Time spent (hours)</p>
            <input
              className="form-control"
              type="number"
              name="timeTrackingSpent"
              value={timeTrackingSpent}
              min={0}
              onChange={changeTimeSpent}
            />
          </div>
          <div className="col-12">
            <p className="mb-1 mt-3">Time remaining (hours)</p>
            <input
              className="form-control"
              type="number"
              name="timeTrackingRemaining"
              value={timeTrackingRemaining}
              min={0}
              onChange={changeTimeRemaining}
            />
          </div>
        </div>
      </div>
    );
  };
  const userAssignees = task?.assigness;

  const userOptions = listUser.map((user, index) => {
    return { value: user.userId, label: user.name, key: index };
  });
  const userValue = userAssignees?.map((user, index) => {
    if (user.name === "") {
      return { value: user.id, key: index };
    }
    return { value: user.id, label: user.name, key: index };
  });
  const handleAssignessChange = (values: any) => {
    let newValue = { ...task, listUserAsign: values };
    const action = changeAssignAction(values);
    dispatch(action);
    const action1 = updateTaskApi(newValue);
    dispatch(action1);
  };

  const handleCommentChange = (index: any, event: any) => {
    const newComment = event.target.value;
    const action = changeCommentAction({ index, newComment });
    dispatch(action);
  };

  const renderComments = () => {
    return comments?.map((comment, index) => {
      return (
        <div className="comment-item mb-3" key={index}>
          <div className="display-comment" style={{ display: "flex" }}>
            <div className="avatar">
              {comment.user.avatar === "" || comment.user.avatar === null ? (
                <Avatar icon={<i className="fa fa-user-alt"></i>} />
              ) : (
                <Avatar src={comment.user.avatar} />
              )}
            </div>
            <div>
              <p style={{ marginBottom: 5, fontSize: 16, color: "#111315" }}>
                {comment.user.name}
              </p>
              <div style={{ marginBottom: 0, color: "#172B4D" }}>
                {visibleEditComment === true ? (
                  <form
                    className="form-group"
                    style={{ display: "flex" }}
                    onSubmit={() => {
                      const actionApi = updateCommentApi(
                        comment.id,
                        comment.contentComment
                      );
                      dispatch(actionApi);
                      setVisibleEditComment(false);
                    }}
                  >
                    <Input
                      type="text"
                      name="name"
                      required
                      onChange={(e) => handleCommentChange(index, e)}
                      value={comment.contentComment}
                    />
                    <Button type="primary" htmlType="submit" className="ms-2">
                      OK
                    </Button>
                  </form>
                ) : (
                  <div className="form-group">
                    <span
                      style={{
                        fontWeight: 300,
                        color: "#172B4D",
                        fontSize: 16,
                      }}
                    >
                      {comment.contentComment}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <span
                  className="cmt"
                  onClick={() => {
                    setVisibleEditComment(true);
                  }}
                >
                  Edit{" "}
                </span>
                <Popconfirm
                  title="Are you sure to delete this comment?"
                  onConfirm={() => {
                    const action = deleteCommentApi(comment.id, comment.taskId);
                    dispatch(action);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <span className="cmt"> Delete</span>
                </Popconfirm>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Modal
        title="Task Detail"
        centered
        open={visibleTask}
        onCancel={() => {
          const action = closeModalTask(false);
          dispatch(action);
          setVisibleEditTaskName(false);
          setCommentContent("");
        }}
        width={900}
        footer={null}
      >
        <div style={{ fontWeight: 500 }} className="custom-modal">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Select
                value={task?.taskTypeDetail.taskType}
                onChange={(value) => {
                  let values = {
                    ...task,
                    listUserAsign: task.assigness.map(
                      (assignee) => assignee.id
                    ),
                    typeId: Number(value),
                  };
                  const actionApi = updateTaskApi(values);
                  dispatch(actionApi);
                }}
              >
                <Option value="1">bug</Option>
                <Option value="2">new task</Option>
              </Select>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const actionApi = removeTaskApi(task.taskId, task.projectId);
                  dispatch(actionApi);
                  const action = closeModalTask(false);
                  dispatch(action);
                }}
              >
                <i className="fa fa-trash-alt" />
                <span style={{ paddingRight: 20 }}> Delete</span>
              </div>
            </div>
          </div>
          <div className="container-fluid mt-3">
            <div className="row">
              <div className="col-lg-7">
                <div>
                  {visibleEditTaskName === true ? (
                    <form
                      className="form-group"
                      style={{ display: "flex" }}
                      onSubmit={() => {
                        let values = {
                          ...task,
                          listUserAsign: task.assigness.map(
                            (assignee) => assignee.id
                          ),
                          taskName: taskName,
                        };
                        const actionApi = updateTaskApi(values);
                        dispatch(actionApi);
                        setVisibleEditTaskName(false);
                      }}
                    >
                      <Input
                        type="text"
                        name="name"
                        required
                        onChange={(e) => {
                          setTaskName(e.target.value);
                          const action = changeTaskNameAction(e.target.value);
                          dispatch(action);
                        }}
                        value={task.taskName}
                      />
                      <Button type="primary" htmlType="submit" className="ms-2">
                        OK
                      </Button>
                    </form>
                  ) : (
                    <div className="form-group">
                      <span
                        style={{
                          fontWeight: 500,
                          color: "#172B4D",
                          fontSize: 24,
                        }}
                      >
                        {task?.taskName}
                      </span>
                      <i
                        className="fa fa-edit ms-2"
                        style={{
                          cursor: "pointer",
                          fontSize: 18,
                          color: "#23B6A4",
                        }}
                        onClick={() => {
                          setVisibleEditTaskName(true);
                          setTaskName(task.taskName);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p>Description</p>
                  <Editor
                    value={task?.description}
                    init={{
                      height: 200,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                      ],
                      toolbar:
                        "undo redo | formatselect | " +
                        "bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                    onEditorChange={(content, editor) => {
                      const action = changeDescriptionAction(content);
                      dispatch(action);
                    }}
                  />
                </div>
                <div className="mt-3">
                  <Button
                    type="primary"
                    onClick={() => {
                      let valueDesc = {
                        taskId: task.taskId,
                        description: task.description,
                      };
                      const actionApi = updateDescriptionApi(valueDesc);
                      dispatch(actionApi);
                    }}
                  >
                    Save
                  </Button>
                </div>
                <div className="comment mt-5">
                  <h6>Comment</h6>
                  <div
                    className="block-comment mt-4"
                    style={{ display: "flex" }}
                  >
                    <div className="avatar">
                        <Avatar
                          src={userLogin?.avatar}
                          style={{ width: 40, height: 40 }}
                        />
                    </div>
                    <div className="input-comment">
                      <Input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentContent}
                        onChange={(e) => {
                          setCommentContent(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        type="primary"
                        style={{ height: 40 }}
                        className="ms-2"
                        onClick={() => {
                          if (commentContent === "") {
                            openNotification(
                              "error",
                              "Fail!",
                              "Please add a comment...!"
                            );
                            return;
                          }
                          let newCmt = {
                            taskId: task.taskId,
                            contentComment: commentContent,
                          };
                          const action = insertCommentApi(newCmt);
                          dispatch(action);
                          setCommentContent("");
                        }}
                      >
                        Sent
                      </Button>
                    </div>
                  </div>
                  <div className="lastest-comment mt-4">{renderComments()}</div>
                </div>
              </div>
              <div className="col-lg-5 bd-task-detail">
                <div className="status">
                  <h6>STATUS</h6>
                  <Select
                    value={task?.statusId}
                    onChange={(value) => {
                      let valueStatus = {
                        projectId: task.projectId,
                        taskId: task.taskId,
                        statusId: value,
                      };
                      const actionApi = updateStatusApi(valueStatus);
                      dispatch(actionApi);
                    }}
                  >
                    <Option value="1">BACKLOG</Option>
                    <Option value="2">SELECTED FOR DEVELOPMENT</Option>
                    <Option value="3">IN PROGRESS</Option>
                    <Option value="4">DONE</Option>
                  </Select>
                </div>
                <div className="reporter mt-3">
                  <h6>ASSIGNEES</h6>
                  <Select
                    mode="multiple"
                    size={"middle"}
                    options={userOptions}
                    placeholder="Add user"
                    value={userValue}
                    optionFilterProp="label"
                    onChange={handleAssignessChange}
                    style={{ width: "100%" }}
                  ></Select>
                </div>

                <div className="priority" style={{ marginBottom: 20 }}>
                  <h6>PRIORITY</h6>
                  <Select
                    value={task?.priorityTask.priority}
                    onChange={(value) => {
                      let valuePriority = {
                        taskId: task.taskId,
                        priorityId: value,
                      };
                      const actionApi = updatePriorityApi(valuePriority);
                      dispatch(actionApi);
                    }}
                  >
                    <Option value="1">High</Option>
                    <Option value="2">Medium</Option>
                    <Option value="3">Low</Option>
                    <Option value="4">Lowest</Option>
                  </Select>
                </div>
                <div className="estimate">
                  <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                  <Input
                    type="number"
                    name="originalEstimate"
                    value={task?.originalEstimate}
                    onChange={(e) => {
                      let valueEstimate = {
                        taskId: task.taskId,
                        originalEstimate: Number(e.target.value),
                      };
                      const actionApi = updateEstimateApi(valueEstimate);
                      dispatch(actionApi);
                    }}
                  />
                </div>
                <div className="time-tracking mt-3">
                  <h6>TIME TRACKING</h6>
                  {renderTimeTracking()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
