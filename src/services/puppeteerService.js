const puppeteer = require('puppeteer');

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance) {
    const useNoSandbox = process.env.PUPPETEER_NO_SANDBOX === 'true';

    browserInstance = await puppeteer.launch({
      headless: true,
      dumpio: false,
      args: useNoSandbox ? ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] : [],
    });
  }

  return browserInstance;
}

module.exports = { getBrowser };
