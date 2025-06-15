import React, { useEffect } from "react";
import { Button, Form, Input, message, Row, Col, Spin } from "antd";
import type { FormProps } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser } from "../service/mutation/useUpdateUset";

type FieldType = {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
};

interface Props {
  defaultValue?: { id: string } & FieldType;
  closeModal: () => void;
}

const UserForm: React.FC<Props> = ({ defaultValue, closeModal }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue({
        firstname: defaultValue.firstname,
        lastname: defaultValue.lastname,
        email: defaultValue.email,
      });
    }
  }, [defaultValue, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (!defaultValue?.id) {
      message.error("Foydalanuvchi aniqlanmadi");
      return;
    }

    updateUser(
      { id: defaultValue.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] }); // kerakli query nomi
          message.success("Foydalanuvchi muvaffaqiyatli yangilandi");
          closeModal();
          form.resetFields();
        },
        onError: (error: any) => {
          const errors = error?.response?.data?.message || [
            "Xatolik yuz berdi",
          ];
          const fieldErrors = errors.map((msg: string) => ({
            name: "email",
            errors: [msg],
          }));
          form.setFields(fieldErrors);
          message.error("Xatolik yuz berdi");
        },
      }
    );
  };

  if (!defaultValue) {
    return <Spin tip="Foydalanuvchi ma'lumotlari yuklanmoqda..." />;
  }

  return (
    <div
      style={{
        maxWidth: "100%",
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        onFinish={onFinish}
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Ism"
              name="firstname"
              rules={[{ required: true, message: "Ismni kiriting" }]}
            >
              <Input placeholder="Ism" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Familiya"
              name="lastname"
              rules={[{ required: true, message: "Familiyani kiriting" }]}
            >
              <Input placeholder="Familiya" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Emailni kiriting" },
                { type: "email", message: "Email noto‘g‘ri formatda" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "8px",
            }}
          >
            Yangilash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm;
