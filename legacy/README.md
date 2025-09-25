# Legacy Archive

This directory contains archived code retained for reference during the Next.js consolidation.

## Contents
- `client/` – Previous Vite React SPA (routes under `client/pages/*`)
- `server/` – Express backend (API + integrations)
- `netlify/` – Netlify functions (deprecated once Next.js handles APIs)
- `next-examples/` – Assorted example component bundles & experimental Next.js mini-apps

## Policy
Do not modify code here for new features. Port what you need into the active app structure instead:
```
app/
components/
hooks/
lib/
```

## Removal Timeline
Once all critical features are ported & validated in production, this folder can be deleted.

---
Document: v1