# React Ecommerce Frontend Migration: Bootstrap to Tailwind CSS

## Role

Act as a senior React and TypeScript frontend engineer experienced in ecommerce applications, frontend architecture, authentication, performance optimization, Tailwind CSS, shadcn/ui, Zustand, React Router, and Motion for React.

## Project Overview

The existing project is a production ecommerce website built with:

* React
* JavaScript or partially implemented TypeScript
* Bootstrap
* React Router
* Zustand
* Existing REST APIs
* Stripe payment integration

The application must be migrated from Bootstrap to a modern, fully modular Tailwind CSS and shadcn/ui architecture.

This is a migration and refactoring project, not a complete rewrite. Existing business logic, API behavior, Zustand functionality, payment workflows, and working ecommerce features must continue to work unless a change is specifically required below.

## Primary Objective

Migrate the complete React frontend from Bootstrap to Tailwind CSS and shadcn/ui while improving:

* Code maintainability
* Component reusability
* Type safety
* Routing architecture
* Authentication handling
* Responsive behavior
* Accessibility
* Loading performance
* User experience
* Visual consistency

Remove all Bootstrap dependencies, Bootstrap classes, Bootstrap JavaScript, unused CSS, and obsolete components after their replacements are complete.

Do not leave Bootstrap and Tailwind implementations mixed together in the final codebase.

---

# Technical Requirements

## 1. Core Technology Stack

Use the latest stable versions that are compatible with the existing application:

* React
* TypeScript
* Vite, when the current build setup can be safely migrated
* Tailwind CSS
* shadcn/ui
* React Router
* Zustand
* Motion for React
* Swiper where sliders are required
* Existing Stripe integration
* Existing API client or one consistent centralized API client

Do not introduce multiple libraries that solve the same problem.

Before upgrading React, React Router, Node, Vite, or other major dependencies, inspect the current project and identify compatibility risks.

## 2. Bootstrap Removal

Replace all Bootstrap functionality, including:

* Grid and layout classes
* Containers
* Navigation bars
* Dropdowns
* Modals
* Accordions
* Tabs
* Forms
* Buttons
* Cards
* Alerts
* Badges
* Tooltips
* Spinners
* Responsive utilities
* Bootstrap JavaScript behavior

Use Tailwind CSS and shadcn/ui equivalents.

After completing the migration:

* Remove Bootstrap packages from `package.json`
* Remove Bootstrap imports
* Remove legacy Bootstrap stylesheets
* Remove unused custom CSS
* Confirm that no Bootstrap classes remain
* Confirm that no Bootstrap JavaScript remains
* Verify that the visual layout has no unintended regressions

## 3. TypeScript Migration

Use TypeScript throughout the migrated frontend.

Enable strict type checking where practical.

Do not use `any` unless there is a documented technical reason.

Separate the following from component files:

* Interfaces
* Type aliases
* API request types
* API response DTOs
* Domain models
* Zustand store types
* Form types
* Component prop types
* Utility types
* Constants and enums

Create frontend response models that match the backend API structure.

Use reusable generic response models where applicable, such as:

* `ApiResponse<T>`
* `PaginatedResponse<T>`
* `ApiError`
* `PaginationMeta`

Do not pass raw backend responses throughout the UI. Map API DTOs to frontend domain models when their structures or naming conventions differ.

## 4. Recommended Project Structure

