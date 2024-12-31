import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import * as puppeteer from "puppeteer";

import { getHomesOrigin } from "../../utils/homes.origin";
import { userAgent, viewport } from "../../utils/constants";

import { pagePatterns } from "../locators";

function outputDir(mode: "master" | "targets"): string {
  return join(
    cwd(),
    "src/vrt/screenshots/outputs",
    mode === "master" ? "master" : "targets/img"
  );
}

function pathToFileName(path: string, deviceType: "sp" | "pc"): string {
  // パスのスラッシュをハイフンに置換してファイル名として利用できる文字列にする
  return (
    `${deviceType}-` +
    path
      .replaceAll(/[/?=,]/g, "-")
      .replace(/^-/, "")
      .replace(/-$/, "")
  );
}

async function screenshot(
  browser: puppeteer.Browser,
  path: string,
  maskingSelectors: string[] | undefined,
  selectors: string[] | undefined,
  stage: string,
  destination: string,
  deviceType: "sp" | "pc"
): Promise<void> {
  const url = join(getHomesOrigin(stage), path);
  console.log(`Screenshotting ${url} to ${destination}`);
  const page = await browser.newPage();
  await page.setUserAgent(userAgent[deviceType]);
  await page.setViewport(viewport[deviceType]);
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 0
  });
  if (maskingSelectors) {
    await page.evaluate((maskingSelectors) => {
      for (const selector of maskingSelectors) {
        document.querySelectorAll(selector).forEach((node) => {
          node.textContent = "****";
        });
      }
    }, maskingSelectors);
  }

  if (selectors) {
    for (const selector of selectors) {
      const element = await page.waitForSelector(selector, { timeout: 60000 });
      let destinationSelector = destination.replace(
        /\.jpeg$/,
        `-${selector}.jpeg`
      );
      if (element) {
        await element.screenshot({ path: destinationSelector });
      }
    }
  } else {
    await autoScroll(page);
    await page.screenshot({ path: destination, fullPage: true, type: "jpeg" });
  }
  await page.close();
}

async function autoScroll(page: puppeteer.Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function main(): Promise<void> {
  const mode = process.env.MODE === "master" ? "master" : "targets";
  const stage = mode === "master" ? "test" : process.env.STAGE ?? "test";

  const browser = await puppeteer.launch({
    headless: true,
    timeout: 10 * 10000,
  });

  if (!existsSync(outputDir(mode))) {
    mkdirSync(outputDir(mode), { recursive: true });
  }

  for (const pagePattern of pagePatterns) {
    if (Array.isArray(pagePattern.deviceType)) {
      for (const device of pagePattern.deviceType) {
        const specificScreenshotImageName = pagePattern.describe
          ? pathToFileName(pagePattern.describe, device)
          : pathToFileName(pagePattern.path, device);
        const specificDestination = join(
          outputDir(mode),
          `${specificScreenshotImageName}.jpeg`
        );
        await screenshot(
          browser,
          pagePattern.path,
          pagePattern.maskingSelectors,
          pagePattern.selectors,
          stage,
          specificDestination,
          device
        );
      }
    } else {
      const screenshotImageName = pagePattern.describe
        ? pathToFileName(pagePattern.describe, pagePattern.deviceType)
        : pathToFileName(pagePattern.path, pagePattern.deviceType);
      const destination = join(outputDir(mode), `${screenshotImageName}.jpeg`);

      await screenshot(
        browser,
        pagePattern.path,
        pagePattern.maskingSelectors,
        pagePattern.selectors,
        stage,
        destination,
        pagePattern.deviceType
      );
    }
  }

  await browser.close();
}

main();
