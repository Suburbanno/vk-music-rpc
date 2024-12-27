// ==UserScript==
// @name         Vk Music RPC hook
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  This extension is a hook for the vk-discord-rpc project on github
// @author       TofaDev, Suburbanno
// @updateURL    https://raw.githubusercontent.com/Suburbanno/vk-music-rpc/main/vk-extension.js
// @downloadURL  https://raw.githubusercontent.com/Suburbanno/vk-music-rpc/main/vk-extension.js
// @match        *://vk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.socket.io/4.0.0/socket.io.min.js
// ==/UserScript==

const getCurrentPlayingMusic = () => {
  var wrap = document.querySelector(".top_audio_player_title_wrap");
  var textMusicDiv = wrap.querySelector("div");

  return textMusicDiv.textContent;
};

const musicIsPlaying = (musicPlayer) => {
  return musicPlayer.classList.contains("top_audio_player_playing");
};

let serverUrl = GM_getValue("serverUrl", "ws://localhost:8112");

GM_registerMenuCommand("Set the websocket server address", () => {
  let url = prompt(
    "Enter the address for the websocket server in the format: ws://host:port",
    serverUrl
  );
  if (url) {
    serverUrl = url;
    GM_setValue("serverUrl", url);
  }
});

(function () {
  "use strict";

  const musicPlayer = document.getElementById("top_audio_player");

  if (!musicPlayer) return;

  const socket = io.connect(serverUrl);

  socket.on("connect", () => {
    console.log("connected to vk-discord-rpc server");

    let lastSong = null;
    let isSongPaused = false;

    setInterval(() => {
      if (!musicIsPlaying(musicPlayer)) {
        if (!isSongPaused) {
          socket.emit("song_paused", "song is paused");
          isSongPaused = true;
        }
        lastSong = null;
        return;
      }

      isSongPaused = false;

      let currentSong = getCurrentPlayingMusic();

      if (lastSong === currentSong) return;

      lastSong = currentSong;

      let splittedSong = currentSong.split("—");

      socket.emit("song_changed", {
        artist: splittedSong[0],
        songName: splittedSong[1],
        source: "VK",
      });
    }, 500);
  });
})();
