import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DispatchType, RootState } from "../../Redux/configStore";
import { useDispatch } from "react-redux";
import { closeModalEditUser, editUserApi } from "../../Redux/reducers/userReducer";

type Props = {};

export default function EditUser({}: Props) {
  const { visibleEditUser, userEdit } = useSelector(
    (state: RootState) => state.userReducer
  );
  const dispatch: DispatchType = useDispatch();
  const onFinish = (values:any) => {
    const action = editUserApi(values);
    dispatch(action)
  };
  useEffect(() => {
    form.setFieldsValue({ ...userEdit });
  }, [userEdit]);

  const [form] = Form.useForm();
  return (
    <>
      <Modal
        title="Edit User"
        centered
        open={visibleEditUser}
        onCancel={() => {
          const actionClose = closeModalEditUser(false);
          dispatch(actionClose);
        }}
        width={600}
        footer={null}
      >
        <Form form={form} labelAlign="left" layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item  name="id" label="ID" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="passWord"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item  className="mt-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
