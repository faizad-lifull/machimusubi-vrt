import { setupBrowser } from "../../../utils/setup-browser";
import { homesOrigin, jestTimeout } from '../../../utils/constants';
import * as puppeteer from 'puppeteer';

// Extend Jest timeout, because Puppeteer might take some time
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi/sitemap-lifestyle.xml`;

describe('/sitemap-station.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        // Use setupBrowser for initialization
        ({ browser, page } = await setupBrowser(validUrl));
    });

    afterAll(async () => {
        // Clean up resources
        await page.close();
        await browser.close();
    });

    test('Success 200', async () => {
        // Check that the response status is 200
        const response = await page.goto(validUrl, { waitUntil: 'networkidle0' });
        expect(response?.status()).toEqual(200);
    });

    test('Check Header is text/xml', async () => {
        // Ensure the content-type header is "text/xml"
        const response = await page.goto(validUrl, { waitUntil: 'networkidle0' });
        expect(response?.headers()['content-type']).toContain('text/xml');
    });

    test('Check sitemap by machimusubi/{pref}/lifestyle', async () => {
        // Navigate to the URL
        await page.goto(validUrl, { waitUntil: 'networkidle0' });

        // Evaluate the page to extract URLs from <loc> tags
        const checkItems = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('url loc')).map((d) => d.textContent);
        });

        expect(checkItems.length).toBeGreaterThan(0);

        const urlRegex = new RegExp(`${homesOrigin}/machimusubi/[A-Za-z]+/lifestyle/(?:[0-9]+/)?`);

        // Validate each URL matches the expected format
        checkItems.forEach((url) => {
            expect(url).toMatch(urlRegex);
        });
    });
});
