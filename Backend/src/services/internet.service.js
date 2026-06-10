import { tavily as Tavily } from "@tavily/core";
const tavily = Tavily({ apiKey: process.env.TAVILY_KEY });


export const internetSearch = async (query) => {
    const response = await tavily.search(query, {
        searchDepth: "advanced",
        maxResults: 3,

    })

    return JSON.stringify(response)
}