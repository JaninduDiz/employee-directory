import { QUOTE_API_BASE_URL } from "../constants";

import { Quote } from "../types";

export async function fetchRandomQuote(): Promise<Quote> {
  const response = await fetch(QUOTE_API_BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch quote");

  const data = await response.json();

  const item = data[0];

  return {
    quote: item.content,
    author: item.author,
  };
}
