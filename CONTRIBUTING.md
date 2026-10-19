# Contributing to Meme Mania

Thank you for your interest in contributing to **Meme Mania**! 🚀

## How to Contribute

1. **Report Bugs**: If you find an issue or unexpected behavior, open an issue detailing what happened, steps to reproduce, and your browser/OS.
2. **Suggest Memes & Features**: Have a hilarious meme character, obstacle, or power-up idea? Propose it in a new feature issue!
3. **Submit Pull Requests**:
   - Fork the repository.
   - Create a branch for your feature or bugfix (`git checkout -b feature/cool-powerup`).
   - Implement your changes.
   - Ensure clean TypeScript compilation with `npm run build`.
   - Submit a Pull Request targeting the `main` branch.

## Code Standards

- **TypeScript**: All source files must be strictly typed. Avoid `any` where possible.
- **Three.js Performance**: Maintain pre-allocated vectors/matrices outside the render loop to prevent garbage collection hiccups.
- **Procedural Sound**: All sound effects and music should use Web Audio API oscillators and filters to keep the app zero-dependency with no broken asset links.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
