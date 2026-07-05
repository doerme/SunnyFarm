import Phaser from 'phaser';
import { PLAYER_SPEED } from '../constants/gameRules';
import { GameStore } from '../systems/GameStore';
import { SaveSystem } from '../systems/SaveSystem';
import type { GameState, TradeResult } from '../types/game';

interface JoystickVector {
  x: number;
  y: number;
}

type InteractionTarget = 'coop' | 'shop' | null;

export class FarmScene extends Phaser.Scene {
  private store!: GameStore;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private joystick: JoystickVector = { x: 0, y: 0 };
  private moveTarget: Phaser.Math.Vector2 | null = null;
  private currentTarget: InteractionTarget = null;
  private lastSavedX = 0;
  private lastSavedY = 0;

  constructor() {
    super('FarmScene');
  }

  create(): void {
    this.store = new GameStore(new SaveSystem());
    this.registry.set('store', this.store);

    this.createWorld();
    this.createPlayer(this.store.getState());
    this.setupInput();
    this.setupEvents();

    this.scene.launch('UIScene');
    this.emitStateChanged();
    this.showMessage('欢迎来到太阳农场');
  }

  update(_time: number, delta: number): void {
    this.updateMovement(delta);
    this.updateInteractionTarget();
  }

  private createWorld(): void {
    this.add.rectangle(195, 422, 390, 844, 0x8ed47a);
    this.drawTiledGround(8, 112, 24, 34, 406);

    for (let y = 112; y < 760; y += 48) {
      for (let x = 34; x < 380; x += 48) {
        const tint = (x + y) % 96 === 0 ? 0x87cb72 : 0x95da7f;
        this.add.rectangle(x, y, 44, 44, tint).setAlpha(0.35);
      }
    }

    this.add.rectangle(195, 705, 390, 92, 0xd6b36b);
    this.add.rectangle(195, 705, 390, 18, 0xc79c56).setAlpha(0.45);
    this.add.rectangle(195, 288, 330, 190, 0x6fb867).setAlpha(0.55);

    this.drawPixelBuilding(104, 236, 0xb55a32, 0xef6349, 0x5b3b2d);
    this.drawPixelBuilding(292, 236, 0xf5df88, 0x4f86cf, 0x6a4630);

    this.add.text(104, 292, '鸡舍', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#3a291b',
      stroke: '#fff3c7',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(3);

    this.add.text(292, 298, '商店', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#1f355c',
      stroke: '#fff3c7',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(3);

    this.add.image(50, 510, 'oga-overworld', 246).setScale(3.4).setDepth(3);
    this.add.image(338, 524, 'oga-overworld', 246).setScale(3.4).setDepth(3);
    this.add.image(72, 114, 'oga-overworld', 246).setScale(2.8).setDepth(3);
    this.add.image(58, 126, 'oga-overworld', 286).setScale(2.8).setDepth(2);

    this.add.rectangle(104, 318, 130, 70, 0xffffff, 0.001).setName('coop-zone');
    this.add.rectangle(292, 322, 130, 78, 0xffffff, 0.001).setName('shop-zone');
  }

  private createPlayer(state: GameState): void {
    this.player = this.physics.add.sprite(state.player.x, state.player.y, 'oga-character', 34);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.player.setDepth(10);
    this.player.body.setSize(24, 28);
    this.player.body.setOffset(4, 2);
    this.lastSavedX = state.player.x;
    this.lastSavedY = state.player.y;
  }

  private drawTiledGround(startX: number, startY: number, tileSize: number, rows: number, frame: number): void {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < 17; x += 1) {
        this.add.image(startX + x * tileSize, startY + y * tileSize, 'oga-overworld', frame)
          .setScale(1.5)
          .setAlpha(0.36)
          .setDepth(0);
      }
    }
  }

