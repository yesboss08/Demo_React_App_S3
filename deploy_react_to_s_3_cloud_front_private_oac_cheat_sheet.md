# Deploy React to S3 + CloudFront (Private OAC) — Cheat Sheet

> Purpose: Exact, copy-paste-ready steps to deploy a built React app to a **private S3 bucket** served securely via **CloudFront using Origin Access Control (OAC)**. Save this and use it as your one-page revision guide.

---

## Table of contents
- Quick decision summary
- Prerequisites
- Prepare your React app (build)
- Create the S3 bucket (private)
- Upload build contents to S3 (console + CLI)
- Create Origin Access Control (OAC) and secure the bucket
- Create CloudFront distribution (detailed toggles)
- DNS & HTTPS (ACM + Route53)
- Invalidation & cache strategy
- CI/CD (GitHub Actions) example
- Troubleshooting & FAQ
- Quick checklist before going live
- Appendix: useful commands & sample policies

---

# Quick decision summary
- **Do this:** Private S3 bucket + CloudFront with OAC. Production-ready, secure, HTTPS, CDN.
- **Don’t do this:** Make the bucket public and rely on S3 website endpoint for production.

---

# Prerequisites
- AWS account with permissions: S3, CloudFront, ACM, Route53 (if using custom domain), IAM to create OAC.
- Local: Node.js + npm/yarn, your React project.
- Optional but recommended: AWS CLI configured (`aws configure`).
- Know which folder is your build output (`build` or `dist`). We’ll call it `build/` in examples.

---

# Prepare your React app (build)
1. Ensure your app is production-ready (env vars, API endpoints, analytics off/on as needed).
2. Build:

```bash
# npm
npm run build
# or yarn
yarn build
```

3. Confirm structure of the build folder (example `build/` or `dist/`):
```
build/
├─ index.html
├─ asset-manifest.json
├─ static/
│  ├─ css/
│  └─ js/
└─ favicon.ico
```

**Important:** Upload the *contents inside* this folder to the S3 bucket root. Do NOT upload the parent folder itself.

Also check `index.html` base paths if you changed `homepage` or `publicPath` — they must match how files will be served.

---

