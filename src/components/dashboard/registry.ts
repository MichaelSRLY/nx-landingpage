import { lazy } from 'react';
import type { WidgetMeta, WidgetDefinition } from './types';

// Schemas imported eagerly (small), components lazily
import { schema as donutSchema, meta as donutMeta } from './widgets/DonutChartWidget';
import { schema as barSchema, meta as barMeta } from './widgets/BarChartWidget';
import { schema as kpiSchema, meta as kpiMeta } from './widgets/KpiCardWidget';
import { schema as topNSchema, meta as topNMeta } from './widgets/TopNCardsWidget';
import { schema as categorySchema, meta as categoryMeta } from './widgets/CategoryListWidget';
import { schema as treemapSchema, meta as treemapMeta } from './widgets/TreemapWidget';
import { schema as radarSchema, meta as radarMeta } from './widgets/RadarChartWidget';
import { schema as stackedSchema, meta as stackedMeta } from './widgets/StackedAreaWidget';
import { schema as tableSchema, meta as tableMeta } from './widgets/DataTableWidget';
import { schema as monthSchema, meta as monthMeta } from './widgets/MonthCardsWidget';

const LazyDonut = lazy(() => import('./widgets/DonutChartWidget'));
const LazyBar = lazy(() => import('./widgets/BarChartWidget'));
const LazyKpi = lazy(() => import('./widgets/KpiCardWidget'));
const LazyTopN = lazy(() => import('./widgets/TopNCardsWidget'));
const LazyCategory = lazy(() => import('./widgets/CategoryListWidget'));
const LazyTreemap = lazy(() => import('./widgets/TreemapWidget'));
const LazyRadar = lazy(() => import('./widgets/RadarChartWidget'));
const LazyStacked = lazy(() => import('./widgets/StackedAreaWidget'));
const LazyTable = lazy(() => import('./widgets/DataTableWidget'));
const LazyMonth = lazy(() => import('./widgets/MonthCardsWidget'));

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  'donut-chart': { meta: donutMeta, schema: donutSchema, component: LazyDonut },
  'bar-chart': { meta: barMeta, schema: barSchema, component: LazyBar },
  'kpi-cards': { meta: kpiMeta, schema: kpiSchema, component: LazyKpi },
  'top-n-cards': { meta: topNMeta, schema: topNSchema, component: LazyTopN },
  'category-list': { meta: categoryMeta, schema: categorySchema, component: LazyCategory },
  'treemap': { meta: treemapMeta, schema: treemapSchema, component: LazyTreemap },
  'radar-chart': { meta: radarMeta, schema: radarSchema, component: LazyRadar },
  'stacked-area': { meta: stackedMeta, schema: stackedSchema, component: LazyStacked },
  'data-table': { meta: tableMeta, schema: tableSchema, component: LazyTable },
  'month-cards': { meta: monthMeta, schema: monthSchema, component: LazyMonth },
};

export const WIDGET_IDS = Object.keys(WIDGET_REGISTRY);

export function getWidgetMetas(): (WidgetMeta & { id: string })[] {
  return Object.entries(WIDGET_REGISTRY).map(([id, def]) => ({ ...def.meta, id }));
}
