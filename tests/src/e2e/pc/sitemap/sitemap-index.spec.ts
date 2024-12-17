import * as puppeteer from 'puppeteer';
import { isHeadless, homesOrigin, jestTimeout } from '../../../utils/constants';

// extend jest timeout, because puppeteer might take sometime
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi/sitemap.xml`;

describe('/sitemap.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let response: puppeteer.HTTPResponse | null;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: isHeadless
        });

        page = await browser.newPage();
        response = await page.goto(validUrl);
        await page.waitForSelector("sitemapindex");
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

    test(`Check sitemap with machimusubi/ sitemap-lifestyle || sitemap-pref || sitemap-line || sitemap-station`, async () => {
        const checkItems = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("sitemap loc")).map(d => d.textContent);
        });
        expect(checkItems.length).toEqual(4);

        // app/Service/Sitemap/IndexService.php@getIndex()
        const sitemaps = [
            `${homesOrigin}/machimusubi/sitemap-lifestyle.xml`,
            `${homesOrigin}/machimusubi/sitemap-pref.xml`,
            `${homesOrigin}/machimusubi/sitemap-line.xml`,
            `${homesOrigin}/machimusubi/sitemap-station.xml`,
        ];

        expect(sitemaps).toEqual(expect.arrayContaining(checkItems));
    })
});
