import RPC, { Client } from "discord-rpc"
import { ConsoleColor } from "../enum/ConsoleColor"
import { IConfiguration } from "../interface/IConfiguration"
import { Logger } from "../utils/Logger"

export class DiscordRPC {

    private config: IConfiguration

    constructor(config: IConfiguration) {
        this.config = config
    }

    private rpcClient: Client | undefined

    public async initializeRpcClient(clientId: string): Promise<void> {

        const rpc = new RPC.Client({
            transport: 'ipc'
        })

        try {
            await rpc.login({ clientId})

            this.rpcClient = rpc

        } catch (e) {
            Logger.log("Failed to authorize with Discord, it is most likely not running", ConsoleColor.RED)
            
            process.exit(0)
        }

        await this.waitToReady(rpc)        
        
    }

    private waitToReady(rpc: Client): Promise<void> {
        return new Promise((resolve) => {
            let isStarted: boolean;
    
            Logger.log(`Starting RPC client...`, ConsoleColor.YELLOW);
    
            setTimeout(() => {
                if (isStarted) return;
    
                Logger.log(`Failed to connect to Discord`, ConsoleColor.RED);
    
                process.exit(0);
            }, 10000);
    
            isStarted = true;
    
            Logger.log(`RPC client started!`, ConsoleColor.GREEN);
    
            return resolve();
        });
    }    

    public setActivity(params?: RPC.Presence): void {

        if(!this.rpcClient) return;

        this.rpcClient.setActivity({
            buttons: this.config.discordButtons,
            startTimestamp: Date.now(),
            largeImageKey: this.config.activity.images.largeImageKey,
            smallImageKey: this.config.activity.images.smallImageKey,
            instance: false,

            details: params?.details ?? this.config.activity.text.firstLine,
            state: params?.state ?? this.config.activity.text.secondLine,

            smallImageText: params?.smallImageText ?? this.config.activity.text.smallImageHint,
            largeImageText: params?.largeImageText ?? this.config.activity.text.largeImageHint,
        })

    }

}