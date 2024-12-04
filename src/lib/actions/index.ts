'use server'

import { profile, rules } from '@/utils/rules'
import { queryGPT } from '@/utils/gpt'
import { scrapeWebsite } from '@/utils/scrap'

export async function scrapeAndGetApplication(houseSittingUrl: string) {
  if (!houseSittingUrl) return

  try {
    const houseSitting = await scrapeWebsite(houseSittingUrl)

    if (!houseSitting) return

    let prompt = `Based on our profile: ${profile} \n
    Now follow these rules:
    ${rules.toString()} \n

    They live in ${houseSitting.place} and their name is(are) ${
      houseSitting.parentName
    }

    This is their introduction:
    ${houseSitting.introduction} \n
    ${houseSitting.responsibilities}

    Write an application to ${
      houseSitting.parentName
    } expressing our desire to look after their pets
    `

    const application = await queryGPT(prompt)

    return application

    // revalidatePath(`/products/${newProduct._id}`)
  } catch (error: any) {
    throw new Error(`Failed to get application: ${error.message}`)
  }
}
