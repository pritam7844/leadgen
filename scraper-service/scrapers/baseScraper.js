const { chromium } = require('playwright')

class BaseScraper {
  constructor(options = {}) {
    this.headless = options.headless !== false
    this.timeout = options.timeout || 30000
    this.browser = null
    this.page = null
  }

  async init() {
    this.browser = await chromium.launch({
      headless: this.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    })
    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    })
    this.page = await context.newPage()
    this.page.setDefaultTimeout(this.timeout)
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: this.timeout })
  }

  async close() {
    if (this.browser) await this.browser.close()
  }

  sanitize(text) {
    if (!text) return null
    return text.replace(/[<>'"]/g, '').trim()
  }

  extractEmail(text) {
    if (!text) return null
    const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/)
    return match ? match[0] : null
  }

  extractPhone(text) {
    if (!text) return null
    const match = text.match(/[\+]?[\d\s\-\(\)]{10,15}/)
    return match ? match[0].replace(/\s+/g, '').trim() : null
  }
}

module.exports = { BaseScraper }
