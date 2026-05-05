# Garden Solitaire — iOS Build & Run Guide

## Prerequisites

1. **Xcode** — Install from Mac App Store
2. **CocoaPods** — `sudo gem install cocoapods`
3. **Apple Developer Account** (for device deployment)

---

## Setup (First Time Only)

```bash
git clone https://github.com/LLMFAO/garden-solitaire.git
cd garden-solitaire
npm install
npx cap add ios
```

## Build & Sync

```bash
npm run build && npx cap sync ios
cd ios/App && pod install && cd ../..
```

## Open in Xcode

```bash
npx cap open ios
```

In Xcode:
- Select a simulator (e.g., iPhone 15) or your device
- Click the Play button (▶️) to build and run

## Making Code Changes

After editing source code:

```bash
npm run build && npx cap sync ios
```

Then rebuild in Xcode (Cmd+R).

## Troubleshooting

**"tool 'xcodebuild' requires Xcode"**
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

**Permission denied on ios/ folder**
```bash
sudo chown -R $(whoami) ~/Documents/garden-solitaire/ios
```

**Missing ios/ folder**
```bash
npx cap add ios && npm run build && npx cap sync ios
```

---

## Project Structure

```
src/              — React + TypeScript source
src/components/   — UI components (GameBoard, TopBar, Card, etc.)
src/store/        — Zustand state (gameStore, settingsStore)
ios/              — Native iOS project (Capacitor)
dist/             — Built web assets (gitignored, generated)
```
