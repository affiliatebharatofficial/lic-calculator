/**
 * Optimistic Concurrency Control for Admin Edits
 */

export class ConcurrencyController {
  /**
   * Validates that the client's expected timestamp or version matches the current record.
   */
  public static check<T extends { updatedAt?: string; version?: string | number }>(
    currentRecord: T,
    clientExpectedUpdatedAt?: string,
    clientExpectedVersion?: string | number
  ): { isStale: boolean; message?: string } {
    if (clientExpectedUpdatedAt && currentRecord.updatedAt) {
      const currentMs = new Date(currentRecord.updatedAt).getTime();
      const clientMs = new Date(clientExpectedUpdatedAt).getTime();
      if (currentMs > clientMs) {
        return {
          isStale: true,
          message: 'Conflict: This record was modified by another administrator since you opened it. Please reload the latest version before saving.'
        };
      }
    }

    if (clientExpectedVersion !== undefined && currentRecord.version !== undefined) {
      if (String(currentRecord.version) !== String(clientExpectedVersion)) {
        return {
          isStale: true,
          message: 'Conflict: Version mismatch. A newer version of this record has already been saved.'
        };
      }
    }

    return { isStale: false };
  }
}
