import React from "react";
import { Button, message, Modal, Table, type TableProps } from "antd";
import { useGetProducts } from "./service/query/useGetProduct";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProduct } from "./service/mutation/useDeleteProduct";

interface Product {
  id: string;
  name: string;
  price: number;
  count: number;
  description: string;
  category: string;
  color: string;
}

interface DataType {
  key: string;
  name: string;
  price: number;
  count: number;
  description: string;
  category: string;
  color: string;
}

export const Products: React.FC = () => {
  const { data, isLoading, error } = useGetProducts();
  const queryClient = useQueryClient();
  const { mutate } = useDeleteProduct();
  console.log(data);

  const dataSource: DataType[] =
    data?.map((item: Product) => ({
      key: item.id,
      name: item.name,
      price: item.price,
      count: item.count,
      description: item.description,
      category: item.category,
    })) || [];

  const deleteProduct = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: () =>
        mutate(id, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            message.success("Product deleted successfully");
          },
          onError: () => {
            message.error("Failed to delete product");
          },
        }),
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a className="text-blue-600 hover:underline">{text}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (count) => `${count}`,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => `${description}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Action",
      render: (data: any) => {
        return (
          <div>
            <Button onClick={() => deleteProduct(data.key as string)}>
              Delete
            </Button>
            <Button>Edit</Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-600">Error loading products</div>
    );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Button
        type="primary"
        className="mb-4 bg-blue-600 hover:bg-blue-700"
        onClick={() => console.log("Open create modal")}
      >
        Add Product
      </Button>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        className="bg-white rounded-lg shadow"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Products;
