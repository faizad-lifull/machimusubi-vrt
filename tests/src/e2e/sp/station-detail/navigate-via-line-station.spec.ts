import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { topPage, lines, stations, stationDetail } from "./locators";

const iPhone = puppeteer.KnownDevices['iPhone 13'];
const url: string = `${homesOrigin}/machimusubi/`;

describe("Navigate to Station detail via Lifestyle in the top page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    const { browser: newBrowser, page: newPage } = await setupBrowser(url);
    browser = newBrowser;
    page = newPage;
    await page.emulate(iPhone);
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  it('should navigate from Top Page to Osaka-Umeda Station detail page via "Search by Line/Station"', async () => {
    // Click on "Search by Line/Station" option
    await page.click(topPage.searchByLineStation);
    
    // Select Kinki region
    await page.waitForSelector(topPage.kinkiRegion);
    await page.click(topPage.kinkiRegion);
    
    // Select Osaka line
    await page.waitForSelector(topPage.osakaLine);
    await page.click(topPage.osakaLine);
    
    // Select Hankyu Kobe Main Line
    await page.waitForSelector(lines.hankyuKobeHonsenLine);
    await page.click(lines.hankyuKobeHonsenLine);
    
    // Select Osaka-Umeda Station
    await page.waitForSelector(stations.osakaUmedaStation);
    await page.click(stations.osakaUmedaStation);

    // Verify that we've reached the correct station detail page
    await page.waitForSelector(stationDetail.stationNameHeader);
    const stationName = await page.$eval(stationDetail.stationNameHeader, el => el.textContent);
    expect(stationName).toBe('大阪梅田駅');
  });
});
