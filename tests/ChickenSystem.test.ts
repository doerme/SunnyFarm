import { describe, expect, it } from 'vitest';
import { InventorySystem } from '../src/systems/InventorySystem';
import { ChickenSystem } from '../src/systems/ChickenSystem';
import type { InventoryState } from '../src/types/game';

function createSystems(inventory: InventoryState, fedChickensToday = 0) {
  const inventorySystem = new InventorySystem(inventory);
  return {
    inventorySystem,
    chickenSystem: new ChickenSystem(inventorySystem, fedChickensToday)
  };
}

describe('ChickenSystem', () => {
  it('feeds one hungry chicken by spending one feed', () => {
    const inventory: InventoryState = { coin: 0, feed: 2, egg: 0, chicken: 1 };
    const { chickenSystem } = createSystems(inventory);

    const result = chickenSystem.feedOneChicken();

    expect(result.ok).toBe(true);
    expect(inventory.feed).toBe(1);
    expect(chickenSystem.getFedChickensToday()).toBe(1);
    expect(chickenSystem.getHungryChickens()).toBe(0);
  });

  it('does not feed more chickens than owned in one day', () => {
    const inventory: InventoryState = { coin: 0, feed: 2, egg: 0, chicken: 1 };
    const { chickenSystem } = createSystems(inventory);

    chickenSystem.feedOneChicken();
    const secondFeed = chickenSystem.feedOneChicken();

    expect(secondFeed.ok).toBe(false);
    expect(inventory.feed).toBe(1);
    expect(chickenSystem.getFedChickensToday()).toBe(1);
  });

  it('turns fed chickens into eggs at day end', () => {
    const inventory: InventoryState = { coin: 0, feed: 3, egg: 0, chicken: 2 };
    const { chickenSystem } = createSystems(inventory);

    chickenSystem.feedOneChicken();
    chickenSystem.feedOneChicken();
    const produced = chickenSystem.endDay();

    expect(produced).toBe(2);
    expect(inventory.egg).toBe(2);
    expect(chickenSystem.getFedChickensToday()).toBe(0);
  });
});

