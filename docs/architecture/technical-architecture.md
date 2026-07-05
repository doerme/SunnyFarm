# 技术架构

## 技术选型

- 引擎：Phaser 4
- 语言：TypeScript
- 构建工具：Vite
- 渲染目标：移动端 Web
- 数据格式：TypeScript 常量与 JSON

Phaser 4 作为项目基础引擎，用于场景、渲染、输入、动画、音频和游戏循环。项目架构需要把游戏规则与 Phaser Scene 生命周期分离，避免玩法逻辑难以测试和复用。

## 设计原则

- Scene 负责生命周期、资源加载、对象装配和转场。
- System 负责核心玩法规则，例如养鸡、商店、时间、背包和存档。
- Data 负责配置，不把交易价格和产蛋规则硬编码到多个地方。
- UI 通过订阅游戏状态刷新，避免直接修改核心系统内部数据。
- 首版优先移动端触摸体验，键盘输入只作为桌面调试辅助。

## 当前目录

```text
src/
  main.ts
  gameConfig.ts
  constants/
    gameRules.ts
  scenes/
    BootScene.ts
    PreloadScene.ts
    FarmScene.ts
    UIScene.ts
  systems/
    ChickenSystem.ts
    GameStore.ts
    InventorySystem.ts
    SaveSystem.ts
    ShopSystem.ts
    TimeSystem.ts
  types/
    game.ts
tests/
```

## 场景职责

### BootScene

- 初始化场景流程。
- 跳转到 PreloadScene。

### PreloadScene

- 创建首版占位像素纹理。
- 后续可替换为 tileset、sprite atlas、音频和 JSON 配置加载。
- 资源准备完成后进入 FarmScene。

### FarmScene

- 创建地图、玩家、鸡舍和商店。
- 装配核心系统。
- 处理触摸摇杆、键盘调试输入和世界交互。
- 根据玩家距离决定当前可交互目标。

### UIScene

- 展示 HUD、触摸摇杆、互动按钮、商店面板和提示信息。
- 监听游戏状态事件。
- 不直接拥有养鸡或商店规则。

## 核心系统

### TimeSystem

职责：

- 管理游戏内天数。
- 提供进入下一天的接口。
- 由 GameStore 协调每日产蛋结算。

### ChickenSystem

职责：

- 管理当天已喂鸡数量。
- 处理喂鸡校验和饲料消耗。
- 在日结时把已喂鸡数量转化为鸡蛋。

### InventorySystem

职责：

- 维护物品数量。
- 提供增加、减少、检查库存的接口。
- 保障库存数量为非负整数。

### ShopSystem

职责：

- 处理购买饲料、购买鸡、出售鸡蛋和出售鸡。
- 校验金币或库存是否足够。
- 返回可展示给玩家的交易结果。

### SaveSystem

职责：

- 将背包、天数、喂鸡状态和玩家位置序列化。
- 首版使用 `localStorage`。
- 保持存档版本号，便于后续迁移。

### GameStore

职责：

- 组合 TimeSystem、ChickenSystem、InventorySystem、ShopSystem 和 SaveSystem。
- 暴露 Scene 可直接调用的高层玩法接口。
- 每次状态变化后自动保存。

## 数据驱动配置

首版经济配置位于 `src/constants/gameRules.ts`：

```json
{
  "buyChicken": 60,
  "sellChicken": 40,
  "buyFeed": 3,
  "sellEgg": 8
}
```

## 事件模型

使用 Phaser 全局事件连接 FarmScene 和 UIScene：

- `state:changed`
- `farm:near-interaction`
- `farm:message`
- `ui:joystick`
- `ui:interact`
- `ui:sleep`
- `ui:new-game`
- `ui:shop-open`
- `ui:shop-close`
- `ui:shop-buy-feed`
- `ui:shop-buy-chicken`
- `ui:shop-sell-egg`
- `ui:shop-sell-chicken`

## 存档结构

```json
{
  "version": 1,
  "day": 1,
  "player": {
    "x": 192,
    "y": 610
  },
  "inventory": {
    "coin": 30,
    "feed": 3,
    "egg": 0,
    "chicken": 1
  },
  "fedChickensToday": 0
}
```

## 测试策略

- 纯逻辑系统优先写单元测试，例如喂鸡产蛋、商店交易、库存扣减、存档迁移。
- Scene 相关行为以浏览器验收为主。
- 每个垂直切片需要一份最短验收清单。

## 性能注意事项

- UI 仅在状态变化时刷新。
- 避免每帧扫描所有养成对象，改为在日结或交互时更新。
- 动画和粒子效果先服务反馈，不提前复杂化。

