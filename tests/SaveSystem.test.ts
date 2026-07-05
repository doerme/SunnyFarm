import { beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_INVENTORY, SAVE_KEY, SAVE_VERSION } from '../src/constants/gameRules';
import { SaveSystem } from '../src/systems/SaveSystem';
import type { GameState } from '../src/types/game';

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  clear(): void {
    this.values.clear();
  }
}

describe('SaveSystem', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('window', { localStorage: storage });
  });

  it('returns default state when no save exists', () => {
    const state = new SaveSystem().load();

    expect(state.day).toBe(1);
    expect(state.inventory).toEqual(INITIAL_INVENTORY);
  });

  it('saves and loads game state', () => {
    const save = new SaveSystem();
    const state: GameState = {
      version: SAVE_VERSION,
      day: 4,
      inventory: { coin: 80, feed: 7, egg: 3, chicken: 2 },
      fedChickensToday: 1,
      player: { x: 150, y: 200 }
    };

    save.save(state);

    expect(save.load()).toEqual(state);
  });

  it('clears corrupted or outdated saves back to defaults', () => {
    storage.setItem(SAVE_KEY, JSON.stringify({ version: 0, inventory: { coin: 999 } }));

    const state = new SaveSystem().load();

    expect(state.version).toBe(SAVE_VERSION);
    expect(state.inventory).toEqual(INITIAL_INVENTORY);
  });
});

