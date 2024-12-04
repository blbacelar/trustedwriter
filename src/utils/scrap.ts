import puppeteer, { ElementHandle } from 'puppeteer'

export async function scrapeWebsite(url: string) {
  const browser = await puppeteer.launch({
    headless: true, // Changed from false to true
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional arguments for headless mode
  })

  const clickIfXPathExists = async (xpath: string) => {
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      const element = elements[0] as unknown as ElementHandle<Element>
      await element.click()
    }
  }

  const scrollUntilVisible = async (xpath: string, maxScrolls = 10) => {
    let scrolls = 0
    while (scrolls < maxScrolls) {
      const found = await page.$x(xpath)
      if (found.length > 0) return true

      await page.evaluate(() => window.scrollBy(0, window.innerHeight))
      await page.waitForTimeout(500)

      scrolls++
    }
    return false
  }

  // Example XPath - replace with your actual XPath
  const introductionXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[2]/p'

  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  )
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url)

  try {
    await page.waitForXPath(introductionXPath, {
      visible: true,
      timeout: 10000
    })
  } catch (error) {
    console.error('Error waiting for introduction element:', error)
    return null // Or handle the error as appropriate
  }

  const readMore =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[2]/p/button'
  const readMore2 =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[5]/p/button'

  if (await scrollUntilVisible(readMore)) {
    await clickIfXPathExists(readMore)
  } else {
    console.log('Element not found or could not scroll to element')
  }

  const responsibilitiesXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[5]/p'
  const placeXPath = '/html/body/div[1]/main/div/article/div[2]/div/div[1]/div'
  const parentNameXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[3]/div[1]/div/div[2]/div/div/div[1]'

  const introductionElement = (await page.$x(introductionXPath))[0]
  const placeElement = (await page.$x(placeXPath))[0]
  const parentNameElement = (await page.$x(parentNameXPath))[0]

  const found = await scrollUntilVisible(readMore2)
  if (found) {
    await clickIfXPathExists(readMore2)
  } else {
    console.log('Element not found or could not scroll to element 2')
  }

  const responsibilitiesElement = (await page.$x(responsibilitiesXPath))[0]

  const results = {
    introduction: introductionElement
      ? await page.evaluate(el => el.textContent, introductionElement)
      : null,
    responsibilities: responsibilitiesElement
      ? await page.evaluate(el => el.textContent, responsibilitiesElement)
      : null,
    place: placeElement
      ? await page.evaluate(el => el.textContent, placeElement)
      : null,
    parentName: parentNameElement
      ? await page.evaluate(el => el.textContent, parentNameElement)
      : null
  }

  await browser.close()
  return results
}
