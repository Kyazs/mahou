# Deploy the mahou landing page

The landing page is a Next.js app in `landing/`. It is not a static
`index.html` site.

## Local preview

```bash
cd landing
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Production build

```bash
cd landing
npm run build
npm run start
```

`npm run build` also type-checks and lints the app; fix any errors before
deploying.

## GitHub Pages

The site is intended to be served as a static export from the `landing/`
directory:

1. Add static export to `landing/next.config.ts`:

   ```ts
   const nextConfig: NextConfig = {
     output: "export",
   };
   ```

2. Build the export:

   ```bash
   cd landing
   npm run build
   ```

   The static site is written to `landing/out/`.

3. Push the contents of `landing/out/` (plus `CNAME` at the repo root) to
   the branch that GitHub Pages serves.
4. Go to **Settings → Pages** in the GitHub repository, select **Deploy from
   a branch**, and choose the branch and folder.
5. Replace the value in `CNAME` with your actual custom domain before
   pushing.
6. Add the required DNS records at your domain registrar.

## Custom domain DNS

For an apex domain (`example.com`), create four A records pointing to:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For a subdomain (`www.example.com`), create a CNAME record:
- `www` → `<username>.github.io`

For full details, see [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
