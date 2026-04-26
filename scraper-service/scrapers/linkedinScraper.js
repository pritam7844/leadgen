const { BaseScraper } = require('./baseScraper')

async function scrapeLinkedIn({ url, fields = [] }) {
  const scraper = new BaseScraper({ headless: true })
  const leads = []
  const errors = []

  try {
    await scraper.init()
    await scraper.navigate(url)

    // Wait for search results
    await scraper.page.waitForSelector('.search-results-container, .reusable-search__result-container', { timeout: 15000 })
      .catch(() => {})

    const cards = await scraper.page.$$('.reusable-search__result-container, [data-view-name="search-entity-result-universal-template"]')

    for (const card of cards.slice(0, 25)) {
      try {
        const name = await card.$eval('.entity-result__title-text a, .app-aware-link[aria-label]',
          el => el.textContent?.trim()).catch(() => null)
        const company = await card.$eval('.entity-result__secondary-subtitle',
          el => el.textContent?.trim()).catch(() => null)
        const location = await card.$eval('.entity-result__tertiary-subtitle',
          el => el.textContent?.trim()).catch(() => null)

        if (name) {
          const parts = scraper.sanitize(name).split(' ')
          leads.push({
            firstName: parts[0] || null,
            lastName: parts.slice(1).join(' ') || null,
            company: scraper.sanitize(company),
            location: scraper.sanitize(location),
            source: 'LINKEDIN',
          })
        }
      } catch {}
    }
  } catch (err) {
    errors.push(err.message)
  } finally {
    await scraper.close()
  }

  return { leads, errors }
}

module.exports = { scrapeLinkedIn }
