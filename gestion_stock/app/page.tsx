"use client";

import {
  Sidebar,
  Header,
  StatCard,
  AlertItem,
  MovementItem,
  statsData,
  alertsData,
  movementsData,
} from "./components/dashboard/DashboardComponents";
import { StockMovementChart, CategoryChart } from "./components/dashboard/Charts";
import { ProductsTable } from "./components/dashboard/ProductsTable";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground">Bienvenue, voici un apercu de votre stock</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <StockMovementChart />
            </div>
            <div>
              <CategoryChart />
            </div>
          </div>

          {/* Alerts and Movements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Low Stock Alerts */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Alertes Stock Bas</h3>
                    <p className="text-sm text-muted-foreground">Produits necessitant un reapprovisionnement</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                    {alertsData.length} alertes
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                {alertsData.map((alert, index) => (
                  <AlertItem key={index} {...alert} />
                ))}
              </div>
            </div>

            {/* Recent Movements */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Mouvements Recents</h3>
                    <p className="text-sm text-muted-foreground">Dernieres entrees et sorties</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">
                    Voir tout
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                {movementsData.map((movement, index) => (
                  <MovementItem key={index} {...movement} />
                ))}
              </div>
            </div>
          </div>

          {/* Products Table */}
          <ProductsTable />
        </main>
      </div>
    </div>
  );
}
