import * as puppeteer from 'puppeteer';
import { isHeadless, homesOrigin, jestTimeout } from '../../../utils/constants';
import * as linesData from '../../../utils/data/master-tokyo-lines';

// extend jest timeout, because puppeteer might take sometime
jest.setTimeout(jestTimeout);

interface InvalidItem {
    name: string;
    url: string;
}
const invalidUrlTest: InvalidItem[] = [
    {
        name: "Invalid pref",
        url: `${homesOrigin}/machimusubi/invalid/keihintohokunegishi-line/`,
    },
    {
        name: "Invalid line",
        url: `${homesOrigin}/machimusubi/tokyo/invalid-line/`,
    },
];

describe('/{pref}/{line}-line/ E2E', () => {
    let browser: puppeteer.Browser;
    let page: puppeteer.Page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: isHeadless
        });
         page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    Object.entries(linesData.data.result).forEach(([id,line]) => {
        let url = `${homesOrigin}/machimusubi/tokyo/${line.roman}-line/`;
        
        describe(`Test valid station detail: ${url}`, () => {
            beforeAll(async () => {
                page = await browser.newPage();
                await page.goto(url);
                await page.waitForSelector(".contents");
            });
    
            afterAll(async () => {
                await page.close();
            });
            
            it('should contain more than 1 element inside stationList class', async () => {
                const stationListElements = await page.$$(
                '.stationList'
                ); 
                
                expect(stationListElements.length).toBeGreaterThan(0);
            });

            test(`Check page title`, async () => {
                const pageTitle = await page.title();
                expect(pageTitle).toEqual(`【ホームズ】${line.name}の駅から街情報・住みやすさを調べる｜まちむすび`)
            });

            test(`Success 200`, () => {
                page.on('response', (response) => {
                    expect(response.status()).toEqual(200);
                })
            });
        });
    })
    
    describe(`Invalid Urls`, () => {
        invalidUrlTest.forEach(function( one_invalid_item: InvalidItem ) {
            describe(`${one_invalid_item.name} prefecture: ${one_invalid_item.url}`, () => {    
                beforeAll(async () => {
                    page = await browser.newPage();
                    await page.goto(one_invalid_item.url);
                    await page.waitForSelector(".contents");
                });
        
                afterAll(async () => {
                    await page.close();
                });
    
                test(`Check Page Title`, async () => {
                    const pageTitle = await page.title();
                    expect(pageTitle).toContain("【ホームズ】404 Not Found｜まちむすび")
                });
    
                test(`Error 404`, () => {
                    page.on('response', (response) => {
                        expect(response.status()).toEqual(404);
                    })
                });
            })
        });
    })
});