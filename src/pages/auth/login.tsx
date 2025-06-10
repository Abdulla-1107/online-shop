import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useLogin } from "./service/useLogin";
import "./login.css";
import { saveState } from "../../config/storage";
import { useNavigate } from "react-router-dom";

type FieldType = {
  email: string;
  password: string;
};

export const Login: React.FC = () => {
  const { isPending, mutate } = useLogin();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values, {
      onSuccess: (res: { token: string }) => {
        saveState("token", res.token);
        navigate("/app", {
          replace: true,
        });
      },
    });
  };
  return (
    <div className="wrapper_login">
      <Form
        name="basic"
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: 400 }}
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Button loading={isPending} type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
