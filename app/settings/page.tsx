/**
 * FILE-REF: PAGE-012-20251128
 *
 * @file page.tsx
 * @description Settings and configuration page
 * @category Page
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial settings page (CHG-006)
 *
 * @see Related files:
 * - PAGE-002 (home page)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Database, Globe, TrendingUp, Zap } from "lucide-react";

export default function SettingsPage() {
  const services = [
    {
      name: "ngrok",
      icon: Globe,
      color: "text-blue-600",
      status: "Not configured",
      description: "Tunnel monitoring and management",
    },
    {
      name: "Vercel",
      icon: TrendingUp,
      color: "text-black",
      status: "Not configured",
      description: "Deployment tracking",
    },
    {
      name: "Neon",
      icon: Database,
      color: "text-green-600",
      status: "Connected",
      description: "PostgreSQL database",
    },
    {
      name: "Upstash",
      icon: Zap,
      color: "text-purple-600",
      status: "Not configured",
      description: "Redis & Kafka",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure API keys and system preferences
        </p>
      </div>

      {/* API Keys Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure API keys for external services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Icon className={`h-8 w-8 ${service.color}`} />
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={service.status === "Connected" ? "default" : "outline"}
                >
                  {service.status}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>System Settings</CardTitle>
          </div>
          <CardDescription>
            Application preferences and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Auto-sync</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically sync resources every 30 seconds
                </p>
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Toast notifications for important events
                </p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Light or dark color scheme
                </p>
              </div>
              <Badge variant="outline">Light</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium">Neon PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">Next.js 14</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
