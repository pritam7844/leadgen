const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { scrapeLinkedIn } = require('./scrapers/linkedinScraper')
const { scrapeIndiamart } = require('./scrapers/indiamartScraper')
const { BaseScraper } = require('./scrapers/baseScraper')

const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8080' }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }))

app.post('/scrape', async (req, res) => {
  const { platform, url, fields = [] } = req.body

  if (!platform || !url) {
    return res.status(400).json({ error: 'platform and url are required' })
  }

  const scraperMap = {
    LINKEDIN: scrapeLinkedIn,
    INDIAMART: scrapeIndiamart,
  }

  const scraperFn = scraperMap[platform.toUpperCase()]
  if (!scraperFn) {
    return res.status(400).json({ error: `Unsupported platform: ${platform}` })
  }

  try {
    const result = await scraperFn({ url, fields })
    res.json({
      leads: result.leads,
      count: result.leads.length,
      errors: result.errors || [],
    })
  } catch (err) {
    console.error(`Scraper error [${platform}]:`, err.message)
    res.status(500).json({
      leads: [],
      count: 0,
      errors: [err.message],
    })
  }
})

app.listen(PORT, () => {
  console.log(`LeadFlow scraper service running on port ${PORT}`)
})
