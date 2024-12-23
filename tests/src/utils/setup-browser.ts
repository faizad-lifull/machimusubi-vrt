import puppeteer, { Browser, Page } from 'puppeteer';
import { jestTimeout } from './constants';

jest.setTimeout(jestTimeout);

export const setupBrowser = async (url: string, readySelector: string = '.contents') => {
    let browser: Browser | null = null;

    try { 
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null, 
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        // Open a new page
        const page: Page = await browser.newPage();

        // Navigate to the URL
        const response = await page.goto(url, { waitUntil: 'networkidle0' });

        // Validate response
        if (!response || response.status() !== 200 || response.request().redirectChain().length) {
            throw new Error(`Page failed to load. Status: ${response?.status()} URL: ${response?.url()}`);
        }

        // Wait for the page to be ready
        await page.waitForSelector(readySelector);
 
        return { browser, page };
    } catch (error) {
        if (browser) await browser.close(); 
        throw error; 
    }
};
