export const minify = (markup: string): string => {
  const minified = markup
    .replace(/[\n\r\t]/g, '')
    .replace(/\s+\</g, '<')
  return minified
}