"use client";

import { useState } from "react";
import { Switch, Select, Input, Button, message, Tabs, Avatar, Divider } from "antd";
import { Sidebar, Header } from "../components/dashboard/DashboardComponents";
import { User, Bell, Shield, Database, Palette, Globe, Save, Building2, Mail, Lock } from "lucide-react";

interface SettingsSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsCard({ icon, title, description, children }: SettingsSection) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingsRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ParametresPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    stockAlerts: true,
    orderUpdates: true,
    weeklyReport: false,
  });

  const [settings, setSettings] = useState({
    language: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    theme: "dark",
    lowStockThreshold: 20,
  });

  const handleSave = () => {
    message.success("Parametres enregistres avec succes");
  };

  const tabItems = [
    {
      key: "general",
      label: "General",
      children: (
        <div className="space-y-6">
          <SettingsCard
            icon={<User className="w-5 h-5 text-primary" />}
            title="Profil Utilisateur"
            description="Gerez vos informations personnelles"
          >
            <div className="flex items-center gap-6 mb-6">
              <Avatar size={80} className="bg-primary text-primary-foreground text-2xl">
                JD
              </Avatar>
              <div>
                <Button>Changer la photo</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG ou GIF. Max 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prenom</label>
                <Input defaultValue="Jean" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input defaultValue="Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input defaultValue="jean.dupont@entreprise.com" prefix={<Mail className="w-4 h-4 text-muted-foreground" />} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <Input defaultValue="Administrateur" disabled />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={<Building2 className="w-5 h-5 text-primary" />}
            title="Entreprise"
            description="Informations de votre entreprise"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom de l&apos;entreprise</label>
                <Input defaultValue="StockPro SARL" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SIRET</label>
                <Input defaultValue="123 456 789 00012" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <Input defaultValue="123 Rue de la Gestion, 75001 Paris" />
              </div>
            </div>
          </SettingsCard>
        </div>
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      children: (
        <SettingsCard
          icon={<Bell className="w-5 h-5 text-primary" />}
          title="Preferences de Notification"
          description="Configurez comment vous souhaitez etre notifie"
        >
          <SettingsRow label="Notifications par email" description="Recevoir les alertes par email">
            <Switch checked={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} />
          </SettingsRow>
          <SettingsRow label="Notifications push" description="Recevoir les notifications dans le navigateur">
            <Switch checked={notifications.push} onChange={(v) => setNotifications({ ...notifications, push: v })} />
          </SettingsRow>
          <SettingsRow label="Alertes de stock bas" description="Etre notifie quand le stock est critique">
            <Switch checked={notifications.stockAlerts} onChange={(v) => setNotifications({ ...notifications, stockAlerts: v })} />
          </SettingsRow>
          <SettingsRow label="Mises a jour des commandes" description="Notifications sur les mouvements de stock">
            <Switch checked={notifications.orderUpdates} onChange={(v) => setNotifications({ ...notifications, orderUpdates: v })} />
          </SettingsRow>
          <SettingsRow label="Rapport hebdomadaire" description="Recevoir un resume chaque semaine">
            <Switch checked={notifications.weeklyReport} onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })} />
          </SettingsRow>
        </SettingsCard>
      ),
    },
    {
      key: "preferences",
      label: "Preferences",
      children: (
        <div className="space-y-6">
          <SettingsCard
            icon={<Globe className="w-5 h-5 text-primary" />}
            title="Localisation"
            description="Parametres regionaux et linguistiques"
          >
            <SettingsRow label="Langue" description="Langue de l'interface">
              <Select
                value={settings.language}
                onChange={(v) => setSettings({ ...settings, language: v })}
                options={[
                  { value: "fr", label: "Francais" },
                  { value: "en", label: "English" },
                  { value: "es", label: "Espanol" },
                ]}
                className="w-40"
              />
            </SettingsRow>
            <SettingsRow label="Fuseau horaire">
              <Select
                value={settings.timezone}
                onChange={(v) => setSettings({ ...settings, timezone: v })}
                options={[
                  { value: "Europe/Paris", label: "Paris (UTC+1)" },
                  { value: "Europe/London", label: "Londres (UTC)" },
                  { value: "America/New_York", label: "New York (UTC-5)" },
                ]}
                className="w-48"
              />
            </SettingsRow>
            <SettingsRow label="Devise">
              <Select
                value={settings.currency}
                onChange={(v) => setSettings({ ...settings, currency: v })}
                options={[
                  { value: "EUR", label: "Euro (EUR)" },
                  { value: "USD", label: "Dollar (USD)" },
                  { value: "GBP", label: "Livre (GBP)" },
                ]}
                className="w-40"
              />
            </SettingsRow>
          </SettingsCard>

          <SettingsCard
            icon={<Palette className="w-5 h-5 text-primary" />}
            title="Apparence"
            description="Personnalisez l'interface"
          >
            <SettingsRow label="Theme" description="Choisir le theme de l'application">
              <Select
                value={settings.theme}
                onChange={(v) => setSettings({ ...settings, theme: v })}
                options={[
                  { value: "dark", label: "Sombre" },
                  { value: "light", label: "Clair" },
                  { value: "system", label: "Systeme" },
                ]}
                className="w-32"
              />
            </SettingsRow>
          </SettingsCard>

          <SettingsCard
            icon={<Database className="w-5 h-5 text-primary" />}
            title="Stock"
            description="Configuration des alertes de stock"
          >
            <SettingsRow label="Seuil de stock bas" description="Pourcentage sous lequel une alerte est declenchee">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                  className="w-20"
                  suffix="%"
                />
              </div>
            </SettingsRow>
          </SettingsCard>
        </div>
      ),
    },
    {
      key: "security",
      label: "Securite",
      children: (
        <div className="space-y-6">
          <SettingsCard
            icon={<Lock className="w-5 h-5 text-primary" />}
            title="Mot de passe"
            description="Modifiez votre mot de passe"
          >
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
                <Input.Password placeholder="Entrez votre mot de passe actuel" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
                <Input.Password placeholder="Entrez un nouveau mot de passe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirmer le mot de passe</label>
                <Input.Password placeholder="Confirmez le nouveau mot de passe" />
              </div>
              <Button type="primary">Changer le mot de passe</Button>
            </div>
          </SettingsCard>

          <SettingsCard
            icon={<Shield className="w-5 h-5 text-primary" />}
            title="Authentification a deux facteurs"
            description="Ajoutez une couche de securite supplementaire"
          >
            <SettingsRow label="Activer 2FA" description="Utiliser une application d'authentification">
              <Switch />
            </SettingsRow>
            <Divider className="my-4" />
            <div className="text-sm text-muted-foreground">
              <p>Sessions actives: <span className="text-foreground font-medium">2 appareils</span></p>
              <Button type="link" className="p-0 h-auto mt-2">Voir toutes les sessions</Button>
            </div>
          </SettingsCard>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Parametres</h1>
              <p className="text-muted-foreground">Configurez votre application</p>
            </div>
            <Button type="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Enregistrer
            </Button>
          </div>

          <Tabs items={tabItems} className="settings-tabs" />
        </main>
      </div>
    </div>
  );
}
