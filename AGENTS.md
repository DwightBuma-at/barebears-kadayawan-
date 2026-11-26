# Permanent Project Rules

## 1. Architecture & Imports

- Use a flat, page-based architecture under `src/pages/<PageName>/<PageName>.tsx` (page-only components live in `src/pages/<PageName>/components/`).
- Shared shell components live in `src/layouts/`, reusable app components in `src/components/common/`, shadcn/ui primitives in `src/components/ui/`, and Magic UI effects in `src/components/magicui/`.
- Keep typed content centralized in `src/data/` and shared interfaces in `src/types/`. Never scatter content data inline across JSX.
- Always use the `@/` path alias for internal imports. Never create redundant `features/`, `sections/`, `config/`, or duplicate `utils/` directories.

## 2. 10-Step Prompt Interpretation Before Coding

1. Identify the exact user goal and scope.
2. Check existing files, routes, and data structures before adding new ones.
3. Map requirements to the page-based architecture.
4. Identify reusable primitives (`src/components/ui/`, `src/components/common/`).
5. Define TypeScript interfaces in `src/types/` and data in `src/data/`.
6. Plan responsive layout behavior across all target viewports.
7. Plan semantic HTML, keyboard navigation, and WCAG 2.2 AA accessibility.
8. Plan light/dark theme token usage (never hardcode raw colors when tokens apply).
9. Plan motion and `prefers-reduced-motion` fallbacks.
10. Verify with `typecheck`, `lint`, `format:check`, `test`, `build`, and `test:e2e`.

## 3. Reference Design Accuracy & Visual Craft

- Match reference screenshots faithfully in layout proportions, alignment, typography, contrast, and spacing.
- Follow a strict **4px spacing scale** (`gap-1`, `p-2`, `p-4`, `p-6`, `p-8`, etc.).
- Maintain consistent vertical and horizontal alignment across grids, cards, headers, and forms.
- Use **Plus Jakarta Sans Variable** (`font-sans`) with clear typographic hierarchy (`h1` once per page, logical heading order).

## 4. Semantic Tables

- Use semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th scope="col|row">`, and `<td>`.
- Align numeric columns right (`tabular-nums`), text columns left, and wrap wide tables in overflow-safe containers so pages never scroll horizontally.

## 5. Responsive Verification

- Verify every page and interactive state across `320px`, `390px`, `768px`, `1024px`, `1440px`, and `1920px` viewports with zero horizontal overflow and zero accessibility violations.

# Modern Web Guidance

### Mandatory skill usage

Whenever a task involves frontend development, web UI, browser APIs, HTML, CSS, JavaScript, TypeScript, accessibility, performance, responsive design, animation, forms, or web platform features:

1. Identify the relevant web platform concepts.
2. Search Modern Web Guidance for the specific task.
3. Retrieve the most relevant guide when a useful guide is found.
4. Apply the recommendations to the actual implementation.
5. Follow the project's existing framework and architecture (React 19, TypeScript 5.9, Vite 8, React Router, Tailwind CSS v4, shadcn/ui).

Do not rely only on general model knowledge when relevant Modern Web Guidance is available. For backend-only tasks, database changes, or unrelated work, do not unnecessarily invoke web guidance.

### Search examples

Use targeted searches based on the actual task:

```bash
npx modern-web-guidance@latest search "accessible modal dialog"
npx modern-web-guidance@latest search "responsive layout with container queries"
npx modern-web-guidance@latest search "native browser form validation"
npx modern-web-guidance@latest search "smooth animation without layout thrashing"
npx modern-web-guidance@latest search "optimize images and loading performance"
npx modern-web-guidance@latest search "accessible custom dropdown menu"
```

### Modern implementation principles

Prefer:

- Native HTML elements with built-in semantics.
- Modern CSS layout, including Grid and Flexbox.
- CSS container queries when they suit component-based responsive layouts.
- Native browser APIs when they provide a simpler and more performant solution.
- Accessible interactions with keyboard support and appropriate focus management.
- Progressive enhancement and graceful fallbacks.
- Efficient loading, rendering, and animation techniques.
- Browser-supported features with compatibility appropriate to the project's target browsers.

Avoid:

- Outdated patterns when modern supported alternatives are better.
- Adding dependencies for functionality already provided by the browser.
- Unnecessary JavaScript for native browser capabilities.
- Large libraries for small UI interactions.
- Unnecessary polyfills.
- Inaccessible custom controls.
- Prematurely rewriting working code just to use a newer API.

Do not adopt a modern API simply because it is new. Evaluate browser support, project requirements, accessibility, maintainability, and compatibility.

### Development workflow & privacy

- Use Modern Web Guidance during new feature development, UI component creation, frontend refactoring, responsive design, accessibility improvements, performance optimization, browser API integrations, and web-platform bug fixes.
- Do not expose private source code, credentials, tokens, environment variables, or customer data in CLI search queries.
- Telemetry can be disabled at any time with `DISABLE_TELEMETRY=1` (`$env:DISABLE_TELEMETRY = "1"` in PowerShell, or `setx DISABLE_TELEMETRY 1` persistently).

## 6. Post-Prompt Skill Usage Reminder

- At the end of **every** response, include a `### Skills Used` section listing every skill from `.agents/skills/` that was used for that prompt (or `None` if no skill applied).
