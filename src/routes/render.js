const express = require('express');
const { getBrowser } = require('../services/puppeteerService');
const validateInput = require('../utils/validateInput');

const router = express.Router();

// Middleware to verify API token from query parameter
function verifyApiToken(req, res, next) {
  const token = req.query.apiToken;
  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API token.' });
  }
  next();
}

// Utility function to get MIME type based on output type
function getMimeType(type) {
  switch (type) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
}


// Takes a screenshot using Puppeteer
async function renderScreenshot(page, type, encoding) {
  return await page.screenshot({ type, encoding });
}

// Main rendering endpoint
router.post('/render', verifyApiToken, async (req, res) => {
  try {
    const { html, width, height, outputFormat, outputType } = validateInput(req.body);
    console.log('Received request with parameters:', { html, width, height, outputFormat, outputType });
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Default viewport size can be overridden via .env or request
    const defaultWidth = parseInt(process.env.DEFAULT_VIEWPORT_WIDTH || '800', 10);
    const defaultHeight = parseInt(process.env.DEFAULT_VIEWPORT_HEIGHT || '600', 10);
    console.log('Default viewport size:', { defaultWidth, defaultHeight });
    await page.setViewport({
      width: width || defaultWidth,
      height: height || defaultHeight,
    });
    
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    console.log('Setting page content...');
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 0 });

    let outputBuffer;
    console.log('Taking screenshot...');
	const encoding = outputFormat === 'base64' ? 'base64' : undefined;
	outputBuffer = await renderScreenshot(page, outputType, encoding);
    
    console.log('Screenshot taken successfully.');
    await page.close();

    const mimeType = getMimeType(outputType);
    console.log('MIME type:', mimeType);
    // Return as Base64 string if requested
    if (outputFormat === 'base64') {
      const base64 = `data:${mimeType};base64,${outputBuffer}`;
      res.setHeader('Content-Type', 'text/plain');
      console.log('Returning Base64 image...');
      return res.send({ image: base64 });
    } else {
      // Return as binary buffer
      res.setHeader('Content-Type', mimeType);
      console.log('Returning binary image...');
      return res.end(outputBuffer);
    }
  } catch (err) {
    console.error('Render error:', err);

    // Handle Zod validation error
    try {
      const parsed = JSON.parse(err.message);
      return res.status(400).json({ error: parsed });
    } catch {
      return res.status(500).json({ error: 'An unexpected error occurred during rendering.' });
    }
  }
});

module.exports = router;
