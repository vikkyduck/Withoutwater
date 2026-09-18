/* Stable service URLs retained for existing links. */
export const BE = {
  general: "/business-effect",
  internal: "/tasks/internal-experts",
  internalEffect: "/tasks/internal-experts/business-effect",
  team: "/tasks/team-subscription",
  teamEffect: "/tasks/team-subscription/business-effect",
  external: "/tasks/external-experts",
  externalEffect: "/tasks/external-experts/business-effect",
} as const;
export const BE_LINK = Object.fromEntries(
  Object.entries(BE).map(([k, v]) => [k, v + "/"]),
) as { [K in keyof typeof BE]: string };
