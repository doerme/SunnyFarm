# 技术架构

## 技术选型

- 引擎：Phaser 4
- 语言：TypeScript
- 构建工具：Vite
- 渲染目标：Web
- 数据格式：JSON

Phaser 4 作为项目基础引擎，用于场景、渲染、输入、动画、tilemap、音频和游戏循环。项目架构需要把游戏规则与 Phaser Scene 生命周期分离，避免玩法逻辑难以测试和复用。

## 设计原则

- Scene 负责生命周期、资源加载、对象装配和转场。
- System 负责核心玩法规则，例如农田、时间、背包和存档。
- Entity 负责游戏对象状态和表现绑定。
- Data 负责配置，不把作物数值硬编码到逻辑里。
- UI 通过订阅游戏状态刷新，避免直接修改核心系统内部数据。

## 推荐目录

```text
src/
  main.ts
  gameConfig.ts
  scenes/
    BootScene.ts
    PreloadScene.ts
    FarmScene.ts
    UIScene.ts
  systems/
    TimeSystem.ts
    FarmSystem.ts
    InventorySystem.ts
    ToolSystem.ts
    SaveSystem.ts
  entities/
    Player.ts
    Crop.ts
    InteractableTile.ts
  ui/
    Hud.ts
    Toolbelt.ts
  data/
    crops.json
    tools.json
    economy.json
  types/
    game.ts
```

## 场景职责

### BootScene

- 初始化全局设置。
- 准备存档、输入和语言配置。
- 跳转到 PreloadScene。

### PreloadScene

- 加载 tileset、sprite atlas、音频和 JSON 配置。
- 显示加载进度。
- 资源加载完成后进入 FarmScene。

### FarmScene

- 创建地图和碰撞层。
- 创建玩家与农场对象。
- 装配核心系统。
- 处理世界输入和交互。

### UIScene

- 展示 HUD、工具栏、背包入口和提示信息。
- 监听游戏状态事件。
- 不直接拥有农场规则。

## 核心系统

### TimeSystem

职责：

- 管理游戏内日期、时钟和日夜推进。
- 派发 `dayStarted`、`dayEnded`、`timeChanged` 事件。
- 触发每日作物成长结算。

### FarmSystem

职责：

- 管理农田格子状态。
- 处理翻土、播种、浇水、收获。
- 根据作物配置推进成长。

### InventorySystem

职责：

- 维护物品数量。
- 提供增加、减少、检查库存的接口。
- 派发库存变化事件。

### ToolSystem

职责：

- 管理当前工具。
- 定义工具消耗和可执行动作。
- 根据玩家输入调用对应系统。

### SaveSystem

职责：

- 将农场、背包、时间和玩家状态序列化。
- 首版使用 `localStorage`。
- 保持存档版本号，便于后续迁移。

## 数据驱动配置

作物配置示例：

```json
{
  "sunflower": {
    "name": "向日葵",
    "growthDays": 3,
    "seedItemId": "sunflower_seed",
    "harvestItemId": "sunflower",
    "seedPrice": 10,
    "sellPrice": 25
  }
}
```

## 事件模型

建议使用轻量事件总线连接系统和 UI：

- `time:changed`
- `day:started`
- `day:ended`
- `inventory:changed`
- `farm:tileChanged`
- `tool:selected`
- `save:completed`

## 存档结构

```json
{
  "version": 1,
  "time": {
    "day": 1,
    "minutes": 360
  },
  "player": {
    "x": 10,
    "y": 12,
    "stamina": 100
  },
  "inventory": {},
  "farmTiles": []
}
```

## 测试策略

- 纯逻辑系统优先写单元测试，例如作物成长、库存扣减、存档迁移。
- Scene 相关行为以集成测试和手动验收为主。
- 每个垂直切片需要一份最短验收清单。

## 性能注意事项

- 大量 tile 和 sprite 由 tilemap 与 sprite atlas 管理。
- 避免每帧扫描所有农田地块，改为在日结或交互时更新。
- UI 仅在状态变化时刷新。
- 动画和粒子效果先服务反馈，不提前复杂化。

