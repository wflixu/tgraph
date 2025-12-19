# Node Modules 配置说明

## 概述

本项目使用 pnpm workspace 来管理多个子包的依赖，通过优化配置实现了依赖的高效管理。

## 配置详情

### `.npmrc` 配置

```ini
registry=https://registry.npmmirror.com

# 启用依赖提升，将依赖安装到根目录的 node_modules
hoist=true
hoist-pattern[]=*

# 启用强制提升，包括开发依赖
shamefully-hoist=true

# 防止特定包被提升（避免版本冲突）
nohoist-pattern=@babel/core
nohoist-pattern=eslint
nohoist-pattern=typescript
nohoist-pattern=vitest
nohoist-pattern=@vitest
nohoist-pattern=@typescript-eslint
nohoist-pattern=tsdown
nohoist-pattern=typedoc

# 优先使用工作区包
prefer-workspace-packages=true
```

### `package.json` 工作区配置

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

## 依赖结构

### 根目录 node_modules
- 大部分共享依赖被提升到根目录
- 包括：React、Vue、工具库等
- 大小：~11MB

### 子包 node_modules
仅保留必要的本地依赖：
- **demos**: 14 items (1KB)
- **docs**: 3 items (0KB)
- **next-demo**: 13 items (0KB)
- **thgraph**: 10 items (0KB)
- **thgraph-next**: 10 items (0KB)

这些主要是开发工具，需要特定版本或避免冲突。

## 管理命令

### 检查 node_modules 结构
```bash
pnpm run check:modules
```

### 清理并重新安装依赖
```bash
pnpm run clean:modules
```

### 正常安装依赖
```bash
pnpm install
```

## 优势

1. **节省磁盘空间**：避免重复安装相同依赖
2. **提升安装速度**：减少网络请求和文件操作
3. **版本一致性**：确保共享依赖使用相同版本
4. **构建优化**：减少打包时的依赖解析时间

## 注意事项

1. 子包中的 `node_modules` 不会被提交到版本控制（已在 `.gitignore` 中配置）
2. 某些工具链可能需要特定版本的依赖，因此会保留在子包中
3. 如果遇到依赖冲突，可以通过调整 `nohoist-pattern` 来解决

## 故障排除

如果遇到依赖相关问题：

1. 清理所有 node_modules：
   ```bash
   pnpm run clean:modules
   ```

2. 检查依赖结构：
   ```bash
   pnpm run check:modules
   ```

3. 重新安装特定包：
   ```bash
   pnpm install --filter=package-name
   ```

4. 查看依赖树：
   ```bash
   pnpm list --depth=0
   ```