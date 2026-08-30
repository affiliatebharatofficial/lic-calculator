/**
 * Indian Rupee (INR) and Indian Numbering System Formatting Utilities
 */

/**
 * Formats a numeric value into the Indian Numbering System (e.g., 10,00,000)
 * @param amount - The number to format
 * @param options - Formatting configuration options
 */
export function formatINR(
  amount: number | null | undefined,
  options: {
    includeSymbol?: boolean;
    decimals?: number;
    compact?: boolean;
  } = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return options.includeSymbol !== false ? '₹0' : '0';
  }

  const { includeSymbol = true, decimals = 0, compact = false } = options;
  const symbol = includeSymbol ? '₹' : '';

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) {
      // Crores (1 Cr = 1,00,00,000)
      const cr = abs / 10000000;
      return `${sign}${symbol}${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
    }
    if (abs >= 100000) {
      // Lakhs (1 Lakh = 1,00,000)
      const lakh = abs / 100000;
      return `${sign}${symbol}${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} Lakh`;
    }
    if (abs >= 1000) {
      // Thousands (1k = 1,000)
      const k = abs / 1000;
      return `${sign}${symbol}${k.toFixed(k % 1 === 0 ? 0 : 1)}k`;
    }
  }

  // Safe rounding to requested decimals
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(amount * factor) / factor;
  const isNegative = rounded < 0;
  const absRounded = Math.abs(rounded);

  // Split integer and decimal parts
  const parts = absRounded.toFixed(decimals).split('.');
  const intPart = parts[0] ?? '0';
  const decPart = parts[1] ? `.${parts[1]}` : '';

  // Format integer part using Indian grouping: last 3 digits, then pairs of 2 digits
  let result = '';
  if (intPart.length > 3) {
    const lastThree = intPart.substring(intPart.length - 3);
    const rest = intPart.substring(0, intPart.length - 3);
    // Replace pairs of 2 digits in `rest`
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${groupedRest},${lastThree}`;
  } else {
    result = intPart;
  }

  const prefix = isNegative ? '-' : '';
  return `${prefix}${symbol}${result}${decPart}`;
}

/**
 * Converts an INR amount to readable text in words (Indian terminology)
 * @param amount - Number
 */
export function inrToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Rupees';
  const abs = Math.abs(Math.round(amount));

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return units[n] ?? '';
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    return `${tens[ten] ?? ''}${unit > 0 ? ' ' + (units[unit] ?? '') : ''}`.trim();
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let res = '';
    if (hundred > 0) {
      res += `${units[hundred]} Hundred`;
      if (remainder > 0) res += ' and ';
    }
    if (remainder > 0) {
      res += convertTwoDigits(remainder);
    }
    return res.trim();
  }

  const crores = Math.floor(abs / 10000000);
  const lakhs = Math.floor((abs % 10000000) / 100000);
  const thousands = Math.floor((abs % 100000) / 1000);
  const remainder = abs % 1000;

  const parts: string[] = [];
  if (crores > 0) {
    parts.push(`${convertThreeDigits(crores)} Crore`);
  }
  if (lakhs > 0) {
    parts.push(`${convertTwoDigits(lakhs)} Lakh`);
  }
  if (thousands > 0) {
    parts.push(`${convertTwoDigits(thousands)} Thousand`);
  }
  if (remainder > 0) {
    parts.push(convertThreeDigits(remainder));
  }

  const words = parts.join(' ').trim();
  return `${amount < 0 ? 'Minus ' : ''}${words} Rupees Only`;
}
