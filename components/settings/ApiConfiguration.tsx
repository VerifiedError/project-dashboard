/**
 * FILE-REF: COMP-082-20251128
 *
 * @file ApiConfiguration.tsx
 * @description API keys configuration section for settings page
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial API configuration component (CHG-008)
 *
 * @dependencies
 * - react
 * - LIB-014 (apiKeys.ts)
 * - COMP-081 (ApiKeyDialog.tsx)
 *
 * @see Related files:
 * - PAGE-012 (settings page)
 */

"use client";

import { useState, useEffect } from "react";
import { ServiceType } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Key, Globe, TrendingUp, Database, Zap, Settings2, Github } from "lucide-react";
import { ApiKeyDialog } from "./ApiKeyDialog";
import { getApiKeys } from "@/lib/actions/apiKeys";

interface Service {
  type: ServiceType;
  name: string;
  icon: typeof Globe;
  color: string;
  description: string;
}

const services: Service[] = [
  {
    type: ServiceType.NGROK,
    name: "ngrok",
    icon: Globe,
    color: "text-blue-600",
    description: "Tunnel monitoring and management",
  },
  {
    type: ServiceType.VERCEL,
    name: "Vercel",
    icon: TrendingUp,
    color: "text-black",
    description: "Deployment tracking",
  },
  {
    type: ServiceType.NEON,
    name: "Neon",
    icon: Database,
    color: "text-green-600",
    description: "PostgreSQL database",
  },
  {
    type: ServiceType.UPSTASH,
    name: "Upstash",
    icon: Zap,
    color: "text-purple-600",
    description: "Redis & Kafka",
  },
  {
    type: ServiceType.GITHUB,
    name: "GitHub",
    icon: Github,
    color: "text-gray-900",
    description: "Fine-grained personal access token",
  },
];

export function ApiConfiguration() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [configuredKeys, setConfiguredKeys] = useState<Set<ServiceType>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load configured API keys on mount
  useEffect(() => {
    loadConfiguredKeys();
  }, []);

  const loadConfiguredKeys = async () => {
    setIsLoading(true);
    try {
      const result = await getApiKeys();
      if (result.success && result.keys) {
        const keys = new Set(result.keys.map((key) => key.service));
        setConfiguredKeys(keys);
      }
    } catch (error) {
      console.error("Failed to load API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureClick = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedService(null);
    // Reload the configured keys to update the UI
    loadConfiguredKeys();
  };

  return (
    <>
      <Card>
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
            const hasKey = configuredKeys.has(service.type);

            return (
              <div
                key={service.type}
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
                <div className="flex items-center gap-3">
                  <Badge
                    variant={hasKey ? "default" : "outline"}
                    className={hasKey ? "bg-green-600" : ""}
                  >
                    {hasKey ? "Configured" : "Not configured"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigureClick(service)}
                    disabled={isLoading}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    {hasKey ? "Update" : "Configure"}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selectedService && (
        <ApiKeyDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          service={selectedService.type}
          serviceName={selectedService.name}
          serviceDescription={selectedService.description}
          hasExistingKey={configuredKeys.has(selectedService.type)}
        />
      )}
    </>
  );
}
