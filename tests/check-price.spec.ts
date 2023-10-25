import {
  test,
  expect,
  chromium,
  firefox,
  webkit,
  BrowserType,
} from '@playwright/test';
import { getSearchTermsFromCSV } from '../util';

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

interface BaseProductComparison {
    productName: string;
    productPrice: string;
    productPageTitle: string;
    productPagePrice: string;
}

type ProductComparison = Nullable<BaseProductComparison>;

const browsers: BrowserType[] = [chromium, firefox, webkit];
const targetUrl = 'https://www.emag.ro/';
const productComparisons: ProductComparison[] = [];

test.describe('Verify the consistency of product details when searching for a product on EMAG', async () => {
  for (const browserType of browsers) {
    const browser = await browserType.launch();
    const page = await browser.newPage();
    const searchTerms = await getSearchTermsFromCSV('../search-terms.csv');

    for (const term of searchTerms) {
      await page.goto(targetUrl);
      await page.fill('input[type="search"][id="searchboxTrigger"][name="query"]', term);
      await page.click('button[class="btn btn-default searchbox-submit-button"]');
      await page.waitForSelector('.card-v2-title');
      const productName = await page.$eval('.card-v2-title', el => el.textContent);
      const productPrice = await page.$eval('.product-new-price', el => el.textContent);
      await page.click('.card-v2-title');
      const productPageTitle = await page.$eval('.page-title', el => el.textContent);
      const productPagePrice = await page.$eval('.product-new-price', el => el.textContent);

      productComparisons.push({
        productName,
        productPrice,
        productPageTitle,
        productPagePrice,
      });
      console.log(productComparisons);
    }

    test(`should have the same price on product page and listing page on browser ${browserType.name()}`, () => {})
  }
});