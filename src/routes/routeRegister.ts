import { RouteRegister, HasRegistration } from './types'

export const routeRegister: RouteRegister = new Map()

export function register({ registration: { label, path } }: HasRegistration) {
	routeRegister.set(label.toLowerCase(), { label, path })
}
