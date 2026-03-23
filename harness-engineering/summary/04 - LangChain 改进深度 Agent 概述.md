---
source: https://blog.langchain.com/improving-deep-agents-with-harness-engineering/
title: "Improving Deep Agents with Harness Engineering"
author: LangChain Team
date: 2026-02-17
---

# LangChain: 通过 Harness Engineering 改进深度 Agent

## 1. 文章概述

本文介绍了 LangChain 团队如何通过 **Harness Engineering**（harness 工程）将其编码 Agent（deepagents-cli）在 Terminal Bench 2.0 排行榜上从 Top 30 提升至 Top 5。核心思路是：不更换底层模型（固定使用 gpt-5.2-codex），仅通过优化模型外围的系统架构——包括 system prompt、工具选择和执行流程——将得分从 52.8% 提升至 66.5%，提高了 13.7 个百分点。

团队利用 LangSmith 的 Trace 功能大规模分析 Agent 的失败模式，构建了一套可重复的"Trace 分析 -> 发现问题 -> 改进 harness"的迭代循环。文章详细分享了四大关键改进策略：自验证循环、环境上下文注入、循环检测以及推理计算量的合理分配，并总结了构建 Agent Harness 的通用实践原则。

## 2. 核心观点

- **Harness Engineering 的本质**是围绕模型构建系统工具，将模型本身"参差不齐"的智能塑造成适合特定任务的能力，优化目标包括任务性能、token 效率和延迟等
- **不换模型，只改 harness** 就能获得显著的性能提升（13.7 个百分点），说明 harness 设计的巨大价值
- **Trace 是最重要的反馈信号**：模型是黑盒，但我们可以通过观察其文本空间中的输入输出来理解和改进
- **自验证是最关键的改进**：Agent 最常见的失败模式是写完代码后"自我确认没问题"就停止了，缺乏真正的测试验证
- **当前的 guardrail 设计是针对模型现阶段不足的权宜之计**，随着模型能力提升，这些防护措施可能不再需要
- **Harness 需要针对不同模型做定制化调优**，通用原则可以迁移，但具体参数需要针对性迭代

## 3. 关键概念

- **Harness Engineering**: 围绕 LLM 构建的系统层工程，包括 system prompt、工具、middleware 等，目标是优化 Agent 在特定任务上的表现
- **Middleware**: LangChain 中对 model call 和 tool call 前后执行的 hook 机制，用于注入上下文、检测异常模式等
- **Self-Verification Loop（自验证循环）**: 让 Agent 在完成实现后主动运行测试、对照任务规范验证结果、修复问题的闭环流程
- **Reasoning Sandwich（推理三明治）**: 在 Agent 执行的不同阶段分配不同的推理计算量——规划阶段用高推理（xhigh）、实现阶段用中等推理（high）、验证阶段再用高推理（xhigh）
- **Doom Loop**: Agent 在确定一个方案后变得"短视"，对同一个错误方案反复做微小变化（有些 trace 中重复 10+ 次）
- **Trace Analyzer Skill**: 一个自动化的 Agent 技能，用于从 LangSmith 获取实验 trace、并行分析错误、综合建议并改进 harness
- **Ralph Wiggum Loop**: 通过 hook 强制 Agent 在退出前继续执行验证的模式

## 4. 实践方法

### 迭代改进流程
1. 从 LangSmith 获取实验 trace
2. 启动并行的错误分析 Agent，主 Agent 综合发现并提出改进建议
3. 汇总反馈，对 harness 做针对性修改（类似 Machine Learning 中的 Boosting 思路，聚焦于上一轮的错误）

### 自验证四步法
1. **Planning & Discovery**: 阅读任务、扫描代码库、制定初步计划和验证方案
2. **Build**: 围绕验证进行实现，编写测试覆盖 happy path 和 edge case
3. **Verify**: 运行测试、阅读完整输出、对照任务规范（而非自己的代码）进行验证
4. **Fix**: 分析错误、回顾原始规范、修复问题

### 环境上下文工程
- **LocalContextMiddleware**: Agent 启动时自动映射工作目录和工具链（如 Python 安装路径）
- **PreCompletionChecklistMiddleware**: Agent 退出前拦截，提醒其进行验证
- **LoopDetectionMiddleware**: 追踪同一文件的编辑次数，超过阈值 N 后提示 Agent 重新考虑方案
- **时间预算注入**: 提醒 Agent 剩余时间，引导其从实现转向验证

### 推理计算量分配
- 全程使用 xhigh 推理反而得分较低（53.9%），因为 Agent 超时
- 使用 high 推理得 63.6%
- 使用 xhigh-high-xhigh "Reasoning Sandwich" 策略得 66.5%

## 5. 重要数据

| 指标 | 数值 |
|------|------|
| 初始得分（默认 harness） | 52.8% |
| 最终得分（优化后 harness） | 66.5% |
| 提升幅度 | +13.7 个百分点 |
| 排名变化 | Top 30 -> Top 5 |
| 全程 xhigh 推理得分 | 53.9% |
| 全程 high 推理得分 | 63.6% |
| Claude Opus 4.6 使用早期 harness 得分 | 59.6% |
| Terminal Bench 2.0 任务数 | 89 个任务 |
| 使用模型 | gpt-5.2-codex |
| xhigh 推理相比 high 的 token/时间消耗 | 超过 2 倍 |

## 6. 核心金句

> "The goal of a harness is to mold the inherently spiky intelligence of a model for tasks we care about."
> -- Harness 的目标是将模型本身参差不齐的智能塑造成适合我们关心的任务的能力。

> "The purpose of the harness engineer: prepare and deliver context so agents can autonomously complete work."
> -- Harness 工程师的职责：准备和传递上下文，使 Agent 能够自主完成工作。

> "Models are biased towards their first plausible solution."
> -- 模型倾向于偏好它们找到的第一个"看似可行"的解决方案。

> "The job of the harness designer is to design around today's shortcomings while planning for smarter models in the future."
> -- Harness 设计者的工作是针对当前模型的不足进行设计，同时为未来更智能的模型做好规划。

> "Today's models are exceptional self-improvement machines."
> -- 当今的模型是出色的自我改进机器。

## 7. 要点总结

- **Harness Engineering 是 Agent 性能优化的高杠杆手段**：不换模型，仅优化外围系统就能带来显著提升
- **自验证是最重要的单一改进**：强制 Agent 进入"构建-测试-验证-修复"循环，而非依赖其自我审查代码
- **Trace 驱动的迭代改进是可复制的方法论**：通过自动化 trace 分析发现问题，针对性改进 harness，类似 ML 中的 Boosting
- **上下文工程要代替 Agent 做好环境感知**：目录结构、工具链、约束条件、评估标准等信息应主动注入而非让 Agent 自行探索
- **推理计算量需要精细分配**：Reasoning Sandwich 策略在关键阶段（规划、验证）投入更多推理资源，执行阶段适当降低
- **防御性设计应对当前模型局限**：Loop Detection、时间预算等机制是务实的工程手段，预期随模型进步逐步退出
- **Harness 需要针对模型做定制化**：不同模型需要不同的 prompting 策略和 harness 配置，通用原则需要经过模型特定的迭代验证
- **未来方向**包括多模型协同系统、持续学习的 memory 机制、以及跨模型的 harness 效果度量
