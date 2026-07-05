export type ItemId = 'coin' | 'feed' | 'egg' | 'chicken';

export type InventoryState = Record<ItemId, number>;

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface GameState {
  version: number;
  day: number;
  inventory: InventoryState;
  fedChickensToday: number;
  player: PlayerPosition;
}

export interface TradeResult {
  ok: boolean;
  message: string;
}

export type GameEvent =
  | 'state:changed'
  | 'farm:near-interaction'
  | 'farm:message'
  | 'ui:joystick'
  | 'ui:interact'
  | 'ui:sleep'
  | 'ui:new-game'
  | 'ui:shop-open'
  | 'ui:shop-close'
  | 'ui:shop-buy-feed'
  | 'ui:shop-buy-chicken'
  | 'ui:shop-sell-egg'
  | 'ui:shop-sell-chicken';

