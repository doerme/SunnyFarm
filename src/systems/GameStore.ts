import { SAVE_VERSION } from '../constants/gameRules';
import type { GameState, PlayerPosition, TradeResult } from '../types/game';
import { ChickenSystem } from './ChickenSystem';
import { InventorySystem } from './InventorySystem';
import { SaveSystem } from './SaveSystem';
import { ShopSystem } from './ShopSystem';
import { TimeSystem } from './TimeSystem';

export class GameStore {
  private state: GameState;
  private inventory: InventorySystem;
  private chicken: ChickenSystem;
  private shop: ShopSystem;
  private time: TimeSystem;

  constructor(private readonly saveSystem: SaveSystem) {
    this.state = this.saveSystem.load();
    this.inventory = new InventorySystem(this.state.inventory);
    this.chicken = new ChickenSystem(this.inventory, this.state.fedChickensToday);
    this.shop = new ShopSystem(this.inventory);
    this.time = new TimeSystem(this.state.day);
    this.commit();
  }

  getState(): GameState {
    return {
      version: this.state.version,
      day: this.state.day,
      inventory: { ...this.state.inventory },
      fedChickensToday: this.state.fedChickensToday,
      player: { ...this.state.player }
    };
  }

  getHungryChickens(): number {
    return this.chicken.getHungryChickens();
  }

  feedChicken(): TradeResult {
    const result = this.chicken.feedOneChicken();
    this.commit();
    return result;
  }

  sleepToNextDay(): TradeResult {
    const eggsProduced = this.chicken.endDay();
    const day = this.time.nextDay();
    this.commit();
    return {
      ok: true,
      message: eggsProduced > 0 ? `第 ${day} 天，收到了 ${eggsProduced} 个鸡蛋` : `第 ${day} 天，没有新的鸡蛋`
    };
  }

  buyFeed(): TradeResult {
    const result = this.shop.buyFeed();
    this.commit();
    return result;
  }

  buyChicken(): TradeResult {
    const result = this.shop.buyChicken();
    this.commit();
    return result;
  }

  sellEgg(): TradeResult {
    const result = this.shop.sellEgg();
    this.commit();
    return result;
  }

  sellChicken(): TradeResult {
    const result = this.shop.sellChicken();
    this.commit();
    return result;
  }

  setPlayerPosition(player: PlayerPosition): void {
    this.state.player = {
      x: Math.round(player.x),
      y: Math.round(player.y)
    };
    this.commit();
  }

  reset(): GameState {
    this.state = this.saveSystem.clear();
    this.inventory = new InventorySystem(this.state.inventory);
    this.chicken = new ChickenSystem(this.inventory, this.state.fedChickensToday);
    this.shop = new ShopSystem(this.inventory);
    this.time = new TimeSystem(this.state.day);
    this.commit();
    return this.getState();
  }

  private commit(): void {
    this.state = {
      version: SAVE_VERSION,
      day: this.time.getDay(),
      inventory: this.inventory.snapshot(),
      fedChickensToday: this.chicken.getFedChickensToday(),
      player: { ...this.state.player }
    };
    this.saveSystem.save(this.state);
  }
}

