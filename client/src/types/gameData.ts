export interface ConnectionMeta {
  timestamp: string;
  externalConnected: boolean;
  simpitConnected: boolean;
}

export interface PlayerInfo {
  name: string;
  faction: string;
  credits: number;
  sectorname: string;
  sectorowner: string;
}

export interface ShipStatus {
  name: string;
  class: string;
  hull: number;         // 0–100 %
  shields: number;      // 0–100 %
  shieldsUp: boolean;
  speed: number;        // m/s
  boostEnergy: number;  // 0–100 %
  isDockedOrLanded: boolean;
  landingGearDown: boolean;
  overHeating: boolean;
  inDanger: boolean;
  maxSpeed: number;
  maxBoostSpeed: number;
  fuel: number | null;
  fuelReserve: number | null;
  cargo: number;
  maxCargo: number;
  oxygen: number | null;
}

export interface Navigation {
  sector: string;
  cluster: string;
  speed: number;
  heading: number;
  coordinates: { x: number; y: number; z: number };
  inTravelMode: boolean;
  legalStatus: string;
}

export interface SystemFlags {
  flightAssist: boolean;
  seta: boolean;
  autopilot: boolean;
  boost: boolean;
  lightsOn: boolean;
  hardpointsDeployed: boolean;
  landingGearDown: boolean;
  shieldsUp: boolean;
  massLocked: boolean;
  travelDrive: boolean;
  silentRunning: boolean;
}

export interface CombatTarget {
  name: string;
  shipName: string;
  hull: number;
  shields: number;
  faction: string;
  legalStatus: string;
  isHostile: boolean;
  distance: number;
  combatRank: string;
  bounty: number;
}

export interface CombatState {
  underAttack: boolean;
  attackType: string | null;
  target: CombatTarget | null;
}

export interface DockedStation {
  stationName: string;
  stationType: string;
  faction: string;
  sector: string;
  services: string[];
}

export interface CommMessage {
  sender: string;
  content: string;
  channel: string;
  timestamp: string;
  source: string;
}

export interface MissionEntry {
  name: string;
  rewardtext: string;
  difficulty: number;
  description: string;
  objectives: string[];
  reward: number;
  duration: number;
}

export interface MissionOffer {
  id: string;
  name: string | null;
  missions: Record<string, MissionEntry>;
}

export interface MissionOffers {
  plot?: MissionOffer[];
  guild?: MissionOffer[];
  other?: MissionOffer[];
  coalition?: MissionOffer[];
}

export interface ActiveMission {
  name: string;
  description: string;
  completed: boolean;
  reward: number;
  timeleft: number;
}

export interface ResearchResource {
  name: string;
  currentAmount: number;
  totalAmount: number;
}

export interface CurrentResearch {
  name: string | null;
  description: string;
  researchtime: number;
  percentageCompleted: number;
  precursors: Array<{ name: string }>;
  resources: ResearchResource[];
}

export interface LogbookEntry {
  title: string;
  text: string;
  factionname: string;
}

export interface GameState {
  _meta: ConnectionMeta;
  player: PlayerInfo;
  ship: ShipStatus;
  navigation: Navigation;
  systems: SystemFlags;
  combat: CombatState;
  docked: DockedStation | null;
  missionOffers: MissionOffers | null;
  activeMission: ActiveMission | null;
  logbook: { list: LogbookEntry[] } | null;
  currentResearch: CurrentResearch | null;
  factions: Record<string, any> | null;
  agents: any[] | null;
  inventory: Record<string, any> | null;
  transactionLog: { list: any[] } | null;
  comms: CommMessage[];
  loadout: any | null;
}

export interface KeyBinding {
  key: string;
  modifiers: string[];
  label: string;
  description: string;
}

export interface KeyBindings {
  description: string;
  note: string;
  bindings: Record<string, KeyBinding>;
}
