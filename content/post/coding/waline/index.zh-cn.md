---
draft: 		false
layout:     post 
title:      "Waline V3 + Supabase 避坑指南：实现 Hugo 博客无服务评论系统"
subtitle:   ""
description: "使用 Waline V3 作为无服务器评论后端，绑定 Supabase (PostgreSQL) 存储数据，并嵌入 Hugo 博客。本文通过详细的配置过程，实现游客免登录丝滑评论。"
date:        2026-06-25 13:04:00
author: "Matthew Lin"
image: ""
publishDate: 2026-06-25 00:00:00
tags:
    - waline
    - supabase
    - hugo
URL: "/2026/6/25/waline-comment/"
categories: [coding]
subcategories: [waline]
comments: true
reward: true
location: "Loc_ShenZhen"
---
## 概述

评论系统采用waline v3.15.2作为无服务后端，supabase(postgres)存储评论数据，不用搭建个人服务器，即可享受免费的评论系统。

## 1. Supabase数据库配置

​		[Supabase官网](https://supabase.com/)

#### 		1.1 创建组织

​		新注册用户会出现New organization按钮，点击后，输入organization name，类型可以选择"个人"，选择免费的计划，点击创建即可。

![](supabase--create-organization.png)

#### 		1.2 创建项目

​		进入刚刚创建的组织，创建新项目。选择刚刚创建的组织，输入项目名、数据库密码(记住密码)、区域、安全选项勾选图中的两个即可。点击创建新项目完成。

![](supabase--create-project.png)

#### 		1.3 创建数据表格

​		进入创建好的项目，选择SQL Editor，在右边的Untitled query(没有就点击+新建一个)，输入下面的sql语句，创建数据表格。注意：该sql语句可能只适用当前waline v3.15.2版本，如果测试不通过再调整数据表中的字段。

​		点击Run，选择Run without RLS。查看Results是否输出成功信息。或者点击左侧的Table Editor，查看是否成功新建3个表：wl_comment、wl_users、wl_counter。

![](supabase--SQL-query.png)

```
-- 评论表 (wl_comment) - 严格驼峰与双重防呆
CREATE TABLE public.wl_comment (
    id SERIAL PRIMARY KEY,
    user_id INT DEFAULT NULL,
    pid INT DEFAULT NULL,
    rid INT DEFAULT NULL,
    url VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(100) DEFAULT '',
    ua TEXT,

    comment TEXT,
    text TEXT, -- 旧版兼容

    -- 用户基本属性（新旧版本所有可能调用的字段名）
    nick VARCHAR(255) DEFAULT NULL,
    username VARCHAR(255) DEFAULT NULL,
    mail VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    link VARCHAR(255) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    type VARCHAR(50) DEFAULT 'user',

    -- 状态与点赞
    status VARCHAR(50) NOT NULL DEFAULT 'waiting',
    sticky INT DEFAULT 0,
    "like" INT DEFAULT 0,
    likes INT DEFAULT 0,

    -- 该版本不适用驼峰命名法比如insertedAt会报错
    "insertedat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "createdat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wl_comment_url ON public.wl_comment(url);

-- 计数/访问量/表情回应表 (wl_counter)
CREATE TABLE public.wl_counter (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL DEFAULT '',
    time INT DEFAULT 0,

    -- 八种文章表情回应
    reaction0 INT DEFAULT 0,
    reaction1 INT DEFAULT 0,
    reaction2 INT DEFAULT 0,
    reaction3 INT DEFAULT 0,
    reaction4 INT DEFAULT 0,
    reaction5 INT DEFAULT 0,
    reaction6 INT DEFAULT 0,
    reaction7 INT DEFAULT 0,
    reaction8 INT DEFAULT 0,

    "createdat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE public.wl_users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'user',
    label VARCHAR(255) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,

    display_name VARCHAR(255) DEFAULT '',
    nick VARCHAR(255) DEFAULT NULL,          
    username VARCHAR(255) DEFAULT NULL,      -- 旧版用户名

    email VARCHAR(255) DEFAULT '',           
    mail VARCHAR(255) DEFAULT NULL,        

    url VARCHAR(255) DEFAULT NULL,           
    link VARCHAR(255) DEFAULT NULL,          

    -- 第三方登录支持
    github VARCHAR(255) DEFAULT NULL,
    twitter VARCHAR(255) DEFAULT NULL,
    facebook VARCHAR(255) DEFAULT NULL,
    google VARCHAR(255) DEFAULT NULL,
    weibo VARCHAR(255) DEFAULT NULL,
    qq VARCHAR(255) DEFAULT NULL,
    oidc VARCHAR(255) DEFAULT NULL,
    "2fa" VARCHAR(32) DEFAULT NULL,

    "createdat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### 		1.4 复制连接信息

​		点击Project Overview，找到Get connected，点击connection string。如图，选择Transation pooler连接方式。

![](supabase--cnnection-string.png)

往下翻，找到connection string，复制右边类似这种的字符串：

```
postgresql://hidden:[YOUR-PASSWORD]@hidden:5432//postgres.xxx:[YOUR-PASSWORD]@aws-xxx.pooler.supabase.com:6543/postgres
```

上面的信息拆分或，对应到下面的键对应的值。

- **PG_HOST**: 	aws-xxx.pooler.supabase.com

- **PG_USER**: 	postgres.xxx

- **PG_DB**: 		postgres

- **PG_PASSWORD**: 	YOUR-PASSWORD[这是上面创建组织时候输入的数据库密码]

- **PG_PORT**: 	6543

如果忘记了密码，可以依次点击"Database"、"Settings"、"Reset password"。

#### 1.5为表格创建安全组策略



## 2. Github设置

​		在github新建一个仓库，仓库名比如设置为waline-comment，选择private、添加readme。

​		仓库根目录下新建文件package.json，内容如下。

```
{
  "name": "waline-server",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "@waline/vercel": "latest"
  }
}
```

​		再在根目录下新建文件vercel.json,内容为：

```
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/api/comment" }
  ]
}
```

​		再新建目录api/，在api目录下新建文件comment.js，内容为：

```
const Waline = require('@waline/vercel');