  private drawPixelBuilding(
    centerX: number,
    centerY: number,
    wallTint: number,
    roofTint: number,
    trimTint: number
  ): void {
    const tileScale = 2.8;
    const tile = 16 * tileScale;
    const left = centerX - tile;
    const top = centerY - tile * 0.5;

    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        this.add.image(left + col * tile, top + row * tile, 'oga-overworld', 405)
          .setScale(tileScale)
          .setTint(wallTint)
          .setDepth(2);
      }
    }

    for (let col = 0; col < 3; col += 1) {
      this.add.image(left + col * tile, top - tile * 0.72, 'oga-overworld', 324)
        .setScale(tileScale)
        .setTint(roofTint)
        .setDepth(3);
    }

    this.add.image(centerX, centerY + tile * 0.46, 'oga-overworld', 492)
      .setScale(tileScale)
      .setTint(trimTint)
      .setDepth(4);
    this.add.image(centerX - tile * 0.62, centerY - tile * 0.08, 'oga-overworld', 451)
      .setScale(tileScale * 0.72)
      .setTint(trimTint)
      .setDepth(4);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    }) as Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const isUiArea = pointer.y < 126 || pointer.y > 650;
      if (!isUiArea) {
        this.moveTarget = new Phaser.Math.Vector2(pointer.x, pointer.y);
      }
    });
  }

  private setupEvents(): void {
    const events = this.game.events;
    events.on('ui:joystick', (vector: JoystickVector) => {
      this.joystick = vector;
    });
    events.on('ui:interact', () => this.handleInteract());
    events.on('ui:sleep', () => this.applyResult(this.store.sleepToNextDay()));
    events.on('ui:new-game', () => this.resetGame());
    events.on('ui:shop-buy-feed', () => this.applyResult(this.store.buyFeed()));
    events.on('ui:shop-buy-chicken', () => this.applyResult(this.store.buyChicken()));
    events.on('ui:shop-sell-egg', () => this.applyResult(this.store.sellEgg()));
    events.on('ui:shop-sell-chicken', () => this.applyResult(this.store.sellChicken()));

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      events.removeAllListeners('ui:joystick');
      events.removeAllListeners('ui:interact');
      events.removeAllListeners('ui:sleep');
      events.removeAllListeners('ui:new-game');
      events.removeAllListeners('ui:shop-buy-feed');
      events.removeAllListeners('ui:shop-buy-chicken');
      events.removeAllListeners('ui:shop-sell-egg');
      events.removeAllListeners('ui:shop-sell-chicken');
    });
  }

  private updateMovement(delta: number): void {
    const keyboardVector = this.getKeyboardVector();
    const inputVector = {
      x: this.joystick.x || keyboardVector.x,
      y: this.joystick.y || keyboardVector.y
    };

    const length = Math.hypot(inputVector.x, inputVector.y);
    if (length > 0) {
      this.moveTarget = null;
      const normalizedX = inputVector.x / length;
      const normalizedY = inputVector.y / length;
      this.player.x += normalizedX * PLAYER_SPEED * (delta / 1000);
      this.player.y += normalizedY * PLAYER_SPEED * (delta / 1000);
      this.player.setFlipX(normalizedX < -0.05);
    } else if (this.moveTarget) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
      if (distance < 6) {
        this.moveTarget = null;
      } else {
        const step = Math.min(distance, PLAYER_SPEED * (delta / 1000));
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.moveTarget.x, this.moveTarget.y);
        this.player.x += Math.cos(angle) * step;
        this.player.y += Math.sin(angle) * step;
        this.player.setFlipX(Math.cos(angle) < -0.05);
      }
    }

    this.player.x = Phaser.Math.Clamp(this.player.x, 24, 366);
    this.player.y = Phaser.Math.Clamp(this.player.y, 120, 760);
    this.maybeSavePlayerPosition();
  }

  private getKeyboardVector(): JoystickVector {
    const left = this.cursors?.left.isDown || this.wasd?.left.isDown;
    const right = this.cursors?.right.isDown || this.wasd?.right.isDown;
    const up = this.cursors?.up.isDown || this.wasd?.up.isDown;
    const down = this.cursors?.down.isDown || this.wasd?.down.isDown;

    return {
      x: (right ? 1 : 0) - (left ? 1 : 0),
      y: (down ? 1 : 0) - (up ? 1 : 0)
    };
  }

  private updateInteractionTarget(): void {
    const previous = this.currentTarget;
    const nearCoop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 104, 292) < 98;
    const nearShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 292, 298) < 104;

    this.currentTarget = nearCoop ? 'coop' : nearShop ? 'shop' : null;
    if (previous !== this.currentTarget) {
      this.game.events.emit('farm:near-interaction', this.currentTarget);
    }
  }

  private handleInteract(): void {
    if (this.currentTarget === 'coop') {
      this.applyResult(this.store.feedChicken());
      return;
    }

    if (this.currentTarget === 'shop') {
      this.game.events.emit('ui:shop-open');
      return;
    }

    this.showMessage('靠近鸡舍或商店再互动');
  }

  private applyResult(result: TradeResult): void {
    this.emitStateChanged();
    this.showMessage(result.message);
  }

  private resetGame(): void {
    const state = this.store.reset();
    this.player.setPosition(state.player.x, state.player.y);
    this.emitStateChanged();
    this.showMessage('新的一天，从一只鸡开始');
  }

  private emitStateChanged(): void {
    this.game.events.emit('state:changed', this.store.getState(), this.store.getHungryChickens());
  }

  private showMessage(message: string): void {
    this.game.events.emit('farm:message', message);
  }

  private maybeSavePlayerPosition(): void {
    if (Math.abs(this.player.x - this.lastSavedX) + Math.abs(this.player.y - this.lastSavedY) < 18) {
      return;
    }

    this.lastSavedX = this.player.x;
    this.lastSavedY = this.player.y;
    this.store.setPlayerPosition({ x: this.player.x, y: this.player.y });
  }
}
