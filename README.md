# Happy Birthday Surprise

An interactive birthday celebration webpage with a romantic pink theme, animated decorations, music, a love letter, cake-cutting interaction, memory gallery, and a final love note.

## Features

- Animated birthday preloader and surprise reveal
- Background birthday music with a music control button
- Floating hearts, petals, and sparkles
- Interactive envelope that reveals a love letter
- Birthday cake interaction:
  - Click the candle to blow it out
  - Drag the knife to cut the cake
- Memory gallery with interactive photo cards
- Responsive layout for desktop, tablet, and mobile screens
- Animated final message with romantic photo frames
- Pink-themed creator footer with GitHub and LinkedIn links

## Project Structure

```text
.
├── index.html       # Main webpage markup
├── style.css        # Theme, layout, animations, and responsive styles
├── script.js        # Interactions, animations, audio, and progression logic
├── bdy.mp3         # Background music used by the webpage
├── hbd.mp3         # Additional audio asset
└── assets/
    ├── img0.jpg     # Final-section photos
    └── img1.jpg     # Memory-gallery photos
```

## Getting Started

No build tools or package installation are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/ankitgl200/hbd.git
   cd hbd
   ```

2. Open `index.html` in a modern web browser.

   For the best experience, use a local server instead of opening the file directly:

   ```bash
   python -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000).

4. LIVE DEMO : [Pyar Ka Birthday](https://pyar-ka-bdy.vercel.app/)

## How to Customize

### Personal message

Update the text in `index.html` to change:

- The love letter
- Birthday headings and messages
- Final love note
- Recipient and sender names

The template contains placeholders such as `[NAME]` and `[YOUR NAME]` that should be replaced before publishing.

### Photos

Replace the files in `assets/` with your own images, keeping the same filenames:

- `assets/img1.jpg` is used in the memory gallery.
- `assets/img0.jpg` is used in the final love-note section.

You can also update the image paths directly in `index.html`.

### Music

The webpage currently loads `bdy.mp3` from the audio element in `index.html`. Replace that file or update the `src` value to use another local audio file.

Browsers may block autoplay. The music starts after the visitor clicks **Open My Surprise**, and it can be controlled with the floating music button.

### Styling

Use the CSS variables at the top of `style.css` to adjust the main colors, fonts, shadows, and transitions.

## External Resources

The page uses these CDN-hosted resources:

- [Google Fonts](https://fonts.google.com/)
- [Font Awesome](https://fontawesome.com/)
- [GSAP](https://gsap.com/)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

An internet connection is required for these CDN resources unless they are downloaded and served locally.

## Deployment

This is a static website and can be deployed using GitHub Pages:

1. Push the project to a GitHub repository.
2. Open the repository's **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the main branch and the root folder.
6. Save the settings and open the generated GitHub Pages URL.

Make sure all image and audio filenames match their references, including capitalization.

## Author

Created by **Ankit Ghugtyal**

- GitHub: [ankitgl200](https://github.com/ankitgl200)
- Repository: [hbd](https://github.com/ankitgl200/hbd)
- LinkedIn: [ghugtyal-ankit](https://www.linkedin.com/in/ghugtyal-ankit)

## License

This project is licensed under the [MIT License](./LICENSE).
