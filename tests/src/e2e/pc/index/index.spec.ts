import * as puppeteer from 'puppeteer';
import { homesOrigin, jestTimeout } from '../../../utils/constants';
import { setupBrowser } from '../../../utils/setup-browser';


// extend jest timeout, because puppeteer might take sometime
jest.setTimeout(jestTimeout);

const validUrl: string = `${homesOrigin}/machimusubi`;

describe('/sitemap-station.xml E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;
    let response: puppeteer.HTTPResponse | null;

    beforeAll(async () => {
        const { browser: newBrowser, page: newPage } = await setupBrowser();

        browser = newBrowser;
        page = newPage;
        response = await page.goto(validUrl,{ waitUntil: 'networkidle0' });
        await page.waitForSelector(".contents");
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

    test(`Check Header is text/html`, () => {
        expect(response?.headers()["content-type"]).toContain("text/html");
    });

    test(`Check page title`, async () => {
        const pageTitle = await page.title();
        expect(pageTitle).toEqual("【ホームズ】まちむすび｜あなたにあった街情報を")
    });

    test(`Check page element exist`, async () => {

        const checkItems = await page.evaluate(() => {
            const header = document.querySelector("article header");
            const sectionSelectTown = document.querySelector("article #anchor_selectTown");
            const sectionCard = document.querySelector("section.card");
            return {
                header: header,
                section_selectTown: sectionSelectTown,
                section_card: sectionCard,
            };
        });

        expect(checkItems.header).toBeTruthy();
        expect(checkItems.section_selectTown).toBeTruthy();
        expect(checkItems.section_card).toBeTruthy();
    })
});
