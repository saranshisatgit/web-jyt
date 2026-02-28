# Design System Extension Plan

## Goal Description
Enhance the visual aesthetics and maintainability of the application by establishing a "premium" design system. This involves defining a centralized color palette, introducing modern typography, and standardizing core UI components to replace ad-hoc styling.

## User Review Required
> [!IMPORTANT]
> - **Color Palette**: I will replace current hardcoded colors (e.g., `gray-950`, `pink-600`) with semantic names (`primary`, `secondary`, `accent`).
> - **Typography**: I will add `Inter` (sans-serif) as a primary font for UI text, keeping `Switzer` for headings if desired, or replacing it.
> - **Components**: I will create reusable `Input`, `Badge`, and `Card` components.

## Proposed Changes

### Configuration
#### [MODIFY] [tailwind.config.js](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/tailwind.config.js)
- Extend `theme.colors` with a new palette:
    - **Primary**: Deep Indigo (`#4F46E5` -> rich variations)
    - **Secondary**: Slate/Cool Gray
    - **Accent**: Vibrant Pink/Coral (preserving the `pink-600` vibe but harmonized)
    - **Surface**: Glassmorphism supports (white/opacity)
- Add `fontFamily` extension.

#### [MODIFY] [app/layout.tsx](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/app/layout.tsx)
- Add Google Fonts link for `Inter` or `Outfit`.

### Components
#### [MODIFY] [components/button.tsx](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/components/button.tsx)
- Update variants to use semantic color names.
- Add 'ghost' and 'link' variants.
- Enhance hover states with subtle animations.

#### [NEW] [components/input.tsx](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/components/input.tsx)
- Extract input styling from `ContactForm` into a reusable component.
- Add label, error message, and helper text support.

#### [NEW] [components/badge.tsx](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/components/badge.tsx)
- New component for status indicators or tags.
- Variants: `default`, `secondary`, `outline`, `destructive`.

#### [MODIFY] [components/ContactForm.tsx](file:///Users/saranshsharma/Documents/jyt-web/jyt-web/components/ContactForm.tsx)
- Refactor to use the new `Button` and `Input` components.

## Verification Plan

### Automated Tests
- None existing. I will rely on manual verification.

### Manual Verification
1.  **Visual Check**:
    -   Launch the dev server.
    -   Functionality check: Ensure the Contact Form still works with the new components.
    -   Aesthetics check: Verify the new colors and fonts are applied on the Home page and specifically the Contact Form.
    -   Interactive check: Hover over buttons and inputs to verify states.
