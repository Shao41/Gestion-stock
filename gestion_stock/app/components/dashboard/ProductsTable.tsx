"use client";

import { useState } from "react";
import { Table, Tag, Button, Input, Select, Space, Modal, Form, InputNumber, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Product {
  key: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: "ok" | "low" | "critical";
}

const initialProducts: Product[] = [
  {
    key: "1",
    sku: "SKU-001",
    name: "MacBook Pro 14 M3",
    category: "Electronique",
    stock: 45,
    minStock: 20,
    price: 2499,
    status: "ok",
  },
  {
    key: "2",
    sku: "SKU-002",
    name: "iPhone 15 Pro Max",
    category: "Electronique",
    stock: 78,
    minStock: 30,
    price: 1299,
    status: "ok",
  },
  {
    key: "3",
    sku: "SKU-003",
    name: "Cable HDMI 2m",
    category: "Accessoires",
    stock: 5,
    minStock: 20,
    price: 15,
    status: "critical",
  },
  {
    key: "4",
    sku: "SKU-004",
    name: "Souris Logitech MX Master",
    category: "Peripheriques",
    stock: 12,
    minStock: 25,
    price: 99,
    status: "low",
  },
  {
    key: "5",
    sku: "SKU-005",
    name: "Ecran Dell 27 4K",
    category: "Moniteurs",
    stock: 8,
    minStock: 10,
    price: 449,
    status: "low",
  },
  {
    key: "6",
    sku: "SKU-006",
    name: "Clavier Apple Magic",
    category: "Peripheriques",
    stock: 34,
    minStock: 15,
    price: 149,
    status: "ok",
  },
  {
    key: "7",
    sku: "SKU-007",
    name: "iPad Pro 12.9",
    category: "Electronique",
    stock: 23,
    minStock: 20,
    price: 1199,
    status: "ok",
  },
  {
    key: "8",
    sku: "SKU-008",
    name: "AirPods Pro 2",
    category: "Accessoires",
    stock: 67,
    minStock: 40,
    price: 279,
    status: "ok",
  },
];

const statusColors: Record<string, string> = {
  ok: "green",
  low: "orange",
  critical: "red",
};

const statusLabels: Record<string, string> = {
  ok: "En stock",
  low: "Stock bas",
  critical: "Critique",
};

const categories = [
  { value: "Electronique", label: "Electronique" },
  { value: "Peripheriques", label: "Peripheriques" },
  { value: "Moniteurs", label: "Moniteurs" },
  { value: "Accessoires", label: "Accessoires" },
];

function getStatus(stock: number, minStock: number): "ok" | "low" | "critical" {
  if (stock <= minStock * 0.25) return "critical";
  if (stock <= minStock) return "low";
  return "ok";
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newProduct: Product = {
        key: `${Date.now()}`,
        sku: `SKU-${String(products.length + 1).padStart(3, "0")}`,
        name: values.name,
        category: values.category,
        stock: values.stock,
        minStock: values.minStock,
        price: values.price,
        status: getStatus(values.stock, values.minStock),
      };
      setProducts([newProduct, ...products]);
      message.success("Produit ajoute avec succes");
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "Supprimer le produit",
      content: "Etes-vous sur de vouloir supprimer ce produit ?",
      okText: "Supprimer",
      cancelText: "Annuler",
      okButtonProps: { danger: true },
      onOk: () => {
        setProducts(products.filter((p) => p.key !== key));
        message.success("Produit supprime");
      },
    });
  };

  const columns: ColumnsType<Product> = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 100,
      render: (text) => <span className="text-muted-foreground font-mono text-xs">{text}</span>,
    },
    {
      title: "Produit",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Categorie",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <Tag className="bg-muted text-muted-foreground border-0">{text}</Tag>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{stock}</span>
          <span className="text-muted-foreground text-xs">/ {record.minStock} min</span>
        </div>
      ),
    },
    {
      title: "Prix",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <span className="font-medium">{price.toLocaleString("fr-FR")} EUR</span>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} className="capitalize">
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            className="text-muted-foreground hover:text-primary"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            className="text-muted-foreground hover:text-primary"
          />
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            className="text-muted-foreground hover:text-destructive"
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inventaire des Produits</h3>
            <p className="text-sm text-muted-foreground">Gerez votre catalogue de produits</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Rechercher..."
              prefix={<SearchOutlined className="text-muted-foreground" />}
              className="w-48"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Categorie"
              className="w-36"
              allowClear
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value)}
              options={[
                { value: "all", label: "Toutes" },
                ...categories,
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
              Ajouter
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} sur ${total} produits`,
        }}
        className="[&_.ant-table]:bg-transparent"
      />

      <Modal
        title="Ajouter un nouveau produit"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Ajouter"
        cancelText="Annuler"
        width={520}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
          initialValues={{
            stock: 0,
            minStock: 10,
            price: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: "Veuillez entrer le nom du produit" }]}
          >
            <Input placeholder="Ex: MacBook Pro 14 M3" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Categorie"
            rules={[{ required: true, message: "Veuillez selectionner une categorie" }]}
          >
            <Select placeholder="Selectionner une categorie" options={categories} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="stock"
              label="Quantite en stock"
              rules={[{ required: true, message: "Requis" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>

            <Form.Item
              name="minStock"
              label="Stock minimum"
              rules={[{ required: true, message: "Requis" }]}
            >
              <InputNumber min={1} className="w-full" placeholder="10" />
            </Form.Item>
          </div>

          <Form.Item
            name="price"
            label="Prix (EUR)"
            rules={[{ required: true, message: "Veuillez entrer le prix" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              className="w-full"
              placeholder="0.00"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
