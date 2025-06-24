const { getBrowser } = require('../services/puppeteerService');

async function initPage(html, width, height) {
	const browser = await getBrowser();
	const page = await browser.newPage();

	const defaultWidth = parseInt(process.env.DEFAULT_VIEWPORT_WIDTH || '800', 10);
	const defaultHeight = parseInt(process.env.DEFAULT_VIEWPORT_HEIGHT || '600', 10);

	await page.setViewport({
		width: width || defaultWidth,
		height: height || defaultHeight,
	});

	page.setDefaultNavigationTimeout(0);
	page.setDefaultTimeout(0);

	await page.setContent(html, { waitUntil: 'networkidle0', timeout: 0 });

	return page;
}

async function renderScreenshot(page, type, encoding) {
	return await page.screenshot({ type, encoding });
}

module.exports = {
	initPage,
	renderScreenshot,
};