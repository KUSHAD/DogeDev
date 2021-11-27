export default function intFormatter(_number) {
	const userLang = navigator.language || navigator.userLanguage;
	const FORMATTER = new Intl.NumberFormat(userLang, {
		maximumFractionDigits: 0,
	});
	return FORMATTER.format(Number(_number));
}
