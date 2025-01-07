import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { logger } from "@/utils/logger";

export async function scrapeWebsite(url: string) {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.NODE_ENV === "production"
          ? await chromium.executablePath
          : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : process.platform === "win32"
          ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          : "/usr/bin/google-chrome",
      headless: true,
      ignoreDefaultArgs: false,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Click "Read More" buttons first
    const clickReadMore = async (buttonXPath: string) => {
      try {
        const text = await page.evaluate((xpath) => {
          const button = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue as HTMLButtonElement;
          if (button) button.click();
          return true;
        }, buttonXPath);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for content to expand
        return text;
      } catch (error) {
        logger.error(`Error clicking button ${buttonXPath}:`, error);
        return null;
      }
    };

    // Click both "Read More" buttons
    await clickReadMore(
      '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[2]/p/button'
    );
    await clickReadMore(
      '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[5]/p/button'
    );

    // Extract text content directly without waiting for specific elements
    const getTextContent = async (xpath: string) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const text = await page.evaluate((xpath) => {
          const element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          return element?.textContent?.trim() || null;
        }, xpath);

        logger.debug(`Found text for ${xpath}: ${text?.substring(0, 100)}...`);
        return text;
      } catch (error) {
        logger.error(`Error getting text content for ${xpath}:`, error);
        return null;
      }
    };

    const results = {
      introduction: await getTextContent(
        '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[2]/p'
      ),
      responsibilities: await getTextContent(
        '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[5]/p'
      ),
      place: await getTextContent(
        '//*[@id="app"]/main/div/article/div[2]/div/div[1]/div'
      ),
      parentName: await getTextContent(
        '//*[@id="app"]/main/div/article/div[2]/div/div[3]/div[1]/div/div[2]/div/div/div[1]'
      ),
    };

    return results;
  } catch (error) {
    logger.error("Error scraping website:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
