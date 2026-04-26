const { BaseScraper } = require('./baseScraper')

async function scrapeIndiamart({ url, fields = [] }) {
  const scraper = new BaseScraper({ headless: true })
  const leads = []
  const errors = []

  try {
    await scraper.init()
    await scraper.navigate(url)
    await scraper.page.waitForTimeout(2000)

    const listings = await scraper.page.$$('.listing-item, .product-listing, .bsrData, .ilc')

    for (const listing of listings.slice(0, 30)) {
      try {
        const company = await listing.$eval('.lcname, .companyName, .bsrName',
          el => el.textContent?.trim()).catch(() => null)
        const phone = await listing.$eval('.mobile_number, .phno, [data-phone]',
          el => el.textContent?.trim() || el.getAttribute('data-phone')).catch(() => null)
        const location = await listing.$eval('.city-name, .lcadd, .compAddress',
          el => el.textContent?.trim()).catch(() => null)
        const industry = await listing.$eval('.catg, .category',
          el => el.textContent?.trim()).catch(() => null)

        if (company) {
          leads.push({
            company: scraper.sanitize(company),
            phone: scraper.extractPhone(phone),
            city: scraper.sanitize(location),
            industry: scraper.sanitize(industry),
            source: 'INDIAMART',
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

module.exports = { scrapeIndiamart }
