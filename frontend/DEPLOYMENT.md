# Deployment Guide for sidegames.golf

## Initial Setup
1. **Build your React app**: `npm run build`
2. **Upload files to GoDaddy**:
   - Upload `dist/index.html` to `public_html/index.html`
   - Upload `dist/assets/` folder to `public_html/assets/`
   - Upload `.htaccess` to `public_html/.htaccess`
3. **Configure Cloudflare DNS** (already done)
4. **Set up SSL certificates** (already done)

## Updating Your Site (Best Practices)

### 1. Development Process
```bash
# Make your changes locally
npm run dev  # Test locally first

# Test thoroughly
npm run build  # Build for production
npm run preview  # Test the build locally

# Fix any issues, then rebuild
npm run build
```

### 2. Backup Current Version
Before uploading new files:
1. **Download current files** from GoDaddy File Manager
2. **Keep a backup** of your current working version
3. **Note the current build hash** (in assets folder names)

### 3. Upload New Version
1. **Build your app**: `npm run build`
2. **Upload new files**:
   - Replace `public_html/index.html`
   - Replace `public_html/assets/` folder contents
   - Keep `.htaccess` (usually doesn't change)

### 4. Cache Management
After uploading:
1. **Purge Cloudflare cache**:
   - Go to Cloudflare → Caching → Configuration
   - Click "Purge Everything"
2. **Wait 2-3 minutes** for propagation
3. **Test your site** in incognito mode

### 5. Rollback Plan
If something goes wrong:
1. **Upload your backup files**
2. **Purge Cloudflare cache again**
3. **Test the rollback**

### 6. Version Control Best Practices
```bash
# Before making changes
git add .
git commit -m "Current working version"

# Make your changes
git add .
git commit -m "New feature: [description]"

# Tag important releases
git tag v1.1.0
git push origin main --tags
```

### 7. Testing Checklist
Before deploying:
- [ ] **Local development** works
- [ ] **Production build** works locally
- [ ] **All routes** work correctly
- [ ] **Forms and interactions** work
- [ ] **Mobile responsiveness** is good
- [ ] **No console errors** in browser

### 8. Post-Deployment Verification
After uploading:
- [ ] **Site loads** without errors
- [ ] **All pages** are accessible
- [ ] **Forms work** correctly
- [ ] **Mobile works** properly
- [ ] **SSL certificate** is valid
- [ ] **No broken links** or assets

### 9. Monitoring
- **Check site** after deployment
- **Monitor for errors** in browser console
- **Test key user flows** (login, cart, etc.)
- **Check mobile experience**

## Troubleshooting

### If Site Breaks After Update
1. **Check browser console** for errors
2. **Verify file uploads** are complete
3. **Purge Cloudflare cache**
4. **Check `.htaccess`** is still in place
5. **Rollback to previous version** if needed

### Common Issues
- **Assets not loading**: Check file permissions (644 for files, 755 for folders)
- **Routes not working**: Verify `.htaccess` is present and correct
- **SSL issues**: Check Cloudflare SSL/TLS settings
- **Cache issues**: Purge Cloudflare cache and browser cache

## File Structure on GoDaddy
```
public_html/
├── index.html          # Your React app
├── .htaccess          # Apache configuration
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [other assets]
```

## Quick Deploy Script
Create a simple script to automate deployment:
```bash
#!/bin/bash
# deploy.sh
echo "Building React app..."
npm run build

echo "Uploading to GoDaddy..."
# Use your FTP client or GoDaddy File Manager

echo "Purging Cloudflare cache..."
# Manual step: Go to Cloudflare dashboard

echo "Deployment complete!"
```

Remember: **Always test locally first, backup before deploying, and have a rollback plan!** 