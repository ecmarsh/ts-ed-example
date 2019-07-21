import { styleInline } from '..'
import { clearDocument } from '../../tests/testUtils'

afterAll(() => clearDocument())

describe('styleInline', () => {
  const colorStyle = styleInline('color')
  const colorStyleRed = colorStyle('red')

  it('Returns partially applied function on first call', () => {
    expect(colorStyle).toBeInstanceOf(Function)
  })

  it('Returns inline style with value on second call', () => {
    expect(typeof colorStyleRed).toMatch('string')
  })

  it('Provides valid inline style markup', () => {
    const redDiv = `<p ${colorStyleRed}></p>`
    document.body.innerHTML = redDiv
    const p = document.querySelector('p') as HTMLElement
    expect(p).not.toBeNull()
    expect(p.style.color).toMatch('red')
  })
})
