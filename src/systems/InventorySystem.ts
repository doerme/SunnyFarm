import type { InventoryState, ItemId } from '../types/game';

export class InventorySystem {
  constructor(private readonly inventory: InventoryState) {}

  get(item: ItemId): number {
    return this.inventory[item];
  }

  add(item: ItemId, amount: number): void {
    this.assertWholeAmount(amount);
    this.inventory[item] += amount;
  }

  canSpend(item: ItemId, amount: number): boolean {
    this.assertWholeAmount(amount);
    return this.inventory[item] >= amount;
  }

  spend(item: ItemId, amount: number): boolean {
    if (!this.canSpend(item, amount)) {
      return false;
    }

    this.inventory[item] -= amount;
    return true;
  }

  snapshot(): InventoryState {
    return { ...this.inventory };
  }

  private assertWholeAmount(amount: number): void {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new Error(`Inventory amounts must be non-negative integers. Received ${amount}.`);
    }
  }
}

