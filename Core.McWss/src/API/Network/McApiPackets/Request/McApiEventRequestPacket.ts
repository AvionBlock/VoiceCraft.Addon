import {EventType, McApiPacketType} from "../../../Data/Enums";
import {IMcApiPacket} from "../IMcApiPacket";
import {NetDataWriter} from "../../../Data/NetDataWriter";
import {NetDataReader} from "../../../Data/NetDataReader";
import {IMcApiEventPacket} from "../IMcApiEventPacket";
import {McApiOnEffectUpdatedPacket} from "../Event/McApiOnEffectUpdatedPacket";
import {McApiOnEntityCreatedPacket} from "../Event/McApiOnEntityCreatedPacket";
import {McApiOnNetworkEntityCreatedPacket} from "../Event/McApiOnNetworkEntityCreatedPacket";
import {McApiOnEntityDestroyedPacket} from "../Event/McApiOnEntityDestroyedPacket";
import {McApiOnEntityVisibilityUpdatedPacket} from "../Event/McApiOnEntityVisibilityUpdatedPacket";
import {McApiOnEntityWorldIdUpdatedPacket} from "../Event/McApiOnEntityWorldIdUpdatedPacket";
import {McApiOnEntityNameUpdatedPacket} from "../Event/McApiOnEntityNameUpdatedPacket";
import {McApiOnEntityMuteUpdatedPacket} from "../Event/McApiOnEntityMuteUpdatedPacket";
import {McApiOnEntityDeafenUpdatedPacket} from "../Event/McApiOnEntityDeafenUpdatedPacket";
import {McApiOnEntityServerMuteUpdatedPacket} from "../Event/McApiOnEntityServerMuteUpdatedPacket";
import {McApiOnEntityServerDeafenUpdatedPacket} from "../Event/McApiOnEntityServerDeafenUpdatedPacket";
import {McApiOnEntityTalkBitmaskUpdatedPacket} from "../Event/McApiOnEntityTalkBitmaskUpdatedPacket";
import {McApiOnEntityListenBitmaskUpdatedPacket} from "../Event/McApiOnEntityListenBitmaskUpdatedPacket";
import {McApiOnEntityEffectBitmaskUpdatedPacket} from "../Event/McApiOnEntityEffectBitmaskUpdatedPacket";
import {McApiOnEntityPositionUpdatedPacket} from "../Event/McApiOnEntityPositionUpdatedPacket";
import {McApiOnEntityRotationUpdatedPacket} from "../Event/McApiOnEntityRotationUpdatedPacket";
import {McApiOnEntityPropertyUpdatedPacket} from "../Event/McApiOnEntityPropertyUpdatedPacket";
import {McApiOnEntityAudioReceivedPacket} from "../Event/McApiOnEntityAudioReceivedPacket";
import {McApiOnEntityAudioDataReceivedPacket} from "../Event/McApiOnEntityAudioDataReceivedPacket";

export class McApiEventRequestPacket implements IMcApiPacket {
    constructor(event?: IMcApiEventPacket) {
        this._event = event;
    }

    public get PacketType(): McApiPacketType {
        return McApiPacketType.EventRequest;
    }

    public get EventType(): EventType {
        return this._event?.EventType ?? EventType.None;
    }

    public get Event(): IMcApiEventPacket | undefined {
        return this._event;
    }

    private _event?: IMcApiEventPacket;

    public Serialize(writer: NetDataWriter) {
        writer.PutByte(this._event?.EventType ?? EventType.None);
        if (this._event !== undefined)
            this._event.Serialize(writer);
    }

    public Deserialize(reader: NetDataReader) {
        const eventType = reader.GetByte() as EventType;
        switch (eventType)
        {
            case EventType.OnEffectUpdated:
                this._event = new McApiOnEffectUpdatedPacket();
                break;
            case EventType.OnEntityCreated:
                this._event = new McApiOnEntityCreatedPacket();
                break;
            case EventType.OnNetworkEntityCreated:
                this._event = new McApiOnNetworkEntityCreatedPacket();
                break;
            case EventType.OnEntityDestroyed:
                this._event = new McApiOnEntityDestroyedPacket();
                break;
            case EventType.OnEntityVisibilityUpdated:
                this._event = new McApiOnEntityVisibilityUpdatedPacket();
                break;
            case EventType.OnEntityWorldIdUpdated:
                this._event = new McApiOnEntityWorldIdUpdatedPacket();
                break;
            case EventType.OnEntityNameUpdated:
                this._event = new McApiOnEntityNameUpdatedPacket();
                break;
            case EventType.OnEntityMuteUpdated:
                this._event = new McApiOnEntityMuteUpdatedPacket();
                break;
            case EventType.OnEntityDeafenUpdated:
                this._event = new McApiOnEntityDeafenUpdatedPacket();
                break;
            case EventType.OnEntityServerMuteUpdated:
                this._event = new McApiOnEntityServerMuteUpdatedPacket();
                break;
            case EventType.OnEntityServerDeafenUpdated:
                this._event = new McApiOnEntityServerDeafenUpdatedPacket();
                break;
            case EventType.OnEntityTalkBitmaskUpdated:
                this._event = new McApiOnEntityTalkBitmaskUpdatedPacket();
                break;
            case EventType.OnEntityListenBitmaskUpdated:
                this._event = new McApiOnEntityListenBitmaskUpdatedPacket();
                break;
            case EventType.OnEntityEffectBitmaskUpdated:
                this._event = new McApiOnEntityEffectBitmaskUpdatedPacket();
                break;
            case EventType.OnEntityPositionUpdated:
                this._event = new McApiOnEntityPositionUpdatedPacket();
                break;
            case EventType.OnEntityRotationUpdated:
                this._event = new McApiOnEntityRotationUpdatedPacket();
                break;
            case EventType.OnEntityPropertyUpdated:
                this._event = new McApiOnEntityPropertyUpdatedPacket();
                break;
            case EventType.OnEntityAudioReceived:
                this._event = new McApiOnEntityAudioReceivedPacket();
                break;
            case EventType.OnEntityAudioDataReceived:
                this._event = new McApiOnEntityAudioDataReceivedPacket();
                break;
            case EventType.None:
            default:
                this._event = undefined;
                break;
        }

        this._event?.Deserialize(reader);
    }

    public Set(event?: IMcApiEventPacket) {
        this._event = event;
    }
}
