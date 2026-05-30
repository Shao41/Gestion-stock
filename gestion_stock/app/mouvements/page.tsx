"use client";

import { useState } from "react";
import { Table, Tag, Button, Input, Select, Space, Modal, Form, InputNumber, DatePicker, message } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Sidebar, Header } from "../components/dashboard/DashboardComponents";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Movement {
  key: string;
  reference: string;
  type: "in" | "out";
  product: string;
  quantity: number;
  date: string;
  supplier?: string;
  destination?: string;
  note?: string;
}

const initialMovements: Movement[] = [
  { key: "1", reference: "ENT-2024-001", type: "in", product: "MacBook Pro 14", quantity: 50, date: "2024-01-15", supplier: "Apple France" },
  { key: "2", reference: "SOR-2024-042", type: "out", product: "iPhone 15 Pro", quantity: 25, date: "2024-01-15", destination: "Boutique Lyon" },
  { key: "3", reference: "ENT-2024-002", type: "in", product: "iPad Air", quantity: 30, date: "2024-01-14", supplier: "Apple France" },
  { key: "4", reference: "SOR-2024-041", type: "out", product: "AirPods Pro", quantity: 40, date: "2024-01-14", destination: "Boutique Marseille" },
  { key: "5", reference: "ENT-2024-003", type: "in", product: "Apple Watch", quantity: 20, date: "2024-01-13", supplier: "Apple France" },
  { key: "6", reference: "SOR-2024-040", type: "out", product: "Cable HDMI 2m", quantity: 100, date: "2024-01-13", destination: "Client XYZ" },
  { key: "7", reference: "ENT-2024-004", type: "in", product: "Souris Logitech", quantity: 75, date: "2024-01-12", supplier: "Logitech EU" },
  { key: "8", reference: "SOR-2024-039", type: "out", product: "Clavier Apple", quantity: 15, date: "2024-01-12", destination: "Boutique Paris" },
];

const products = [
  { value: "MacBook Pro 14", label: "MacBook Pro 14" },
  { value: "iPhone 15 Pro", label: "iPhone 15 Pro" },
  { value: "iPad Air", label: "iPad Air" },
  { value: "AirPods Pro", label: "AirPods Pro" },
  { value: "Apple Watch", label: "Apple Watch" },
  { value: "Cable HDMI 2m", label: "Cable HDMI 2m" },
  { value: "Souris Logitech", label: "Souris Logitech" },
  { value: "Clavier Apple", label: "Clavier Apple" },
];

export default function MouvementsPage() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<"in" | "out">("in");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product.toLowerCase().includes(searchText.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !typeFilter || typeFilter === "all" || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddMovement = (type: "in" | "out") => {
    setMovementType(type);
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const prefix = movementType === "in" ? "ENT" : "SOR";
      const newMovement: Movement = {
        key: `${Date.now()}`,
        reference: `${prefix}-2024-${String(movements.length + 1).padStart(3, "0")}`,
        type: movementType,
        product: values.product,
        quantity: values.quantity,
        date: values.date.format("YYYY-MM-DD"),
        supplier: movementType === "in" ? values.supplier : undefined,
        destination: movementType === "out" ? values.destination : undefined,
        note: values.note,
      };
      setMovements([newMovement, ...movements]);
      message.success(`${movementType === "in" ? "Entree" : "Sortie"} ajoutee avec succes`);
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const columns: ColumnsType<Movement> = [
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      width: 140,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={type === "in" ? "green" : "orange"} icon={type === "in" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}>
          {type === "in" ? "Entree" : "Sortie"}
        </Tag>
      ),
    },
    {
      title: "Produit",
      dataIndex: "product",
      key: "product",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Quantite",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity, record) => (
        <span className={`font-medium ${record.type === "in" ? "text-accent" : "text-warning"}`}>
          {record.type === "in" ? "+" : "-"}{quantity}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => new Date(date).toLocaleDateString("fr-FR"),
    },
    {
      title: "Fournisseur / Destination",
      key: "origin",
      render: (_, record) => (
        <span className="text-muted-foreground">
          {record.supplier || record.destination || "-"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: () => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          className="text-muted-foreground hover:text-primary"
        />
      ),
    },
  ];

  // Stats
  const totalIn = movements.filter(m => m.type === "in").reduce((acc, m) => acc + m.quantity, 0);
  const totalOut = movements.filter(m => m.type === "out").reduce((acc, m) => acc + m.quantity, 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Mouvements de Stock</h1>
            <p className="text-muted-foreground">Suivez les entrees et sorties de votre stock</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Entrees</p>
                  <p className="text-xl font-semibold text-accent">+{totalIn}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <TrendingDown className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sorties</p>
                  <p className="text-xl font-semibold text-warning">-{totalOut}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className={`text-xl font-semibold ${totalIn - totalOut >= 0 ? "text-accent" : "text-destructive"}`}>
                    {totalIn - totalOut >= 0 ? "+" : ""}{totalIn - totalOut}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Movements Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Historique des Mouvements</h3>
                  <p className="text-sm text-muted-foreground">{movements.length} mouvements enregistres</p>
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
                    placeholder="Type"
                    className="w-32"
                    allowClear
                    value={typeFilter}
                    onChange={(value) => setTypeFilter(value)}
                    options={[
                      { value: "all", label: "Tous" },
                      { value: "in", label: "Entrees" },
                      { value: "out", label: "Sorties" },
                    ]}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddMovement("in")}>
                    Entree
                  </Button>
                  <Button icon={<PlusOutlined />} onClick={() => handleAddMovement("out")}>
                    Sortie
                  </Button>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredMovements}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} sur ${total} mouvements`,
              }}
              className="[&_.ant-table]:bg-transparent"
            />
          </div>

          <Modal
            title={movementType === "in" ? "Nouvelle Entree de Stock" : "Nouvelle Sortie de Stock"}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="Enregistrer"
            cancelText="Annuler"
            width={520}
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              className="mt-4"
            >
              <Form.Item
                name="product"
                label="Produit"
                rules={[{ required: true, message: "Veuillez selectionner un produit" }]}
              >
                <Select placeholder="Selectionner un produit" options={products} showSearch />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="quantity"
                  label="Quantite"
                  rules={[{ required: true, message: "Requis" }]}
                >
                  <InputNumber min={1} className="w-full" placeholder="0" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Requis" }]}
                >
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>
              </div>

              {movementType === "in" ? (
                <Form.Item
                  name="supplier"
                  label="Fournisseur"
                >
                  <Input placeholder="Nom du fournisseur" />
                </Form.Item>
              ) : (
                <Form.Item
                  name="destination"
                  label="Destination"
                >
                  <Input placeholder="Destination de la sortie" />
                </Form.Item>
              )}

              <Form.Item
                name="note"
                label="Note"
              >
                <Input.TextArea placeholder="Note optionnelle..." rows={2} />
              </Form.Item>
            </Form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
