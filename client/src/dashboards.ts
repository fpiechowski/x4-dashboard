// ─────────────────────────────────────────────────────────────────────────────
// Dashboard layout configuration
//
// Two layout modes per dashboard:
//
//   layout: 'grid'
//     columns: CSS grid-template-columns value
//     widgets: explicit col/row placements (1-based, colSpan/rowSpan optional)
//
//   layout: 'columns'
//     columns: array of column definitions, each with an optional width and
//              an ordered list of widgets that stack vertically inside it
//
// Widget IDs must match the WidgetId union type.
// scale?: visual zoom factor, default 1 (e.g. 1.5 = 150%, 0.75 = 75%)
// ─────────────────────────────────────────────────────────────────────────────

export type WidgetId =
  | 'PlayerInfo'
  | 'ShipStatus'
  | 'TargetInfo'
  | 'Navigation'
  | 'SystemFlags'
  | 'ActiveMission'
  | 'MissionOffers'
  | 'Comms'
  | 'Research'
  | 'UnderAttack'

// ── Grid layout ──────────────────────────────────────────────────────────────

export interface WidgetPlacement {
  id: WidgetId
  col: number       // 1-based grid column
  row: number       // 1-based grid row
  colSpan?: number  // default 1
  rowSpan?: number  // default 1
  scale?: number
  grow?: boolean    // align-self: stretch — fills available vertical space in the grid cell
  height?: string   // CSS height, e.g. '200px'
}

export interface GridDashboard {
  id: string
  label: string
  layout: 'grid'
  columns: string           // CSS grid-template-columns
  widgets: WidgetPlacement[]
}

// ── Columns layout ────────────────────────────────────────────────────────────

export interface ColumnWidget {
  id: WidgetId
  scale?: number
  height?: string   // CSS height, e.g. '200px', '50%'
  grow?: boolean    // flex: 1 — fills all remaining vertical space in the column
}

export interface ColumnDef {
  width?: string            // CSS width, e.g. '280px', '1fr' (default: auto)
  widgets: ColumnWidget[]
}

export interface ColumnsDashboard {
  id: string
  label: string
  layout: 'columns'
  columns: ColumnDef[]
}

export type DashboardConfig = GridDashboard | ColumnsDashboard

export const DASHBOARDS: DashboardConfig[] = [
  // ── Full Dashboard ───────────────────────────────────────────────────────
  // 4-column: missions | instruments (fixed 280px) | systems (flex) | comms
  {
    id: 'full',
    label: 'Full Dashboard',
    layout: 'grid',
    columns: '240px 280px 1fr 260px',
    widgets: [
      { id: 'ActiveMission',  col: 1, row: 1 },
      { id: 'MissionOffers',  col: 1, row: 2 },
      { id: 'PlayerInfo',     col: 2, row: 1 },
      { id: 'ShipStatus',     col: 3, row: 1, scale: 1.75 },
      { id: 'TargetInfo',     col: 3, row: 2, scale: 1.5 },
      { id: 'Navigation',     col: 2, row: 2 },
      { id: 'SystemFlags',    col: 3, row: 3 },
      { id: 'Research',       col: 4, row: 1 },
      { id: 'Comms',          col: 4, row: 2 },
    ],
  },

  // ── Flight ───────────────────────────────────────────────────────────────
  // Focus on real-time flight data. Good for a dedicated secondary screen.
  // Fixed instrument column left, flexible systems+info column right.
  {
    id: 'flight',
    label: 'Flight',
    layout: 'grid',
    columns: "30% 50% 20%",
    widgets: [
      {
        id: 'UnderAttack',
        col: 1,
        colSpan: 3,
        row: 1
      },
      {
        id: 'Navigation',
        col: 1,
        row: 1,
        rowSpan: 2,
        scale: 1,
        grow: true
      },
      {
        id: "ShipStatus",
        col: 2,
        row: 1,
        scale: 1.25,
        grow: true
      },
      {
        id: "TargetInfo",
        col: 2,
        row: 2,
        scale: 1
      },
      {
        id: "SystemFlags",
        col: 1,
        row: 3,
        colSpan: 3,
        scale: 1.5,
        grow: true
      },
      {
        id: "ActiveMission",
        col: 3,
        row: 1,
        rowSpan: 2,
        scale: 1.75,
      }
    ]
  },

  // ── Missions & Comms ─────────────────────────────────────────────────────
  // Mission management and communications. Good for a tablet or side display.
  {
    id: 'comms',
    label: 'Missions & Comms',
    layout: 'grid',
    columns: '1fr 1fr',
    widgets: [
      { id: 'ActiveMission',  col: 1, row: 1 },
      { id: 'MissionOffers',  col: 1, row: 2 },
      { id: 'Research',       col: 2, row: 1 },
      { id: 'Comms',          col: 2, row: 2 },
    ],
  },
]

export function getDashboard(id: string): DashboardConfig {
  return DASHBOARDS.find(d => d.id === id) ?? DASHBOARDS[0]
}
