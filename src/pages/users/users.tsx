import type React from "react";
import { useGetUsers } from "./service/query/useGetUsers";
import { Button, message, Popconfirm, Table, type TableProps } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "./service/mutation/useDeleteUser";

export const Users: React.FC = () => {
  const { data, isLoading, isError } = useGetUsers();
  const { mutate } = useDeleteUser();
  const queryClient = useQueryClient();

  console.log(data?.users);
  console.log(isLoading);
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
        message.success("Mahsulot muvaffaqiyatli o'chirildi");
      },
      onError: (error: any) => {
        console.error("Delete error:", error);
        message.error(
          `Mahsulotni o'chirishda xato: ${error.message || "Noma'lum xato"}`
        );
      },
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "FirstName",
      dataIndex: "firstname",
      key: "firstname",
      render: (text) => <a className="text-blue-600 hover:underline">{text}</a>,
    },
    {
      title: "LastName",
      dataIndex: "lastname",
      key: "lastname",
      render: (text) => <a className="text-blue-600 hover:underline">{text}</a>,
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
        <div>
          <Popconfirm
            title="User o'chirish"
            description="Haqiqatan ham o'chirmoqchimisiz?"
            onConfirm={() => deleteUser(record.key)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button>Delete</Button>
          </Popconfirm>
          <Button
            onClick={() => {
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
        className="bg-white rounded-lg shadow"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
