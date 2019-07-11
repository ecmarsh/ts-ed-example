import { makeAnchor } from '..'
import { clearDocument } from './utils'


beforeAll(() => document.body.innerHTML = makeAnchor(route))
afterAll(() => clearDocument());

const route = {
  label: 'Link',
  path: '/link'
}

describe('makeAnchor', () => {
  it('Makes valid anchor markup', () => {
    expect(document.querySelector('a')).toBeInstanceOf(HTMLAnchorElement)
  })

  it('Adds the href to link', () => {
    const path = RegExp(`${route.path}$`)
    expect(document.querySelector('a')!.href).toMatch(path)
  })

  it('Renders the anchor text', () => {
    expect(document.querySelector('a')!.textContent).toMatch(route.label)
  })
})
