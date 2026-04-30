// pluginCommands.js - Extracted plugin command registration from FourthWallBreaks.js
export function registerPluginCommands(PLUGIN_NAME, deps) {
    const FWB = deps.FWB;
    const argString = deps.argString;
    const argNumber = deps.argNumber;
    const argBool = deps.argBool;
    const DEFAULT_SYMBOLS = deps.DEFAULT_SYMBOLS;
    const state = deps.state;
    const defaultState = deps.defaultState;
    const markSyncDirty = deps.markSyncDirty;
    const syncVariablesAndSwitches = deps.syncVariablesAndSwitches;
    const root = deps.root;

    PluginManager.registerCommand(PLUGIN_NAME, "SetCrackStage", args => {
        FWB.setStage(argNumber(args, "stage", 1), { fadeFrames: argNumber(args, "fadeFrames", 45), force: argBool(args, "force", false) });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "EscalateCrack", args => {
        FWB.escalate(argNumber(args, "amount", 1), { fadeFrames: argNumber(args, "fadeFrames", 35) });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ReduceCrackStage", args => {
        FWB.reduce(argNumber(args, "amount", 1), { fadeFrames: argNumber(args, "fadeFrames", 45) });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearCracks", args => {
        FWB.clear({ fadeFrames: argNumber(args, "fadeFrames", 60) });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "PulseCrack", args => {
        FWB.pulse(argNumber(args, "duration", 60), argNumber(args, "intensity", 0.5));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "FlashCrack", args => {
        FWB.flash(argNumber(args, "duration", 24), argNumber(args, "opacity", 160));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "LockCrackStage", () => FWB.lock());
    PluginManager.registerCommand(PLUGIN_NAME, "UnlockCrackStage", () => FWB.unlock());
    PluginManager.registerCommand(PLUGIN_NAME, "SetCrackMode", args => {
        FWB.setMode(argString(args, "mode", "hybrid"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "LockInput", args => {
        FWB.lockInput(argNumber(args, "frames", 60));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "UnlockInput", () => FWB.unlockInput());
    PluginManager.registerCommand(PLUGIN_NAME, "LockBreachMeter", () => FWB.lockBreach());
    PluginManager.registerCommand(PLUGIN_NAME, "UnlockBreachMeter", () => FWB.unlockBreach());
    PluginManager.registerCommand(PLUGIN_NAME, "RegisterSequence", args => {
        FWB.registerSequence(argString(args, "sequenceName", "Custom Break"), argString(args, "customJson", "[]"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "QueueBreakSequence", args => {
        FWB.queueSequence(argString(args, "sequenceName", "Reality Fracture"), argString(args, "customJson", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "PauseSequence", () => FWB.pauseSequence());
    PluginManager.registerCommand(PLUGIN_NAME, "ResumeSequence", () => FWB.resumeSequence());
    PluginManager.registerCommand(PLUGIN_NAME, "StopSequence", args => {
        FWB.stopSequence(argBool(args, "clearQueue", false));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearSequenceMemory", args => {
        FWB.clearSequenceMemory(argString(args, "prefix", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ValidateSequence", args => {
        const result = FWB.validateSequence(argString(args, "customJson", "[]"));
        console.log(`[${PLUGIN_NAME}] ValidateSequence`, result);
    });
    PluginManager.registerCommand(PLUGIN_NAME, "RunBreakSequence", args => {
        FWB.runSequence(argString(args, "sequenceName", "Reality Fracture"), argString(args, "customJson", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "AddBreachMeter", args => {
        FWB.addBreach(argNumber(args, "amount", 10));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetBreachMeter", args => {
        FWB.setBreach(argNumber(args, "value", 50));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "RepairScreen", args => {
        FWB.repair(argString(args, "mode", "oneStage"), argNumber(args, "fadeFrames", 60));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "GlitchNextMessage", args => {
        FWB.glitchNextMessage(argNumber(args, "amount", 0.2), argNumber(args, "lines", 1), argString(args, "symbols", DEFAULT_SYMBOLS));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "GlitchSpeakerName", args => {
        FWB.glitchSpeakerName(argNumber(args, "amount", 0.35), argNumber(args, "uses", 1), argString(args, "symbols", DEFAULT_SYMBOLS));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "PlayBreakMoment", args => {
        FWB.playBreakMoment({
            breakId: argString(args, "breakId", ""),
            severity: argNumber(args, "severity", 1),
            type: argString(args, "type", "dialogue"),
            speakerName: argString(args, "speakerName", ""),
            messageText: argString(args, "messageText", ""),
            faceEventId: argNumber(args, "faceEventId", 0),
            addBreach: argNumber(args, "addBreach", 0),
            addPresence: argNumber(args, "addPresence", 0),
            oneShot: argBool(args, "oneShot", false)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetPresence", args => {
        FWB.setPresence(argNumber(args, "value", 50));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "AddPresence", args => {
        FWB.addPresence(argNumber(args, "amount", 10));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearPresence", () => {
        FWB.clearPresence();
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetPresenceDecay", args => {
        FWB.setPresenceDecay(
            argBool(args, "enabled", true),
            argNumber(args, "amount", 1),
            argNumber(args, "frames", 900),
            argNumber(args, "floor", 0)
        );
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetNarrativeState", args => {
        FWB.setNarrativeState(argString(args, "stateName", "neutral"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetRandomSubtle", args => {
        FWB.setRandomSubtle(argBool(args, "enabled", true));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetAccessibility", args => {
        FWB.setAccessibility({
            reduceFlashing: argBool(args, "reduceFlashing", false),
            reduceScreenShake: argBool(args, "reduceScreenShake", false),
            disableFlicker: argBool(args, "disableFlicker", false),
            disableStage4: argBool(args, "disableStage4", false),
            maxOverlayOpacity: argNumber(args, "maxOverlayOpacity", 255)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "RegisterTrigger", args => {
        FWB.registerTrigger({
            id: argString(args, "triggerId", ""),
            condition: argString(args, "condition", "presence GTE 75"),
            action: argString(args, "action", "sequence"),
            value: argString(args, "value", "System Failure"),
            cooldown: argNumber(args, "cooldown", 0),
            once: argBool(args, "once", false),
            scope: argString(args, "scope", "global")
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearTriggers", args => {
        FWB.clearTriggers(argString(args, "scope", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetControlDistortion", args => {
        FWB.setControlDistortion({
            duration: argNumber(args, "duration", 180),
            invertX: argBool(args, "invertX", false),
            invertY: argBool(args, "invertY", false),
            driftChance: argNumber(args, "driftChance", 0),
            randomBlockChance: argNumber(args, "randomBlockChance", 0),
            delayFrames: argNumber(args, "delayFrames", 0),
            forceDirection: argNumber(args, "forceDirection", 0)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearControlDistortion", () => FWB.clearControlDistortion());
    PluginManager.registerCommand(PLUGIN_NAME, "SetUiCorruption", args => {
        FWB.setUiCorruption(argNumber(args, "level", 1), argNumber(args, "duration", 0));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearUiCorruption", () => FWB.clearUiCorruption());
    PluginManager.registerCommand(PLUGIN_NAME, "FakeSystemMessage", args => {
        FWB.fakeSystemMessage(argString(args, "text", "Runtime integrity warning."), argString(args, "speaker", "SYSTEM"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "FakeSaveFailure", args => {
        FWB.fakeSaveFailure(argString(args, "text", "Save failed. File integrity compromised."));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "FakeOptionChange", args => {
        FWB.fakeOptionChange(argString(args, "optionName", "Volume"), argString(args, "fakeValue", "???"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetMemory", args => {
        FWB.memory.set(argString(args, "key", "key"), argString(args, "value", "true"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "AddMemory", args => {
        FWB.memory.add(argString(args, "key", "counter"), argNumber(args, "amount", 1));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearMemory", args => {
        FWB.memory.clear(argString(args, "key", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetFlag", args => {
        FWB.setFlag(argString(args, "key", "flag"), argBool(args, "value", true));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearFlag", args => {
        FWB.clearFlag(argString(args, "key", "flag"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "FakeBattleDamage", args => {
        FWB.fakeDamage(argNumber(args, "targetIndex", 0), argNumber(args, "amount", 9999), argString(args, "text", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "FakeBattleHeal", args => {
        FWB.fakeHeal(argNumber(args, "targetIndex", 0), argNumber(args, "amount", 9999), argString(args, "text", ""));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "CorruptBattleLog", args => {
        FWB.corruptBattleLog(argNumber(args, "amount", 0.25), argNumber(args, "lines", 3));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "SetAudioCorruption", args => {
        FWB.setAudioCorruption({
            pitchDrift: argNumber(args, "pitchDrift", 0.06),
            volumeFlutter: argNumber(args, "volumeFlutter", 0.12),
            dropoutChance: argNumber(args, "dropoutChance", 0),
            wrongSeChance: argNumber(args, "wrongSeChance", 0),
            duration: argNumber(args, "duration", 300)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearAudioCorruption", () => FWB.clearAudioCorruption());
    PluginManager.registerCommand(PLUGIN_NAME, "SetVisualDistortion", args => {
        FWB.setVisualDistortion({
            breathAmount: argNumber(args, "breathAmount", 0.02),
            breathSpeed: argNumber(args, "breathSpeed", 0.05),
            rippleAmount: argNumber(args, "rippleAmount", 0.01),
            zoomWobble: argNumber(args, "zoomWobble", 0.01),
            rotationWobble: argNumber(args, "rotationWobble", 0.002),
            duration: argNumber(args, "duration", 300)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ClearVisualDistortion", () => FWB.clearVisualDistortion());
    PluginManager.registerCommand(PLUGIN_NAME, "FakeCrash", args => {
        FWB.fakeCrash({
            message: argString(args, "message", "Runtime breach detected."),
            duration: argNumber(args, "duration", 180),
            returnStage: argNumber(args, "returnStage", 2)
        });
    });
    PluginManager.registerCommand(PLUGIN_NAME, "RealTimeMessage", args => {
        FWB.realTimeMessage(argString(args, "condition", "lateNight"), argString(args, "message", "It is late. You should stop."), argString(args, "speaker", "SYSTEM"));
    });
    PluginManager.registerCommand(PLUGIN_NAME, "DumpDebugSnapshot", () => FWB.dumpDebugSnapshot());
    PluginManager.registerCommand(PLUGIN_NAME, "ValidateRuntime", () => {
        console.log(`[${PLUGIN_NAME}] runtime validation`, FWB.validateRuntime());
    });
    PluginManager.registerCommand(PLUGIN_NAME, "DebugAction", args => {
        const action = argString(args, "action", "printState");
        if (action === "printState") console.log(`[${PLUGIN_NAME}] state`, JSON.parse(JSON.stringify(state())));
        else if (action === "testStage1") FWB.setStage(1, { force: true });
        else if (action === "testStage2") FWB.setStage(2, { force: true });
        else if (action === "testStage3") FWB.setStage(3, { force: true });
        else if (action === "testStage4") FWB.setStage(4, { force: true });
        else if (action === "testPulse") FWB.pulse(60, 0.7);
        else if (action === "testSequence") FWB.runSequence("Reality Fracture");
        else if (action === "clear") FWB.clear({ force: true });
        else if (action === "resetMemory") {
            if (root.$gameSystem) root.$gameSystem._fourthWallBreaks = defaultState();
            markSyncDirty();
        }
    });
    PluginManager.registerCommand(PLUGIN_NAME, "ForceSync", () => syncVariablesAndSwitches());
}
