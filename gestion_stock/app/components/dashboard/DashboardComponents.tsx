"use client";

import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  LayoutDashboard,
  Boxes,
  ArrowDownUp,
  Users,
  Settings,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-muted">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm ${
            changeType === "up"
              ? "text-accent"
              : changeType === "down"
              ? "text-destructive"
              : "text-muted-foreground"
          }`}
        >
          {changeType === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : changeType === "down" ? (
            <TrendingDown className="w-4 h-4" />
          ) : null}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1 text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

export function NavItem({ icon, label, active, badge }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {badge !== undefined && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            active ? "bg-primary-foreground/20" : "bg-destructive text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">StockPro</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Tableau de bord"
          active
        />
        <NavItem
          icon={<Boxes className="w-5 h-5" />}
          label="Produits"
        />
        <NavItem
          icon={<ArrowDownUp className="w-5 h-5" />}
          label="Mouvements"
        />
        <NavItem
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Alertes"
          badge={12}
        />
        <NavItem
          icon={<Users className="w-5 h-5" />}
          label="Fournisseurs"
        />
        <NavItem
          icon={<Settings className="w-5 h-5" />}
          label="Parametres"
        />
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Jean Dupont</p>
            <p className="text-xs text-muted-foreground">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full bg-muted rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary border border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <span className="text-sm text-muted-foreground">Entrepot Paris</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

interface AlertItemProps {
  product: string;
  stock: number;
  minimum: number;
  category: string;
}

export function AlertItem({ product, stock, minimum, category }: AlertItemProps) {
  const percentage = Math.round((stock / minimum) * 100);
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{product}</p>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-destructive">{stock} / {minimum}</p>
        <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
          <div 
            className="h-full bg-destructive rounded-full" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface MovementItemProps {
  type: "in" | "out";
  product: string;
  quantity: number;
  date: string;
  reference: string;
}

export function MovementItem({ type, product, quantity, date, reference }: MovementItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        type === "in" ? "bg-accent/10" : "bg-warning/10"
      }`}>
        {type === "in" ? (
          <TrendingUp className={`w-5 h-5 text-accent`} />
        ) : (
          <TrendingDown className={`w-5 h-5 text-warning`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{product}</p>
        <p className="text-xs text-muted-foreground">{reference}</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${type === "in" ? "text-accent" : "text-warning"}`}>
          {type === "in" ? "+" : "-"}{quantity}
        </p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

export const statsData = [
  {
    title: "Total Produits",
    value: "2,847",
    change: "+12.5%",
    changeType: "up" as const,
    icon: <Package className="w-5 h-5 text-primary" />,
  },
  {
    title: "Valeur du Stock",
    value: "847,250 EUR",
    change: "+8.2%",
    changeType: "up" as const,
    icon: <DollarSign className="w-5 h-5 text-accent" />,
  },
  {
    title: "Entrees ce mois",
    value: "1,234",
    change: "+23.1%",
    changeType: "up" as const,
    icon: <TrendingUp className="w-5 h-5 text-success" />,
  },
  {
    title: "Alertes Stock",
    value: "12",
    change: "+3",
    changeType: "down" as const,
    icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
  },
];

export const alertsData: AlertItemProps[] = [
  { product: "Cable HDMI 2m", stock: 5, minimum: 20, category: "Electronique" },
  { product: "Souris sans fil", stock: 8, minimum: 30, category: "Peripheriques" },
  { product: "Ecran 24 pouces", stock: 3, minimum: 10, category: "Moniteurs" },
  { product: "Clavier mecanique", stock: 12, minimum: 25, category: "Peripheriques" },
  { product: "Webcam HD", stock: 4, minimum: 15, category: "Accessoires" },
];

export const movementsData: MovementItemProps[] = [
  { type: "in", product: "MacBook Pro 14", quantity: 50, date: "Aujourd'hui", reference: "ENT-2024-001" },
  { type: "out", product: "iPhone 15 Pro", quantity: 25, date: "Aujourd'hui", reference: "SOR-2024-042" },
  { type: "in", product: "iPad Air", quantity: 30, date: "Hier", reference: "ENT-2024-002" },
  { type: "out", product: "AirPods Pro", quantity: 40, date: "Hier", reference: "SOR-2024-041" },
  { type: "in", product: "Apple Watch", quantity: 20, date: "Il y a 2 jours", reference: "ENT-2024-003" },
];

export const chartData = [
  { name: "Jan", entrees: 4000, sorties: 2400 },
  { name: "Fev", entrees: 3000, sorties: 1398 },
  { name: "Mar", entrees: 2000, sorties: 9800 },
  { name: "Avr", entrees: 2780, sorties: 3908 },
  { name: "Mai", entrees: 1890, sorties: 4800 },
  { name: "Juin", entrees: 2390, sorties: 3800 },
];

export const categoryData = [
  { name: "Electronique", value: 35 },
  { name: "Peripheriques", value: 25 },
  { name: "Moniteurs", value: 20 },
  { name: "Accessoires", value: 15 },
  { name: "Autres", value: 5 },
];
