/** Feature flags – flip any flag to toggle functionality at build time. */
export const featureFlags = {
  enableWishlist: true,
  enableCoupons: true,
  enableSaveForLater: true,
  enableRecommendations: true,
  enableSkeletonLoading: true,
  enableRetryLogic: true,
  enableOrderHistory: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;
export const isEnabled = (flag: FeatureFlag): boolean => featureFlags[flag];
