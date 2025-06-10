import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Spin, message, Row, Col } from "antd";
import type { FormProps } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateProduct } from "../service/mutation/useCreateProduct";
import { useGetCategoryes } from "../../catogoryes/service/query/useGetCategoryes";
import { useUpdateProduct } from "../service/mutation/useUpdateProduct";
import { useGetColors } from "../service/query/useGetColor";
import ImageUpload from "./ImageUpload";

type FieldType = {
  name: string;
  price: number;
  count: number;
  description: string;
  categoryId: string;
  colorIds: string[];
  img: string;
  colorId: string;
};

interface DataSource {
  key?: string;
  name?: string;
  price?: number;
  count?: number;
  description?: string;
  categoryId?: string;
  colorIds?: string[];
  img?: string;
  colorId?: string;
}

interface Props {
  closeModal: () => void;
  defaultValue?: DataSource;
}

export const ProductForm: React.FC<Props> = ({ closeModal, defaultValue }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [img, setImg] = useState(defaultValue?.img || "");

  const {
    data: categoryData,
    isLoading: isLoadingCategories,
    error: categoryError,
  } = useGetCategoryes();
  const {
    data: colorData,
    isLoading: isLoadingColors,
    error: colorError,
  } = useGetColors();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const categoryOptions =
    categoryData?.data?.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const colorOptions =
    colorData?.map((item: { id: string; name: string }) => ({
      value: item.id,
      label: item.name,
    })) || [];

  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue({
        name: defaultValue.name || "",
        price: defaultValue.price || undefined,
        count: defaultValue.count || undefined,
        description: defaultValue.description || "",
        categoryId: defaultValue.categoryId || undefined,
        colorIds:
          defaultValue.colorIds ||
          (defaultValue.colorId ? [defaultValue.colorId] : []),
        img: defaultValue.img || "https://image",
        colorId: defaultValue.colorId || "",
      });
      setImg(defaultValue.img || "");
    } else {
      form.resetFields();
      setImg("");
    }
  }, [defaultValue, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const productData: FieldType = {
      ...values,
      price: Number(values.price),
      count: Number(values.count),
      colorIds: values.colorIds || [],
      colorId: values.colorIds?.[0] || defaultValue?.colorId || "",
      img: img || values.img,
    };

    console.log("productData:", productData);

    if (defaultValue?.key) {
      updateProduct(
        { id: defaultValue.key, ...productData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            message.success("Mahsulot muvaffaqiyatli yangilandi");
            closeModal();
            form.resetFields();
            setImg("");
          },
          onError: (error: any) => {
            const errors = error.response?.data?.message || ["Noma'lum xato"];
            const fieldErrors = errors.map((msg: string) => {
              if (msg.includes("colorIds"))
                return { name: "colorIds", errors: [msg] };
              if (msg.includes("img")) return { name: "img", errors: [msg] };
              if (msg.includes("colorId"))
                return { name: "colorId", errors: [msg] };
              return { name: "name", errors: [msg] };
            });
            form.setFields(fieldErrors);
            message.error("Xato yuzaga keldi");
          },
        }
      );
    } else {
      createProduct(productData, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          message.success("Mahsulot muvaffaqiyatli qo'shildi");
          closeModal();
          form.resetFields();
          setImg("");
        },
        onError: (error: any) => {
          const errors = error?.response?.data?.message || ["Noma'lum xato"];
          const fieldErrors = errors.map((msg: string) => {
            if (msg.includes("colorIds"))
              return { name: "colorIds", errors: [msg] };
            if (msg.includes("img")) return { name: "img", errors: [msg] };
            if (msg.includes("colorId"))
              return { name: "colorId", errors: [msg] };
            return { name: "name", errors: [msg] };
          });
          form.setFields(fieldErrors);
          message.error("Xato yuzaga keldi");
        },
      });
    }
  };

  if (isLoadingCategories || isLoadingColors) {
    return <Spin tip="Yuklanmoqda..." />;
  }

  if (categoryError || colorError) {
    return <div>Kategoriyalar yoki ranglarni yuklashda xato</div>;
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
        name="productForm"
        layout="vertical"
        style={{
          maxWidth: "700px",
          width: "100%",
          margin: "0 auto",
        }}
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Mahsulot nomi"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Iltimos, mahsulot nomini kiriting!",
                },
              ]}
            >
              <Input
                placeholder="Mahsulot nomini kiriting"
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Narxi"
              name="price"
              rules={[
                { required: true, message: "Iltimos, narxni kiriting!" },
                {
                  type: "number",
                  min: 0,
                  message: "Narx musbat son bo'lishi kerak!",
                },
              ]}
              normalize={(value) => Number(value)}
            >
              <Input
                type="number"
                step="0.01"
                placeholder="Narxni kiriting"
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Soni"
              name="count"
              rules={[
                { required: true, message: "Iltimos, sonini kiriting!" },
                {
                  type: "number",
                  min: 0,
                  message: "Soni musbat son bo'lishi kerak!",
                },
              ]}
              normalize={(value) => Number(value)}
            >
              <input
                type="number"
                placeholder="Soni kiriting"
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "16px",
                  width: "100%",
                  border: "1px solid #d9d9d9",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Tavsif"
              name="description"
              rules={[
                { required: true, message: "Iltimos, tavsifni kiriting!" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Mahsulot tavsifini kiriting"
                style={{
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Kategoriya"
              name="categoryId"
              rules={[
                { required: true, message: "Iltimos, kategoriyani tanlang!" },
              ]}
            >
              <Select
                placeholder="Kategoriyani tanlang"
                options={categoryOptions}
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<FieldType>
              label="Ranglar"
              name="colorIds"
              rules={[
                {
                  required: true,
                  message: "Iltimos, kamida bitta rang tanlang!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Ranglarni tanlang"
                options={colorOptions}
                allowClear
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item<FieldType>
              label="Rasm URL"
              name="img"
              rules={[
                {
                  required: true,
                  message: "Iltimos, rasm yuklang!",
                },
                {
                  validator: (_, value) =>
                    value && value !== "image"
                      ? Promise.resolve()
                      : Promise.reject(new Error("Iltimos, rasm yuklang!")),
                },
              ]}
            >
              <ImageUpload
                onImageUpload={(url) => {
                  setImg(url);
                  form.setFieldsValue({ img: url });
                  form.validateFields(["img"]);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating || isUpdating}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#1890ff",
                  border: "none",
                  marginTop: "16px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#40a9ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1890ff")
                }
              >
                {defaultValue ? "Yangilash" : "Qo'shish"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
