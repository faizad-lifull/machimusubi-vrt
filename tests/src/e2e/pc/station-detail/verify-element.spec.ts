import * as puppeteer from "puppeteer";
import { homesOrigin } from "../../../utils/constants";
import { setupBrowser } from "../../../utils/setup-browser";
import { stationDetail } from "./locators";

const url: string = `${homesOrigin}/machimusubi/tokyo/heiwadai_06376-st/`;

describe("Station Detail Page", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let response: puppeteer.HTTPResponse | null;

  beforeAll(async () => {
    const { browser: newBrowser, page: newPage } = await setupBrowser(url);
    browser = newBrowser;
    page = newPage;
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("Map Section", () => {
    it("should display the map element", async () => {

      const anchorAroundElement = await page.waitForSelector(stationDetail.anchorAround);

      const hrefValue = await anchorAroundElement?.evaluate((el) =>
        el.getAttribute("href")
      );
      expect(hrefValue).toBe("#around");

      await anchorAroundElement?.click();

      await new Promise<void>((resolve) => setTimeout(resolve, 5000));
 
      const mapElement = await page.$(stationDetail.mapCanvas);
      expect(await mapElement?.isIntersectingViewport()).toBe(true);
    });
  });

  describe("Reviews Section", () => {
    it("should display area reviews", async () => {
      const reviewContentElement = await page.$(stationDetail.reviewContent);

      await reviewContentElement?.evaluate(element => {
        element.scrollIntoView({ behavior: 'smooth' }); 
      });

      await new Promise<void>((resolve) => setTimeout(resolve, 5000));

      const reviewElements = await page.$$(stationDetail.areaReviews);
      expect(reviewElements.length).toBeGreaterThan(0);
      for (const reviewElement of reviewElements) {
        expect(await reviewElement.isIntersectingViewport()).toBe(true);
      }
    });
  });

  describe("Navigation Links", () => {
    it("should have correct href for property list link", async () => {
      const propertyList = await page.$eval(
        stationDetail.propertyListLink,
        (el: Element) => (el as HTMLAnchorElement).href
      );
      expect(propertyList).toContain(
        `${homesOrigin}/chintai/tokyo/heiwadai_06376-st/list/?cond%5Bmadori%5D%5B11%5D=11`
      );
    });

    it("should have correct href for more list link", async () => {
      const moreList = await page.$eval(
        stationDetail.moreListLink,
        (el: Element) => (el as HTMLAnchorElement).href
      );
      expect(moreList).toBe(`${homesOrigin}/chintai/tokyo/heiwadai_06376-st/list/`);
    });

    it("should have correct href for map list link", async () => {
      const mapListLink = await page.$eval(
        stationDetail.mapListLink,
        (el: Element) => (el as HTMLAnchorElement).href
      );
      expect(mapListLink).toBe(`${homesOrigin}/chintai/tokyo/heiwadai_06376-st/map/`);
    });
  });

  describe("Sidebar Rent Link", () => {
    it("should have correct href and navigate to the correct section", async () => {
      const rentLink = await page.waitForSelector(stationDetail.rentLink);

      const hrefValue = await rentLink?.evaluate((el) =>
        el.getAttribute("href")
      );
      expect(hrefValue).toBe("#rate");

      await rentLink?.click();

      await new Promise<void>((resolve) => setTimeout(resolve, 5000));

      const rateElement = await page.$(stationDetail.rateSection);
      expect(await rateElement?.isIntersectingViewport()).toBe(true);
    });
  });

  describe("Average Rent Section", () => {
    it("should display the average rent and 万円", async () => {
      const averageRentElement = await page.waitForSelector(stationDetail.rentingRate);
      
      const averageRentText = await averageRentElement?.evaluate(el => el.textContent);

      const numberAndManYen = /\d+(\.\d+)?万円/;
      
      expect(averageRentText).toMatch(numberAndManYen);
    });
  });

  
});
