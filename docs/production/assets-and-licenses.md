# 素材与许可证

## 初始素材

- 名称：Zelda-like tilesets and sprites
- 来源：https://opengameart.org/content/zelda-like-tilesets-and-sprites
- 作者：ArMM1998
- 许可证：CC0

该素材适合作为太阳农场早期原型的像素 tileset、角色和环境资源。虽然 CC0 允许较自由地使用和修改素材，项目仍应在文档中保留来源记录，方便追踪和替换。

## 素材使用原则

- 所有第三方素材必须记录来源、作者、许可证和下载日期。
- 修改后的素材需要保留原始来源说明。
- 商业化或发布前需要重新审查所有素材许可证。
- 素材文件名应表达用途，避免保留难以理解的临时命名。

## 推荐目录

```text
assets/
  art/
    source/
    sprites/
    tilesets/
    ui/
  audio/
    music/
    sfx/
  tilemaps/
  licenses/
```

## 资产清单模板

| 资产 | 路径 | 来源 | 作者 | 许可证 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Zelda-like tilesets and sprites | assets/art/source/ | OpenGameArt | ArMM1998 | CC0 | 初始原型素材 |

## 导入规范

- tileset 原图保留在 `assets/art/source/`。
- Phaser 可直接使用的切图、图集或压缩版本放在 `assets/art/tilesets/` 或 `assets/art/sprites/`。
- tilemap 文件放在 `assets/tilemaps/`。
- 若使用 TexturePacker 或类似工具生成 atlas，需要提交源图和生成配置。

