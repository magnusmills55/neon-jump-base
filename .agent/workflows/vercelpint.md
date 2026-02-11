---
description: Resume Farcaster Mini App Verification (Domain Association)
---

This workflow completes the final social verification for "Neon Jump" on Base.

### Prerequisites
1.  **User providing the `accountAssociation` block** from the [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest?domain=neon-jump-base-9lww.vercel.app).

### Steps
1.  **Update `farcaster.json`**:
    -   Open `packages/app/public/.well-known/farcaster.json`.
    -   Replace the `accountAssociation` section with the one provided by the user.

2.  **Push to GitHub**:
    -   Run `git add .`
    -   Run `git commit -m "Final social verification signature"`
    -   Run `git push origin main`

3.  **Verify Link**:
    -   Wait for Vercel deployment.
    -   Verify the manifest at `https://neon-jump-base-9lww.vercel.app/.well-known/farcaster.json`.

4.  **Final Test**:
    -   Instruct the user to check the Warpcast Frames Debugger.
