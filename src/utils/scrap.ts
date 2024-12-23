import { chromium } from "@playwright/test";
import { logger } from "@/utils/logger";

export async function scrapeWebsite(url: string) {
  let browser;

  try {
    // Different launch options for production vs development
    const launchOptions =
      process.env.NODE_ENV === "production"
        ? {
            headless: true,
            chromiumSandbox: false,
            args: [
              "--disable-gpu",
              "--disable-setuid-sandbox",
              "--no-sandbox",
              "--no-zygote",
              "--disable-dev-shm-usage",
              "--disable-accelerated-2d-canvas",
              "--disable-web-security",
            ],
          }
        : {
            headless: true,
          };

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      navigationTimeout: 30000,
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // XPaths for elements to scrape
    const xpaths = {
      introduction: "//div[contains(@class, 'article')]//section[2]/p",
      responsibilities: "//div[contains(@class, 'article')]//section[5]/p",
      place: "//div[contains(@class, 'article')]//div[1]/div",
      parentName:
        "//div[contains(@class, 'article')]//div[3]/div[1]/div/div[2]/div/div/div[1]",
      readMore1: "//div[contains(@class, 'article')]//section[2]/p/button",
      readMore2: "//div[contains(@class, 'article')]//section[5]/p/button",
    };

    // Click "Read More" buttons if they exist
    for (const buttonXPath of [xpaths.readMore1, xpaths.readMore2]) {
      try {
        await page.waitForSelector(`xpath=${buttonXPath}`, { timeout: 5000 });
        await page.click(`xpath=${buttonXPath}`);
        await page.waitForTimeout(1000); // Wait for content to load
      } catch (err) {
        logger.debug(`Button not found or not clickable: ${buttonXPath}`);
      }
    }

    // Extract text content
    const getTextContent = async (xpath: string) => {
      try {
        const element = await page.waitForSelector(`xpath=${xpath}`, {
          timeout: 5000,
        });
        return element ? (await element.textContent())?.trim() || null : null;
      } catch {
        return null;
      }
    };

    const results = {
      introduction: await getTextContent(xpaths.introduction),
      responsibilities: await getTextContent(xpaths.responsibilities),
      place: await getTextContent(xpaths.place),
      parentName: await getTextContent(xpaths.parentName),
    };

    return results;
  } catch (error) {
    logger.error("Error scraping website:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
