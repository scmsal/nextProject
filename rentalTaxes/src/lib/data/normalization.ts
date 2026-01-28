/*
 * Normalize any string for deterministic comparison.
 */

export function normalizeText(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "") //removes any whitespace (space, tab, line break)
    .replace(/[^\p{L}\p{N}]/gu, "") //removes everything that’s not a letter or number
    .normalize("NFC"); //Normalization Form Composed — turns characters like e + ´ into the single codepoint é. Standardizes how accented or composite characters are encoded.
}

/**
 * Deterministic property key generator.
 * Combines normalized propertyName + address with a short hash of the same.
 */

export function createPropertyId(
  propertyName: string,
  address: string
): string {
  const base = normalizeText(propertyName + address);
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const shortHash = (hash >>> 0).toString(16).slice(0, 4);

  return base.slice(0, 5) + shortHash;
}

/**
 * Deterministic listing key generator.
 * Combines normalized propertyName + address with a short hash of the same.
 */
export function createListingId(
  listingName: string,
  propertyId: string
): string {
  const base = normalizeText(listingName + propertyId);

  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  const shortHash = (hash >>> 0).toString(16).slice(0, 4);
  return base.slice(0, 5) + shortHash;
}
