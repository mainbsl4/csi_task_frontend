# CSI Task Frontend

Frontend application for the CSI dashboard, built with React and Vite.

## Project Guidelines

## 1. Prerequisites
- Node.js 18+
- npm 9+

## 2. Setup
1. Install dependencies:
```bash
npm install
```
2. Create environment file (if needed):
```bash
cp .env.example .env
```
3. Start development server:
```bash
npm run dev
```

## 3. Available Scripts
- `npm run dev` - run app in development mode
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks

## 4. Project Structure
- `src/main.jsx` - app bootstrap
- `src/App.jsx` - root app wrapper
- `src/component/` - UI components
- `src/api/` - API/data modules for dashboard sections
- `src/index.css` - global styles
- `public/` - static assets

## 5. Development Standards
- Keep components small and focused on one responsibility.
- Reuse shared UI from `src/component/shared/` before creating new components.
- Keep API request/data logic in `src/api/` instead of UI files.
- Use clear naming for files and components (PascalCase for components).
- Run `npm run lint` before pushing changes.

## 6. Styling Guidelines
- Use existing Tailwind and MUI patterns already used in the codebase.
- Prefer consistency with current spacing, colors, and typography.
- Avoid inline style duplication; extract repeated styles when practical.

## 7. Environment Variables
- Keep secrets out of source code.
- Add new variables to `.env.example` when introducing them.

## 8. Pull Request Checklist
- Feature/bug fix works locally.
- Lint passes (`npm run lint`).
- No unrelated file changes.
- README/docs updated when behavior or setup changes.

## 9. Build Verification
Before release:
```bash
npm run lint
npm run build
npm run preview
```
