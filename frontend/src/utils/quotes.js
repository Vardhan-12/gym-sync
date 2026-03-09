export const quotes = [
  "Push yourself because no one else will do it for you.",
  "Success starts with self discipline.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Great things never come from comfort zones.",
  "Consistency beats motivation.",
  "Train insane or remain the same.",
  "Your only competition is yesterday's you.",
  "The body achieves what the mind believes."
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}