import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { topPage,lines,stations,stationDetail } from "./locators";
 
const url: string = `${homesOrigin}/machimusubi/`;

describe("Navigate to Station detail via Line Station in the top page", () => {
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
    it('should navigate from Top Page to Tokyo Station detail page via "Search by Line/Station"', async () => {
      await page.click(topPage.lineStationLink);
      await page.waitForSelector(topPage.lineLink);
      await page.click(topPage.lineLink); 
 
      await page.waitForSelector(lines.yamanoteLineLink);
      await page.click(lines.yamanoteLineLink); 
      
      await page.waitForSelector(stations.tokyoStationLink);
      await page.click(stations.tokyoStationLink);

      await page.waitForSelector(stationDetail.stationHeading);
      const stationTitle = await page.$eval(
        stationDetail.stationHeading,
        (el: Element) => el.textContent
      );
      expect(stationTitle).toBe("東京駅");
    });
  });
});
