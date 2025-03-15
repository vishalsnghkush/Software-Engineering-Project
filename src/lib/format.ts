export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function formatPercentage(value: number, total: number): string {
  return `${((value / total) * 100).toFixed(1)}%`;
}