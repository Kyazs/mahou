# Deploy the mahou landing page

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages

1. Push these files to the root of your repository branch:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `CNAME`
2. Go to **Settings → Pages** in the GitHub repository.
3. Select **Deploy from a branch**, choose the branch, and select **/(root)**.
4. Replace `yourdomain.com` in `CNAME` with your actual custom domain before pushing.
5. Add the required DNS records at your domain registrar.
6. Wait a few minutes for DNS and HTTPS to propagate.

## Custom domain DNS

For an apex domain (`example.com`), create four A records pointing to:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For a subdomain (`www.example.com`), create a CNAME record:
- `www` → `<username>.github.io`

For full details, see [GitHub Docs: Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
