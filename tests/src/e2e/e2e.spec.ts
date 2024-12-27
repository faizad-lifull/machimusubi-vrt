import puppeteer, { Browser, Page } from 'puppeteer';
jest.setTimeout(10000);
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
    await page.goto('https://www.homes.co.jp/machimusubi/', {
      waitUntil: 'networkidle0',
    });
    const title = await page.title(); 
    expect(title).toBe('【ホームズ】まちむすび｜あなたにあった街情報を');
  });


  test('should handle errors gracefully', async () => {
    try {
      await page.goto('https://this-is-invalid-url.com');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

});