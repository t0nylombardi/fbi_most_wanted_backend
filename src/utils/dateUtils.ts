/**
 * Determines if the database is outdated.
 * @param updatedAt - The last update time of the database.
 * @returns True if the database is outdated, false otherwise.
 */
export function isDatabaseOutdated(updatedAt: Date): boolean {
  // return if updatedAt is null
  if (!updatedAt) return false;

  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return now.getTime() - new Date(updatedAt).getTime() > oneDayInMs;
}
