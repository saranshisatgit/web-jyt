/**
 * Sky design-system — textile domain icon set.
 *
 * Phosphor **duotone** icons (MIT, no key/attribution), rendered with
 * `currentColor` so they inherit Sky ink/periwinkle from context. Duotone gives
 * the secondary layer a soft periwinkle wash while the primary strokes stay ink.
 *
 * Use these for domain/feature/process iconography ONLY. Generic UI chrome
 * (carets, checks, arrows) stays on its existing set — duotone reads wrong at
 * small chrome sizes.
 */
"use client"

import {
  Needle,
  TShirt,
  Dress,
  CoatHanger,
  Swatches,
  Scissors,
  Ruler,
  Stack,
  DeviceMobile,
  MicrosoftExcelLogo,
  Table,
  ShoppingCartSimple,
  Tag,
  MapPin,
  Package,
  type IconProps,
} from "@phosphor-icons/react"

/** The 15-icon Sky domain set, keyed by intent. */
export const DomainIcon = {
  needle: Needle,
  tshirt: TShirt,
  dress: Dress,
  hanger: CoatHanger,
  swatches: Swatches,
  scissors: Scissors,
  ruler: Ruler,
  stack: Stack,
  mobile: DeviceMobile,
  excel: MicrosoftExcelLogo,
  table: Table,
  cart: ShoppingCartSimple,
  tag: Tag,
  pin: MapPin,
  package: Package,
} as const

export type DomainIconName = keyof typeof DomainIcon

/**
 * Render a Sky domain icon. Duotone by default; `currentColor` so it tints from
 * the surrounding text color. Pass any Phosphor `IconProps` (size, weight, etc.).
 *
 * <SkyIcon name="scissors" size={28} />
 */
export function SkyIcon({
  name,
  weight = "duotone",
  size = 24,
  ...props
}: { name: DomainIconName } & IconProps) {
  const Icon = DomainIcon[name]
  return <Icon weight={weight} size={size} color="currentColor" {...props} />
}
