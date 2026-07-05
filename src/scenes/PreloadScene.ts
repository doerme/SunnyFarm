import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    this.load.spritesheet('oga-overworld', '/assets/opengameart/zelda-like/Overworld.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('oga-objects', '/assets/opengameart/zelda-like/objects.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('oga-character', '/assets/opengameart/zelda-like/character.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('oga-npc', '/assets/opengameart/zelda-like/NPC_test.png', {
      frameWidth: 16,
      frameHeight: 16,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('lpc-chicken', '/assets/opengameart/lpc-chicken-rework/chicken.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('green-cap-farmer', '/assets/opengameart/green-cap-character-16x18/green-cap-character.png', {
      frameWidth: 16,
      frameHeight: 18,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('lpc-medieval-decor', '/assets/opengameart/lpc-medieval-village-decorations/decorations-medieval.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0
    });
    this.load.spritesheet('lpc-medieval-fence', '/assets/opengameart/lpc-medieval-village-decorations/fence_medieval.png', {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0
    });
    this.load.image('animal-shed', '/assets/opengameart/lpc-medieval-village-decorations/animal-shed.png');
    this.load.image('market-stall', '/assets/opengameart/lpc-medieval-village-decorations/market-stall.png');
    this.load.image('market-tent', '/assets/opengameart/lpc-medieval-village-decorations/market-tent.png');
    this.createPixelTextures();
  }

  create(): void {
    this.scene.start('FarmScene');
  }

  private createPixelTextures(): void {
    this.createPlayerTexture();
    this.createChickenTexture();
    this.createCoopTexture();
    this.createShopTexture();
    this.createTreeTexture();
  }

  private createPlayerTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x305cde, 1);
    graphics.fillRoundedRect(8, 14, 20, 22, 4);
    graphics.fillStyle(0xffd39a, 1);
    graphics.fillCircle(18, 9, 8);
    graphics.fillStyle(0x3a2b1d, 1);
    graphics.fillRect(11, 2, 14, 5);
    graphics.fillStyle(0x1d2d50, 1);
    graphics.fillRect(9, 34, 7, 8);
    graphics.fillRect(20, 34, 7, 8);
    graphics.generateTexture('player', 36, 44);
    graphics.destroy();
  }

  private createChickenTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillEllipse(18, 21, 26, 20);
    graphics.fillCircle(25, 12, 9);
    graphics.fillStyle(0xffcf42, 1);
    graphics.fillTriangle(32, 12, 40, 16, 32, 19);
    graphics.fillStyle(0xd83535, 1);
    graphics.fillCircle(23, 4, 4);
    graphics.fillCircle(27, 5, 4);
    graphics.fillStyle(0x2d2926, 1);
    graphics.fillCircle(27, 11, 2);
    graphics.fillStyle(0xc57937, 1);
    graphics.fillRect(13, 30, 3, 7);
    graphics.fillRect(23, 30, 3, 7);
    graphics.generateTexture('chicken', 44, 40);
    graphics.destroy();
  }

  private createCoopTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x8b4e2e, 1);
    graphics.fillRect(9, 24, 70, 48);
    graphics.fillStyle(0xd9563a, 1);
    graphics.fillTriangle(4, 26, 44, 0, 84, 26);
    graphics.fillStyle(0xf3c16b, 1);
    graphics.fillRect(36, 44, 17, 28);
    graphics.fillStyle(0x5a3426, 1);
    graphics.fillRect(18, 34, 16, 14);
    graphics.fillRect(56, 34, 13, 13);
    graphics.generateTexture('coop', 88, 76);
    graphics.destroy();
  }

  private createShopTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xf5df88, 1);
    graphics.fillRect(7, 24, 78, 52);
    graphics.fillStyle(0x4c85cf, 1);
    graphics.fillTriangle(2, 26, 46, 0, 90, 26);
    graphics.fillStyle(0x2d5d8c, 1);
    graphics.fillRect(14, 35, 28, 22);
    graphics.fillStyle(0x7b4a2f, 1);
    graphics.fillRect(54, 43, 18, 33);
    graphics.generateTexture('shop', 92, 80);
    graphics.destroy();
  }

  private createTreeTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x8a5a35, 1);
    graphics.fillRect(22, 28, 12, 26);
    graphics.fillStyle(0x2f8f4e, 1);
    graphics.fillCircle(18, 24, 16);
    graphics.fillCircle(32, 20, 18);
    graphics.fillCircle(42, 30, 15);
    graphics.generateTexture('tree', 60, 60);
    graphics.destroy();
  }
}
