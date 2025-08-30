/**
 * @param value {number|string}
 * @param [digits=1] 
 * @description
 * Formats large numbers into a short human-readable form.
 * Examples:
 *  - 950 -> "950"
 *  - 1000 -> "1k"
 *  - 1500 -> "1.5k"
 *  - 10000 -> "10k"
 *  - 1250000 -> "1.3M"
 */
export function parseNum(value: number | string, digits = 1): string {
	const num = typeof value === 'number' ? value : Number(value);
	if (!isFinite(num)) return String(value);

	const sign = num < 0 ? '-' : '';
	const abs = Math.abs(num);

	const units = [
		{ value: 1e12, symbol: 'T' },
		{ value: 1e9, symbol: 'B' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e3, symbol: 'k' },
	];

	for (const unit of units) {
		if (abs >= unit.value) {
			const short = +(abs / unit.value).toFixed(digits);
			// Remove unnecessary trailing .0 (e.g. 1.0k -> 1k)
			const formatted = short % 1 === 0 ? String(short.toFixed(0)) : String(short);
			return `${sign}${formatted}${unit.symbol}`;
		}
	}

	// For numbers below 1000, just return the integer or fixed decimals if requested
	if (digits > 0 && abs % 1 !== 0) {
		return `${sign}${abs.toFixed(digits)}`;
	}

	return `${sign}${abs.toFixed(0)}`;
}