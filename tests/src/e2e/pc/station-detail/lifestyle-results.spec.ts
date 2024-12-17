import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { lifeStyle, stationDetail } from "./locators";

const url: string = `${homesOrigin}/machimusubi/tokyo/lifestyle/`;

describe("Search by lifestyle' checkbox matches the number of stations on the city list screen.", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let numberResult: String | null;

  beforeAll(async () => {
    const { browser: newBrowser, page: newPage } = await setupBrowser(url);
    browser = newBrowser;
    page = newPage;
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  it("should select lifestyle options「コンビニの数が多い」,「終電が遅くまである」,「運動に適した公園や道がある」and get the number of results", async () => {
    await page.waitForSelector(lifeStyle.manyConvenienceStores);
    await page.click(lifeStyle.manyConvenienceStores);
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));

    await page.waitForSelector(lifeStyle.lateLastTrain);
    await page.click(lifeStyle.lateLastTrain);
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));

    await page.waitForSelector(lifeStyle.nearParks);
    await page.click(lifeStyle.nearParks);
    await new Promise<void>((resolve) => setTimeout(resolve, 5000));

    numberResult = await page.$eval(
      lifeStyle.lifestyleResult,
      (el: Element) => el.textContent
    );
  });

  it("should press search button and compare the number of cassette and banner number at previous page", async () => {
    
    await page.waitForSelector(lifeStyle.searchButton);
    await page.click(lifeStyle.searchButton);

    await page.waitForSelector(stationDetail.lifestyleCassette);
    const stationCount = await page.$$eval(
      `${stationDetail.lifestyleCassette} li`,
      (elements) => elements.length
    );
    expect(Number(numberResult)).toEqual(stationCount);
  });
});
