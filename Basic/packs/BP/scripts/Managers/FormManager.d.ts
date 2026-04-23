import { VoiceCraft } from "../API/VoiceCraft";
import { Player } from "@minecraft/server";
import { ProximityEffect } from "../API/Effects/ProximityEffect";
import { VisibilityEffect } from "../API/Effects/VisibilityEffect";
import { DirectionalEffect } from "../API/Effects/DirectionalEffect";
import { ProximityEchoEffect } from "../API/Effects/ProximityEchoEffect";
import { EchoEffect } from "../API/Effects/EchoEffect";
import { ProximityMuffleEffect } from "../API/Effects/ProximityMuffleEffect";
import { MuffleEffect } from "../API/Effects/MuffleEffect";
import { AudioEffectSystem } from "../API/Systems/AudioEffectSystem";
import { BindingSystem } from "../API/Systems/BindingSystem";
export declare class FormManager {
    private _vc;
    private _bs;
    private _aes;
    private _mainMenuSettingsForm;
    private _generalSettingsMenuForm;
    private _effectsMenuSettingsForm;
    private _selectEffectMenuSettingsForm;
    private _setVisibilityEffectMenuSettingsForm;
    private _setProximityEffectMenuSettingsForm;
    private _setDirectionalEffectMenuSettingsForm;
    private _setProximityEchoEffectMenuSettingsForm;
    private _setEchoEffectMenuSettingsForm;
    private _setProximityMuffleEffectMenuSettingsForm;
    private _setMuffleEffectMenuSettingsForm;
    private _editEffectMenuSettingsForm;
    private _deleteEffectMenuSettingsForm;
    private _selectPlayerMenuSettingsForm;
    private _selectPlayerActionMenuSettingsForm;
    constructor(_vc: VoiceCraft, _bs: BindingSystem, _aes: AudioEffectSystem);
    ShowMainMenuSettingsFormAsync(player: Player): Promise<void>;
    ShowGeneralSettingsFormAsync(player: Player): Promise<void>;
    ShowEffectSettingsFormAsync(player: Player): Promise<void>;
    ShowSelectEffectMenuSettingsFormAsync(player: Player): Promise<void>;
    ShowEditEffectMenuSettingsFormAsync(player: Player): Promise<void>;
    ShowSetVisibilityEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: VisibilityEffect;
    } | undefined): Promise<void>;
    ShowSetProximityEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: ProximityEffect;
    } | undefined): Promise<void>;
    ShowSetDirectionalEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: DirectionalEffect;
    } | undefined): Promise<void>;
    ShowSetProximityEchoEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: ProximityEchoEffect;
    } | undefined): Promise<void>;
    ShowSetEchoEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: EchoEffect;
    } | undefined): Promise<void>;
    ShowSetProximityMuffleEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: ProximityMuffleEffect;
    } | undefined): Promise<void>;
    ShowSetMuffleEffectMenuSettingsFormAsync(player: Player, effect?: {
        bitmask: number;
        effect: MuffleEffect;
    } | undefined): Promise<void>;
    ShowDeleteEffectSettingsFormAsync(player: Player): Promise<void>;
    ShowSelectPlayerSettingsFormAsync(player: Player): Promise<void>;
    ShowPlayerActionsSettingsFormAsync(player: Player, selectedPlayer: Player): Promise<void>;
}
