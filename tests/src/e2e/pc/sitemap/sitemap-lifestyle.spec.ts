
import { setupBrowser } from "../../../utils/setup-browser";
import * as puppeteer from "puppeteer";
import { homesOrigin, jestTimeout } from '../../../utils/constants';

// Extend Jest timeout, because Puppeteer might take some time
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi/sitemap-lifestyle.xml`;

describe('/sitemap-station.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let response: puppeteer.HTTPResponse | null;

    beforeAll(async () => {
        // Use setupBrowser for initialization
        const setup = await setupBrowser(validUrl, 'urlset'); // Wait for 'urlset' selector
        browser = setup.browser;
        page = setup.page;

        // Capture the response of the initial navigation
        response = await page.goto(validUrl, { waitUntil: 'networkidle0' });
    });

    afterAll(async () => {
        // Clean up resources
        await page.close();
        await browser.close();
    });

    test(`Success 200`, () => {
        // Check that the response status is 200
        expect(response?.status()).toEqual(200);
    });

    test(`Check Header is text/xml`, () => {
        // Ensure the content-type header is "text/xml"
        expect(response?.headers()["content-type"]).toContain("text/xml");
    });

    test(`Check sitemap by machimusubi/{pref}/lifestyle`, async () => {
        // Evaluate the page to extract URLs from <loc> tags
        const checkItems = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("url loc")).map((d) => d.textContent);
        });

        expect(checkItems.length).toBeGreaterThan(0);

        const urlRegex = new RegExp(`${homesOrigin}/machimusubi/[A-Za-z]+/lifestyle/(?:[0-9]+/)?`);

        // Validate each URL matches the expected format
        checkItems.forEach((url) => {
            expect(url).toMatch(urlRegex);
        });
    });
});
