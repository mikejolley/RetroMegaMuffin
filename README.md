# RetroMegaMuffin – Links & Ratings

A retro-themed static site for GitHub Pages featuring a Metro-style grid of social links and a game ratings table.

## Features

- **Metro UI Grid**: Social media links with video backgrounds and hover effects
- **Game Ratings**: Interactive table with detailed breakdowns
- **Tab Navigation**: URL hash-based navigation with persistence
- **Responsive Design**: Scales beautifully from mobile to desktop
- **Retro Theme**: Press Start 2P fonts, CRT effects, and pixel art styling

## File Structure

- `index.html`: Main site structure and content
- `styles.css`: All styling including responsive design and animations
- `script.js`: Tab navigation, video controls, and ratings functionality
- `data/ratings.json`: Game ratings data in JSON format
- `assets/`: Images, videos, and platform icons

## Local Development

### Simple HTTP Server

```sh
python3 -m http.server 5173
```

Visit `http://localhost:5173`

### Docker (Optional)

```sh
colima start
docker compose up -d --build
```

Then open `http://localhost:5173`

## Customization

### Adding Social Links

Edit the grid tiles directly in `index.html` around line 80-170.

### Updating Game Ratings

Modify `data/ratings.json` with your game reviews. Each entry should include:

- `name`: Game title
- `platform`: Gaming system
- `ratings`: Object with gameplay, graphics, music, replay, challenge, slant scores

### Changing Colors/Styling

Update CSS custom properties in `styles.css` (lines 18-32) to modify the color scheme.

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository
3. Go to Settings → Pages
4. Set source to "Deploy from a branch" → "main" → "/ (root)"
5. Your site will be available at `https://yourusername.github.io/repository-name`

## Browser Support

Modern browsers with CSS Grid and ES6 module support. The site gracefully degrades on older browsers.

## License

MIT
