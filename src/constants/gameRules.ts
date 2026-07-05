import type { InventoryState } from '../types/game';

export const SAVE_VERSION = 1;
export const SAVE_KEY = 'sunny-farm-save-v1';

export const INITIAL_INVENTORY: InventoryState = {
  coin: 30,
  feed: 3,
  egg: 0,
  chicken: 1
};

export const PRICES = {
  buyChicken: 60,
  sellChicken: 40,
  buyFeed: 3,
  sellEgg: 8
} as const;

export const INITIAL_PLAYER_POSITION = {
  x: 192,
  y: 610
} as const;

export const PLAYER_SPEED = 150;

