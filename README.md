# vk-music-rpc

This program allows you to display the music you're listening to on VKontakte as your Discord status.

### Example

**When music is playing on VK Music:**

![When music is playing on VK](https://github.com/user-attachments/assets/949e9843-60f7-486e-b3ba-47cfc7ec4889)

All status messages can be customized in a configuration file that is generated after the program is launched.

# Troubleshooting

## The program is running, but the Discord status is not displayed

Ensure that "Activity Status" is enabled in Discord:

**Settings -> Privacy & Safety -> Display current activity as a status message**

# Installation

1. First, if you don't have [Tampermonkey](https://www.tampermonkey.net/) installed, you need to install it for your browser.

2. Next, you need to install the appropriate script:

   - [VK Music Script](https://raw.githubusercontent.com/Suburbanno/vk-music-rpc/main/vk-extension.js)
   - [Yandex Music Script](https://raw.githubusercontent.com/Suburbanno/vk-music-rpc/main/yandex-extension.js)

3. Finally, download and run the program. That's it! You're amazing.

The program is available for Linux, Windows, and iOS. You can download it from the [releases page](https://github.com/Suburbanno/vk-music-rpc/releases/).

# Building From Source

## Dependencies

- Node.js version 16

## Instructions

By default, the build is set to target x64 processors for Linux, iOS, and Windows.

If you need a build for a different processor type, you can modify the `scope` property in the **package.json** file to suit your needs.

To build the program, open a terminal and run the following command:

```bash
npm run build:release
```
After the build process is complete, a **releases** folder will be created in the project directory containing the compiled binaries.

> this is a fork from [TofaDev](https://github.com/TofaDev)
