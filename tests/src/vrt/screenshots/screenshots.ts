
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
  // const url = join(getHomesOrigin(stage), path);
  const url = "https://www.google.com";
  console.log(`Screenshotting ${url} to ${destination}`);
  const page = await browser.newPage();

  // Anti-bot detection bypass
  await page.setUserAgent(userAgent[deviceType]);
  await page.setViewport(viewport[deviceType]);
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  // Modify navigator properties to appear more human-like
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "platform", {
      get: () => "Win32",
    });
    Object.defineProperty(navigator, "webdriver", {
      get: () => false,
    });
    Object.defineProperty(navigator, "language", {
      get: () => "en-US",
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
  });

  // Disable bot-friendly features
  const client = await page.target().createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.setUserAgentOverride", {
    userAgent: userAgent[deviceType],
  });
  await client.send("Emulation.setNavigatorOverrides", {
    platform: "Win32",
  });

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 0,
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
      const element = await page.waitForSelector(selector);
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
  const stage = mode === "master" ? "live" : process.env.STAGE ?? "live";

  const browser = await puppeteer.launch({
    headless: true,
    timeout: 10 * 10000,
    args: [
      "--disable-blink-features=AutomationControlled", // Further bot detection bypass
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
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
