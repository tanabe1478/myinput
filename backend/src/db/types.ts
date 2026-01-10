/**
 * Item state status enum
 * Represents the reading status of an item for a user
 */
export const ItemStatus = {
  UNREAD: 'unread',
  READ: 'read',
  KEPT: 'kept',
  SKIPPED: 'skipped',
} as const;

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

export const ITEM_STATUS_VALUES = Object.values(ItemStatus) as [
  ItemStatus,
  ...ItemStatus[]
];

/**
 * Theme priority enum
 * Represents the priority level of a theme
 */
export const ThemePriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type ThemePriority = (typeof ThemePriority)[keyof typeof ThemePriority];

export const THEME_PRIORITY_VALUES = Object.values(ThemePriority) as [
  ThemePriority,
  ...ThemePriority[]
];

/**
 * Today snapshot bucket enum
 * Represents the priority bucket for items in today's reading queue
 */
export const TodayBucket = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  OTHER: 'other',
} as const;

export type TodayBucket = (typeof TodayBucket)[keyof typeof TodayBucket];

export const TODAY_BUCKET_VALUES = Object.values(TodayBucket) as [
  TodayBucket,
  ...TodayBucket[]
];
