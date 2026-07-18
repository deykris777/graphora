export const calculateAverage = (total: number, count: number) => {
  if (count <= 0) {
    return 0;
  }
  return Number((total / count).toFixed(2));
};

export const calculateP95 = (samples: number[]) => {
  if (samples.length === 0) {
    return 0;
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(index, 0)];
};
