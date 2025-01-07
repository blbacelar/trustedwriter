import { chromium } from "playwright-core";
import { logger } from "@/utils/logger";

export async function scrapeWebsite(url: string) {
  let browser;

  try {
    const launchOptions = {
      headless: true,
      chromiumSandbox: false,
      args: [
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
    };

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000, // 30 seconds timeout for navigation
    });

    // XPaths for elements to scrape
    const xpaths = {
      introduction: "//div[contains(@class, 'article')]//section[2]/p",
      responsibilities: "//div[contains(@class, 'article')]//section[5]/p",
      place: "//div[contains(@class, 'article')]//div[1]/div",
      parentName:
        '//*[@id="app"]/main/div/article/div[2]/div/div[3]/div[1]/div/div[2]/div/div/div[1]',
      readMore1: "//div[contains(@class, 'article')]//section[2]/p/button",
      readMore2: "//div[contains(@class, 'article')]//section[5]/p/button",
    };

    // Click "Read More" buttons if they exist
    for (const buttonXPath of [xpaths.readMore1, xpaths.readMore2]) {
      try {
        await page.waitForSelector(`xpath=${buttonXPath}`, { timeout: 5000 });
        await page.click(`xpath=${buttonXPath}`);
        await page.waitForTimeout(1000);
      } catch {
        // Silently ignore missing buttons
        continue;
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
    // Only log actual scraping errors in production
    if (process.env.NODE_ENV === "production") {
      logger.error("Error scraping website:", error);
    }
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => {}); // Silently catch close errors
    }
  }
}
