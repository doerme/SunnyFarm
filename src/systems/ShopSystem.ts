import { PRICES } from '../constants/gameRules';
import type { TradeResult } from '../types/game';
import { InventorySystem } from './InventorySystem';

export class ShopSystem {
  constructor(private readonly inventory: InventorySystem) {}

  buyFeed(): TradeResult {
    if (!this.inventory.spend('coin', PRICES.buyFeed)) {
      return { ok: false, message: `金币不足，饲料需要 ${PRICES.buyFeed} 金币` };
    }

    this.inventory.add('feed', 1);
    return { ok: true, message: '买了 1 份饲料' };
  }

  buyChicken(): TradeResult {
    if (!this.inventory.spend('coin', PRICES.buyChicken)) {
      return { ok: false, message: `金币不足，小鸡需要 ${PRICES.buyChicken} 金币` };
    }

    this.inventory.add('chicken', 1);
    return { ok: true, message: '买了 1 只鸡' };
  }

  sellEgg(): TradeResult {
    if (!this.inventory.spend('egg', 1)) {
      return { ok: false, message: '没有鸡蛋可以卖' };
    }

    this.inventory.add('coin', PRICES.sellEgg);
    return { ok: true, message: `卖出 1 个鸡蛋，获得 ${PRICES.sellEgg} 金币` };
  }

  sellChicken(): TradeResult {
    if (!this.inventory.spend('chicken', 1)) {
      return { ok: false, message: '没有鸡可以卖' };
    }

    this.inventory.add('coin', PRICES.sellChicken);
    return { ok: true, message: `卖出 1 只鸡，获得 ${PRICES.sellChicken} 金币` };
  }
}

