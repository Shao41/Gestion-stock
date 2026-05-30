"use client";

import { useState } from "react";
import { Table, Tag, Button, Input, Space, Modal, Form, message, Dropdown, Avatar } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Sidebar, Header } from "../components/dashboard/DashboardComponents";
import { Building2, MapPin, Package } from "lucide-react";

interface Supplier {
  key: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  productsCount: number;
  status: "active" | "inactive";
  lastOrder: string;
}

const initialSuppliers: Supplier[] = [
  { key: "1", name: "Apple France", contact: "Marie Dupont", email: "contact@apple.fr", phone: "+33 1 23 45 67 89", address: "Paris, France", productsCount: 12, status: "active", lastOrder: "2024-01-15" },
  { key: "2", name: "Logitech EU", contact: "Jean Martin", email: "sales@logitech.eu", phone: "+33 1 98 76 54 32", address: "Lyon, France", productsCount: 8, status: "active", lastOrder: "2024-01-12" },
  { key: "3", name: "Dell Technologies", contact: "Pierre Bernard", email: "enterprise@dell.com", phone: "+33 1 11 22 33 44", address: "Marseille, France", productsCount: 15, status: "active", lastOrder: "2024-01-10" },
  { key: "4", name: "Samsung Electronics", contact: "Sophie Leroy", email: "b2b@samsung.fr", phone: "+33 1 55 66 77 88", address: "Toulouse, France", productsCount: 6, status: "inactive", lastOrder: "2023-12-20" },
  { key: "5", name: "HP France", contact: "Lucas Moreau", email: "sales@hp.fr", phone: "+33 1 44 55 66 77", address: "Bordeaux, France", productsCount: 10, status: "active", lastOrder: "2024-01-08" },
  { key: "6", name: "Microsoft France", contact: "Emma Petit", email: "enterprise@microsoft.fr", phone: "+33 1 33 44 55 66", address: "Nice, France", productsCount: 4, status: "active", lastOrder: "2024-01-05" },
];

export default function FournisseursPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchText.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "Supprimer le fournisseur",
      content: "Etes-vous sur de vouloir supprimer ce fournisseur ?",
      okText: "Supprimer",
      cancelText: "Annuler",
      okButtonProps: { danger: true },
      onOk: () => {
        setSuppliers(suppliers.filter((s) => s.key !== key));
        message.success("Fournisseur supprime");
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSupplier) {
        setSuppliers(suppliers.map(s => s.key === editingSupplier.key ? { ...s, ...values } : s));
        message.success("Fournisseur mis a jour");
      } else {
        const newSupplier: Supplier = {
          key: `${Date.now()}`,
          ...values,
          productsCount: 0,
          status: "active",
          lastOrder: "-",
        };
        setSuppliers([newSupplier, ...suppliers]);
        message.success("Fournisseur ajoute");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: "Fournisseur",
      key: "supplier",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-primary/10 text-primary" size={40}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <span className="font-medium">{record.name}</span>
            <span className="block text-xs text-muted-foreground">{record.contact}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <MailOutlined className="text-muted-foreground w-4" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PhoneOutlined className="w-4" />
            <span>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Adresse",
      key: "address",
      render: (_, record) => (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{record.address}</span>
        </div>
      ),
    },
    {
      title: "Produits",
      dataIndex: "productsCount",
      key: "productsCount",
      sorter: (a, b) => a.productsCount - b.productsCount,
      render: (count) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{count}</span>
        </div>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status === "active" ? "Actif" : "Inactif"}
        </Tag>
      ),
    },
    {
      title: "Derniere commande",
      dataIndex: "lastOrder",
      key: "lastOrder",
      render: (date) => date === "-" ? "-" : new Date(date).toLocaleDateString("fr-FR"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "view", label: "Voir details", icon: <EyeOutlined /> },
              { key: "edit", label: "Modifier", icon: <EditOutlined />, onClick: () => handleEdit(record) },
              { type: "divider" },
              { key: "delete", label: "Supprimer", icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(record.key) },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Stats
  const activeCount = suppliers.filter(s => s.status === "active").length;
  const totalProducts = suppliers.reduce((acc, s) => acc + s.productsCount, 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Fournisseurs</h1>
            <p className="text-muted-foreground">Gerez vos partenaires et fournisseurs</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fournisseurs</p>
                  <p className="text-xl font-semibold text-foreground">{suppliers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fournisseurs Actifs</p>
                  <p className="text-xl font-semibold text-accent">{activeCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Package className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produits Fournis</p>
                  <p className="text-xl font-semibold text-warning">{totalProducts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Suppliers Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Liste des Fournisseurs</h3>
                  <p className="text-sm text-muted-foreground">{suppliers.length} fournisseurs enregistres</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Rechercher..."
                    prefix={<SearchOutlined className="text-muted-foreground" />}
                    className="w-48"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredSuppliers}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} sur ${total} fournisseurs`,
              }}
              className="[&_.ant-table]:bg-transparent"
            />
          </div>

          <Modal
            title={editingSupplier ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
            okText={editingSupplier ? "Enregistrer" : "Ajouter"}
            cancelText="Annuler"
            width={520}
            destroyOnClose
          >
            <Form form={form} layout="vertical" className="mt-4">
              <Form.Item
                name="name"
                label="Nom de l'entreprise"
                rules={[{ required: true, message: "Requis" }]}
              >
                <Input placeholder="Ex: Apple France" />
              </Form.Item>

              <Form.Item
                name="contact"
                label="Personne de contact"
                rules={[{ required: true, message: "Requis" }]}
              >
                <Input placeholder="Nom du contact" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: "email", message: "Email invalide" }]}
                >
                  <Input placeholder="email@exemple.com" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Telephone"
                  rules={[{ required: true, message: "Requis" }]}
                >
                  <Input placeholder="+33 1 23 45 67 89" />
                </Form.Item>
              </div>

              <Form.Item
                name="address"
                label="Adresse"
                rules={[{ required: true, message: "Requis" }]}
              >
                <Input placeholder="Ville, Pays" />
              </Form.Item>
            </Form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
