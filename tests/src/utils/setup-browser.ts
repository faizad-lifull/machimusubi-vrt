import puppeteer, { Browser, Page } from 'puppeteer';
import { jestTimeout } from './constants';

jest.setTimeout(jestTimeout);

export const setupBrowser = async (url?: string) => {
    let browser: Browser;
    let page: Page;

    // Launch the browser and open a new page
    browser = await puppeteer.launch({
        headless:true,
        defaultViewport: null, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 0
    });

    page = await browser.newPage();

    if(url){
        console.log(url)
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Check for unsuccessful response or redirection
        if (response?.status() !== 200 || response?.request().redirectChain().length) {
            await browser.close();
            throw new Error('Failed to load the page or redirected.');
        }

        // Wait for specific element to load
        await page.waitForSelector('.contents');

    }
    
    // Return an object with methods to access the browser and page
    return { browser, page };
};
