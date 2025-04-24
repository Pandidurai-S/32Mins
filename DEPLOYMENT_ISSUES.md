# Vercel Deployment Issues and Solutions

## Common Deployment Issues

### 1. Build Size and Asset Optimization
**Issue**: Large build size due to 3D models and assets
**Solution**:
- Optimize 3D models before deployment
- Use dynamic imports for heavy components
- Implement proper caching strategies
- Consider using a CDN for static assets

### 2. Environment Variables
**Issue**: Missing or incorrect environment variables
**Solution**:
- Add all required environment variables in Vercel dashboard
- Ensure `.env.local` variables are properly configured
- Use `vercel env pull` to sync local environment variables

### 3. Static File Serving
**Issue**: 3D model files not being served correctly
**Solution**:
- Place model files in `public/models/` directory
- Ensure correct file paths in code
- Add proper MIME types in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        {
          "key": "Content-Type",
          "value": "model/gltf-binary"
        }
      ]
    }
  ]
}
```

### 4. Memory Issues
**Issue**: Build process running out of memory
**Solution**:
- Increase memory limit in Vercel settings
- Optimize build process
- Split large components into smaller chunks

### 5. WebGL Context
**Issue**: WebGL context not available or failing
**Solution**:
- Add fallback for non-WebGL browsers
- Implement proper error handling
- Check browser compatibility

## Development Issues and Solutions

### 1. Three.js Integration
**Issue**: Three.js not working properly in production
**Solution**:
- Use dynamic imports for Three.js
- Implement proper cleanup in useEffect
- Handle window object checks:
```typescript
if (typeof window !== 'undefined') {
  // Three.js initialization
}
```

### 2. Model Loading
**Issue**: Models not loading in production
**Solution**:
- Verify model paths are correct
- Implement proper error handling
- Add loading states
- Use absolute paths for model files

### 3. Performance Optimization
**Issue**: Poor performance with 3D models
**Solution**:
- Implement proper model optimization
- Use LOD (Level of Detail) for models
- Implement proper cleanup of resources
- Use requestAnimationFrame for animations

### 4. Browser Compatibility
**Issue**: Features not working across browsers
**Solution**:
- Add proper polyfills
- Implement feature detection
- Provide fallbacks for unsupported features

## Deployment Checklist

1. **Pre-deployment**:
   - [ ] Optimize all 3D models
   - [ ] Check environment variables
   - [ ] Verify static file paths
   - [ ] Test in development environment

2. **Build Process**:
   - [ ] Monitor build logs
   - [ ] Check for memory issues
   - [ ] Verify asset optimization

3. **Post-deployment**:
   - [ ] Test all features
   - [ ] Check performance
   - [ ] Verify model loading
   - [ ] Test across different browsers

## Troubleshooting Steps

1. **Check Build Logs**:
   - Review Vercel deployment logs
   - Look for specific error messages
   - Check memory usage

2. **Verify Configuration**:
   - Check `vercel.json` settings
   - Verify environment variables
   - Confirm build settings

3. **Test Locally**:
   - Run `vercel dev` to test locally
   - Check for any warnings
   - Verify all features work

4. **Performance Monitoring**:
   - Use Vercel Analytics
   - Monitor page load times
   - Check for memory leaks

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Three.js Optimization Guide](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)

## Tailwind CSS Configuration and Issues

### 1. PostCSS Configuration
**Issue**: Tailwind styles not being applied in production
**Solution**:
- Ensure proper PostCSS configuration in `postcss.config.js`:
```js
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-import': {},
    'postcss-nesting': {},
  }
}
```

### 2. PurgeCSS Configuration
**Issue**: Styles being purged incorrectly in production
**Solution**:
- Configure content paths in `tailwind.config.js`:
```js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  // ... other config
}
```

### 3. CSS Nesting Issues
**Issue**: CSS nesting not working properly
**Solution**:
- Install and configure `@tailwindcss/nesting`:
```bash
npm install -D @tailwindcss/nesting postcss-nesting
```
- Update PostCSS config:
```js
module.exports = {
  plugins: {
    '@tailwindcss/nesting': {},
    'tailwindcss': {},
    'autoprefixer': {},
  }
}
```

### 4. Build Performance
**Issue**: Slow build times with Tailwind
**Solution**:
- Use JIT (Just-In-Time) mode in development
- Configure proper purge settings
- Optimize content paths
- Use `@apply` sparingly

### 5. Custom Configuration
**Issue**: Custom theme not being applied
**Solution**:
- Update `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
      spacing: {
        // Your custom spacing
      },
      // Other customizations
    }
  }
}
```

### 6. Production Build Issues
**Issue**: Styles missing in production build
**Solution**:
- Check build logs for CSS processing errors
- Verify PostCSS plugins are properly installed
- Ensure all required files are included in content paths
- Check for conflicting CSS configurations

### 7. Dynamic Class Names
**Issue**: Dynamic class names not working
**Solution**:
- Use template literals for dynamic classes
- Safelist important classes in `tailwind.config.js`:
```js
module.exports = {
  safelist: [
    'bg-red-500',
    'text-3xl',
    // Add other important classes
  ]
}
```

### 8. CSS Module Conflicts
**Issue**: CSS modules conflicting with Tailwind
**Solution**:
- Use proper naming conventions
- Configure CSS modules to work with Tailwind
- Use `@layer` to organize styles:
```css
@layer components {
  .custom-component {
    @apply ...;
  }
}
```

### 9. Responsive Design Issues
**Issue**: Responsive classes not working
**Solution**:
- Verify breakpoint configuration
- Check for conflicting media queries
- Ensure proper class ordering
- Test in different viewport sizes

### 10. Dark Mode Configuration
**Issue**: Dark mode not working properly
**Solution**:
- Configure dark mode in `tailwind.config.js`:
```js
module.exports = {
  darkMode: 'class', // or 'media'
  // ... other config
}
```
- Add dark mode classes properly:
```html
<div class="dark:bg-gray-800">
  <!-- content -->
</div>
```

## Additional Tailwind Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostCSS Configuration Guide](https://tailwindcss.com/docs/using-with-preprocessors)
- [Optimizing for Production](https://tailwindcss.com/docs/optimizing-for-production)
- [JIT Mode Documentation](https://tailwindcss.com/docs/just-in-time-mode) 