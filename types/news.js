/**
 * @typedef {'left' | 'centre-left' | 'centre' | 'centre-right' | 'right' | 'focused-agenda'} BiasTendency
 * @typedef {'news' | 'podcast' | 'social' | 'blog' | 'research' | 'advocacy'} SourceType
 * @typedef {'high' | 'medium' | 'low' | 'unrated'} ValidityRating
 *
 * @typedef {Object} NewsSource
 * @property {string} id
 * @property {string} name
 * @property {string} url
 * @property {string[]} platforms
 * @property {SourceType} type
 * @property {BiasTendency} bias
 * @property {ValidityRating} validity_rating
 * @property {string|null} validity_notes
 * @property {string|null} funded_by
 * @property {boolean} active
 * @property {string} created_at
 */
