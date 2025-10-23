# Contributing to Hemodialysis Management System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables (see README.md)
4. Start the development server: `npm run dev`

## Code Quality

This project uses several tools to maintain code quality:

### Husky & Git Hooks

We use Husky to run automated checks before commits:

- **Pre-commit**: Runs linting, formatting, and type-checking on staged files
- **Commit-msg**: Validates commit message format

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

#### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src files
- **revert**: Reverts a previous commit

#### Examples

```bash
# Good commit messages
feat: add patient risk score calculation
fix: resolve authentication redirect issue
docs: update README with deployment instructions
refactor: extract AI prediction logic into separate module
perf: optimize database queries for session listing

# Bad commit messages (will be rejected)
update stuff
fixed bug
WIP
asdasd
```

#### Scope (optional)

The scope provides additional context:

```bash
feat(auth): add two-factor authentication
fix(dashboard): correct patient count display
docs(api): add endpoint documentation
```

### Code Formatting

We use Prettier for consistent code formatting with automatic Tailwind CSS class sorting.

```bash
# Format all files
npm run format

# Check formatting without modifying files
npm run format:check
```

#### Tailwind CSS Class Sorting

The `prettier-plugin-tailwindcss` automatically sorts your Tailwind classes in the recommended order:

**Before:**

```tsx
<div className="text-center px-4 py-2 bg-blue-500 text-white font-bold rounded-lg">
```

**After:**

```tsx
<div className="rounded-lg bg-blue-500 px-4 py-2 text-center font-bold text-white">
```

This happens automatically when you:

- Run `npm run format`
- Commit (via pre-commit hook)
- Save in your editor (if configured)

See [.prettierrc.md](./.prettierrc.md) for complete configuration details.

### Linting

We use ESLint to catch potential issues.

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Type Checking

Ensure TypeScript types are correct:

```bash
npm run type-check
```

## Pre-Commit Workflow

When you commit, the following happens automatically:

1. **Prettier** formats your staged files
2. **ESLint** checks and fixes issues in your code
3. **TypeScript** validates types
4. **Commitlint** validates your commit message

If any step fails, the commit will be rejected. Fix the issues and try again.

## Pull Request Process

1. Create a feature branch from `main`

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes following the code style

3. Ensure all checks pass:

   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. Commit your changes with conventional commit messages

5. Push to your fork and create a Pull Request

6. Describe your changes in the PR description:
   - What problem does it solve?
   - How does it work?
   - Any breaking changes?
   - Screenshots (if UI changes)

## Development Guidelines

### File Organization

- Place components in `src/components/`
- Place utilities in `src/lib/`
- Place pages in `src/app/`
- Follow the existing folder structure

### Code Style

- Use TypeScript for all new files
- Use functional components with hooks
- Keep components small and focused
- Extract complex logic into custom hooks or utilities
- Add comments for complex logic
- Use meaningful variable and function names

### Testing

- Test your changes thoroughly
- Consider edge cases
- Test on different screen sizes (responsive design)

### Database Changes

- Create new migration files in `supabase/migrations/`
- Document schema changes in PR description
- Ensure migrations are reversible when possible

## Need Help?

- Check existing issues and PRs
- Review the README.md for setup instructions
- Ask questions in issues or discussions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing!
