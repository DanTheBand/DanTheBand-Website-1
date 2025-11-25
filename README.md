# Dan Policar - Composer & Music Producer Website

A professional portfolio website for Grammy-nominated composer Dan Policar.

## Features

- **Responsive Design** - Mobile-first approach with optimized layouts for tablet and desktop
- **Hero Banner** - Eye-catching header with custom branding
- **Professional Bio** - Comprehensive background and career highlights
- **Selected Works** - Showcase of game compositions and projects
- **Social Media Integration** - Links to Twitch, YouTube, Instagram, and TikTok
- **Contact Form** - Integrated contact form for inquiries
 - **Accessibility Improvements** - Skip-to-content link, visible focus states, ARIA roles for form success/error messages, and keyboard-friendly interactions
 - **Cleaned CTAs** - Removed a redundant "DISCUSS YOUR PROJECT" button (one primary CTA remains)

## Setup Instructions

### Local Development

1. Simply open `index.html` in your web browser
2. No build process or dependencies required

### Contact Form Setup

The contact form is currently configured to use **Web3Forms** (a free service). To enable it:

1. Visit [https://web3forms.com](https://web3forms.com)
2. Sign up for a free account and get your access key
3. Open `index.html` and find this line (around line 570):
   ```javascript
   formData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual access key

**Alternative Options:**
- Use **Formspree** ([formspree.io](https://formspree.io))
- Use **EmailJS** ([emailjs.com](https://www.emailjs.com))
- Set up your own backend server

Note: The contact form script now adds ARIA roles and moves focus to the success/error messages for better screen-reader feedback.

### Deployment Options

You can deploy this website to:

1. **GitHub Pages** - Free hosting for static sites
2. **Netlify** - Free tier with automatic deployments
3. **Vercel** - Free hosting with excellent performance
4. **Any web hosting service** - Just upload the files

## File Structure

```
dan-portfolio/
├── index.html          # Main HTML file
├── images/             # Image assets
│   ├── hero-banner.jpg # Hero section banner (jpg)
│   ├── dan-headshot.jpg # Profile photo (jpg)
│   └── Homestead.jpg   # Release artwork (jpg)
└── README.md           # This file
```

## Customization

### Updating Content

- **Bio**: Edit the paragraphs in the "About" section
- **Works**: Add or modify entries in the "Selected Works" grid
- **Social Links**: Update URLs in the "Music & Streaming" and "Connect" sections
- **Colors**: Modify the CSS color variables (purple theme: `#d8b3ff`, `rgba(62, 6, 112, ...)`)

## Recent Changes (Changelog)

- Removed redundant CTA: the "DISCUSS YOUR PROJECT" button in the Testimonials section was removed; the hero CTA (`Start Your Project`) and the Contact form are the primary ways to reach out.
- Accessibility improvements: added a visible "Skip to Main Content" link, ARIA roles for form messages, and programmatic focus on success/error messages for screen-readers.
- CSS cleanup: spacing and many layout values are being migrated from `px` to relative units (`rem`, `%`) for better responsiveness; this is a partial refactor and will continue.

If you'd like, I can continue the px→rem conversions across the entire style block, or extract the styles into a separate `styles.css` file for easier maintenance.

### Adding New Sections

Follow the existing pattern:
```html
<div class="section">
    <h2>Section Title</h2>
    <!-- Your content here -->
</div>
```

## Performance & Optimization

### Image Optimization

For best performance, ensure all images are properly optimized:

- **Hero Banner**: Recommended size 1920x400px, compressed to under 200KB
- **Profile Photo**: Recommended size 400x400px, compressed to under 100KB
- **Game Thumbnails**: Recommended size 600x400px, compressed to under 150KB each
- **Album Artwork**: Recommended size 500x500px, compressed to under 200KB

**Tools for compression:**
- [TinyPNG](https://tinypng.com) - Excellent for PNG/JPG compression
- [Squoosh](https://squoosh.app) - Google's image optimization tool
- [ImageOptim](https://imageoptim.com) - Mac app for batch optimization

### Speed Testing

Regularly test your site speed using:
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)

**Target metrics:**
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Total page size: < 2MB

### Accessibility

The site is designed with accessibility in mind:

✅ **High contrast text** - All text meets WCAG AA standards for readability
✅ **Semantic HTML** - Proper heading hierarchy and structure
✅ **Alt text** - All images include descriptive alt attributes
✅ **Keyboard navigation** - All interactive elements are keyboard accessible
✅ **Focus indicators** - Visible focus states for form inputs and links

**Test accessibility:**
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org)
- Browser DevTools Lighthouse audit

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

- Design: Based on original skeleton by user
- Font Icons: Font Awesome 6.4.0
- Images: Provided by Dan Policar

## License

© 2025 Dan Policar. All rights reserved.
