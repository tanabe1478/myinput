/**
 * Generate a UUID using crypto.randomUUID()
 * @returns UUID string
 */
export function generateUuid(): string {
  return crypto.randomUUID();
}

/**
 * Get current Unix timestamp in seconds
 * @returns Current timestamp as integer
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert Date to Unix timestamp in seconds
 * @param date - Date object
 * @returns Unix timestamp as integer
 */
export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Convert Unix timestamp to Date
 * @param timestamp - Unix timestamp in seconds
 * @returns Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Validate enum value against allowed values
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @returns True if valid, false otherwise
 */
export function isValidEnum<T extends string>(
  value: string,
  allowedValues: readonly T[]
): value is T {
  return (allowedValues as readonly string[]).includes(value);
}

/**
 * Create a SQL CHECK constraint for enum validation
 * @param columnName - Name of the column
 * @param allowedValues - Array of allowed enum values
 * @returns SQL CHECK constraint string
 */
export function createEnumCheckConstraint(
  columnName: string,
  allowedValues: readonly string[]
): string {
  const values = allowedValues.map((v) => `'${v}'`).join(', ');
  return `${columnName} IN (${values})`;
}