# Create the S3 bucket (private)
1. Console → S3 → Create bucket.
2. Name it (globally unique): `your-app-name-<env>-<region-suffix>`.
3. Region: pick nearest to your users (doesn't affect CloudFront placement).
4. **Block Public Access**: Keep all "Block public access" toggles **ON**.
5. Do **not** enable static website hosting (we're serving through CloudFront).
6. (Optional) Enable versioning and lifecycle rules.

---

# Upload build contents to S3

## Option A — Console (manual)
- Open the bucket → Upload → select ALL files and folders **inside** `build/` and upload them to the bucket root.
- Verify `index.html` is at bucket root.
- Check `Content-Type` headers (S3 usually sets them correctly). If you see `application/octet-stream`, re-upload with correct content type.
- Set Cache-Control headers if needed (see CLI method below for examples).

## Option B — CLI (recommended for reproducibility)

```bash
# from the project root
aws s3 sync build/ s3://<YOUR_BUCKET_NAME>/ --delete \
  --acl private \
  --metadata-directive REPLACE \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html"

# Then upload index.html with a short cache so it can change quickly:
aws s3 cp build/index.html s3://<YOUR_BUCKET_NAME>/index.html \
  --acl private \
  --cache-control "max-age=0, no-cache, no-store, must-revalidate"
```

**Why two-step?** Assets use long-lived cache (fingerprinted filenames). `index.html` must be short-lived so new deployments appear quickly.

---

# Create Origin Access Control (OAC) and secure the bucket
**Do this** instead of making the bucket public.

1. CloudFront → Create distribution → Origin settings (we’ll cover full distribution creation later). In the origin section choose your S3 bucket and under "Origin access" choose **Origin access control settings (recommended)**.
2. Create a new OAC (name it like `oac-yourapp-<env>`). Use **Sign requests: Yes (SigV4)**.
3. CloudFront will show a snippet and prompt to update the S3 bucket policy. **Use the generated bucket policy** — it contains the correct statements for OAC. If you prefer to add it manually, use the CloudFront console to generate and copy the policy and paste it into the S3 bucket policy.

> NOTE: AWS Console provides the exact policy tailored to your OAC and distribution. Use that when available. If you need a manual template, see the Appendix → OAI example (legacy). For OAC, prefer the console-generated policy.

After policy is applied, verify: bucket objects cannot be listed by anonymous users and a `curl` to the S3 object URL directly should return 403 or be denied — CloudFront will still serve via OAC.

---

# Create CloudFront distribution (full details)
Use **Web / HTTP CDN** distribution (not the S3 website endpoint). Steps and recommended settings:

## Origin
- **Origin Domain**: choose the S3 bucket (not the website endpoint). Example: `your-bucket.s3.amazonaws.com`.
- **Origin path**: leave empty if your built files are at bucket root. Use `/subfolder` only if your files live under a folder inside the bucket.
- **Origin access**: choose the OAC you created.

## Default cache behavior
- **Viewer protocol policy**: Redirect HTTP to HTTPS.
- **Allowed HTTP methods**: GET, HEAD, OPTIONS (READ only).
- **Cache policy**: Managed-CachingOptimized is fine. For finer control, create a custom cache policy.
- **Origin request policy**: Use `allViewer` only if you really need headers/cookies forwarded. For static sites, minimal forwarding (none) is best.
- **Compress objects automatically**: ON.

## Default root object
- Set to `index.html`.

## Error responses (CRITICAL for React Router)
Add custom error responses:
- **HTTP 403** → Response page path: `/index.html`, HTTP response code: `200`.
- **HTTP 404** → Response page path: `/index.html`, HTTP response code: `200`.

This makes CloudFront return `index.html` for unknown paths so client-side routing works on refresh.

## Security / headers
- **Response headers policy**: enable security headers (or add via Lambda@Edge / Functions if you want custom headers). CloudFront now supports managed security headers policies.

## Price/region/logging
- Enable logging only if you need it (costs extra).
- Leave IPv6 enabled (recommended).

## Alternate domain name (optional)
- Add your custom domain (e.g. `www.example.com`) after you have a certificate in ACM (must be in `us-east-1` for CloudFront).

Finally, create the distribution and wait for it to deploy (status: Deployed).

---

# DNS & HTTPS (ACM + Route53)
1. In ACM, request a certificate for your domain (e.g. `example.com` and `www.example.com`) in **us-east-1** (N. Virginia) for CloudFront.
2. Validate via DNS (Route53) or email. Route53 DNS validation is easiest.
3. In CloudFront distribution General settings, set **Alternate domain names (CNAMEs)** and pick the ACM cert.
4. In Route53, create an **A (Alias)** record for your domain pointing to the CloudFront distribution hostname.

---

# Invalidation & caching strategy
- Best practice: Keep assets fingerprinted (file names include hash) and long cache TTL.
- Keep `index.html` short TTL or no-cache.
- When deploying, avoid full invalidation. Instead:
  - `aws cloudfront create-invalidation --distribution-id <ID> --paths "/index.html"` or
  - `--paths "/index.html" "/static/*"` as required.

CLI example:
```bash
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/index.html"
```

Full invalidation ("/*") is slow and may cost more if frequent.

---

# CI/CD example — GitHub Actions
Copy this into `.github/workflows/deploy.yml` (basic example). It builds, syncs to S3, and invalidates `index.html`.

```yaml
name: Build & Deploy to S3
on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Sync to S3
        run: |
          aws s3 sync build/ s3://$BUCKET_NAME/ --delete \
            --acl private --metadata-directive REPLACE \
            --cache-control "max-age=31536000,public" --exclude "index.html"
          aws s3 cp build/index.html s3://$BUCKET_NAME/index.html \
            --acl private --cache-control "max-age=0, no-cache, no-store, must-revalidate"
        env:
          BUCKET_NAME: ${{ secrets.S3_BUCKET }}

      - name: Create CloudFront invalidation
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/index.html"
```

Make sure to add the secrets `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, and `CF_DISTRIBUTION_ID` to your repo.

---

# Troubleshooting & FAQ
**Q: I get 403 when accessing files via CloudFront**
- Check OAC is attached to the origin and S3 bucket policy correctly allows CloudFront.
- Confirm bucket is **not** publicly accessible.

**Q: Refreshing client routes returns 404 or downloads index.html**
- Ensure CloudFront Default Root Object is `index.html` and error responses map 403/404 → `/index.html` (200).
- If browser downloads `index.html`, check `Content-Type` on the object in S3.

**Q: Changes not visible after deploy**
- CloudFront caches. Invalidate `index.html` or relevant paths. Check `index.html` cache-control.

**Q: How do I confirm CloudFront is serving files, not S3?**
- Check response headers: CloudFront responses include `Via` or `X-Cache` headers. Direct S3 responses will not.

---

# Quick checklist before going live
- [ ] Build produced `index.html` and fingerprinted assets
- [ ] Uploaded *contents* of build folder to bucket root
- [ ] Block public access enabled on S3
- [ ] OAC created and attached to CloudFront origin
- [ ] S3 bucket policy updated (use console-generated policy)
- [ ] CloudFront default root = `index.html`
- [ ] Error responses configured (403/404 -> `/index.html` → 200)
- [ ] ACM cert in `us-east-1` if using custom domain
- [ ] Route53 A record (Alias) pointing to CloudFront
- [ ] Cache-control correct for `index.html` and assets
- [ ] Invalidation strategy in place for deploys

---

# Appendix: useful commands & examples

### Sync build to S3 (CLI)
```bash
aws s3 sync build/ s3://<YOUR_BUCKET_NAME>/ --delete \
  --acl private --metadata-directive REPLACE \
  --cache-control "max-age=31536000,public" --exclude "index.html"
aws s3 cp build/index.html s3://<YOUR_BUCKET_NAME>/index.html \
  --acl private --cache-control "max-age=0, no-cache, no-store, must-revalidate"
```

### Invalidate CloudFront (CLI)
```bash
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/index.html"
```

### Legacy OAI bucket policy template (if you ever use OAI)
> Only use this if you intentionally choose OAI. Prefer console-generated OAC policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GrantCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXXXXXXXXXXXX"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/*"
    }
  ]
}
```

(Replace the OAI ARN with the one CloudFront gives you.)

---

# Closing notes
This guide is intentionally pragmatic: build the app, upload the contents of the build folder to a private S3 bucket, lock the bucket down with OAC, and let CloudFront serve everything with HTTPS and CDN benefits. Use the console to generate the exact OAC/bucket policy when possible — it's the safest route.

Want me to:
- add a second GitHub Actions job that deploys only on tags/releases? or
- convert the CI snippet to GitLab CI / Bitbucket Pipelines? or
- include explicit CloudFront console screenshots-style steps (text)?

Tell me which and I’ll update the document.