Use a scalable feature-based structure similar to:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   ├── layouts/
│   └── config/
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   ├── search/
│   ├── support/
│   └── complaints/
├── hooks/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── validation/
│   └── utils/
├── pages/
├── services/
├── stores/
├── types/
├── constants/
└── styles/
```

The exact structure may be adjusted based on the current codebase, but feature logic must remain modular and easy to locate.

## 5. Component Architecture

Build the frontend using reusable and composable components.

Create shared components for repeated UI patterns, including:

* Page container
* Section heading
* Product card
* Product grid
* Product price
* Product badge
* Category item
* Search field
* Empty state
* Error state
* Loading skeleton
* Pagination
* Breadcrumb
* Quantity selector
* Rating display
* Form field
* Confirmation dialog
* Authentication guard
* Header
* Footer
* Mobile navigation
* Profile dropdown
* Cart trigger
* Theme switcher

Avoid creating one oversized component for an entire page.

Avoid unnecessary abstraction for components that are only used once and have no reusable behavior.

Components must support typed props, responsive layouts, keyboard interaction, and appropriate loading states.

---

# Routing Requirements

## 6. Modern React Router Architecture

Replace the legacy routing implementation with the latest stable React Router approach compatible with the application.

For a client-rendered SPA, prefer route objects using:

* `createBrowserRouter`
* `RouterProvider`
* Nested routes
* Layout routes
* Error boundaries
* Route-level lazy loading
* Redirect utilities
* Route-level pending states where appropriate

Organize routes by purpose:

* Public routes
* Authentication routes
* Customer-protected routes
* Checkout routes
* Policy and informational routes
* Not-found route

Create layouts such as:

* `PublicLayout`
* `AuthLayout`
* `CustomerLayout`
* `CheckoutLayout`

Pages should be lazy-loaded where beneficial.

Provide a route-level loading fallback and a proper 404 page.

## 7. Protected Routes

Create a reusable authentication guard such as:

* `AuthGuard`
* `ProtectedRoute`
* Route loader-based authentication validation

Protected pages must include:

* Profile
* Order history
* Order details
* Checkout, when authentication is required
* Complaints submitted by the customer
* Other account-specific pages

When an unauthenticated user attempts to open a protected route:

1. Redirect the user to the login page.
2. Preserve the originally requested URL.
3. After successful login, redirect the user back to that URL.
4. Prevent redirect loops.

Do not rely only on client-side protection for backend authorization. Protected APIs must continue to validate the user on the server.

---

# Authentication and Session Management

## 8. Authentication Architecture

The backend issues:

* An access token
* A refresh token

Tokens are set by the server through cookies.

The frontend must never store the refresh token in:

* Local storage
* Session storage
* Zustand persistence
* IndexedDB
* JavaScript-readable application state

Prefer secure server-managed cookies.

When JavaScript access to the access token is required by the existing backend contract, keep the token in memory only. Do not persist it in local storage.

Create a modular auth feature containing:

```text
features/auth/
├── api/
├── components/
├── hooks/
├── store/
├── types/
├── utils/
└── validation/
```

The authentication module must manage:

* Login
* Logout
* Current-user retrieval
* Session initialization
* Token refresh
* Authentication loading state
* Authentication error state
* Protected-route access
* Session expiration
* Redirect after login

## 9. Initial Session Validation

When the application starts:

1. Request the current authenticated session or user.
2. Display an application-level loading state while authentication is being checked.
3. Mark the user as authenticated when the session is valid.
4. Attempt token refresh when appropriate.
5. Mark the user as unauthenticated when refresh fails.
6. Do not briefly show protected content before validation finishes.

Prefer a backend endpoint such as:

```http
GET /auth/me
```

or:

```http
GET /auth/session
```

## 10. Automatic Token Refresh

Create one centralized API client.

It must:

* Send cookies with requests
* Detect authentication failures
* Attempt a token refresh only when appropriate
* Prevent multiple simultaneous refresh requests
* Queue requests while one refresh request is running
* Retry each failed request no more than once
* Prevent infinite refresh loops
* Log the user out when refresh fails
* Redirect to login when the current route is protected

Do not place refresh-token logic inside individual page components or individual Zustand actions.

## 11. Minimal Backend Refresh Endpoint

Add or update a minimal backend endpoint:

```http
POST /auth/refresh
```

Expected behavior:

1. Read and validate the refresh token from the server-managed cookie.
2. Reject missing, invalid, expired, revoked, or reused refresh tokens.
3. Generate a new access token.
4. Rotate the refresh token when supported.
5. Set updated cookies through the response.
6. Return only the minimum session information required by the frontend.
7. Return `401 Unauthorized` when the session cannot be refreshed.

Cookie configuration must be environment-aware and use appropriate security settings, including:

* `HttpOnly`
* `Secure` in production
* An appropriate `SameSite` policy
* Restricted cookie path and domain where possible
* Appropriate expiration durations

Implement an appropriate CSRF defense when authentication cookies can be sent with cross-site requests.

---

# Zustand and API State Management

## 12. Zustand Architecture

Keep Zustand as the primary client-side state management solution.

Organize stores by domain instead of placing all state in one global store.

Suggested stores:

* `useAuthStore`
* `useProductStore`
* `useCategoryStore`
* `useCartStore`
* `useOrderStore`
* `useProfileStore`
* `useSearchStore`

Separate each store into:

* State
* Actions
* Selectors
* Types
* API service functions
* Optional persistence configuration

Use typed selectors to reduce unnecessary component rerenders.

Do not store purely local UI state globally unless multiple unrelated components need it.

## 13. Product API State

All product-related API state must be managed through the product feature and Zustand.

Include state for:

* Product list
* Featured products
* Product details
* Related products
* Search results
* Categories
* Active filters
* Sorting
* Pagination
* Loading status
* Error status
* Request metadata

Use explicit async states such as:

```ts
type RequestStatus = "idle" | "loading" | "success" | "error";
```

Do not call product APIs directly inside presentation components.

Prevent unnecessary duplicate requests.

Handle stale requests, rapid search changes, and component unmounting where relevant.

---

# UI and Ecommerce Requirements

## 14. Design System

Use Tailwind CSS and shadcn/ui to establish a consistent design system.

Configure reusable tokens for:

* Background
* Foreground
* Primary
* Secondary
* Accent
* Muted
* Destructive
* Border
* Input
* Focus ring
* Radius
* Shadows
* Typography
* Container widths
* Spacing

Do not scatter arbitrary color values throughout components.

## 15. Theme Switching

Implement:

* Light theme
* Dark theme
* System theme

Store the selected theme locally and prevent visible theme flashing during startup.

Ensure that all pages, dialogs, menus, forms, product cards, and loading states support every theme.

## 16. Header and Search

Refactor the site header.

The header should include:

* Brand logo
* Primary navigation
* Improved product search
* Profile dropdown
* Theme switcher
* Cart access
* Responsive mobile navigation

Place the search bar where it remains discoverable without making the header crowded.

Search requirements:

* Responsive layout
* Clear submit behavior
* Debounced suggestions when API support exists
* Loading state
* Empty state
* Keyboard accessibility
* Clear-search action
* Search results page
* Search-query synchronization with the URL

## 17. Homepage

Make the homepage informative, modern, and conversion-focused.

Recommended sections:

1. Hero slider
2. Search or category discovery
3. Circular category list
4. Featured products
5. Our Products
6. Promotional banner
7. How to Buy
8. Customer benefits
9. Frequently Asked Questions
10. Support call-to-action
11. Newsletter, only when supported
12. Footer

Avoid adding sections that do not provide meaningful customer value.

## 18. Hero Slider

Create a professional hero slider with:

* Automatic sliding
* Manual controls
* Touch and swipe support
* Responsive images
* Accessible labels
* Pause on interaction or hover where appropriate
* Reduced-motion support
* Clear call-to-action buttons
* No disruptive layout shift

Keep text readable across all viewport sizes.

## 19. Categories Section

Redesign the category section as a circular category list.

Each category item should include:

* Category image or icon
* Category name
* Clickable navigation
* Keyboard focus state
* Hover state
* Responsive sizing

Support horizontal scrolling on smaller devices without breaking the page layout.

## 20. Our Products Section

Create a highly reusable and optimized product section.

Use accessible shadcn/ui tabs where appropriate for groups such as:

* Featured
* New arrivals
* Best sellers
* Discounted products

Requirements:

* Keyboard-accessible tabs
* Loading skeletons
* Empty states
* Responsive product grid
* Reusable product cards
* Wishlist state when already supported
* Add-to-cart action
* Product badges
* Product price and discount display
* Clear navigation to the full product collection

Do not render large hidden product collections for every tab when data can be loaded on demand.

## 21. Product Details Page

Reorganize the product details page.

Include:

* Breadcrumb
* Product image gallery
* Automatic slider only when appropriate
* Thumbnail navigation
* Product title
* Rating
* Current and previous price
* Discount information
* Stock state
* Variant selection
* Quantity selector
* Add-to-cart action
* Buy-now action when supported
* Product description
* Specifications
* Shipping information
* Refund summary
* Related products
* Loading and error states

Use Swiper for the gallery when it improves usability.

Images must not be stretched or distorted.

## 22. Cart Access

Move the main cart action to the right side of the interface.

It may be implemented as a sticky or fixed cart trigger when this does not obstruct content.

Requirements:

* Display item count
* Provide accessible label
* Work on mobile and desktop
* Respect safe-area spacing
* Avoid covering important buttons
* Open the cart page or cart drawer according to the existing flow
* Do not create conflicting cart behaviors

## 23. Profile Dropdown

Improve the profile dropdown UI.

Include relevant options such as:

* Profile
* Orders
* Addresses
* Settings
* Support
* Logout

Requirements:

* Accessible keyboard navigation
* Click-outside behavior
* Correct mobile behavior
* User avatar or initials
* Loading fallback
* Clear logout action

---

# Additional Pages

## 24. Contact and Support Page

Create a Contact or Support page containing:

* Support manager placeholder image
* Support heading and description
* Contact form
* Email information
* Phone information when available
* Business hours
* Expected response guidance
* Frequently asked support questions
* Form success and error states

Contact form fields:

* Full name
* Email
* Phone, optional
* Subject
* Order number, optional
* Message
* Submit button

Use typed validation and accessible error messages.

## 25. Live Chat Bubble

Add a non-functional live-chat bubble to the bottom-right corner.

Requirements:

* Visually consistent with the design system
* Responsive positioning
* Accessible label
* Tooltip
* No fake online conversation
* Clearly marked placeholder behavior if clicked
* Must not overlap the fixed cart action

## 26. How to Buy Page

Create a step-by-step purchasing guide covering:

1. Find a product
2. Review product information
3. Add the product to the cart
4. Review the cart
5. Enter shipping information
6. Select a payment method
7. Confirm the order
8. Track the order

Use icons, illustrations, or screenshots when appropriate.

## 27. FAQ

Create a reusable FAQ section using an accessible accordion.

Place a homepage FAQ preview near the support section and provide a full FAQ page when the amount of content justifies it.

Suggested topics:

* Ordering
* Payments
* Delivery
* Returns
* Refunds
* Account access
* Product availability
* Support

## 28. Terms and Conditions

Redesign the Terms and Conditions page with:

* Clear page heading
* Last-updated date
* Table of contents
* Readable content width
* Section anchors
* Strong heading hierarchy
* Mobile-friendly typography
* Back-to-top action

Do not rewrite legal content without explicit approval.

## 29. Refund Policy

Create a refund policy page with sections for:

* Eligibility
* Non-refundable items
* Refund request process
* Required evidence
* Processing time
* Refund destination
* Shipping costs
* Exchanges
* Contact information

Use approved business policy content. Clearly mark placeholders where policy information has not been provided.

## 30. Complaint Page

Create a complaint submission page.

Suggested fields:

* Customer name
* Email
* Phone
* Order number
* Complaint category
* Subject
* Description
* Attachment input, when supported
* Preferred resolution

Include:

* Validation
* Submission loading state
* Success confirmation
* Error handling
* Complaint reference number when supported
* Instructions for following up

## 31. Footer

Redesign the footer with:

* Logo and company summary
* Shopping links
* Customer service links
* Policy links
* Contact information
* Social links
* Theme-compatible styling
* Copyright information
* Supported payment-method image

Replace the current payment image with an approved Stripe or supported-payment guide image.

Do not imply support for payment methods that the backend or Stripe configuration does not actually accept.

---

# Animation and Interaction

## 32. Motion for React

Use Motion for React for professional and restrained animation.

Suitable animation examples:

* Page entry transitions
* Product-card hover feedback
* Dropdown transitions
* Modal transitions
* Section reveal
* Tab content transition
* Cart-count feedback
* Hero content transition

Requirements:

* Avoid excessive animation
* Prefer opacity and transform animations
* Avoid animations that cause layout shifts
* Respect `prefers-reduced-motion`
* Do not delay important user actions
* Do not animate every section automatically
* Keep animation components reusable

Enable smooth scrolling only where it improves navigation and does not conflict with accessibility preferences.

---

# Responsiveness and Accessibility

## 33. Responsive Design

The full website must work correctly on:

* Small mobile devices
* Standard mobile devices
* Tablets
* Laptops
* Desktop screens
* Large desktop screens

Use a mobile-first approach.

Test important layouts around common viewport widths, but do not design only for fixed device dimensions.

Prevent:

* Horizontal page overflow
* Clipped text
* Overlapping fixed elements
* Distorted images
* Unusable dropdowns
* Tiny touch targets
* Unreadable typography

## 34. Fluid Images and Media

Images must:

* Use responsive dimensions
* Preserve aspect ratio
* Use suitable `object-fit`
* Include meaningful alternative text
* Lazy-load below-the-fold content
* Reserve dimensions to reduce layout shift
* Use optimized formats where supported
* Avoid loading full-resolution images unnecessarily

Above-the-fold hero images must be optimized separately and should not be lazy-loaded when they are required for the initial view.

## 35. Accessibility

Follow practical accessibility requirements:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Form labels
* Accessible validation errors
* Dialog focus management
* Descriptive button labels
* Alternative image text
* Sufficient color contrast
* Reduced-motion support
* Proper heading hierarchy
* Screen-reader-friendly loading states

Do not make clickable `div` elements when a native button or link is appropriate.

---

# Performance Optimization

## 36. Performance Requirements

Optimize the application using:

* Route-level code splitting
* Lazy-loaded heavy components
* Dynamic imports
* Optimized images
* Appropriate image dimensions
* Memoization only where beneficial
* Zustand selectors
* Request deduplication
* Debounced search
* Reduced unnecessary rerenders
* Reduced unused JavaScript
* Removed Bootstrap assets
* Tree-shakeable imports
* Loading skeletons
* Cached static data where appropriate

Do not apply `useMemo`, `useCallback`, or `React.memo` everywhere without measuring whether they provide value.

Avoid unnecessarily large icon, slider, animation, and utility packages.

## 37. Performance Verification

Measure the application before and after migration.

Check:

* Production bundle size
* Largest JavaScript chunks
* Unused CSS
* Initial page loading
* Route transition performance
* Image loading
* Layout shift
* Interaction responsiveness

Document meaningful improvements and any remaining bottlenecks.

---

# Error Handling and User Feedback

Every API-powered page must support:

* Initial loading state
* Refreshing state
* Empty state
* Error state
* Retry action
* Success feedback when necessary

Add:

* Application error boundary
* Route error boundaries
* Not-found page
* Network-error handling
* Session-expiration handling
* Form-level and field-level validation
* Toast notifications only for events that require temporary feedback

Do not use toast notifications as a replacement for persistent form errors.

---

# Migration Process

Complete the migration incrementally.

Recommended order:

1. Audit the current application.
2. Document routes, pages, components, APIs, stores, and Bootstrap usage.
3. Confirm the application builds before migration.
4. Configure TypeScript.
5. Configure Tailwind CSS and shadcn/ui.
6. Create design tokens and shared layouts.
7. Create reusable base components.
8. Migrate routing.
9. Refactor authentication.
10. Refactor the API client.
11. Refactor Zustand stores.
12. Migrate pages feature by feature.
13. Remove Bootstrap.
14. Optimize performance.
15. Test responsiveness and accessibility.
16. Run regression testing.
17. Produce migration documentation.

The website should remain buildable throughout the migration whenever possible.

---

# Deliverables

Provide:

1. Fully migrated React and TypeScript frontend
2. Tailwind CSS configuration
3. shadcn/ui configuration
4. Light, dark, and system theme support
5. Modern React Router configuration
6. Protected-route implementation
7. Automatic token-refresh implementation
8. Minimal backend refresh endpoint
9. Modular Zustand stores
10. Typed API models
11. Reusable component library
12. Responsive ecommerce pages
13. Contact and support page
14. FAQ implementation
15. How to Buy page
16. Refund Policy page
17. Complaint page
18. Redesigned Terms and Conditions page
19. Updated footer and payment image
20. Loading, empty, and error states
21. Updated dependency list
22. Migration notes
23. Environment-variable example file
24. Setup and run instructions
25. Testing checklist
26. List of remaining assumptions or backend dependencies

---

# Testing Requirements

Test at minimum:

* Login
* Logout
* Refresh after login
* Session restoration
* Expired access token
* Failed refresh token
* Protected-route redirection
* Redirect back after login
* Product listing
* Product filtering
* Product search
* Product details
* Product slider
* Category navigation
* Add to cart
* Cart updates
* Checkout
* Stripe payment flow
* Profile dropdown
* Theme switching
* Contact form
* Complaint form
* Mobile navigation
* Error states
* Empty states
* 404 route
* Keyboard navigation
* Reduced-motion behavior

Existing APIs and critical ecommerce flows must not break.

---

# Acceptance Criteria

The project is complete only when:

* Bootstrap has been completely removed.
* No Bootstrap classes or imports remain.
* The frontend builds without TypeScript errors.
* There are no important console errors or warnings.
* All routes work after direct browser refresh.
* Protected pages redirect unauthenticated users correctly.
* Expired sessions attempt one controlled token refresh.
* Failed refresh requests log the user out safely.
* Product API state is managed through modular Zustand stores.
* API response models are typed.
* Shared UI is implemented through reusable components.
* Light, dark, and system themes work across the website.
* The application is responsive on mobile, tablet, laptop, and desktop.
* Fixed cart and chat elements do not overlap.
* Images remain fluid and preserve their aspect ratios.
* Animations are professional and restrained.
* Core ecommerce and Stripe payment flows continue to work.
* Loading, empty, error, and success states are implemented.
* Setup and migration documentation is included.

---

# Development Rules

* Inspect the existing project before changing architecture.
* Preserve working business logic.
* Do not invent backend fields or API endpoints without clearly documenting them.
* Do not replace working packages without a technical reason.
* Do not mix Bootstrap and Tailwind in the final implementation.
* Do not store refresh tokens in browser storage.
* Do not duplicate API logic inside UI components.
* Do not use `any` as the default TypeScript type.
* Do not overuse global Zustand state.
* Do not add excessive animation.
* Do not sacrifice accessibility for visual effects.
* Do not change approved legal text.
* Do not claim unsupported payment methods.
* Keep commits or migration stages small and reviewable.

Before implementation, provide:

1. A brief audit of the existing codebase
2. Proposed architecture
3. Proposed folder structure
4. Dependency migration plan
5. Authentication flow diagram
6. Route map
7. Reusable component inventory
8. Key assumptions and risks

Then implement the migration feature by feature.
