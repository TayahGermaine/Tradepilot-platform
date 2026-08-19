import AiToolRun from '../models/AiToolRun.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getAiStats,
  getAiTools,
  getAiActions,
  getAiSignals,
  getMarketSentiment,
  getNewsDigest,
  runTool,
} from '../utils/aiEngine.js'

// GET /api/ai/stats
export const stats = asyncHandler(async (req, res) => {
  res.json(getAiStats())
})

// GET /api/ai/tools
export const tools = asyncHandler(async (req, res) => {
  res.json(getAiTools())
})

// POST /api/ai/run
export const run = asyncHandler(async (req, res) => {
  const { tool } = req.body
  if (!tool) throw new ApiError(400, 'tool is required')

  const result = runTool(tool)
  await AiToolRun.create({ user: req.user._id, tool, result: result.result })

  res.json(result)
})

// GET /api/ai/actions
export const actions = asyncHandler(async (req, res) => {
  res.json(getAiActions())
})

// GET /api/ai/signals
export const signals = asyncHandler(async (req, res) => {
  res.json(getAiSignals())
})

// GET /api/ai/sentiment
export const sentiment = asyncHandler(async (req, res) => {
  res.json(getMarketSentiment())
})

// GET /api/ai/news-digest
export const newsDigest = asyncHandler(async (req, res) => {
  res.json(getNewsDigest())
})
