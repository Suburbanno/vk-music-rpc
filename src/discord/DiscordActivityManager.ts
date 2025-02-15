import { ConsoleColor } from "../enum/ConsoleColor";
import { IConfiguration } from "../interface/IConfiguration";
import { Logger } from "../utils/Logger";
import { DiscordRPC } from "./DiscordRPC";
import { SongStatus } from "../enum/SongStatus";
import { ISong } from "../interface/ISong";
import { translateMusicSource } from "../enum/MusicSource";

export class DiscordActivityManager {
  private discordRPC: DiscordRPC;
  private config: IConfiguration;
  private lastSongText: string | null = null;

  constructor(discordRPC: DiscordRPC, config: IConfiguration) {
    this.config = config;
    this.discordRPC = discordRPC;
  }

  public updateActivity(songStatus: SongStatus, song?: ISong): void {
    if (song != null && songStatus == SongStatus.PLAYING) {
      const songText = `${song.artist} - ${song.songName}`;

      if (songText.length >= 128 || songText === this.lastSongText) return;

      this.lastSongText = songText; 

      Logger.log(`Currently playing: ${songText}`, ConsoleColor.GREEN);

      this.discordRPC.setActivity({
        details: this.config.activity.text.nowPlaying.replace(
          "%source%",
          translateMusicSource(song.source)
        ),
        state: songText,
      });
    } else {
      this.lastSongText = null;
      this.discordRPC.setActivity();
    }
  }
}
