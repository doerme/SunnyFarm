import Phaser from 'phaser';
import { PRICES } from '../constants/gameRules';
import type { GameStore } from '../systems/GameStore';
import type { GameState } from '../types/game';

interface UiButton {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
  setDisabled: (disabled: boolean) => void;
}

type InteractionTarget = 'coop' | 'shop' | null;

export class UIScene extends Phaser.Scene {
  private hudText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private interactButton!: UiButton;
  private shopPanel?: Phaser.GameObjects.Container;
  private state?: GameState;
  private hungryChickens = 0;
  private joystickBase!: Phaser.GameObjects.Arc;
  private joystickKnob!: Phaser.GameObjects.Arc;
  private joystickPointerId: number | null = null;
  private joystickOrigin = new Phaser.Math.Vector2(82, 738);

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.createHud();
    this.createControls();
    this.setupEvents();
    this.renderInitialState();
  }

  private createHud(): void {
    this.add.rectangle(195, 42, 368, 62, 0xfff0bd, 0.94)
      .setStrokeStyle(2, 0x9d7137)
      .setDepth(100);

    this.hudText = this.add.text(24, 18, '', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#3d2a18',
      lineSpacing: 4
    }).setDepth(101);

    this.hintText = this.add.text(195, 91, '', {
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: '#fff9df',
      stroke: '#45311d',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(101);

    this.messageText = this.add.text(195, 130, '', {
      fontFamily: 'sans-serif',
      fontSize: '15px',
      color: '#fff9df',
      stroke: '#31261e',
      strokeThickness: 4,
      align: 'center',
      wordWrap: { width: 330 }
    }).setOrigin(0.5).setDepth(101);

    this.createButton(330, 94, 84, 36, '下一天', 0x6b77d8, () => {
      this.game.events.emit('ui:sleep');
    });

    this.createButton(60, 94, 82, 36, '新游戏', 0xb45d4d, () => {
      this.closeShop();
      this.game.events.emit('ui:new-game');
    });
  }

  private createControls(): void {
    this.joystickBase = this.add.circle(this.joystickOrigin.x, this.joystickOrigin.y, 58, 0x26384a, 0.38)
      .setStrokeStyle(3, 0xffffff, 0.35)
      .setDepth(110);
    this.joystickKnob = this.add.circle(this.joystickOrigin.x, this.joystickOrigin.y, 24, 0xffffff, 0.72)
      .setStrokeStyle(2, 0x26384a, 0.5)
      .setDepth(111);

    this.interactButton = this.createButton(310, 736, 116, 62, '互动', 0xf0a33a, () => {
      this.game.events.emit('ui:interact');
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handleJoystickStart(pointer));
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.handleJoystickMove(pointer));
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.handleJoystickEnd(pointer));
    this.input.on('pointerupoutside', (pointer: Phaser.Input.Pointer) => this.handleJoystickEnd(pointer));
  }

  private setupEvents(): void {
    this.game.events.on('state:changed', (state: GameState, hungryChickens: number) => {
      this.state = state;
      this.hungryChickens = hungryChickens;
      this.renderState();
      this.renderShopPanel();
    });

    this.game.events.on('farm:near-interaction', (target: InteractionTarget) => {
      if (target === 'coop') {
        this.hintText.setText('鸡舍：喂鸡');
        this.interactButton.label.setText('喂鸡');
      } else if (target === 'shop') {
        this.hintText.setText('商店：买卖');
        this.interactButton.label.setText('商店');
      } else {
        this.hintText.setText('');
        this.interactButton.label.setText('互动');
      }
    });

    this.game.events.on('farm:message', (message: string) => {
      this.showMessage(message);
    });

    this.game.events.on('ui:shop-open', () => this.openShop());
    this.game.events.on('ui:shop-close', () => this.closeShop());
  }

  private renderInitialState(): void {
    const store = this.registry.get('store') as GameStore | undefined;
    if (!store) {
      return;
    }

    this.state = store.getState();
    this.hungryChickens = store.getHungryChickens();
    this.renderState();
  }

  private renderState(): void {
    if (!this.state) {
      return;
    }

    const { day, inventory, fedChickensToday } = this.state;
    this.hudText.setText(
      `第 ${day} 天  金币 ${inventory.coin}  饲料 ${inventory.feed}\n鸡 ${inventory.chicken}  已喂 ${fedChickensToday}  待喂 ${this.hungryChickens}  鸡蛋 ${inventory.egg}`
    );
  }

  private openShop(): void {
    if (this.shopPanel) {
      this.shopPanel.setVisible(true);
      this.renderShopPanel();
      return;
    }

    this.shopPanel = this.add.container(195, 424).setDepth(130);
    this.shopPanel.add(this.add.rectangle(0, 0, 338, 360, 0xfff5d6, 0.97).setStrokeStyle(3, 0x765331));
    this.shopPanel.add(this.add.text(0, -154, '农场商店', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#3b2a1f'
    }).setOrigin(0.5));

    const close = this.createButton(128, -154, 48, 34, '×', 0x7a5741, () => this.closeShop());
    this.shopPanel.add(close.container);

    const buyFeed = this.createButton(0, -88, 266, 42, `买饲料 ${PRICES.buyFeed} 金币`, 0x579c4a, () => {
      this.game.events.emit('ui:shop-buy-feed');
    });
    buyFeed.container.setName('buy-feed');
    this.shopPanel.add(buyFeed.container);

    const buyChicken = this.createButton(0, -34, 266, 42, `买鸡 ${PRICES.buyChicken} 金币`, 0xe2a13b, () => {
      this.game.events.emit('ui:shop-buy-chicken');
    });
    buyChicken.container.setName('buy-chicken');
    this.shopPanel.add(buyChicken.container);

    const sellEgg = this.createButton(0, 20, 266, 42, `卖鸡蛋 +${PRICES.sellEgg} 金币`, 0x4d8fd1, () => {
      this.game.events.emit('ui:shop-sell-egg');
    });
    sellEgg.container.setName('sell-egg');
    this.shopPanel.add(sellEgg.container);

    const sellChicken = this.createButton(0, 74, 266, 42, `卖鸡 +${PRICES.sellChicken} 金币`, 0xc96151, () => {
      this.game.events.emit('ui:shop-sell-chicken');
    });
    sellChicken.container.setName('sell-chicken');
    this.shopPanel.add(sellChicken.container);

    this.shopPanel.add(this.add.text(0, 138, '鸡每天吃 1 份饲料，睡醒后产 1 个蛋。', {
      fontFamily: 'sans-serif',
      fontSize: '14px',
      color: '#5b4431',
      align: 'center',
      wordWrap: { width: 280 }
    }).setOrigin(0.5));

    this.renderShopPanel();
  }

  private renderShopPanel(): void {
    if (!this.shopPanel || !this.state) {
      return;
    }

    const { inventory } = this.state;
    this.setNamedButtonDisabled('buy-feed', inventory.coin < PRICES.buyFeed);
    this.setNamedButtonDisabled('buy-chicken', inventory.coin < PRICES.buyChicken);
    this.setNamedButtonDisabled('sell-egg', inventory.egg < 1);
    this.setNamedButtonDisabled('sell-chicken', inventory.chicken < 1);
  }

  private closeShop(): void {
    this.shopPanel?.setVisible(false);
  }

  private setNamedButtonDisabled(name: string, disabled: boolean): void {
    const buttonContainer = this.shopPanel?.getByName(name) as Phaser.GameObjects.Container | undefined;
    const button = buttonContainer?.getData('button') as UiButton | undefined;
    button?.setDisabled(disabled);
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    color: number,
    onClick: () => void
  ): UiButton {
    const container = this.add.container(x, y).setDepth(120);
    const bg = this.add.rectangle(0, 0, width, height, color, 1).setStrokeStyle(2, 0xffffff, 0.75);
    const label = this.add.text(0, 0, text, {
      fontFamily: 'sans-serif',
      fontSize: height > 50 ? '20px' : '15px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width - 12 }
    }).setOrigin(0.5);
    let disabled = false;

    container.add([bg, label]);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', () => {
      if (!disabled) {
        onClick();
      } else {
        this.showMessage('条件不足');
      }
    });

    const button: UiButton = {
      container,
      bg,
      label,
      setDisabled: (nextDisabled: boolean) => {
        disabled = nextDisabled;
        bg.setAlpha(disabled ? 0.42 : 1);
        label.setAlpha(disabled ? 0.58 : 1);
      }
    };
    container.setData('button', button);
    return button;
  }

  private handleJoystickStart(pointer: Phaser.Input.Pointer): void {
    if (pointer.x > 170 || pointer.y < 610) {
      return;
    }

    this.joystickPointerId = pointer.id;
    this.joystickOrigin.set(pointer.x, pointer.y);
    this.joystickBase.setPosition(pointer.x, pointer.y);
    this.handleJoystickMove(pointer);
  }

  private handleJoystickMove(pointer: Phaser.Input.Pointer): void {
    if (this.joystickPointerId !== pointer.id) {
      return;
    }

    const dx = pointer.x - this.joystickOrigin.x;
    const dy = pointer.y - this.joystickOrigin.y;
    const distance = Math.min(54, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const knobX = this.joystickOrigin.x + Math.cos(angle) * distance;
    const knobY = this.joystickOrigin.y + Math.sin(angle) * distance;

    this.joystickKnob.setPosition(knobX, knobY);
    this.game.events.emit('ui:joystick', {
      x: Math.cos(angle) * (distance / 54),
      y: Math.sin(angle) * (distance / 54)
    });
  }

  private handleJoystickEnd(pointer: Phaser.Input.Pointer): void {
    if (this.joystickPointerId !== pointer.id) {
      return;
    }

    this.joystickPointerId = null;
    this.joystickOrigin.set(82, 738);
    this.joystickBase.setPosition(82, 738);
    this.joystickKnob.setPosition(82, 738);
    this.game.events.emit('ui:joystick', { x: 0, y: 0 });
  }

  private showMessage(message: string): void {
    this.messageText.setText(message);
    this.time.delayedCall(2300, () => {
      if (this.messageText.text === message) {
        this.messageText.setText('');
      }
    });
  }
}
