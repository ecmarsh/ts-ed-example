// Introduces 'Reflect' into global scope
import 'reflect-metadata'

describe('Reflect-metadata basics', function testMetadataBasics() {
  test('Object metadata as prop', () => {
    const notes = {}

    Reflect.defineMetadata('note', 'TODO', notes)
    expect(notes.hasOwnProperty('note')).toBe(false)

    const note = Reflect.getMetadata('note', notes)
    expect(note).toMatch('TODO')
  })

  test('Metadata on object property', () => {
    const notes = {
      note: 'TODO'
    }

    Reflect.defineMetadata('isCompleted', false, notes, 'note')
    expect(notes).toMatchObject({ note: 'TODO' })

    const status = Reflect.getMetadata('isCompleted', notes, 'note')
    expect(status).toEqual(false)
  })

  test('Metadata object equality effects', () => {
    const noMeta = { note: 'TODO' }
    const withMeta = noMeta

    expect(Object.is(noMeta, withMeta)).toBe(true)

    Reflect.defineMetadata('meta', { extra: true }, withMeta, 'note')
    expect(Object.is(noMeta, withMeta)).toBe(true)
    expect(noMeta).toMatchObject(withMeta)
  })

  test('Param decorator', function testParamMetadata() {
    const isCompleted = Symbol('isCompleted')

    const meta = {
      withStatus: (status: boolean) => {
        return Reflect.metadata(isCompleted, status)
      },
      getStatus: (target: any, prop: string | symbol) => {
        return Reflect.getMetadata(isCompleted, target, prop)
      }
    }

    class Notebook {
      @meta.withStatus(false)
      note: string

      constructor(text: string) {
        this.note = text
      }

      getNoteStatus() {
        return meta.getStatus(this, 'note')
      }
    }

    const notebook = new Notebook('TODO')
    const noteStatus = notebook.getNoteStatus()
    expect(noteStatus).toBe(false)
  })

})
