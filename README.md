# 🎲 Guess the Roll

A fun, interactive web game where you try to guess the outcome of a dice roll!  
Test your luck, earn points, and enjoy smooth animations with automatic day/night theme support.

---

## 🚀 Features

- **Simple Gameplay:** Guess the number (1–6) before the dice is rolled.
- **Animated Dice:** Dice images shake and update with each roll.
- **Difficulty Levels:** Easy, Medium, and Hard with different point systems.
- **Points System:** Gain or lose points based on your guess and level.
- **Responsive Design:** Looks great on desktop and mobile.
- **Auto Day/Night Theme:** Follows your system’s light/dark mode.
- **Immersive Sound Effects:** Audio feedback for guesses, rolls, wins, losses, and special alerts.
- **Unique Dice Roll Mechanic:** Experience a structured dice roll system (pseudo-random block sequence) for varied gameplay.
- **Accessible:** Keyboard and screen reader friendly.
- **Modern Font:** Uses the Quicksand font for a friendly look.

---

## 🕹️ How to Play

1. Select your difficulty level (Easy, Medium, Hard).
2. Click a number button (1–6) to make your guess.
3. The dice will roll and reveal the result.
4. If you guessed right, you earn points (amount depends on level). If not, you lose points.
5. Get to 50 points to win, or drop to -50 to lose.
6. Click **Reset Game** to start over at any time.

---

## 📦 Project Structure

```
Guess-the-Roll/
│
├── assets/
│   ├── dice/
│   │   ├── dice1.png
│   │   ├── dice2.png
│   │   ├── dice3.png
│   │   ├── dice4.png
│   │   ├── dice5.png
│   │   └── dice6.png
│   └── sounds/
│       ├── correct.mp3
│       ├── wrong.mp3
        ├── wrong_special.mp3
│       ├── roll.mp3
│       ├── win.mp3
│       └── lose.mp3
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── index.html
└── README.md
```

---

## 🛠️ Setup & Usage

1. **Clone or Download** this repository.
2. Make sure all dice images are in `assets/dice/` and named `dice1.png` to `dice6.png`.
3. Open `index.html` in your browser.
- Ensure sound files are present in `assets/sounds/` for the full audio experience (the game will run without them but audio features will be missing).
4. Enjoy!

---

## ✨ Customization

- **Add More Animations:** Edit `css/style.css` for custom effects.
- **Change Dice Images:** Replace images in `assets/dice/`.
- **Manual Theme Toggle:** Add a toggle button if you want users to switch themes manually.
- **Customize Sound Effects:** Replace sound files in `assets/sounds/` and update paths in `js/main.js` if needed.
- **Change Font:** Edit the Google Fonts link in `index.html` and update the `font-family` in `style.css`.
- **Adjust Dice Roll Behavior:** Modify the `BLOCK_SIZES_SEQUENCE` array in `js/main.js` to change the pattern of the pseudo-random dice rolls.

---

## 📄 License

MIT License.  
Feel free to use, modify, and share!

---

**Made with ❤️ for learning and fun!**
