# Digital Futures Undergraduate Program - New Layout

## Overview

This project contains a redesigned interface for viewing Digital Futures undergraduate pathways with an improved layout optimized for both desktop and mobile devices.

## New Features

### 🎨 **Modern Layout**
- **Sidebar Navigation**: Clean pathway selection cards with descriptions
- **Grid-Based Course Display**: 4 years vertically × course types horizontally
- **Responsive Design**: Fully optimized for mobile devices
- **Interactive Course Details**: Click any course to see full information

### 📱 **Mobile-First Design**
- Collapsible sidebar on mobile devices
- Touch-friendly course selection
- Optimized grid layout for small screens
- Responsive typography and spacing

### 🔧 **Technical Improvements**
- JSON-powered data loading
- Modular JavaScript architecture
- Clean CSS with CSS custom properties
- Accessibility features (keyboard navigation, ARIA labels)

## File Structure

```
├── index-new.html          # New layout HTML
├── styles-new.css          # New layout styles
├── script-new.js           # New layout JavaScript
├── pathways/               # JSON data files
│   ├── creative-technologist.json
│   ├── physical-interface-designer.json
│   ├── games-playable-media-maker.json
│   ├── pathway-comparison.json
│   └── searchable-index.json
└── README.md              # This file
```

## Usage

1. **Open `index-new.html`** in your web browser
2. **Select a pathway** from the sidebar cards
3. **Browse courses** in the grid layout (4 years × course types)
4. **Click any course** to view detailed information
5. **Use on mobile** - the layout automatically adapts

## Layout Structure

### Sidebar (Left)
- Pathway selection cards with descriptions
- Placeholder for future search and filter features
- Responsive - collapses on mobile

### Main Content (Right)
- Header with pathway information
- Course grid: 4 rows (years) × 3 columns (course types)
- Each cell shows courses for that year/type combination
- Click courses for detailed modal view

## Course Types

1. **Core Courses** - Required courses for all students
2. **Program-Specific Electives** - Specialized courses for each pathway
3. **Open Electives** - Flexible course choices

## Mobile Features

- **Responsive Grid**: Single column layout on mobile
- **Touch Interactions**: Optimized for touch devices
- **Readable Typography**: Adjusted font sizes for small screens
- **Accessible Navigation**: Keyboard and screen reader support

## Future Enhancements

The layout is designed with placeholders for:
- 🔍 **Search functionality**
- 🎛️ **Advanced filtering options**
- 📊 **Course comparison tools**
- 💾 **Save/load user preferences**
- 📱 **Progressive Web App features**

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Adding New Pathways
1. Create JSON file in `pathways/` directory
2. Add pathway card to sidebar in HTML
3. Update JavaScript data loading if needed

### Customizing Styles
- Use CSS custom properties in `:root` for easy theming
- Grid layout can be adjusted in `.course-grid`
- Responsive breakpoints defined in media queries

### Extending Functionality
- Search features can be added to `.sidebar-footer`
- Additional filters can extend the pathway selection
- Modal can be enhanced with course prerequisites, etc.

## Data Format

Courses are stored in JSON format with this structure:
```json
{
  "name": "Creative Technologist",
  "years": {
    "1": {
      "core_courses": [
        {
          "code": "DIGF-1002",
          "title": "Cross-Disciplinary Collab",
          "credits": 0.5,
          "description": "..."
        }
      ]
    }
  }
}
```

## Contributing

1. Test on multiple devices and browsers
2. Ensure mobile responsiveness
3. Maintain accessibility standards
4. Follow existing code style and structure
