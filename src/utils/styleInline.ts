export function styleInline(attr: string) {
	return (function addAttr(attr: string) {
		return function addValue(value: string) {
			return `style="${attr}:${value}"`
		}
	})(attr)
}