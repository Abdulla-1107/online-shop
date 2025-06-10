import { Button, message, Modal, Table, type TableProps } from "antd";
import { useGetCategoryes } from "./service/query/useGetCategoryes";
import { useToggle } from "../../hooks/useToggle";
import { CategoryForm } from "./components/category-form";
import React from "react";
import { useDeleteCategory } from "./service/mutation/useDeleteCategory";
import { useQueryClient } from "@tanstack/react-query";

interface dataSource {
  title?: string;
  dataIndex?: string;
  type?: string;
  key?: string;
}

interface TypeCategory {
  name: string;
  type: string;
}

export const Categoryes = () => {
  const { data } = useGetCategoryes();
  const { isOpen, open, close } = useToggle();
  const { isOpen: isOpen2, open: open2, close: close2 } = useToggle();

  const [initialData, setInitialData] = React.useState<
    dataSource | undefined
  >();

  const dataSource = data?.data.map((item) => ({
    createdAt: item.createdAt.slice(0, 10),
    name: item.name,
    type: item.type.name,
    key: item.id,
  }));

  const editContent = (el: dataSource) => {
    setInitialData(el);
    open2();
  };
  const { mutate, isPending } = useDeleteCategory();
  const client = useQueryClient();

  const deleteItems = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["categoryes"] });
        message.success("success");
      },
    });
  };

  const columns: TableProps<dataSource>["columns"] = [
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      render: (data: dataSource) => {
        return (
          <div>
            <Button onClick={() => deleteItems(data.key as string)}>
              Delete
            </Button>
            <Button onClick={() => editContent(data)}>Edit</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Button onClick={open} type="primary">
        Create
      </Button>
      <Modal footer={false} onCancel={close} open={isOpen}>
        <CategoryForm closeModal={close} />
      </Modal>
      <Modal footer={false} onCancel={close2} open={isOpen2}>
        <CategoryForm defaultValue={initialData} closeModal={close2} />
      </Modal>
      <Table<dataSource> dataSource={dataSource} columns={columns} />;
    </div>
  );
};
