import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Empty,
  Avatar,
  Popover,
  Popconfirm,
  AutoComplete,
  List,
  Pagination,
} from "antd";
import type {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { DispatchType, RootState } from "../../Redux/configStore";
import {
  ProjectApi,
  deleteProjectApi,
  getAllProjectAction,
  getProjectByKeywordApi,
  setIsFragProject,
} from "../../Redux/reducers/projectReducer";
import Header from "../Header/Header";
import {
  Member,
  getProjectDetailApi,
  setIsFragAction,
  showEditProjectAction,
} from "../../Redux/reducers/editProjectReducer";
import {
  addUserToProjectApi,
  getUserApi,
  getUserByKeywordApi,
  removeUserFromProjectApi,
} from "../../Redux/reducers/userReducer";
import { NavLink } from "react-router-dom";

type Props = {};

export default function ProjectList({}: Props) {
  const projectList = useSelector(
    (state: RootState) => state.projectReducer.projectList
  );
  const { isFragProject } = useSelector(
    (state: RootState) => state.projectReducer
  );
  const userSearched: Member[] = useSelector(
    (state: RootState) => state.userReducer.userSearched
  );
  const [usernameSearch, setUsernameSearch] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");

  const searchRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch: DispatchType = useDispatch();
  const data: ProjectApi[] = projectList;

  const handleSearch = (value: string) => {
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      const actionApi = getUserByKeywordApi(value);
      dispatch(actionApi);
    }, 300);
  };

  const handleSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    const action = getProjectByKeywordApi(e.target.value);
    dispatch(action);
  };

  const getDataProject = async () => {
    const actionApi = getAllProjectAction();
    dispatch(actionApi);
  };

  const getDataUser = async () => {
    const actionApi = getUserApi();
    dispatch(actionApi);
  };

  useEffect(() => {
    if (isFragProject) {
      getDataProject();
      getDataUser();
      const action = setIsFragProject(false);
      dispatch(action);
    }
  }, [isFragProject]);

  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ProjectApi>>({});

  const handleChange: TableProps<ProjectApi>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<ProjectApi>);
  };

  const columns: ColumnsType<ProjectApi> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Project name",
      dataIndex: "projectName",
      key: "projectName",
      filteredValue: filteredInfo.projectName || null,
      render: (text, record, index) => {
        return (
          <NavLink
            to={`/projectdetail/${record.id}`}
            style={{ cursor: "pointer" }}
            className="t-none"
            onClick={()=>{
              const action = setIsFragAction(true);
              dispatch(action)
            }}
          >
            {text}
          </NavLink>
        );
      },
      onFilter: (value: string | number | boolean, record: ProjectApi) =>
        record.projectName.includes(String(value)),
      sorter: (a, b) => a.projectName.length - b.projectName.length,
      sortOrder:
        sortedInfo.columnKey === "projectName" ? sortedInfo.order : null,
      ellipsis: true,
    },

    {
      title: "Category name",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: [
        { text: "Dự án web", value: "Dự án web" },
        { text: "Dự án phần mềm", value: "Dự án phần mềm" },
        { text: "Dự án di động", value: "Dự án di động" },
      ],
      filteredValue: filteredInfo.categoryName || null,
      onFilter: (value: string | number | boolean, record: ProjectApi) =>
        record.categoryName.includes(String(value)),
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      sortOrder:
        sortedInfo.columnKey === "categoryName" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      filteredValue: filteredInfo.creator || null,
      render: (value, record, index) => {
        return <span>{record.creator.name}</span>;
      },
      onFilter: (value: string | number | boolean, record: ProjectApi) =>
        record.creator.name.includes(String(value)),
      sorter: (a, b) => a.creator.name.length - b.creator.name.length,
      sortOrder: sortedInfo.columnKey === "creator" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "id",
      render(value, record, index) {
        return (
          <>
            <Popover
              placement="topLeft"
              title={"Members"}
              content={() => {
                return (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.members?.map((member, index) => {
                        return (
                          <tr key={index} className="ver-mid">
                            <th>{member.userId}</th>
                            <td>
                              <Avatar src={member.avatar} key={index} />
                            </td>
                            <td>{member.name}</td>
                            <td>
                              <Button
                                className="ml-1"
                                type="default"
                                danger
                                size="small"
                                style={{ fontWeight: "bold", fontSize: 15 }}
                                onClick={() => {
                                  const value = {
                                    projectId: record.id,
                                    userId: member.userId,
                                  };
                                  const actionApi =
                                    removeUserFromProjectApi(value);
                                  dispatch(actionApi);
                                }}
                              >
                                X
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              }}
              trigger="hover"
            >
              <button className="bg-none">
                <Avatar.Group
                  maxCount={2}
                  maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  key={index}
                >
                  {record.members.map((member, index) => {
                    return <Avatar src={member.avatar} key={index} />;
                  })}
                </Avatar.Group>
              </button>
            </Popover>

            <Popover
              placement="topLeft"
              title={"Add Member"}
              content={() => {
                return (
                  <div>
                    <AutoComplete
                      value={usernameSearch}
                      onChange={(value) => {
                        setUsernameSearch(value);
                      }}
                      options={userSearched
                        ?.filter((user: Member) => {
                          let index = record.members.findIndex(
                            (member) => member.userId === user.userId
                          );
                          if (index !== -1) {
                            return false;
                          }
                          return true;
                        })
                        .map((user: Member, index: any) => {
                          return {
                            label: user.name,
                            value: user.userId,
                            key: index,
                          };
                        })}
                      onSelect={(value, option) => {
                        setUsernameSearch(option.label);
                        const values = {
                          projectId: record.id,
                          userId: option.value,
                        };
                        const actionApi = addUserToProjectApi(values);
                        dispatch(actionApi);
                      }}
                      style={{ width: "100%" }}
                      onSearch={handleSearch}
                      placeholder="Username"
                    />
                  </div>
                );
              }}
              trigger="click"
            >
              <Button
                type="primary"
                size="small"
                style={{ fontWeight: "bold", fontSize: 15 }}
              >
                +
              </Button>
            </Popover>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render(value, record, index) {
        return (
          <div style={{ display: "flex" }}>
            <div>
              <span
                className="bg-primary text-white"
                style={{
                  padding: 6,
                  borderRadius: "3px",
                  paddingBottom: 8,
                  cursor: "pointer",
                }}
                onClick={() => {
                  const actionShow = showEditProjectAction(1);
                  dispatch(actionShow);
                  const actionApi = getProjectDetailApi(record.id);
                  dispatch(actionApi);
                }}
              >
                <FormOutlined style={{ fontSize: 18 }} />
              </span>
            </div>
            <div>
              <span>
                <Popconfirm
                  title="Are you sure to delete this project?"
                  onConfirm={() => {
                    const actionDelete = deleteProjectApi(record.id);
                    dispatch(actionDelete);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <span
                    className="bg-danger text-white ms-2"
                    style={{
                      padding: 6,
                      borderRadius: "3px",
                      paddingBottom: 8,
                      cursor: "pointer",
                    }}
                  >
                    <DeleteOutlined style={{ fontSize: 18 }} />
                  </span>
                </Popconfirm>
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  const renderMembers = (members: any, item: any) => (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member: any, index: any) => (
            <tr key={index} className="ver-mid">
              <th>{member.userId}</th>
              <td>
                <Avatar src={member.avatar} key={index} />
              </td>
              <td>{member.name}</td>
              <td>
                <Button
                  className="ml-1"
                  type="default"
                  danger
                  size="small"
                  style={{ fontWeight: "bold", fontSize: 15 }}
                  onClick={() => {
                    const value = { projectId: item.id, userId: member.userId };
                    const actionApi = removeUserFromProjectApi(value);
                    dispatch(actionApi);
                  }}
                >
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderItem = (item: any) => (
    <List.Item className="mb-4">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: "1" }}>
          <div>
            <strong className="strong">Project Name:</strong>
            <NavLink
              className="t-none"
              to={`/projectdetail/${item.id}`}
              style={{ cursor: "pointer" }}
            >
              {item.projectName}
            </NavLink>
          </div>
          <div>
            <strong className="strong">Category Name:</strong>
            <span>{item.categoryName}</span>
          </div>
          <div>
            <strong className="strong">Creator:</strong>
            <span>{item.creator.name}</span>
          </div>
          <div>
            <strong className="strong">Members:</strong>
            {renderMembers(item.members, item)}
            <AutoComplete
              value={usernameSearch}
              onChange={(value) => {
                setUsernameSearch(value);
              }}
              options={userSearched
                ?.filter((user) => {
                  let index = item.members.findIndex(
                    (member: any) => member.userId === user.userId
                  );
                  if (index !== -1) {
                    return false;
                  }
                  return true;
                })
                .map((user, index) => {
                  return {
                    label: user.name,
                    value: user.userId,
                    key: index,
                  };
                })}
              onSelect={(value, option) => {
                setUsernameSearch(option.label);
                const values = { projectId: item.id, userId: option.value };
                const actionApi = addUserToProjectApi(values);
                dispatch(actionApi);
              }}
              style={{ width: "100%" }}
              onSearch={handleSearch}
              placeholder="Add member"
            />
          </div>
          <div className="mt-3">
            <strong className="strong">Actions:</strong>
            <span
              className="bg-primary text-white"
              style={{
                padding: 6,
                borderRadius: "3px",
                paddingBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => {
                const actionShow = showEditProjectAction(1);
                dispatch(actionShow);
                const actionApi = getProjectDetailApi(item.id);
                dispatch(actionApi);
              }}
            >
              <FormOutlined style={{ fontSize: 18 }} />
            </span>
            <span>
              <Popconfirm
                title="Are you sure to delete this project?"
                onConfirm={() => {
                  const actionDelete = deleteProjectApi(item.id);
                  dispatch(actionDelete);
                }}
                okText="Yes"
                cancelText="No"
              >
                <span
                  className="bg-danger text-white ms-2"
                  style={{
                    padding: 6,
                    borderRadius: "3px",
                    paddingBottom: 8,
                    cursor: "pointer",
                  }}
                >
                  <DeleteOutlined style={{ fontSize: 18 }} />
                </span>
              </Popconfirm>
            </span>
          </div>
        </div>
      </div>
    </List.Item>
  );

  return (
    <>
      <Header title="Project Management" />
      <h4 className="title">Project Management</h4>
      <input
        type="text"
        className="s-proj"
        placeholder="Search project"
        value={keyword}
        onChange={handleSearchKeyword}
      />
      <Table
        className="resp-table"
        columns={columns}
        dataSource={data}
        onChange={handleChange}
      >
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      </Table>
      <div>
        <List
          className="resp-list"
          dataSource={getCurrentPageData()}
          renderItem={renderItem}
        >
          <Pagination
            className="pag"
            current={currentPage}
            total={data.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
          />
        </List>
      </div>
    </>
  );
}
