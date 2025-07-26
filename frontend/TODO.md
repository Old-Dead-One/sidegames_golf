# TODO List

## Authentication & Security
- [ ] Add “Sign up / Sign in with Google” (and optionally other providers)
- [ ] Add CAPTCHA to event creation
- [ ] Add CAPTCHA to account creation (sign up)
- [ ] (Optional) Add email confirmation reminders for unverified users

## User Experience
- [ ] Add a “Forgot Password?” link to the login page
- [ ] Add a “Resend verification email” option for unverified users
- [ ] Add a “Delete Account” feature (with confirmation and data cleanup)
- [ ] Show a list of events the user has created on the My Events page
- [ ] Show a list of events the user has entered (registered for)

## Event Management
- [x] Add ability to edit/delete events (with proper permissions)
- [x] Add event date picker with correct year range (2024–2030)
- [x] Add side games modal/section UI/UX (modern, styled, with custom order)
- [ ] Add event detail pages (with player list, event info, etc.)
- [ ] Prevent users from joining the same event twice (already implemented in purchases, but double-check UI)
- [ ] (Optional) Add event search/filtering
- [ ] Add bulk event upload via CSV (use Supabase CSV import for large data sets, e.g., Tours with many events)
- [ ] Add the id of the user that creates an event to the event so only they have access to it
- [ ] Add DB logic to collect which side games are in each event
- [ ] Add logic to the delete event button to check that there are no players already in the event before allowing deletion
- [ ] Add a refund players method for events (e.g., when an event is deleted or canceled)

## Notifications & Communication
- [ ] Implement notification sending (email/SMS) for event reminders, updates, etc.
- [ ] Add notification preferences to user settings (already in DB/UI, but connect to actual notification logic)
- [ ] (Optional) Add in-app notifications/messages

## Profile & Privacy
- [ ] Add profile completeness progress bar or checklist
- [x] Add “public profile” view (what others see)
- [ ] (Optional) Add profile badges or verification

## Admin/Moderation
- [ ] Add admin dashboard for managing users/events
- [ ] Add moderation tools for reporting/flagging inappropriate events or users

## Performance & Polish
- [x] Add loading spinners/placeholders to all async pages
- [x] Add error boundaries for better error handling
- [ ] Test on mobile and different browsers for responsive design

## Other Ideas
- [ ] Analytics (track signups, event creation, etc.)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] SEO improvements (meta tags, Open Graph)
- [ ] PWA support (installable app, offline support) 

## Payments
- [ ] Integrate Stripe Connect for accepting payments and paying out event creators/winners
- [ ] Build onboarding flow for event creators to connect their Stripe account
- [ ] Add payout logic for winners (trigger payouts from dashboard or automatically)
- [ ] Track payment and payout status in the database
- [ ] Model Stripe fee impact for a typical event (e.g., 70 incoming and 30 outgoing transactions) 
- [ ] Implement processing fee calculation: Stripe fee (2.9% + $0.30) + $0.25 buffer, rounded up to nearest $0.25. Display excess (platform buffer) per transaction. 

## Stripe Fee Modeling and Revenue Projection

- **Buffer per entry:** $0.35 (covers Stripe processing fee and share of payout costs)
- **Entries per event:** 100
- **Payouts per event:** 35
- **Payout fee:** $0.25 per payout
- **Events per year:** 900

### Per Event:
- Platform buffer: 100 × $0.35 = $35
- Payout fees: 35 × $0.25 = $8.75
- **Net per event:** $35 - $8.75 = $26.25

### Annual Projection:
- 900 × $26.25 = **$23,625**

| Metric                | Per Event | 900 Events/Year |
|-----------------------|-----------|-----------------|
| Platform buffer (entries) | $35      | $31,500         |
| Payout fees (cost)        | $8.75    | $7,875          |
| **Net platform revenue**  | $26.25   | $23,625         |

> Adjust buffer, entry count, or payout count as needed for different scenarios. 

# UI/UX TODOs and Enhancements

## Microinteractions & Feedback
- Add subtle animations or color changes on button clicks, toggles, and form submissions (e.g., pulse or ripple).
- Show icons or checkmarks for successful actions (e.g., adding to cart, saving profile).
- Use skeleton loaders or contextual spinners for all async actions, not just a central spinner.

## Accessibility & Usability
- Ensure all interactive elements are keyboard accessible (Tab, Enter, Space).
- Add clear, visible focus rings for all focusable elements.
- Add ARIA attributes to custom components (modals, toggles, icons) for screen readers.

## Mobile & Touch Enhancements
- Ensure all buttons, toggles, and icons are at least 44x44px for easy tapping.
- Consider sticky action bars for key actions on mobile (e.g., “Add to Cart”, “Create Event”).
- Make the cart drawer swipeable/dismissible on mobile.

## Visual Polish
- Use soft shadows on cards, modals, and floating elements for depth.
- Use a single icon set and keep icon sizes consistent.
- Stick to a tight color palette; use accent colors sparingly for CTAs/highlights.

## Navigation & Discoverability
- Add a floating “+” button for quick event creation or a “Find Game” shortcut on mobile.
- Add breadcrumbs or a progress indicator for multi-step flows (e.g., event creation).
- Add a floating “Back to Top” button on long pages.

## Personalization & Delight
- Show user initials or a default avatar if no profile pic is set.
- Add friendly messages and illustrations for empty states (e.g., “No events yet—create your first!”).
- Add celebratory animations (e.g., confetti) for big actions (event created, checkout complete).

## Legal & Info
- Keep legal, FAQ, and contact links always accessible (footer or floating button).
- Add tooltips or “?” icons for complex fields or fees.

## Performance
- Use modern image formats (WebP), lazy-load images, and compress assets.
- Continue code splitting and monitor bundle size.

## Dark Mode (Optional)
- Consider adding a dark mode toggle for night/outdoor use. 