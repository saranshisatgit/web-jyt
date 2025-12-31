import { cache } from "react"

import { fetchPage, getBlockByType, type Block, type Page } from "@/medu/queries"

export interface SiteData {
  homePage: Page
  navBlock?: Block
  footerBlock?: Block
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const homePage = await fetchPage("jaalyantra.com", "home")

  const navBlock = getBlockByType(homePage.blocks, "Header")
  const footerBlock = getBlockByType(homePage.blocks, "Footer")

  return { homePage, navBlock, footerBlock }
})
