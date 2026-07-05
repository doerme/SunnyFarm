import type { TradeResult } from '../types/game';
import { InventorySystem } from './InventorySystem';

export class ChickenSystem {
  constructor(
    private readonly inventory: InventorySystem,
    private fedChickensToday: number
  ) {}

  getFedChickensToday(): number {
    return this.fedChickensToday;
  }

  getHungryChickens(): number {
    return Math.max(0, this.inventory.get('chicken') - this.fedChickensToday);
  }

  feedOneChicken(): TradeResult {
    if (this.inventory.get('chicken') <= 0) {
      return { ok: false, message: '还没有鸡，先去商店买一只吧' };
    }

    if (this.getHungryChickens() <= 0) {
      return { ok: false, message: '今天所有鸡都已经吃饱了' };
    }

    if (!this.inventory.spend('feed', 1)) {
      return { ok: false, message: '饲料不够，去商店买一些' };
    }

    this.fedChickensToday += 1;
    return { ok: true, message: '喂了一只鸡，明天会有鸡蛋' };
  }

  endDay(): number {
    const eggsProduced = Math.min(this.fedChickensToday, this.inventory.get('chicken'));
    this.inventory.add('egg', eggsProduced);
    this.fedChickensToday = 0;
    return eggsProduced;
  }

  resetFedCount(): void {
    this.fedChickensToday = 0;
  }
}

