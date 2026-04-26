const amqp = require('amqplib');
const { MongoClient } = require('mongodb');
const { scrapeLinkedIn } = require('./scrapers/linkedinScraper');
const { scrapeIndiamart } = require('./scrapers/indiamartScraper');
const { scrapeGoogleMaps } = require('./scrapers/googleMapsScraper');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MONGO_URI = "mongodb+srv://pritamcodeservir_db_user:test@plantseelingproject.cgru8ib.mongodb.net/scrapperdb?retryWrites=true&w=majority";
const QUEUE_NAME = 'scrape_jobs';

const scraperMap = {
  LINKEDIN: scrapeLinkedIn,
  INDIAMART: scrapeIndiamart,
  GOOGLE_MAPS: scrapeGoogleMaps,
};

async function startWorker() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    const mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db();
    const leadsCollection = db.collection('leads');

    console.log(`[*] Scraper Worker started. Waiting for jobs in ${QUEUE_NAME}...`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        const { platform, url, workspaceId, fields } = payload;
        
        console.log(`[x] Received job: ${platform} for workspace ${workspaceId}`);

        try {
          const scraperFn = scraperMap[platform];
          if (!scraperFn) throw new Error(`Unsupported platform: ${platform}`);

          const result = await scraperFn({ url, fields });
          
          if (result.leads && result.leads.length > 0) {
            const leadsToSave = result.leads.map(l => ({
              ...l,
              workspaceId,
              createdAt: new Date(),
              updatedAt: new Date(),
              status: 'NEW'
            }));

            // Bulk write leads to MongoDB
            for (const lead of leadsToSave) {
              await leadsCollection.updateOne(
                { email: lead.email, phone: lead.phone, workspaceId },
                { $set: lead },
                { upsert: true }
              );
            }
            console.log(`[v] Saved ${result.leads.length} leads for ${workspaceId}`);
          }

          channel.ack(msg);
        } catch (err) {
          console.error(`[!] Job failed:`, err.message);
          // Requeue or move to DLQ logic could go here
          channel.nack(msg, false, false); 
        }
      }
    });

  } catch (err) {
    console.error('Worker error:', err);
    setTimeout(startWorker, 5000); // Retry connection
  }
}

startWorker();
