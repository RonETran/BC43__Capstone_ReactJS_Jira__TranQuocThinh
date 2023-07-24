import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import { Empty, Popconfirm, Table, TableProps } from 'antd'
import { Member } from '../../Redux/reducers/editProjectReducer';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../Redux/configStore';
import { deleteUserApi, getUserApi, getUserByKeywordApi, getUserEditAction, openModalEditUser, setIsFragUser } from '../../Redux/reducers/userReducer';
import { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';

type Props = {}

export default function UserList({}: Props) {

    const userSearched:Member[] = useSelector((state:RootState)=>state.userReducer.userSearched);
    const {isFragUser} = useSelector((state:RootState) => state.userReducer)
    const dispatch: DispatchType = useDispatch();
  const data = userSearched;
  const [keyword, setKeyword] = useState<string>('');
  const handleSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    const action = getUserByKeywordApi(e.target.value);
    dispatch(action)
  };


    const getDataUser = async () => {
        const actionApi = getUserApi();
        dispatch(actionApi);
      };

      useEffect(()=>{
        if(isFragUser){
            getDataUser();
            const action = setIsFragUser(false);
            dispatch(action)
        }
      },[isFragUser])

    const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Member>>({});

  const handleChange: TableProps<Member>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Member>);
    if (pagination?.current !== undefined) {
        setIndexOffset((pagination.current - 1) * (pagination.pageSize || 10));
    }
  };
  const [indexOffset, setIndexOffset] = useState(0);

    const columns: ColumnsType<Member> = [
        {
            title:"No.",
            render(value, record, index) {
                return <p>{index + 1 + indexOffset}</p>
            },
            width: 90
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            filteredValue: filteredInfo.name || null,
            render: (text, record, index) => {
                return <p className='t-none'>{text}</p>
            },
            onFilter: (value: string | number | boolean, record: Member) =>
            record.name.includes(String(value)),
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder:
            sortedInfo.columnKey === "name" ? sortedInfo.order : null,
            ellipsis: true,
        },
        {
          title: "User Id",
          dataIndex: "userId",
          key: "userId",
          sorter: (a, b) => a.userId - b.userId,
          sortOrder: sortedInfo.columnKey === "userId" ? sortedInfo.order : null,
          ellipsis: true,
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email"
        },
        {
          title: "Phone Number",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
        },
        {
          title: "Actions",
          dataIndex: "",
          key: "",
          width: 150,
          render(value, record, index) {
            return (
              <div style={{ display: "flex" }} key={index}>
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
                        const actionOpen = openModalEditUser(true);
                        dispatch(actionOpen);
                        const action = getUserEditAction(record);
                        dispatch(action)
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
                        const action = deleteUserApi(record.userId);
                        dispatch(action)
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

  return (
    <>
      <Header title="User Management"/>
      <h4 className="title">User Management</h4>
      <input type="text" className="s-proj" placeholder="Search user" value={keyword} onChange={handleSearchKeyword}/>
      <Table columns={columns} dataSource={data} onChange={handleChange}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      </Table>
    </>
  )
}