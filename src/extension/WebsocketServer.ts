import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

import { Logger } from "../utils/Logger";
import { ConsoleColor } from "../enum/ConsoleColor";
import { DiscordActivityManager } from "../discord/DiscordActivityManager";
import { SongStatus } from "../enum/SongStatus";
import { ISong } from "../interface/ISong";

export class WebsocketServer {
    private readonly websocketPort: number;
    private socketIoServer: SocketServer;
    private readonly httpServer: Server;
    private activityManager: DiscordActivityManager;

    constructor(websocketPort: number, activityManager: DiscordActivityManager) {
        this.httpServer = new Server();
        this.socketIoServer = new SocketServer(this.httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.websocketPort = websocketPort;
        this.activityManager = activityManager;
    }

    public async start(): Promise<void> {
        Logger.log(`Opening websocket server on port ${this.websocketPort}...`, ConsoleColor.YELLOW);

        this.registerListeners();

        this.httpServer.listen(this.websocketPort, () => {
            Logger.log(`Server started on port ${this.websocketPort}`, ConsoleColor.GREEN);
        });
    }

    private registerListeners(): void {
        this.socketIoServer.on('connection', (socket: Socket) => {
            Logger.log(`Connection with the extension was successfully established!`, ConsoleColor.GREEN);

            socket.on('disconnecting', () => {
                Logger.log(`Connection with the extension is disconnected, trying to reconnect`, ConsoleColor.RED);
                this.activityManager.updateActivity(SongStatus.PAUSED);
            });

            socket.on('song_changed', (song: ISong) => {
                this.activityManager.updateActivity(SongStatus.PLAYING, song);
            });

            socket.on('song_paused', () => {
                this.activityManager.updateActivity(SongStatus.PAUSED);
            });
        });
    }
}