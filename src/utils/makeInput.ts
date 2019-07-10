import { styleInline } from '../utils'

export function makeInput(name: string, type?: string): string {
	const textTransform = styleInline('text-transform')
	const capitalize = textTransform('capitalize')

	const markup = `
				<div>
					<label for=${name} ${capitalize}>${name}</label>
					<input type="${type || name}" name="${name}" />
				</div>
			`

	return markup
}