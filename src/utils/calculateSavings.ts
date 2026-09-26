export interface SavingsResult {
  savedBytes: number;
  reductionPercentage: number;
  isLarger: boolean;
}

/**
 * Calculates accurate size savings and reduction percentage
 */
export function calculateSavings(originalBytes: number, optimizedBytes: number): SavingsResult {
  if (originalBytes <= 0 || optimizedBytes <= 0) {
    return { savedBytes: 0, reductionPercentage: 0, isLarger: false };
  }

  const savedBytes = originalBytes - optimizedBytes;
  const isLarger = savedBytes < 0;
  
  if (isLarger) {
    const increasePercentage = Math.round(((optimizedBytes - originalBytes) / originalBytes) * 1000) / 10;
    return {
      savedBytes,
      reductionPercentage: -increasePercentage,
      isLarger: true,
    };
  }

  const reductionPercentage = Math.round((savedBytes / originalBytes) * 1000) / 10;

  return {
    savedBytes,
    reductionPercentage: Math.max(0, Math.min(100, reductionPercentage)),
    isLarger: false,
  };
}
