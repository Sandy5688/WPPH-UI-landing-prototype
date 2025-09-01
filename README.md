# Content UI with Mock API - Ads and Branding Integration

This project demonstrates a content display UI with integrated advertising and branding capabilities using pure HTML, CSS, and JavaScript.

## Features

- **Content Display**: Responsive grid layout for articles/posts
- **Search & Filtering**: Real-time search and category filtering
- **Ad Integration**: Multiple ad slots (header, sidebar, inline, footer, mobile)
- **Branding System**: Dynamic logo and color scheme application
- **Mock API**: Complete mock data structure with posts, ads, and branding
- **Pure HTML/CSS/JS**: No frameworks or build tools required

## Mock API Structure

The mock API data (`mock-api-data.json`) includes:

### Posts
- Article content with titles, descriptions, categories
- View counts and publication dates
- Thumbnail images and links

### Ads
- Multiple ad slots: `banner_top`, `sidebar_1`, `sidebar_2`, `banner_footer`, `inline_1`, `inline_2`, `mobile_banner`
- Each ad includes image URL, click URL, and alt text
- Responsive ad placement throughout the UI

### Branding
- Company logo and name
- Primary, secondary, and accent colors
- Social media links
- Tagline

## Setup Instructions

1. **Upload to MockAPI**:
   - Copy the content from `mock-api-data.json`
   - Upload it to your MockAPI endpoint: `https://68b43ecb45c90167876fdf56.mockapi.io/api/v1/posts`

2. **Open the Application**:
   - Simply open `index.html` in your web browser
   - Or serve it through any web server

3. **That's it!** The application will automatically load content, ads, and branding from your MockAPI

## File Structure

```
ui/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # Styling with brand color support
│   └── js/
│       └── app.js          # Main application logic
├── mock-api-data.json      # Complete mock data (for reference)
└── README.md               # This file
```

## Customization

### Adding New Ad Slots
1. Add new ad entries to `mock-api-data.json` with unique slot names
2. Update the `AdManager` class in `app.js` to handle new slots
3. Add corresponding CSS styles if needed

### Modifying Branding
1. Update the `branding` object in `mock-api-data.json`
2. The application will automatically apply:
   - Logo image or company name
   - Brand colors (primary, secondary, accent)
   - Social media links

### Changing Content
1. Modify the `posts` array in `mock-api-data.json`
2. Each post should include: `id`, `title`, `description`, `category`, `date`, `views`, `thumbnail`, `link`

## Browser Compatibility

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Progressive enhancement for older browsers

## Development

For development with auto-restart:
```bash
npm run dev
```

## License

MIT License - feel free to use and modify as needed.
