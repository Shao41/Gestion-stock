"use client";

import { useState } from "react";
import { Table, Tag, Button, Input, Select, Progress, Modal, Form, InputNumber, message } from "antd";
import {
  SearchOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Sidebar, Header } from "../components/dashboard/DashboardComponents";
import { AlertTriangle, CheckCircle, XCircle, Bell, BellOff } from "lucide-react";

interface Alert {
  key: string;
  product: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  status: "critical" | "warning" | "resolved";
  lastUpdated: string;
  notified: boolean;
}

const initialAlerts: Alert[] = [
  { key: "1", product: "Cable HDMI 2m", sku: "SKU-003", category: "Accessoires", currentStock: 5, minStock: 20, status: "critical", lastUpdated: "2024-01-15", notified: true },
  { key: "2", product: "Souris sans fil", sku: "SKU-012", category: "Peripheriques", currentStock: 8, minStock: 30, status: "critical", lastUpdated: "2024-01-15", notified: true },
  { key: "3", product: "Ecran 24 pouces", sku: "SKU-005", category: "Moniteurs", currentStock: 3, minStock: 10, status: "critical", lastUpdated: "2024-01-14", notified: true },
  { key: "4", product: "Clavier mecanique", sku: "SKU-008", category: "Peripheriques", currentStock: 12, minStock: 25, status: "warning", lastUpdated: "2024-01-14", notified: false },
  { key: "5", product: "Webcam HD", sku: "SKU-015", category: "Accessoires", currentStock: 4, minStock: 15, status: "critical", lastUpdated: "2024-01-13", notified: true },
  { key: "6", product: "Hub USB-C", sku: "SKU-021", category: "Accessoires", currentStock: 18, minStock: 25, status: "warning", lastUpdated: "2024-01-13", notified: false },
  { key: "7", product: "Casque audio", sku: "SKU-019", category: "Accessoires", currentStock: 22, minStock: 30, status: "warning", lastUpdated: "2024-01-12", notified: false },
  { key: "8", product: "Tapis de souris XL", sku: "SKU-025", category: "Accessoires", currentStock: 45, minStock: 40, status: "resolved", lastUpdated: "2024-01-12", notified: false },
];

export default function AlertesPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.product.toLowerCase().includes(searchText.toLowerCase()) ||
      alert.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRestock = (alert: Alert) => {
    setSelectedAlert(alert);
    form.setFieldsValue({ quantity: alert.minStock - alert.currentStock + 10 });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAlert) {
        const newStock = selectedAlert.currentStock + values.quantity;
        setAlerts(alerts.map(a => {
          if (a.key === selectedAlert.key) {
            const newStatus = newStock > a.minStock ? "resolved" : newStock <= a.minStock * 0.5 ? "critical" : "warning";
            return { ...a, currentStock: newStock, status: newStatus, lastUpdated: new Date().toISOString().split("T")[0] };
          }
          return a;
        }));
        message.success(`Stock de "${selectedAlert.product}" mis a jour`);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const toggleNotification = (key: string) => {
    setAlerts(alerts.map(a => a.key === key ? { ...a, notified: !a.notified } : a));
  };

  const columns: ColumnsType<Alert> = [
    {
      title: "Produit",
      key: "product",
      render: (_, record) => (
        <div>
          <span className="font-medium">{record.product}</span>
          <span className="block text-xs text-muted-foreground font-mono">{record.sku}</span>
        </div>
      ),
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
      title: "Stock Actuel",
      key: "stock",
      sorter: (a, b) => a.currentStock - b.currentStock,
      render: (_, record) => {
        const percentage = Math.round((record.currentStock / record.minStock) * 100);
        const color = record.status === "critical" ? "#ef4444" : record.status === "warning" ? "#f59e0b" : "#22c55e";
        return (
          <div className="w-32">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{record.currentStock}</span>
              <span className="text-muted-foreground">/ {record.minStock}</span>
            </div>
            <Progress percent={Math.min(percentage, 100)} size="small" strokeColor={color} showInfo={false} />
          </div>
        );
      },
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          critical: { color: "red", icon: <ExclamationCircleOutlined />, label: "Critique" },
          warning: { color: "orange", icon: <WarningOutlined />, label: "Attention" },
          resolved: { color: "green", icon: <CheckCircleOutlined />, label: "Resolu" },
        };
        const c = config[status as keyof typeof config];
        return <Tag color={c.color} icon={c.icon}>{c.label}</Tag>;
      },
    },
    {
      title: "Derniere MAJ",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (date) => new Date(date).toLocaleDateString("fr-FR"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            size="small"
            icon={record.notified ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            className={record.notified ? "text-primary" : "text-muted-foreground"}
            onClick={() => toggleNotification(record.key)}
          />
          {record.status !== "resolved" && (
            <Button type="primary" size="small" onClick={() => handleRestock(record)}>
              Reapprovisionner
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Stats
  const criticalCount = alerts.filter(a => a.status === "critical").length;
  const warningCount = alerts.filter(a => a.status === "warning").length;
  const resolvedCount = alerts.filter(a => a.status === "resolved").length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Alertes de Stock</h1>
            <p className="text-muted-foreground">Surveillez les produits necessitant un reapprovisionnement</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critiques</p>
                  <p className="text-xl font-semibold text-destructive">{criticalCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attention</p>
                  <p className="text-xl font-semibold text-warning">{warningCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolus</p>
                  <p className="text-xl font-semibold text-accent">{resolvedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Liste des Alertes</h3>
                  <p className="text-sm text-muted-foreground">{criticalCount + warningCount} alertes actives</p>
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
                    placeholder="Statut"
                    className="w-32"
                    allowClear
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    options={[
                      { value: "all", label: "Tous" },
                      { value: "critical", label: "Critiques" },
                      { value: "warning", label: "Attention" },
                      { value: "resolved", label: "Resolus" },
                    ]}
                  />
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredAlerts}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} sur ${total} alertes`,
              }}
              className="[&_.ant-table]:bg-transparent"
            />
          </div>

          <Modal
            title="Reapprovisionnement"
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
            okText="Confirmer"
            cancelText="Annuler"
            width={400}
            destroyOnClose
          >
            <Form form={form} layout="vertical" className="mt-4">
              {selectedAlert && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedAlert.product}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock actuel: {selectedAlert.currentStock} / Min: {selectedAlert.minStock}
                  </p>
                </div>
              )}
              <Form.Item
                name="quantity"
                label="Quantite a ajouter"
                rules={[{ required: true, message: "Requis" }]}
              >
                <InputNumber min={1} className="w-full" placeholder="0" />
              </Form.Item>
            </Form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
