interface AnchorDescriptor {
	label: string,
	path: string,
}

export function makeAnchor({ label, path }: AnchorDescriptor) {
	return `<a href="${path}">${label}</a>`
}