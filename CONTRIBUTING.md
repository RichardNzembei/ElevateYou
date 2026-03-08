# Contributing to ElevateYou

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Firebase config
4. Start the dev server: `npm run dev`

## Code Style

- Use `<script setup lang="ts">` for all Vue components
- Follow the existing Tailwind CSS patterns for styling
- Use Pinia composition API style for stores
- Keep components focused — one responsibility per component
- Use TypeScript types from `types/index.ts`

## Pull Request Process

1. Create a branch from `main` with a descriptive name
2. Make your changes in small, focused commits
3. Ensure `npx nuxt typecheck` passes
4. Ensure `npx nuxt build` succeeds
5. Write a clear PR description explaining what and why
6. Link any related issues

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Screenshots if applicable

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use case / problem it solves
- Mockups or examples if possible
