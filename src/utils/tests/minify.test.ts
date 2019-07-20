import { minify } from '../minify'

test('minify(markup)', function testMinify() {
  const markup = `
    <div>
      <p>Some text</p>
    </div>
  `

  expect(markup.search(/\s+\</)).not.toEqual(-1)
  expect(markup.search(/\n/)).not.toEqual(-1)

  const minified = minify(markup)
  expect(minified).toMatch(`<div><p>Some text</p></div>`)
})