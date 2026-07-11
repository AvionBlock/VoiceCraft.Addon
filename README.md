# VoiceCraft Minecraft Bedrock Edition Proximity Chat Addon
Addon for VoiceCraft

Project structure as follows:
- `Basic`: Basic integration, admin controls, binding and entity sync. Not the most ideal for advanced moderation or systems, this just serves as a very quick and basic setup addon.
- `Core.Api`: Core API used to communicate with the backend voicecraft addons/sockets, used by the `Basic` addon and any third party addons.
- `Core.McHttp`: McApi backend addon through the http socket protocol to communicate with the VoiceCraft server, ideal for large deployments.
- `Core.McWss`: McApi backend addon through the mcwss socket protocol to communicate with the VoiceCraft server, ideal for singleplayer/small worlds, not ideal for large deployments.

If you have an issue/suggestion with the addon. Please create it on the main repository: https://github.com/AvionBlock/VoiceCraft

> [!NOTE]
> If you are viewing this on GitHub, you are looking at a mirror. Actual development happens over at https://gitlab.avion.team/voicecraft/VoiceCraft.Addon