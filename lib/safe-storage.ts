/**
 * SafeStorage - Type-safe wrapper for localStorage with quota handling and validation
 *
 * Features:
 * - Zod schema validation for data integrity
 * - Quota exceeded error handling
 * - Automatic JSON serialization/deserialization
 * - Type-safe get/set operations
 */

import { z } from 'zod';

export class SafeStorage {
  /**
   * Set item in localStorage with quota handling
   *
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns true if successful, false if quota exceeded or other error
   */
  static setItem(key: string, value: any): boolean {
    if (typeof window === 'undefined') {
      console.warn('SafeStorage: window is undefined (SSR context)');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.error('SafeStorage: LocalStorage quota exceeded');

        // Try to clear old data to make space
        this.clearOldData(key);

        // Retry once after clearing
        try {
          const serialized = JSON.stringify(value);
          localStorage.setItem(key, serialized);
          console.info('SafeStorage: Successfully saved after clearing old data');
          return true;
        } catch (retryError) {
          console.error('SafeStorage: Still failed after clearing old data');
          return false;
        }
      }

      console.error('SafeStorage: Failed to save to localStorage', e);
      return false;
    }
  }

  /**
   * Get item from localStorage with Zod validation
   *
   * @param key - Storage key
   * @param schema - Zod schema for validation
   * @returns Validated data or null if not found/invalid
   */
  static getItem<T>(key: string, schema: z.ZodSchema<T>): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const validated = schema.safeParse(parsed);

      if (validated.success) {
        return validated.data;
      } else {
        console.error(`SafeStorage: Invalid data for key "${key}"`, validated.error);
        return null;
      }
    } catch (e) {
      console.error(`SafeStorage: Failed to parse data for key "${key}"`, e);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   *
   * @param key - Storage key
   */
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`SafeStorage: Failed to remove key "${key}"`, e);
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (e) {
      console.error('SafeStorage: Failed to clear localStorage', e);
    }
  }

  /**
   * Get all keys from localStorage
   *
   * @returns Array of keys
   */
  static getAllKeys(): string[] {
    if (typeof window === 'undefined') return [];

    try {
      return Object.keys(localStorage);
    } catch (e) {
      console.error('SafeStorage: Failed to get keys', e);
      return [];
    }
  }

  /**
   * Get storage usage statistics
   *
   * @returns Object with storage info
   */
  static getStorageInfo(): {
    used: number;
    available: number;
    items: number;
    keys: string[];
  } {
    if (typeof window === 'undefined') {
      return { used: 0, available: 0, items: 0, keys: [] };
    }

    try {
      const keys = Object.keys(localStorage);
      let totalSize = 0;

      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          // Approximate size in bytes (UTF-16 encoding)
          totalSize += (key.length + item.length) * 2;
        }
      });

      // Most browsers have 5-10MB limit, we'll assume 5MB
      const estimatedLimit = 5 * 1024 * 1024;

      return {
        used: totalSize,
        available: estimatedLimit - totalSize,
        items: keys.length,
        keys: keys
      };
    } catch (e) {
      console.error('SafeStorage: Failed to get storage info', e);
      return { used: 0, available: 0, items: 0, keys: [] };
    }
  }

  /**
   * Clear old data to make space
   * This is a basic implementation - can be enhanced with timestamp-based cleanup
   *
   * @param excludeKey - Key to exclude from cleanup
   */
  private static clearOldData(excludeKey: string): void {
    try {
      const keys = Object.keys(localStorage);

      // Remove items that look like they might be old/temporary
      // This is a simple heuristic - enhance based on your app's needs
      const candidatesForRemoval = keys.filter(key =>
        key !== excludeKey &&
        !key.startsWith('pravo-app-') // Keep app-critical data
      );

      if (candidatesForRemoval.length > 0) {
        candidatesForRemoval.forEach(key => localStorage.removeItem(key));
        console.info(`SafeStorage: Cleared ${candidatesForRemoval.length} old items`);
      }
    } catch (e) {
      console.error('SafeStorage: Failed to clear old data', e);
    }
  }

  /**
   * Check if localStorage is available
   *
   * @returns true if localStorage is available
   */
  static isAvailable(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const testKey = '__safe_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
