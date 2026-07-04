# 太阳农场

太阳农场是一个基于 Phaser 4 的 2D 养成游戏项目。玩家在明亮的像素农场中开垦土地、种植作物、收集资源、建设设施，并通过每日循环逐步扩展自己的小农场。

- 项目类型：养成游戏 / 2D 像素农场
- 仓库地址：https://github.com/doerme/SunnyFarm
- 游戏引擎：https://phaser.io/phaser4
- 初始素材来源：https://opengameart.org/content/zelda-like-tilesets-and-sprites
- 开发技巧参考：https://github.com/donchitos/claude-code-game-studios

## 项目目标

1. 构建一个可持续迭代的小型农场养成核心循环。
2. 优先完成可玩的垂直切片：移动、地图、种植、成长、收获、背包和基础 UI。
3. 使用清晰的游戏状态与场景架构，方便后续扩展天气、NPC、建造、任务和经济系统。
4. 保持素材、代码、设计文档的来源和许可证清晰可追踪。

## 初始范围

首个版本聚焦一个白天农场场景：

- 玩家角色可在 tilemap 地图上移动。
- 可交互地块支持翻土、播种、浇水、成长和收获。
- 作物从种子成长为可收获状态。
- 背包记录种子、作物和基础资源。
- 简单 HUD 展示日期、时间、体力、金币和当前工具。
- 存档系统保存农场状态。

暂不纳入首个垂直切片：

- 多地图世界。
- 复杂 NPC 好感度。
- 联机玩法。
- 完整剧情线。
- 高级经济模拟。

## 文档索引

- [游戏设计概览](docs/design/game-design.md)
- [技术架构](docs/architecture/technical-architecture.md)
- [素材与许可证](docs/production/assets-and-licenses.md)
- [开发流程](docs/production/development-workflow.md)

## 推荐目录结构

```text
SunnyFarm/
  assets/
    art/
    audio/
    tilemaps/
  docs/
    architecture/
    design/
    production/
  src/
    scenes/
    systems/
    entities/
    ui/
    data/
  tests/
```

## 开发原则

- 先做最小可玩循环，再扩内容。
- 所有规则尽量数据驱动，例如作物成长时间、售价、种子成本。
- 游戏对象和系统解耦，避免把所有逻辑塞进单个 Scene。
- 每次添加玩法都更新对应设计或技术文档。
- 外部素材必须记录来源、作者和许可证。

