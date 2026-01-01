# Mimir - Next Features Roadmap

This document outlines the planned future features and enhancements for the Mimir TV Remote application.

## 1. Enhanced User Experience

- [x] **Haptic Feedback**: Implement `navigator.vibrate` to provide tactile feedback when users press buttons on their mobile devices.
- [ ] **Customizable Layouts**: Allow users to drag-and-drop buttons or toggle visibility of specific sections (e.g., Number Pad, Media Controls).
- [ ] **Themes**: Add selectable color themes beyond the default dark mode, including high-contrast options.
- [ ] **Gesture Control**: Implementing swipe gestures on the touchpad area for navigation (Up/Down/Left/Right).

## 2. Smart Automation

- [ ] **Macros / Routines**: Create custom sequences of commands.
  - _Example "Movie Night":_ Power On -> Input HDMI 1 -> Volume 20 -> Mute off.
- [ ] **Voice Control**: Integrate the Web Speech API to enable voice commands like "Volume Up," "Mute," or "Turn Off."
- [ ] **Sleep Timer**: A software-based sleep timer that sends the "Power Off" command after a set duration.

## 3. Advanced Device Control

- [ ] **App Shortcuts / Favorites**: Quick-access buttons for popular apps (Netflix, YouTube, Disney+, etc.) and favorite TV channels.
- [ ] **Manual Device Addition**: distinct from auto-discovery, allow users to manually enter an IP address for a TV.
- [ ] **Wake-on-LAN (WoL)**: Ensure devices can be turned on even when they are in deep sleep mode (requires backend support).

## 4. Platform & Accessibility

- [ ] **Progressive Web App (PWA) Polish**: Ensure the app has a perfect lighthouse score, installability, and distinct splash screens for all devices.
- [ ] **Keyboard Shortcuts**: Map physical keyboard keys (Arrow keys, Enter, Esc, Space) to remote functions for desktop users.
- [ ] **Internationalization (i18n)**: Support for multiple languages.

## 5. Backend & Connectivity

- [ ] **Multi-Brand Support**: Expand beyond the current implementation to fully support Samsung (Tizen), LG (WebOS), and Android TV protocols.
- [ ] **State Sync**: Better two-way communication to reflect the actual state of the TV (e.g., specific volume level, current app) where supported.
