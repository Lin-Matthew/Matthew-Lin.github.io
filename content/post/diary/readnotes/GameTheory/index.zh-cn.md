---
draft: 		false
layout:     post 
title:      "读《博弈论-朱·弗登博格 & 让·梯若尔》"
subtitle:   ""
description: ""
date:        2026-07-17 22:00:00
author: "Matthew Lin"
image: ""
pre_image: "/img/postlist/diary-rnotes-preimg.png"
publishDate: 2026-07-17 22:00:00
tags:
    - reading notes
URL: "/2026/7/17/rnotes-GameTheory/"
categories: [diary]
subcategories: [rnotes]
comments: true
reward: true
---

## 1 中英词汇

#### 1.1 博弈的核心要素

- **决策人/局中人：Player/Agents**

  --参与博弈并进行决策的个人、公司、国家

- **策略：Strategy**

  --决策者在各种可能情况下可以选择的一整套行动方案

- **收益/支付：Payoff**

  --博弈结束后，各个决策者最终得到的量化结果，如金钱、效用、满意度

#### 1.2 经典模型与核心概念

- **囚徒困境：Prisoner's Dilemma**

  --最经典的非零和博弈模型，个体与集体的理性的冲突

  个体的最优选择，往往导致集体的最差结果。

  1.竞争公司的价格互卷

  2.职场内卷

  破：1.增加背叛的成本(公司之间的价格同盟)

  ​		2.把单次博弈变成重复博弈(这次背叛会导致以后不再有合作)

- **智猪博弈：Boxed Pigs Game**

  --大组织与小组织竞争中“搭便车”现象的模型

  弱者的最优解是“搭便车”

  全部不干，都没有收益。弱者干会亏本，等强者干跟进。

  小公司蹭大品牌热度，直接卖同款，不用付出广告的成本。

  破：

  ​	1.大公司建立自己的核心壁垒，使得小公司只能喝汤；

  ​	2.公司内，老板修改规则，按劳分配而非按人头分配；不破会赶走大猪，留下一堆小猪。

- **斗鸡博弈：Chicken Game**

  --两强(or not)相遇，谁先认输谁丢脸，但都不认输会一起毁灭。

  一方先失去退路，另一方(理性情况下)看到这种情况，会为你选择退了。

  **前提是能判断对方是理性人。**

  例：

  ​	1.关系中，吵架先摔门而去的人；

  ​	2.商业谈判，一方说我已经是最低价了，你不接受我也没办法

  [核心就是在扔方向盘，逼对方做出让步]

- 猎鹿博弈

  --







- **纳什均衡：Nash Equilibrium**

  --没有任何人愿意单独改变策略的稳定状态

- **占优策略：Dominant Strategy**

  --无论对手采取什么策略，对你而言都是最优的选择

- **常识/共同知识：Common Knowledge**

  --“我知道，你知道我知道，我知道你知道我知道......”这种彼此心照不宣的背景信息

#### 1.3 博弈的分类

- **零和博弈：Zero-Sum Game**

  --你死我活，一方的得等于另一方的失

- **非零和博弈：Non-Zero-Sum Game**

  --可能双赢或双输，有合作空间

- **静态博弈：Static Game/Simultaneous Game**

  --所有人同时决策，或者彼此不知道对方的选择

- **动态博弈：Dynamic Game/Sequential Game**

  --决策有先后顺序，后出招的人能看到先出招人的动作

- **合作/非合作博弈：Cooperative/Non-Cooperative Game**

  --区别在于各方能否达成有法律或强制约束力的协议。主流博弈论书多讨论“非合作博弈”

- **完全/不完全信息：Complete Information/Incomplete Information**

  --大家是否互相完全了解对方的收益规则

