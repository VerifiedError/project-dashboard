/**
 * FILE-REF: COMP-081-20251128
 *
 * @file ApiKeyDialog.tsx
 * @description Dialog for configuring API keys
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial API key dialog component (CHG-008)
 *
 * @dependencies
 * - react
 * - LIB-014 (apiKeys.ts)
 * - COMP-006 (dialog.tsx)
 *
 * @see Related files:
 * - PAGE-012 (settings page)
 */

"use client";

import { useState } from "react";
import { ServiceType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveApiKey, deleteApiKey, getApiKey } from "@/lib/actions/apiKeys";
import { Loader2, Eye, EyeOff, Trash2, Download } from "lucide-react";

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceType | null;
  serviceName: string;
  serviceDescription: string;
  hasExistingKey?: boolean;
}

export function ApiKeyDialog({
  isOpen,
  onClose,
  service,
  serviceName,
  serviceDescription,
  hasExistingKey = false,
}: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!service) return;

    if (!apiKey || apiKey.trim().length === 0) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Get userId from auth context once authentication is implemented
      const userId = "temp-user-id"; // This will be replaced with actual auth
      const result = await saveApiKey(service, apiKey, userId);

      if (result.success) {
        toast({
          title: "Success",
          description: `${serviceName} API key saved successfully`,
        });
        setApiKey("");
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save API key",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;

    setIsDeleting(true);

    try {
      // TODO: Get userId from auth context once authentication is implemented
      const userId = "temp-user-id"; // This will be replaced with actual auth
      const result = await deleteApiKey(service, userId);

      if (result.success) {
        toast({
          title: "Success",
          description: `${serviceName} API key deleted successfully`,
        });
        setApiKey("");
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete API key",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLoadKey = async () => {
    if (!service) return;

    setIsLoadingKey(true);

    try {
      // TODO: Get userId from auth context once authentication is implemented
      const userId = "temp-user-id"; // This will be replaced with actual auth
      const result = await getApiKey(service, userId);

      if (result.success && result.keyValue) {
        setApiKey(result.keyValue);
        setShowKey(true);
        toast({
          title: "Success",
          description: `${serviceName} API key loaded`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load API key",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleClose = () => {
    setApiKey("");
    setShowKey(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configure {serviceName} API Key</DialogTitle>
          <DialogDescription>
            {hasExistingKey
              ? `Update or delete your ${serviceName} API key. ${serviceDescription}`
              : `Enter your ${serviceName} API key. ${serviceDescription}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasExistingKey ? "Enter new API key to update" : "Enter your API key"}
                disabled={isSubmitting || isDeleting}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isSubmitting || isDeleting}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key will be encrypted and stored securely.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <div className="flex gap-2 flex-1">
            {hasExistingKey && (
              <Button
                type="button"
                variant="outline"
                onClick={handleLoadKey}
                disabled={isSubmitting || isDeleting || isLoadingKey}
                className="flex-1 sm:flex-none"
              >
                {isLoadingKey && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Download className="mr-2 h-4 w-4" />
                View Key
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {hasExistingKey && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting || isLoadingKey}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting || isDeleting || isLoadingKey}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting || isDeleting || isLoadingKey || !apiKey.trim()}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hasExistingKey ? "Update" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
