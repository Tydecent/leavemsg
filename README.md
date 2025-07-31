# 留言板应用 (Leave Message App)

这是一个基于Node.js的简单留言板应用，允许用户提交公开或仅开发者可见的留言。


## 功能特点

- 用户可以提交留言，支持匿名选项
- 可以选择留言是否仅开发者可见
- 留言按时间倒序显示（最新的在最前面）
- 支持HTML语法格式化留言内容
- 数据存储在JSON文件中，无需额外数据库

## 技术栈

- **后端**：Node.js
- **前端**：HTML, CSS, JavaScript
- **数据存储**：JSON文件
- **样式库**：Font Awesome 图标

## 使用方法
- 访问者可以提交留言，提交留言时可以选择留言是否匿名/仅开发者可见。
- 开发者/站长可以通过留言文件查阅、编辑留言

## 安装指南

### 前提条件
- 已安装 Node.js

### 步骤
1. 克隆或下载此项目
2. 进入项目目录
   ```bash
   cd leavemsg.tydecent.top
   ```
3. 安装依赖
   ```bash
   npm install
   ```
4. 启动服务器
   ```bash
   node server.js
   ```
5. 在浏览器中访问 `http://localhost:12001`


## 项目结构

```
leavemsg.tydecent.top/
├── developer_messages.json  # 仅开发者可见的留言
├── messages.json           # 公开留言
├── package-lock.json       # 依赖锁定文件
├── package.json            # 项目依赖配置
├── public/
│   ├── index.html          # 主页面
│   ├── script.js          # 前端JavaScript
│   └── style.css          # 样式表
├── server.js               # 服务器代码
└── users.json              # 用户数据
```

## 配置

- 服务器端口：默认12001（可在server.js中修改PORT变量）
- 留言存储文件：messages.json（公开）和developer_messages.json（仅开发者）

## 注意事项

- 目前应用没有实现完善的安全措施，建议仅在可信环境中使用
- 生产环境中应考虑添加更多安全措施，如密码加密、请求限流等
- 登录、用户数据部分仍在测试阶段

## 改进方向

1. 添加分页加载功能
2. 实现留言编辑和删除功能
3. 使用数据库替代JSON文件存储
4. 增加用户注册功能
5. 添加留言搜索功能
6. 实现更完善的权限管理
