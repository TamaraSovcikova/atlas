/**
 * The bank content version, in its own tiny module so seed.ts can check whether
 * a re-sync is needed without statically importing the (large) content bank.
 * That lets the bank load as a lazy chunk, fetched only on first run or a bump.
 * Bump when the bank content changes; review progress is preserved across bumps.
 */
export const BANK_VERSION = 'v10'
