import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { topPage, stationDetail,lifeStyle,stations } from "./locators";
 
const url: string = `${homesOrigin}/machimusubi/`;

describe("Navigate to Station detail via Lifestyle in the top page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    const { browser: newBrowser, page: newPage } = await setupBrowser(url);
    browser = newBrowser;
    page = newPage;
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  describe("Navigation flow", () => {
    it('should navigate from Top Page to station detail page via "Search by Lifestyle"', async () => {
      await page.click(topPage.lifestyleLink);
      await page.waitForSelector(topPage.osakaLifestyleLink);
      await page.click(topPage.osakaLifestyleLink); 
 
      await page.waitForSelector(lifeStyle.personalListSecondButton);
      await page.click(lifeStyle.personalListSecondButton);
      await new Promise<void>((resolve) => setTimeout(resolve, 5000));
      await page.waitForSelector(lifeStyle.searchButton);
      await page.click(lifeStyle.searchButton); 
 
      await page.waitForSelector(stations.umedaStationLink);
      await page.click(stations.umedaStationLink);
      await page.waitForSelector(stationDetail.stationHeading); 
 
      const stationTitle = await page.$eval(
        stationDetail.stationHeading,
        (el: Element) => el.textContent
      );
      expect(stationTitle).toBe("梅田駅");
    });
  });
});
