type AnchorDescriptor = {
	label: string,
	path: string,
}

type MakeAnchor = ({ label, path }: AnchorDescriptor) => string

export const makeAnchor: MakeAnchor = ({ label, path }) => {
	return `<a href="${path}">${label}</a>`
}