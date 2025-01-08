import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { logger } from "@/utils/logger";

export async function scrapeWebsite(url: string) {
  let browser;

  try {
    logger.debug("Starting scraping process for:", url);

    const options = process.env.AWS_LAMBDA_FUNCTION_VERSION
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        }
      : {
          args: [],
          executablePath:
            process.platform === "darwin" && process.arch === "arm64"
              ? process.env.CHROME_PATH ||
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
              : process.platform === "win32"
              ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
              : "/usr/bin/google-chrome",
          headless: true,
        };

    logger.debug("Launching browser with options:", options);
    browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );

    logger.debug("Navigating to URL:", url);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const clickReadMore = async (buttonXPath: string) => {
      try {
        await page.waitForXPath(buttonXPath, { timeout: 5000 });
        const [button] = await page.$x(buttonXPath);
        if (button) {
          await button.click();
          await page.waitForTimeout(1000);
        }
      } catch (error) {
        logger.debug(`Button not found or not clickable: ${buttonXPath}`);
      }
    };

    await clickReadMore(
      '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[2]/p/button'
    );
    await clickReadMore(
      '//*[@id="app"]/main/div/article/div[2]/div/div[4]/section[5]/p/button'
    );

    const getTextContent = async (xpath: string) => {
      try {
        await page.waitForXPath(xpath, { timeout: 5000 });
        const [element] = await page.$x(xpath);
        if (element) {
          const text = await page.evaluate((el) => el.textContent, element);
          return text?.trim() || null;
        }
        return null;
      } catch (error) {
        logger.debug(`Element not found: ${xpath}`);
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

    logger.debug("Scraping completed successfully:", results);
    return results;
  } catch (error: unknown) {
    logger.error("Error during scraping:", error);
    throw new Error(
      `Failed to scrape website: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
        logger.debug("Browser closed successfully");
      } catch (error: unknown) {
        logger.error("Error closing browser:", error);
      }
    }
  }
}
