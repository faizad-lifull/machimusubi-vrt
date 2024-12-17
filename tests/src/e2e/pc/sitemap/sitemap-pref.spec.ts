import * as puppeteer from 'puppeteer';
import { homesOrigin, jestTimeout } from '../../../utils/constants';
import * as prefectureData from '../../../utils/data/master-address-prefectures';
import { setupBrowser } from '../../../utils/setup-browser';

// extend jest timeout, because puppeteer might take sometime
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi/sitemap-pref.xml`;

describe('/sitemap-pref.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let response: puppeteer.HTTPResponse | null;

    beforeAll(async () => {
        const { browser: newBrowser, page: newPage } = await setupBrowser();

        browser = newBrowser;
        page = newPage;
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

    test(`Check sitemap with machimusubi/{pref}/line`, async () => {
        const checkItems = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("url loc")).map(d => d.textContent);
        });

        let sitemap_urls: string[] = [];

        Object.entries(prefectureData.data.result).forEach((obj, index)=>{
            const url = `${homesOrigin}/machimusubi/${obj[1].roman}/line/`;
            sitemap_urls.push(url);
        })

        expect(sitemap_urls).toEqual(expect.arrayContaining(checkItems));
    })
});
