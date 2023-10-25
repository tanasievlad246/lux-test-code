import {
  test,
  expect,
  Page,
} from '@playwright/test';
import { getSearchTermsFromCSV } from '../util';
import * as path from 'path';

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

const targetUrl = 'https://www.emag.ro/';
const csvFilePath = path.join(__dirname, '..', 'searchTerms.csv');
const productsToCompare: ProductComparison[] = [];

test.describe('Verify the consistency of product details when searching for a product on EMAG', async () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    page.setDefaultTimeout(60000)
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should have the same product name on the search page and on the product page', async () => {
    const searchTerms = await getSearchTermsFromCSV(csvFilePath);

    for (const term of searchTerms) {
      await page.goto(targetUrl);
      await page.fill('input[type="search"][id="searchboxTrigger"][name="query"]', term);
      await page.click('button[class="btn btn-default searchbox-submit-button"]');
      await page.waitForSelector('.card-v2-title');

      const productName = await page.$eval('.card-v2-title', el => el.textContent);
      const productPrice = await page.$eval('.product-new-price', el => el.textContent);

      await page.click('a[class="card-v2-title semibold mrg-btm-xxs js-product-url"]');
      await page.waitForSelector('.page-title');

      const productPageTitle = await page.$eval('h1[class="page-title"]', el => el.textContent);
      const productPagePrice = await page.$eval('p[class="product-new-price"]', el => el.textContent);

      const productComparison: ProductComparison = {
        productName,
        productPrice,
        productPageTitle: productPageTitle!.replace(/\n/g, '').trim(),
        productPagePrice,
      };
      productsToCompare.push(productComparison);
    }

    for (const product of productsToCompare) {
      expect(product.productName).toBe(product.productPageTitle);
    }
  });
});