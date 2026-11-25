# Contributing

## Branches and releases

- **`main`** is the development branch. All feature, fix, and dependency PRs target `main`.
- **`release`** is what gets published to npm. Every push to `release` runs [`release.yaml`](.github/workflows/release.yaml), which builds, tests, and publishes.

### Release flow

1. Bump `version` in `package.json` and add an entry to [`CHANGELOG.md`](CHANGELOG.md) on `main`.
2. Open a PR from **`main` → `release`**. No other source branch is allowed.
3. Merge it with **"Create a merge commit"**. Squash and rebase are disabled on `release`, because they create new commits that `main` does not have and make `release` drift ahead of `main`.

`release` must never be ahead of `main`. The [`Release Guard`](.github/workflows/release-guard.yml) check enforces both rules on every PR into `release`.
