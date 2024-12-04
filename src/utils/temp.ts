import puppeteer, { ElementHandle } from 'puppeteer'

export async function scrapeWebsite(url: string) {
  const browser = await puppeteer.launch({
    headless: false, // Set headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional arguments for headless mode
  })

  const clickIfXPathExists = async (xpath: string) => {
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      // Cast the ElementHandle<Node> to ElementHandle<Element> using 'as'
      const element = elements[0] as unknown as ElementHandle<Element>
      await element.click()
      await page.waitForNavigation({ waitUntil: 'networkidle2' })
    }
  }

  const readMore =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[2]/p/button'
  const readMore2 =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[5]/p/button'

  await clickIfXPathExists(readMore)
  await clickIfXPathExists(readMore2)

  // Example XPath - replace with your actual XPath
  const introductionXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[2]/p/span'

  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  )
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url)

  await page.waitForXPath(introductionXPath)

  const responsibilitiesXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[4]/section[5]/p'
  const placeXPath = '/html/body/div[1]/main/div/article/div[2]/div/div[1]/div'
  const parentNameXPath =
    '/html/body/div[1]/main/div/article/div[2]/div/div[3]/div[1]/div/div[2]/div/div/div[1]'

  // Evaluate XPath and extract text
  const introductionElement = (await page.$x(introductionXPath))[0]
  const responsibilitiesElement = (await page.$x(responsibilitiesXPath))[0]
  const placeElement = (await page.$x(placeXPath))[0]
  const parentNameElement = (await page.$x(parentNameXPath))[0]

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
