# Delivery workflow

The user wants every completed task committed and the live site updated automatically.

- Run checks appropriate to the changes before publishing.
- Commit the task's completed changes and push to `origin/main`; keep unrelated work intact.
- For application changes, update https://oncomilver.davidgc.com and verify the live deployment with `node scripts/verify-deployment.mjs https://oncomilver.davidgc.com`.
- GitHub Actions runs `.github/workflows/cloudflare.yml`. If its Cloudflare token is unavailable, use the authenticated local Wrangler CLI to deploy the verified production build. Never store local OAuth credentials in GitHub or the repository.
- Report the commit/deployment outcome and any blockers accurately. Do not claim a successful automatic deployment when the workflow is blocked.
- These routine commit, push, and deployment actions are authorized by the user's standing instruction; do not ask for confirmation again unless the scope changes or a separate approval requirement applies.
