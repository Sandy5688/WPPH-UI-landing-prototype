# Content UI with Mock API - Ads and Branding Integration

This project demonstrates a content display UI with integrated advertising and branding capabilities using pure HTML, CSS, and JavaScript.

## Features

- **Content Display**: Responsive grid layout for articles/posts
- **Search & Filtering**: Real-time search and category filtering
- **Ad Integration**: Multiple ad slots (header, sidebar, inline, footer, mobile)
- **Branding System**: Dynamic logo and color scheme application
- **Mock API**: Complete mock data structure with posts, ads, and branding
- **Pure HTML/CSS/JS**: No frameworks or build tools required

## Mock Data Structure

The mock data file (`mock-api-data.json`) includes:

### Posts (Updated Schema)
- Video/article-like items with the following fields:
  - `id` (string)
  - `title` (string)
  - `description` (string)
  - `tags` (array of strings)
  - `category` (string)
  - `media_url` (string)
  - `thumbnail_url` (string)
  - `published_at` (ISO date string)
  - `source` (string)

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

1. **Run a local static server (recommended to avoid CORS)**:
   - Python: `python3 -m http.server 8080`
   - Or npm: `npm exec --yes http-server -p 8080`

2. **Open the application**:
   - Visit: `http://localhost:8080`

3. **Data loading**:
   - By default, the app fetches from the local `mock-api-data.json`.
   - If you prefer a remote API, update `apiUrl` in `assets/js/app.js` and ensure the response matches the expected structure.

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
1. Modify the `posts` array in `mock-api-data.json`.
2. Each post should include the updated fields: `id`, `title`, `description`, `tags`, `category`, `media_url`, `thumbnail_url`, `published_at`, `source`.
3. Ads and branding remain under `ads` and `branding` and are unchanged.

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
