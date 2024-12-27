import fse from "fs-extra";
import { Promt } from "../cli/Promt";
import { ConsoleColor } from "../enum/ConsoleColor";
import { IConfiguration } from "../interface/IConfiguration";
import { Logger } from "../utils/Logger";

export default class Config {
  private rawConfig: IConfiguration | undefined;

  public create(config: IConfiguration): void {
    if (this.exists()) throw new Error(`Config already exists!`);

    fse.writeFileSync(this.getConfigPath(), JSON.stringify(config, null, 4));
  }

  public get(): IConfiguration | null | undefined {
    if (!this.exists()) return null;

    return this.rawConfig;
  }

  public exists(): boolean {
    return fse.existsSync(this.getConfigPath());
  }

  public getConfigPath(): string {
    return `${process.cwd()}/config.json`;
  }

  private setRawConfig(): void {
    let config = JSON.parse(
      fse.readFileSync(this.getConfigPath(), "utf-8")
    ) as IConfiguration;

    this.rawConfig = config;
  }

  public async initializeConfig(promt: Promt): Promise<void> {
    if (this.exists()) return this.setRawConfig();

    let config: IConfiguration = {
      clientId: "1306411002635485265",
      debug: null,
      websocketPort: 8112,
      discordButtons: [
        {
          "label": "Vk Music",
          "url": "https://music.vk.com/"
      }
      ],
      activity: {
        images: {
          largeImageKey: "vk_music",
          smallImageKey: "vk_small",
        },
        text: {
          firstLine: "No music playing",
          secondLine: " ",
          nowPlaying: "Currently playing on %source%:",
          largeImageHint: "VK Music",
          smallImageHint: "VK",
        },
      },
      musicSource: {
        vk: "VK Music",
        yandex: "Yandex Music",
      },
    };

    config.debug = false;

    this.create(config);

    Logger.log(
      `The program configuration has been created at the path: ${this.getConfigPath()} \n. You can manually edit it or delete it to go through the setup procedure again`,
      ConsoleColor.GREEN
    );
    Logger.log(
      `The program has been updated to version 1.1.0, it is recommended to delete the old config.json for proper operation`,
      ConsoleColor.YELLOW
    );    

    this.rawConfig = config;
  }
}
