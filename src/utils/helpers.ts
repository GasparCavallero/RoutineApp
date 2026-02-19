export function roundToStep(value: number, step: number) {
	return Math.round(value / step) * step;
}

export function formatDate(dateIso: string) {
	return new Date(dateIso).toLocaleDateString();
}

export function formatDateTime(dateIso: string) {
	return new Date(dateIso).toLocaleString();
}

export function toKg(value: number) {
	return `${value.toFixed(1)} kg`;
}
