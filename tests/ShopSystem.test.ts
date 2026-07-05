import { describe, expect, it } from 'vitest';
import { PRICES } from '../src/constants/gameRules';
import { InventorySystem } from '../src/systems/InventorySystem';
import { ShopSystem } from '../src/systems/ShopSystem';
import type { InventoryState } from '../src/types/game';

function createShop(inventory: InventoryState) {
  return new ShopSystem(new InventorySystem(inventory));
}

describe('ShopSystem', () => {
  it('buys feed when coins are available', () => {
    const inventory: InventoryState = { coin: 3, feed: 0, egg: 0, chicken: 0 };
    const result = createShop(inventory).buyFeed();

    expect(result.ok).toBe(true);
    expect(inventory.coin).toBe(0);
    expect(inventory.feed).toBe(1);
  });

  it('prevents buying chicken without enough coins', () => {
    const inventory: InventoryState = { coin: PRICES.buyChicken - 1, feed: 0, egg: 0, chicken: 0 };
    const result = createShop(inventory).buyChicken();

    expect(result.ok).toBe(false);
    expect(inventory.chicken).toBe(0);
  });

  it('sells eggs and chickens for configured prices', () => {
    const inventory: InventoryState = { coin: 0, feed: 0, egg: 1, chicken: 1 };
    const shop = createShop(inventory);

    expect(shop.sellEgg().ok).toBe(true);
    expect(shop.sellChicken().ok).toBe(true);

    expect(inventory.coin).toBe(PRICES.sellEgg + PRICES.sellChicken);
    expect(inventory.egg).toBe(0);
    expect(inventory.chicken).toBe(0);
  });
});

