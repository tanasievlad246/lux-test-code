# Test Case Specification: Searching for a Product on EMAG
____

**Test Case ID**: TC001
**Title**: Verify the consistency of product details when searching for a product on EMAG
**Objective**: Ensure that when a product is clicked from the search results, the product's details in the detail page match those in the search results.

## Pre-requisites:
- Have access to EMAG (or any marketplace) on a supported web browser.
- CSV file with search terms is available.

## Test Steps:
1. Open the web browser.
2. Navigate to the EMAG website.
3. Read the first word from the CSV file.
4. Enter the word into the search box.
5. Click on the search button.
6. From the search results, note down the name and price of the first product.
7. Click on the first product link to navigate to the product's details page.
8. On the product details page, note down the product name and price.

## Expected Result:
The product name and price from the search results should match the product name and price on the product's details page.

## Post-condition:
The browser can be closed or can be used to repeat the test with the next word from the CSV file.
____
