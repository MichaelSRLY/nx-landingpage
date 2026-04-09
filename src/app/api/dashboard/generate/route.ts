import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { buildSystemPrompt, buildUserPrompt } from '@/components/dashboard/llm/buildPrompt';

// Import all schemas
import { schema as donutSchema } from '@/components/dashboard/widgets/DonutChartWidget';
import { schema as barSchema } from '@/components/dashboard/widgets/BarChartWidget';
import { schema as kpiSchema } from '@/components/dashboard/widgets/KpiCardWidget';
import { schema as topNSchema } from '@/components/dashboard/widgets/TopNCardsWidget';
import { schema as categorySchema } from '@/components/dashboard/widgets/CategoryListWidget';
import { schema as treemapSchema } from '@/components/dashboard/widgets/TreemapWidget';
import { schema as radarSchema } from '@/components/dashboard/widgets/RadarChartWidget';
import { schema as stackedSchema } from '@/components/dashboard/widgets/StackedAreaWidget';
import { schema as tableSchema } from '@/components/dashboard/widgets/DataTableWidget';
import { schema as monthSchema } from '@/components/dashboard/widgets/MonthCardsWidget';

const SCHEMA_MAP: Record<string, z.ZodType> = {
  'donut-chart': donutSchema,
  'bar-chart': barSchema,
  'kpi-cards': kpiSchema,
  'top-n-cards': topNSchema,
  'category-list': categorySchema,
  'treemap': treemapSchema,
  'radar-chart': radarSchema,
  'stacked-area': stackedSchema,
  'data-table': tableSchema,
  'month-cards': monthSchema,
};

function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  return z.toJSONSchema(schema) as Record<string, unknown>;
}

interface WidgetRequest {
  instanceId: string;
  widgetId: string;
  schemaDescription: string;
}

interface RequestBody {
  fileContent: string;
  fileType: string;
  widgets: WidgetRequest[];
}

const MAX_TURNS = 5;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const body = (await request.json()) as RequestBody;
    const { fileContent, fileType, widgets } = body;

    if (!fileContent || !widgets?.length) {
      return NextResponse.json({ error: 'Missing fileContent or widgets' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    // Build one tool per widget instance
    const tools: Anthropic.Messages.Tool[] = widgets.map((w) => {
      const schema = SCHEMA_MAP[w.widgetId];
      const jsonSchema = schema ? zodToJsonSchema(schema) : { type: 'object' as const };
      return {
        name: `fill_${w.instanceId}`,
        description: `Fill the ${w.widgetId} widget (instance ${w.instanceId}). ${w.schemaDescription}`,
        input_schema: jsonSchema as Anthropic.Messages.Tool['input_schema'],
      };
    });

    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(fileContent, fileType);

    const results = new Map<string, { success: boolean; data?: Record<string, unknown>; error?: string }>();

    let messages: Anthropic.Messages.MessageParam[] = [
      { role: 'user', content: userPrompt },
    ];

    // Agentic loop
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const allFilled = widgets.every((w) => results.has(w.instanceId));
      if (allFilled) break;

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        tools,
        messages,
      });

      // Process tool use blocks
      const assistantContent = response.content;
      const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

      for (const block of assistantContent) {
        if (block.type === 'tool_use') {
          const instanceId = block.name.replace('fill_', '');
          const widgetReq = widgets.find((w) => w.instanceId === instanceId);

          if (widgetReq) {
            const zodSchema = SCHEMA_MAP[widgetReq.widgetId];
            if (zodSchema) {
              const parseResult = zodSchema.safeParse(block.input);
              if (parseResult.success) {
                results.set(instanceId, { success: true, data: parseResult.data as Record<string, unknown> });
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: 'Success: data validated and accepted.',
                });
              } else {
                const errMsg = parseResult.error.issues.map((iss) => `${iss.path.join('.')}: ${iss.message}`).join('; ');
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: `Validation error: ${errMsg}. Please fix the data and try again.`,
                  is_error: true,
                });
              }
            } else {
              results.set(instanceId, { success: true, data: block.input as Record<string, unknown> });
              toolResults.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: 'Success.',
              });
            }
          } else {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: 'Unknown widget instance.',
              is_error: true,
            });
          }
        }
      }

      if (toolResults.length === 0) break; // Claude didn't call any tools

      messages = [
        ...messages,
        { role: 'assistant', content: assistantContent },
        { role: 'user', content: toolResults },
      ];

      if (response.stop_reason === 'end_turn') break;
    }

    // Build final response
    const finalResults = widgets.map((w) => {
      const result = results.get(w.instanceId);
      return {
        instanceId: w.instanceId,
        success: result?.success ?? false,
        data: result?.data,
        error: result?.error || (result ? undefined : 'Widget was not filled by Claude'),
      };
    });

    return NextResponse.json({ results: finalResults });
  } catch (err) {
    console.error('Dashboard generate error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
