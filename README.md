# Spotify AI – The Future of Music Listening

A reimagined Spotify web experience, supercharged with AI capabilities. Designed and built during the **Level Up: Vibe Coding Hackathon**, this project blends innovation, design, and personalization to elevate the way you discover and enjoy music.

---

> ⚠️ **Note:** The backend API is hosted on [Render](https://render.com) using their free plan.  
> If the API has been inactive for a while, it may take **50–60 seconds** to spin up the first time you access it. Please be patient!
> If there is n error during the generation, please click on try again and generate the playlist again as the backend can sometime take some time to properly fire up. 
---

## Features That Set Us Apart

### Refined UI/UX

* **Fluid Playlist Navigation**
  Seamless, animated transitions make switching between playlists a pleasure.

* **Customizable Sidebar**
  Resize or collapse the sidebar to suit your workflow and screen size.

* **Modern Aesthetic**
  A clean, sleek design with improved visual hierarchy for intuitive interaction.

* **Responsive by Nature**
  Optimized for every screen—from mobile to desktop.

### Intelligence Meets Music

* **AI-Curated Playlists**
  Generate playlists simply by describing your vibe or mood in natural language.

* **Context-Aware Song Suggestions**
  Personalized recommendations tailored to how you're feeling.

* **Instant Prompt Templates**
  No need to think—use pre-built prompts to create playlists in seconds.

* **One-Click Save to Library**
  Effortlessly keep the tracks you love.

### Interactive & Immersive

* **Animated Actions**
  Smooth transitions when saving or removing tracks for a more delightful user experience.

* **Real-Time Feedback**
  Instant visual cues when you interact with your music.

* **Enhanced Fullscreen Mode**
  A dynamic, immersive player that changes with your music.

---

## Visual Showcase

Include screenshots to bring the experience to life:

<img width="1511" alt="image" src="https://github.com/user-attachments/assets/bd615467-b106-4879-be38-f5349bc30157" />
<img width="1510" alt="image" src="https://github.com/user-attachments/assets/033e33e9-4401-4749-87b7-213d32fb5a70" />
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/7a0da081-cef8-45b6-9c83-71acccc49642" />
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/f343ba96-5bb5-40e3-aa7c-c0a522641200" />
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/a33efa1f-b5b4-4916-827b-33e95ab6837b" />

---

## Engineering Improvements

### How We Improved Upon the Original

| Original Spotify                 | Our Enhanced Version                               |
| -------------------------------- | -------------------------------------------------- |
| Static playlist switching        | Animated transitions for seamless navigation       |
| Manual playlist curation         | AI-generated playlists with natural language input |
| Basic fullscreen experience      | Dynamic, immersive fullscreen visuals              |
| Standard save/remove interaction | Animated feedback with instant responses           |

### Under-the-Hood Enhancements

* **Snappy Transitions**
  Optimized animations reduce lag and boost engagement.

* **Improved State Management**
  Smarter logic keeps the app fast and responsive.

* **Robust Error Handling**
  Clear user feedback and smooth recovery for edge cases.

* **Performance Optimizations**
  Reduced load times and efficient rendering for better scalability.

---

## Tech Stack

* **Frontend Framework**: Next.js, React, TypeScript
* **Backend**: Flask
* **Styling**: Tailwind CSS
* **Animation**: Framer Motion
* **Icons**: Lucide React
* **Deployment**: Vercel


---

## Get Started in Minutes

```bash
# Clone the repo
git clone https://github.com/devrishisikka/spotify-ai.git

# Navigate to project folder
cd spotify-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
spotify-ai/
├── app/
│   ├── page.tsx           → Main entry page
│   └── layout.tsx         → Global layout
├── components/
│   ├── mood-search.tsx    → AI playlist generator
│   ├── LoadingScreen.tsx  → Initial load animation
│   └── AudioWaveform.tsx  → Visual audio experience
└── public/
    └── animations/        → Lottie and SVG animations
```

---

## Contribute

Have ideas or improvements? Open a pull request or create an issue. We welcome all contributions—big or small.

---

## License

This project is open source under the [MIT License].

---

## Credits & Inspiration

* Inspired by Spotify’s music platform
* Built for the **Level Up: Vibe Coding Hackathon**
* Thanks to the dev community and all contributors

---

## Connect With Us

Questions, ideas, or feedback? Reach out at: **[devrishisikka@gmail.com](mailto:devrishisikka@gmail.com)**

