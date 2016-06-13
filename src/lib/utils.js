export const getVersionMetaData = ({ description }) => {
	if (!description) return {};
	const reviver = (k, v) => {
		if (k === 'version') return v.replace(/v/gi, '');
		return v;
	};
	return JSON.parse(
		// need to escape new line or tab characters to parse
		description.replace('\n', '\\n').replace('\t', '\\t'),
		reviver
	);
};
