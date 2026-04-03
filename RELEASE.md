# Release Guide

## Pre-release checklist

1. Update `CHANGELOG.md`
2. Verify version numbers in `package.json`, `client/package.json`, and `server/package.json` when needed
3. Run:

```bash
npm run release:check
```

To generate the distributable runtime bundle locally:

```bash
npm run release:bundle
```

This now creates separate release inputs in `dist/` for:

- the standalone server package
- the standalone Lua mod package

To build Windows desktop installers locally:

```bash
npm run desktop:dist
```

4. Smoke test:
- `npm run dev:mock`
- `npm start` after `npm run build`

5. Confirm docs are current:
- `README.md`
- `SECURITY.md`
- `CONTRIBUTING.md`

## Suggested release flow

1. Create a release branch
2. Finalize changelog notes
3. Tag the release with `vX.Y.Z`
4. Publish GitHub release notes based on `CHANGELOG.md`
5. Let `.github/workflows/release.yml` attach the generated server and Lua assets
6. Let `.github/workflows/release.yml` build and attach Windows desktop installers
7. Let `.github/workflows/publish-images.yml` publish `x4-dashboard-landing` and `x4-dashboard-mock` images to GHCR for the same release tag

## Distribution notes

- `server/public/` is generated locally and should not be committed
- The project is intended for trusted local environments
- Remote control should stay disabled unless explicitly required
- Desktop packaging now acts as a server launcher and convenience entry point for browser-based clients
- `nebula` and other infrastructure repositories should reference the published GHCR images instead of rebuilding this repository
