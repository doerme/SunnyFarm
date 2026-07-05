import { INITIAL_INVENTORY, INITIAL_PLAYER_POSITION, SAVE_KEY, SAVE_VERSION } from '../constants/gameRules';
import type { GameState } from '../types/game';

export class SaveSystem {
  load(): GameState {
    const fallback = this.createNewState();

    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw) as Partial<GameState>;
      if (parsed.version !== SAVE_VERSION || !parsed.inventory || !parsed.player) {
        return fallback;
      }

      return {
        version: SAVE_VERSION,
        day: this.toPositiveInteger(parsed.day, fallback.day),
        inventory: {
          coin: this.toNonNegativeInteger(parsed.inventory.coin, fallback.inventory.coin),
          feed: this.toNonNegativeInteger(parsed.inventory.feed, fallback.inventory.feed),
          egg: this.toNonNegativeInteger(parsed.inventory.egg, fallback.inventory.egg),
          chicken: this.toNonNegativeInteger(parsed.inventory.chicken, fallback.inventory.chicken)
        },
        fedChickensToday: this.toNonNegativeInteger(parsed.fedChickensToday, fallback.fedChickensToday),
        player: {
          x: this.toFiniteNumber(parsed.player.x, fallback.player.x),
          y: this.toFiniteNumber(parsed.player.y, fallback.player.y)
        }
      };
    } catch {
      return fallback;
    }
  }

  save(state: GameState): void {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  clear(): GameState {
    window.localStorage.removeItem(SAVE_KEY);
    return this.createNewState();
  }

  createNewState(): GameState {
    return {
      version: SAVE_VERSION,
      day: 1,
      inventory: { ...INITIAL_INVENTORY },
      fedChickensToday: 0,
      player: { ...INITIAL_PLAYER_POSITION }
    };
  }

  private toPositiveInteger(value: unknown, fallback: number): number {
    return Number.isInteger(value) && Number(value) > 0 ? Number(value) : fallback;
  }

  private toNonNegativeInteger(value: unknown, fallback: number): number {
    return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : fallback;
  }

  private toFiniteNumber(value: unknown, fallback: number): number {
    return Number.isFinite(value) ? Number(value) : fallback;
  }
}