module.exports = Waline({
  env: 'vercel',
  storage: 'postgresql',
  oauth: {}, 
  plugins: [], 
});
```

## 3. Vercel配置

#### 		3.1 Vercel设置环境变量

​		[Vercel官网](https://vercel.com/)，用github登录。去控制面板页面，点击添加新的项目，弹出下图界面。点击install，在新窗口里，可以选择所有的github仓库，或者只选择某个仓库。这里选择"Only select repositories"，选择步骤2里面的仓库waline-comment，点击Install，等待完成。

![](Vercel--create-project.png)

​		在新建好的项目里，左侧找到Environment Variables，点击Add Environment Variables。添加步骤1.4中的5个键值对，注意前后不要有空格。如图是添加好的样子。

![](Vercel--create-variables.png)

​		添加过程中会弹出"Added Environment Variable successfully. A new deployment is needed for changes to take effect."，点击Redeploy，等待部署完成(可以在Overview里面观察状态变化)。

​		如图，Status状态Ready表示部署完成无误。点击中间的窗口，新页面即可加载waline的评论页面。

右边的Domains，可以复制出来，用于下一步添加到hugo博客里。

![](Vercel--overview.png)

## 4. 在hugo文章里添加评论

​		修改hugo.toml，在[params]里添加上一步获取的domain，waline_server = "https://waline-comment-xxx"。在其他页面代码中即可使用该变量，实现评论系统。

```
<div id="waline"></div>
<script type="module">
  import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
  init({
    el: '#waline',
    serverURL: '{{ .Site.Params.waline_server }}',
    lang: 'zh-CN',
    dark: 'auto',
    requiredMeta: ['nick'],
  });
</script>
```

​		由于默认生成的domain需要VPN才能访问，在vercel里找到Domains->Add Existing，添加自己的域名，将上面的waline_server替换成新域名，即可免VPN访问和加载评论。

​		init里面可以添加、修改其他配置，比如语言等显示。
