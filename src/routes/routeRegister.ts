import {
  RouteMap,
  RouteRegister,
  RouteRegistration,
  Registerable,
} from './types'


class RoutesProxy implements RouteRegister {

  private map: RouteMap = new Map()

  private static defaultRegistration: RouteRegistration = {
    label: '',
    path: '/'
  }

  public get = (key: string) => {
    return this.map.get(key) || RoutesProxy.defaultRegistration
  }

  public set = (key: string, value: RouteRegistration): RouteMap => {
    if (this.map.has(key)) {
      this.delete(key)
    }

    return this.map.set(key, value)
  }

  public register = ({ registration: { label, path } }: Registerable) => {
    const key = label.toLowerCase()
    return this.set(key, { label, path })
  }

  public clear = () => this.map.clear()

  public delete = (key: string): boolean => this.map.delete(key)
}

export const routeRegister: RouteRegister = new RoutesProxy()
