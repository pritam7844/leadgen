const { chromium } = require('playwright');

/**
 * Scrapes Google Maps business data
 * @param {Object} config - { url, fields }
 */
async function scrapeGoogleMaps({ url, fields }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  const leads = [];
  const errors = [];

  try {
    console.log(`Navigating to Google Maps: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Wait for the results list to load
    await page.waitForSelector('div[role="feed"]', { timeout: 10000 }).catch(() => {});

    // Scroll to load more results (Google Maps uses infinite scroll)
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 5000);
      await page.waitForTimeout(1500);
    }

    const items = await page.$$('div[role="article"]');
    
    for (const item of items) {
      try {
        const name = await item.$eval('div.fontHeadlineSmall', el => el.innerText).catch(() => null);
        if (!name) continue;

        // Click to get more details if needed, but for now we extract from list
        const address = await item.$eval('div.fontBodyMedium >> nth=0', el => el.innerText).catch(() => null);
        const rating = await item.$eval('span.MW4etd', el => el.innerText).catch(() => null);
        const website = await item.$eval('a[aria-label*="website"]', el => el.getAttribute('href')).catch(() => null);
        const phone = await item.$eval('span[aria-label*="phone"]', el => el.innerText).catch(() => null);

        leads.push({
          firstName: name, // We'll map "Name" to firstName for business leads
          company: name,
          industry: 'Local Business',
          city: address ? address.split(',').slice(-2, -1)[0]?.trim() : null,
          location: address,
          source: 'GOOGLE_MAPS',
          customFields: {
            rating: rating || 'N/A',
            website: website || 'N/A',
            googleMapsUrl: await item.$eval('a', el => el.href).catch(() => null)
          }
        });
      } catch (e) {
        // Individual item failed, skip
      }
    }

  } catch (err) {
    console.error('Google Maps scraping failed:', err);
    errors.push(err.message);
  } finally {
    await browser.close();
  }

  return { leads, errors };
}

module.exports = { scrapeGoogleMaps };
