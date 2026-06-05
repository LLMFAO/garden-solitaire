# Garden Solitaire

Traditional solitaire where playing the game grows a garden. React + TypeScript +
Vite web app wrapped natively for iOS with Capacitor.

- Web source: `src/` (components in `src/components/`, Zustand stores in `src/store/`)
- Native iOS project: `ios/` (Capacitor)
- Built web assets: `dist/` (generated, gitignored)
- App Store screenshots: `app-store-assets/` (`iphone-6.9-1320/` is the live set)

## Common commands

```bash
npm run dev      # Vite dev server
npm run build    # tsc + vite build  ->  dist/
npm test         # node --test on tests/gameLogic.test.ts
```

After changing web source, sync into the native project before building in Xcode:

```bash
npm run build && npx cap copy ios     # or: npx cap sync ios
```

---

# iOS release runbook (TestFlight + App Store)

## App / account identifiers

| Thing | Value |
|---|---|
| App name | Garden ~ Solitaire |
| Bundle ID | `com.gardensolitaire.app` |
| App Store Connect app id | `6766763805` |
| Team ID | `E4WZK7V29T` |
| Primary locale | `en-US` |
| Version field | `MARKETING_VERSION` (e.g. 1.0.1) |
| Build field | `CURRENT_PROJECT_VERSION` |

## App Store Connect API key

Uploads/submissions use an App Store Connect API key (shared with the Block Blast app,
same Apple account):

- Key ID: `M6262AX69L`
- Issuer ID: `69a6de72-3c0c-47e3-e053-5b8c7c11a4d1`
- Private key (`.p8`, the real secret): `~/.appstoreconnect/private_keys/AuthKey_M6262AX69L.p8`

`fastlane/api_key.json` wires this into fastlane. It is **gitignored** (contains the key)
and must be recreated locally. For this fastlane version the key must be embedded inline
under `"key"` (not `key_filepath`):

```bash
python3 - <<'PY'
import json
key = open("/Users/paul/.appstoreconnect/private_keys/AuthKey_M6262AX69L.p8").read()
json.dump({
  "key_id": "M6262AX69L",
  "issuer_id": "69a6de72-3c0c-47e3-e053-5b8c7c11a4d1",
  "key": key,
  "in_house": False
}, open("fastlane/api_key.json","w"), indent=2)
PY
```

## Tooling

- `fastlane` is installed via Homebrew (`brew install fastlane` — system Ruby 2.6 is too old).
  Run lanes with `/opt/homebrew/bin` on PATH.
- `xcrun altool` / `xcodebuild` come from Xcode.

## 1. Build & export the IPA

Build web, sync to iOS, archive, and export an App Store IPA. The archive lands in
`build/GardenSolitaire.xcarchive` and the IPA in `build/AppStoreExport/App.ipa`
(`build/` is gitignored). Export uses `build/ExportOptions.plist` (method
`app-store-connect`, automatic signing, team `E4WZK7V29T`).

`ITSAppUsesNonExemptEncryption=false` is set in `ios/App/App/Info.plist`, so builds skip
the export-compliance prompt (local solitaire game, no custom encryption).

## 2. Upload to TestFlight

Always validate first, then upload (the `.p8` is auto-discovered in
`~/.appstoreconnect/private_keys/`):

```bash
xcrun altool --validate-app -f build/AppStoreExport/App.ipa -t ios \
  --apiKey M6262AX69L --apiIssuer 69a6de72-3c0c-47e3-e053-5b8c7c11a4d1

xcrun altool --upload-app -f build/AppStoreExport/App.ipa -t ios \
  --apiKey M6262AX69L --apiIssuer 69a6de72-3c0c-47e3-e053-5b8c7c11a4d1
```

Apple takes ~5–15 min to process; the build then shows as VALID under TestFlight.
Note: TestFlight previews show the **currently-live** App Store version's screenshots,
not the in-progress version's.

## 3. Screenshots

- Required set: iPhone 6.9" display, **1320×2868** PNG. App Store Connect stores these
  under display type `APP_IPHONE_67` (Apple's unified 6.7"/6.9" bucket). That set alone
  satisfies requirements — Apple auto-scales it to smaller devices.
- Canonical set lives in `app-store-assets/iphone-6.9-1320/` (`000.png`–`003.png`, in order).
- deliver reads from `fastlane/screenshots/<locale>/` and uploads in filename-sorted order.
  Keep `fastlane/screenshots/en-US/` in sync with the canonical set when changing shots.

Upload screenshots only (no binary, no metadata, no submission):

```bash
fastlane screens
```

## 4. Submit for review

`fastlane submit` selects build 2, declares compliance (no encryption / no IDFA / no
third-party content), and submits v1.0.1 with automatic release. Edit the `build_number`
in the lane for new builds.

```bash
fastlane submit
```

## fastlane lanes (`fastlane/Fastfile`)

| Lane | Does |
|---|---|
| `inspect` | App + version states, locales, recent builds |
| `all_screens` | Screenshot counts per version (live + editable) |
| `readiness` | Submission readiness (attached build, What's New, compliance) |
| `screens` | Upload screenshots only to the editable version |
| `submit` | Attach build + answer compliance + submit for review |

## Notes

- Review typically takes ~24–48h; release type is automatic (goes live on approval).
- On rejection, fix the issue, re-archive/upload a new build, bump `build_number` in the
  `submit` lane, and rerun `fastlane submit`.
