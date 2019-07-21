export const clearDocument = (): void => {
  document.body.innerHTML = ''
}

export const mount = (text: string): void => {
  document.body.innerHTML = text
}