import { makeInput } from '..'
import { clearDocument } from '../../tests/testUtils'


beforeEach(() => clearDocument())
afterAll(() => clearDocument())

describe('makeInput', () => {
  it('Makes valid input markup', () => {
    document.body.innerHTML = makeInput('text')
    const input = document.querySelector('input')
    expect(input).toBeInstanceOf(HTMLInputElement)
  })

  it('Makes valid number input with different name', () => {
    document.body.innerHTML = makeInput('age', 'number')
    const numberInput =
      document.querySelector('input[type="number"]') as HTMLInputElement
    expect(numberInput).toBeInstanceOf(HTMLInputElement)
    expect(numberInput.name).toBe('age')
  })

  it('Makes a label for input', () => {
    document.body.innerHTML = makeInput('password')
    const labelForPassword =
      document.querySelector('label[for="password"]') as HTMLLabelElement
    expect(labelForPassword).toBeInstanceOf(HTMLLabelElement)
    expect(labelForPassword.textContent).toMatch('password')
  })
})
