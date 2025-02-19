import puppeteer from 'puppeteer';
import express from 'express';

const app = express();

const port = 3000;


app.get('/', (req, res) => {

  res.send('Hello World!');

});


app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`);

});


async function willysSearch() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    try {
      await page.goto('https://www.willys.se/');
      await page.setViewport({ width: 1080, height: 1024 });
  
      // Cookie handling (as you already have it):
      try {
        await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 });
        await page.click('#onetrust-accept-btn-handler');
        console.log("Accepted cookies.");
      } catch (error) {
        console.log("Could not find or click 'Accept All' button:", error);
      }
  
      await page.locator('input[name="search"]').fill('pepsi');
      await page.locator('[data-testid="search-button"]').click();
  
      const redirectCheck = await page.waitForSelector(
        'text/Visar resultat för',);
  
      // Check if the element was found before trying to evaluate:
      if (redirectCheck) {
        const textSelector = await page.locator('[data-testid="grid"]').waitHandle(); 
        const fullTitle = await textSelector.evaluate(el => el.innerText);
        console.log("Product title:", fullTitle);
      } else {
        console.log("Product element not found after waiting.");
      }
  
  
    } catch (error) {
      console.error('Error during search or title extraction:', error);
    } finally {
      await browser.close();
    }
  }
  
  willysSearch();