import type { z } from 'zod';
import type { ComponentType } from 'react';

export interface WidgetMeta {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  minWidth?: number;
}

export interface WidgetDefinition {
  meta: WidgetMeta;
  schema: z.ZodType;
  component: ComponentType<{ data: Record<string, unknown> }>;
}

export interface PlacedWidget {
  instanceId: string;
  widgetId: string;
  data: Record<string, unknown> | null;
  status: 'empty' | 'loading' | 'filled' | 'error';
  error?: string;
}

export interface GenerateRequest {
  fileContent: string;
  fileType: 'csv' | 'pdf' | 'txt';
  widgets: Array<{
    instanceId: string;
    widgetId: string;
    schemaDescription: string;
  }>;
}

export interface GenerateResult {
  instanceId: string;
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface GenerateResponse {
  results: GenerateResult[];
}
