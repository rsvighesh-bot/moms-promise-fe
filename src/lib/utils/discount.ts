const NEW_THRESHOLD_DAYS = 14;

export function isNewProduct(createdAt?: string): boolean {
  if (!createdAt) return false;
  const ageInDays =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays <= NEW_THRESHOLD_DAYS;
}
