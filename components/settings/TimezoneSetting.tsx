/**
 * FILE-REF: COMP-085-20251128
 *
 * @file TimezoneSetting.tsx
 * @description Timezone preference selector component
 * @category Component
 * @created 2025-11-28
 * @modified 2025-11-28
 *
 * @changelog
 * - 2025-11-28 - Initial timezone setting component (CHG-010)
 *
 * @dependencies
 * - react
 * - LIB-013 (settings.ts)
 * - LIB-027 (timezone.ts)
 * - COMP-037 (select.tsx)
 *
 * @see Related files:
 * - PAGE-012 (settings page)
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getTimezone, setTimezone } from "@/lib/actions/settings";
import { TIMEZONES, DEFAULT_TIMEZONE, type TimezoneValue, formatDateInTimezone } from "@/lib/utils/timezone";
import { Loader2, Globe, Check } from "lucide-react";

export function TimezoneSetting() {
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneValue>(DEFAULT_TIMEZONE);
  const [savedTimezone, setSavedTimezone] = useState<TimezoneValue>(DEFAULT_TIMEZONE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load current timezone on mount
  useEffect(() => {
    async function loadTimezone() {
      setIsLoading(true);
      const result = await getTimezone();
      if (result.success && result.timezone) {
        setSelectedTimezone(result.timezone);
        setSavedTimezone(result.timezone);
      }
      setIsLoading(false);
    }
    loadTimezone();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await setTimezone(selectedTimezone);
      if (result.success) {
        setSavedTimezone(selectedTimezone);
        toast({
          title: "Timezone saved",
          description: `All dates will now display in ${TIMEZONES.find((tz) => tz.value === selectedTimezone)?.label}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save timezone",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Timezone save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = selectedTimezone !== savedTimezone;
  const currentTime = new Date();
  const formattedTime = formatDateInTimezone(currentTime, selectedTimezone, {
    includeTime: true,
    includeSeconds: true,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <CardTitle>Timezone</CardTitle>
        </div>
        <CardDescription>
          Set your local timezone for displaying dates and times throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timezone Selector */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Select your timezone</Label>
            <Select
              value={selectedTimezone}
              onValueChange={(value) => setSelectedTimezone(value as TimezoneValue)}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Time Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current time in selected timezone:</p>
            <p className="text-lg font-medium">{formattedTime}</p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {!hasChanges && savedTimezone && (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Saved</span>
                </>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isLoading || isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
