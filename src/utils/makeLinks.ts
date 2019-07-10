import { RouteRegistration } from '../routes/types'

export function makeLinks(routes: RouteRegistration[]): string {
	let links: string[] = []
	routes.forEach(route => {
		const { label, path } = route
		const link = makeLink({ label, path })
		links.push(link)
	})

	return links.join(`<br/>`)
}

export function makeLink({ label, path }: RouteRegistration) {
	return `<a href="${path}">${label}</a>`
}