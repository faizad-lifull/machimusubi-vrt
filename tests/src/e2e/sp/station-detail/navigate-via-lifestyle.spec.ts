import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { topPage,lifeStyle,stations,stationDetail } from "./locators";

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

  it('should navigate from Top Page to station detail page via "Search by Lifestyle"', async () => {
    // Navigate to Lifestyle page
    await page.click(topPage.lifestyleSmallLink);
    await page.waitForSelector(topPage.kinkiRegionLink);

    // Select Kinki region
    await page.click(topPage.kinkiRegionLink);
    await page.waitForSelector(topPage.osakaLifestyleLink);

    // Select Osaka lifestyle
    await page.click(topPage.osakaLifestyleLink);
    await page.waitForSelector(lifeStyle.personalListSecondItem);

    // Select second item from personal list
    await page.click(lifeStyle.personalListSecondItem);
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));
    await page.waitForSelector(lifeStyle.searchButton, { timeout: 10000 });

    // Perform search
    await page.click(lifeStyle.searchButton);
    await page.waitForSelector(stations.umedaStationLink);

    // Navigate to Umeda station detail page
    await page.click(stations.umedaStationLink);
    await page.waitForSelector(stationDetail.stationNameHeader);

    // Verify station name
    const stationName = await page.$eval(stationDetail.stationNameHeader, el => el.textContent);
    expect(stationName).toBe('梅田駅');
  });
});

