import * as puppeteer from 'puppeteer';
import {tealiumTestConfig} from './tealium.spec.config';
import {getHomesOrigin} from '../../../utils/homes.origin';
import { setupBrowser } from '../../../utils/setup-browser';

// Puppeteerによるブラウザ操作が時間を要するので
// Jest のテストケース毎のタイムアウト時間を10秒に延長する
jest.setTimeout(20 * 1000);

type UtagData = Record<string, string | string[] | number>;
declare global {
  interface Window {
    utag_data: UtagData;
  }
}

const homesOrigin = getHomesOrigin(process.env.STAGE ?? '');

const getUtagData = async (page: puppeteer.Page): Promise<UtagData> => {
  const utagData = await page.evaluate(() => window.utag_data);

  return utagData;
};

describe('Tealium E2Eテスト', () => {
  let browser: puppeteer.Browser;
  beforeAll(async () => {
     const { browser: newBrowser, page: newPage } = await setupBrowser();

        browser = newBrowser;
  });

  afterAll(async () => {
    await browser.close();
  });

  tealiumTestConfig.testCases.forEach(testCase => {
    describe(`${testCase.description}の window.utag_data のチェック`, () => {
      const targetUrl = `${homesOrigin}${testCase.path}`;
      let page: puppeteer.Page;
      let utagData: UtagData;
      beforeAll(async () => {
        page = await browser.newPage();
        await page.setUserAgent(testCase.userAgent);
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
          if (targetUrl === interceptedRequest.url()) {
            interceptedRequest.continue();
          } else {
            interceptedRequest.abort();
          }
        });
        await page.goto(targetUrl);
        utagData = await getUtagData(page);
      });

      afterAll(async () => {
        await page.close();
      });

      // window.utag_data のパラメータを1つずつ期待した値になっていることをイテレーションを回して確認する
      Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
        // 期待値にマッチャ関数が指定されている場合には JSON.stringify すると undefined になってしまう上に
        // 特定の値を指定していないため、テストケース名を生成する際に不都合だった
        // マッチャ関数が指定されている場合には、その関数名をケース名に含め、テスト結果をみてソースコードを grep することができるようにするため、
        // やや実装は気持ち悪いがこのように対応している
        switch (typeof expectedValue) {
          case 'function': {
            test(`utag_data.${key}において ${expectedValue.name} マッチャがtrueを返す値であること`, () => {
              expect(expectedValue(utagData[key])).toBe(true);
            });
            break;
          }
          default: {
            test(`utag_data.${key}が ${JSON.stringify(
              expectedValue
            )} であること`, () => {
              expect(utagData[key]).toStrictEqual(expectedValue);
            });
            break;
          }
        }
      });
    });
  });
});
