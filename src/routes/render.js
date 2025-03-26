const express = require('express');
const validateInput = require('../utils/validateInput');
const pupeteerHelper = require('../utils/puppeteerHelper');

const router = express.Router();

function verifyApiToken(req, res, next) {
  const token = req.query.apiToken;
  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API token.' });
  }
  next();
}

function getMimeType(type) {
  switch (type) {
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

function handleOutput(res, buffer, type, format) {
  const mimeType = getMimeType(type);

  if (format === 'base64') {
    const base64 = `data:${mimeType};base64,${buffer}`;
    res.setHeader('Content-Type', 'text/plain');
    return res.send({ image: base64 });
  }

  res.setHeader('Content-Type', mimeType);
  return res.end(buffer);
}

router.post('/render', verifyApiToken, async (req, res) => {
  try {
    const { html, width, height, outputFormat, outputType } = validateInput(req.body);
    const encoding = outputFormat === 'base64' ? 'base64' : undefined;

    const page = await pupeteerHelper.initPage(html, width, height);
    const buffer = await pupeteerHelper.renderScreenshot(page, outputType, encoding);
    await page.close();

    return handleOutput(res, buffer, outputType, outputFormat);
  } catch (err) {
    console.error('Render error:', err);

    try {
      const parsed = JSON.parse(err.message);
      return res.status(400).json({ error: parsed });
    } catch {
      return res.status(500).json({ error: 'An unexpected error occurred during rendering.' });
    }
  }
});

module.exports = router;
