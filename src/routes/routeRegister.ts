import {
	RouteMap,
	RouteRegister,
	RouteRegistration,
	Registerable,
	RoutesCallback
} from './types'


class Routes implements RouteRegister {
	static defaultRegistration: RouteRegistration = {
		label: '',
		path: '/'
	}

	private map: RouteMap

	constructor() {
		this.map = new Map()
	}

	get = (key: string) => {
		return this.map.get(key) || Routes.defaultRegistration
	}

	set = (key: string, value: RouteRegistration): RouteMap => {
		if (this.map.has(key)) {
			this.delete(key)
		}

		return this.map.set(key, value)
	}

	register = ({ registration: { label, path } }: Registerable) => {
		const key = label.toLowerCase()
		return this.set(key, { label, path })
	}

	forEach = (callback: RoutesCallback, thisArg?: any): void => {
		this.map.forEach(callback, thisArg)
	}

	clear = () => this.map.clear()

	delete = (key: string): boolean => this.map.delete(key)
}

export const routeRegister: RouteRegister = new Routes()
