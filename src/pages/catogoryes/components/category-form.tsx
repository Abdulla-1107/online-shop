import { Select } from "antd";
import { useGetTypes } from "../service/query/useGetTypes";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useCreateCategory } from "../service/mutation/useCreateCategory";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useUpdateCategory } from "../service/mutation/useUpdateCategory";

type FieldType = {
  name: string;
  type: string;
};

interface dataSource {
  name?: string;
  dataIndex?: string;
  type?: string;
  key?: string;
}

interface Props {
  closeModal: () => void;
  defaultValue?: dataSource;
}

export const CategoryForm = ({ closeModal, defaultValue }: Props) => {
  const { data } = useGetTypes();
  const [form] = Form.useForm();

  const { mutate, isPending } = useCreateCategory();
  const { mutate: editCategory, isPending: isPending2 } = useUpdateCategory();

  const clinet = useQueryClient();

  const onFinish: FormProps<FieldType>["onFinish"] = (data) => {
    if (defaultValue) {
      return editCategory(
        { name: data.name, id: defaultValue.key },
        {
          onSuccess: () => {
            clinet.invalidateQueries({ queryKey: ["categoryes"] });
            closeModal();
          },
        }
      );
    }
    mutate(
      { name: data.name, typeId: data.type },
      {
        onSuccess: () => {
          clinet.invalidateQueries({ queryKey: ["categoryes"] });
          closeModal();
          form.resetFields();
        },
        onError: (error) => {
          form.setFields([{ name: "name", errors: [error.message] }]);
        },
      }
    );
  };

  React.useEffect(() => {
    if (defaultValue) {
      form.setFields([
        {
          name: "name",
          value: defaultValue.name,
        },
        {
          name: "type",
          value: defaultValue.type,
        },
      ]);
    }
  }, [defaultValue]);

  const typeList = data?.map((item) => ({
    value: item.id,
    label: <span>{item.name}</span>,
  }));
  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: 600, margin: "0 auto" }}
      onFinish={onFinish}
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Select
          disabled={defaultValue ? true : false}
          placeholder="Type"
          options={typeList}
        />
      </Form.Item>

      <Button
        loading={isPending || isPending2}
        type="primary"
        htmlType="submit"
      >
        Submit
      </Button>
    </Form>
  );
};
