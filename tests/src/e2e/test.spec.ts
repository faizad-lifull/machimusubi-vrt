import puppeteer, { Browser, Page } from 'puppeteer';

describe('Google Search Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.setViewport({ width: 1280, height: 800 });
  });

  test('should have correct title', async () => {
    await page.goto('https://www.google.com', {
      waitUntil: 'networkidle0',
    });
    const title = await page.title();
    expect(title).toBe('Google');
  });

  test('should perform search and verify results', async () => {
    await page.goto('https://www.google.com', {
      waitUntil: 'networkidle0',
    });

    // Type into search box
    await page.type('textarea[name="q"]', 'puppeteer testing');

    // Press Enter and wait for navigation
    await Promise.all([
      page.keyboard.press('Enter'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    // Take a screenshot of the results
    await page.screenshot({
      path: './src/vrt/screenshots/outputs/targets/img/search-results.png',
      fullPage: true,
    });

    // Verify search results are present
    const results = await page.$('#search');
    expect(results).toBeTruthy();
  });

  test('should handle errors gracefully', async () => {
    try {
      await page.goto('https://this-is-invalid-url.com');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Helper function for taking screenshots
  async function takeScreenshot(name: string): Promise<void> {
    await page.screenshot({
      path: `./src/vrt/screenshots/outputs/targets/img/${name}.png`,
      fullPage: true,
    });
  }
});