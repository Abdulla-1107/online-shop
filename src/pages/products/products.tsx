import React from "react";
import {
  Button,
  message,
  Popconfirm,
  Table,
  type TableProps,
  Modal,
} from "antd";
import { useGetProducts } from "./service/query/useGetProduct";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProduct } from "./service/mutation/useDeleteProduct";
import { useGetCategoryes } from "../catogoryes/service/query/useGetCategoryes";
import { useToggle } from "../../hooks/useToggle";
import { ProductForm } from "./components/product-form";
import ErrorBoundary from "./service/ErrorBoundary";

interface Product {
  id: string;
  name: string;
  price: number;
  count: number;
  description: string;
  category: string | { id: string; name: string };
  colorId: string;
}

interface Category {
  id: string;
  name: string;
}

interface DataType {
  key: string;
  name: string;
  price: number;
  count: number;
  description: string;
  categoryId: string;
  colorId: string;
}

export const Products: React.FC = () => {
  const { data, isLoading, error } = useGetProducts();
  const {
    data: categoryList,
    isLoading: isLoading2,
    error: error2,
  } = useGetCategoryes();
  const queryClient = useQueryClient();
  const { mutate } = useDeleteProduct();
  const { isOpen, open, close } = useToggle();
  const [editingProduct, setEditingProduct] = React.useState<
    DataType | undefined
  >(undefined);

  const categories = categoryList?.data;

  const dataSource: DataType[] =
    data?.map((item: Product) => ({
      key: item.id,
      name: item.name,
      price: item.price,
      count: item.count,
      description: item.description,
      categoryId:
        typeof item.category === "object" ? item.category.id : item.category,
      colorId: item.colorId,
    })) || [];

  const deleteProduct = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
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
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: string) => {
        if (isLoading2) return "Yuklanmoqda...";
        if (error2 || !categories) return "Kategoriya yuklanmadi";
        const category = categories?.find(
          (cat: Category) => String(cat.id) === String(categoryId)
        );
        return category
          ? category.name
          : `Noma'lum kategoriya (ID: ${categoryId})`;
      },
    },
    {
      title: "Color",
      dataIndex: "colorId",
      key: "colorId",
    },
    {
      title: "Action",
      render: (_text, record: DataType) => (
        <div>
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Haqiqatan ham o'chirmoqchimisiz?"
            onConfirm={() => deleteProduct(record.key)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button>Delete</Button>
          </Popconfirm>
          <Button
            onClick={() => {
              setEditingProduct(record);
              open();
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const openCreateModal = () => {
    setEditingProduct(undefined);
    open();
  };

  if (isLoading) return <div className="text-center p-4">Yuklanmoqda...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-600">
        Mahsulotlarni yuklashda xato
      </div>
    );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Button
        type="primary"
        className="mb-4 bg-blue-600 hover:bg-blue-700"
        onClick={openCreateModal}
      >
        Mahsulot qo'shish
      </Button>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        className="bg-white rounded-lg shadow"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingProduct ? "Mahsulotni yangilash" : "Mahsulot qo'shish"}
        open={isOpen}
        onCancel={close}
        footer={null}
      >
        <ErrorBoundary>
          <ProductForm
            closeModal={close}
            defaultValue={
              editingProduct
                ? {
                    key: editingProduct.key,
                    name: editingProduct.name,
                    price: editingProduct.price,
                    count: editingProduct.count,
                    description: editingProduct.description,
                    categoryId: editingProduct.categoryId,
                    colorId: editingProduct.colorId,
                  }
                : undefined
            }
          />
        </ErrorBoundary>
      </Modal>
    </div>
  );
};

export default Products;
