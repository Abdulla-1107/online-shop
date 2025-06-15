import React from "react";
import { useGetUsers } from "./service/query/useGetUsers";
import {
  Button,
  message,
  Popconfirm,
  Table,
  Modal,
  type TableProps,
} from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "./service/mutation/useDeleteUser";
import { useToggle } from "../../hooks/useToggle";
import UserForm from "./components/user-form";

export const Users: React.FC = () => {
  const { data, isLoading, isError } = useGetUsers();
  const { mutate } = useDeleteUser();
  const queryClient = useQueryClient();
  const { isOpen, open, close } = useToggle();
  const [editingUser, setEditingUser] = React.useState<DataType | undefined>(
    undefined
  );
  console.log(isError);
  interface Users {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  }

  interface DataType {
    key: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  }

  const dataSource: DataType[] =
    data?.users.map((item: Users) => ({
      key: item.id,
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      role: item.role,
    })) || [];

  const deleteUser = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        message.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
      },
      onError: (error: any) => {
        console.error("Delete error:", error);
        message.error(`O'chirishda xato: ${error.message || "Noma'lum xato"}`);
      },
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      render: (_text, record: DataType) => (
        <div className="flex gap-2">
          <Popconfirm
            title="User o'chirish"
            description="Haqiqatan ham o'chirmoqchimisiz?"
            onConfirm={() => deleteUser(record.key)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => {
              setEditingUser(record);
              open();
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        className="bg-white rounded-lg shadow"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Foydalanuvchini tahrirlash"
        open={isOpen}
        onCancel={() => {
          close();
          setEditingUser(undefined);
        }}
        footer={false}
        destroyOnClose
      >
        {editingUser && (
          <UserForm
            defaultValue={{
              id: editingUser.key,
              firstname: editingUser.firstname,
              lastname: editingUser.lastname,
              email: editingUser.email,
            }}
            closeModal={() => {
              close();
              setEditingUser(undefined);
            }}
          />
        )}
      </Modal>
    </div>
  );
};
