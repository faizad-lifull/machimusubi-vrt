import * as puppeteer from 'puppeteer';
import { isHeadless, homesOrigin, jestTimeout } from '../../../utils/constants';

// extend jest timeout, because puppeteer might take sometime
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi/sitemap-lifestyle.xml`;

describe('/sitemap-station.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let response: puppeteer.HTTPResponse | null;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: isHeadless
            // headless: false
        });

        page = await browser.newPage();
        response = await page.goto(validUrl);
        await page.waitForSelector("urlset");
    });

    afterAll(async () => {
        await page.close();
        await browser.close();
    });

    test(`Success 200`, () => {
        page.on('response', (response) => {
            expect(response.status()).toEqual(200);
        })
    });

    test(`Check Header is text/xml`, () => {
        expect(response?.headers()["content-type"]).toContain("text/xml");
    });

    test(`Check sitemap by machimusubi/{pref}/lifestyle`, async () => {
        const checkItems = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("url loc")).map(d => d.textContent);
        });
        
        expect(checkItems.length).toBeGreaterThan(0);
        const urlRegex = new RegExp(`${homesOrigin}/machimusubi/[A-Za-z]+/lifestyle/(?:[0-9]+/)?`);
        //check format
        checkItems.forEach((url) => {
            expect(url).toMatch(urlRegex);
        })
    })
});
