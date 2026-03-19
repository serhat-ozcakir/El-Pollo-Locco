/**
 * Manages all game sounds.
 */
class SoundsManager {
    /**
     * Creates a new sounds manager.
     */
    constructor() {
        this.sounds = this.createSounds();
        this.isMuted = JSON.parse(localStorage.getItem('muted')) || false;
        this.setupLoopSounds();
        this.setupVolumes();
        this.applyMuteState();
    }

    /**
     * Creates the sound collection.
     * @returns {Object} All game sounds.
     */
    createSounds() {
        return {
            game_start: new Audio('audio/game/gameStart.mp3'),
            boss_music: new Audio('audio/endboss/boss_music.mp3'),
            game_win: new Audio('audio/game/game-win.mp3'),
            background_music: new Audio('audio/background/sneaky-fight-142704.mp3'),
            jump: new Audio('audio/character/characterJump.wav'),
            damage: new Audio('audio/character/characterDamage.mp3'),
            character_dead: new Audio('audio/character/characterDead.wav'),
            run: new Audio('audio/character/characterRun.mp3'),
            snoring: new Audio('audio/character/characterSnoring.mp3'),
            coin: new Audio('audio/collectibles/collectSound.wav'),
            bottle: new Audio('audio/collectibles/bottleCollectSound.wav'),
            chicken_dead: new Audio('audio/chicken/chickenDead.mp3'),
            endboss_approach: new Audio('audio/endboss/endbossApproach.wav'),
            bottle_hit: new Audio('audio/throwable/bottleBreak.mp3'),
            wind: new Audio('audio/game/storm-wind.wav')
        };
    }

    /**
     * Sets loop mode for looping sounds.
     */
    setupLoopSounds() {
        this.sounds.background_music.loop = true;
        this.sounds.run.loop = true;
        this.sounds.snoring.loop = true;
        this.sounds.boss_music.loop = true;
        this.sounds.endboss_approach.loop = true;
    }

    /**
     * Sets default volume values.
     */
    setupVolumes() {
        this.sounds.background_music.volume = 0.1;
        this.sounds.boss_music.volume = 0.1;
        this.setDefaultSoundVolume();
    }

    /**
     * Sets volume for all regular sounds.
     */
    setDefaultSoundVolume() {
        Object.keys(this.sounds).forEach((key) => {
            if (this.isSpecialVolumeSound(key)) return;
            this.sounds[key].volume = 0.1;
        });
    }

    /**
     * Checks if a sound has a separate volume setup.
     * @param {string} key - Sound key.
     * @returns {boolean} True if the sound is handled separately.
     */
    isSpecialVolumeSound(key) {
        return key === 'background_music' || key === 'boss_music';
    }

    /**
     * Plays a sound by name.
     * @param {string} soundName - The sound key.
     */
    play(soundName) {
        if (this.isMuted) return;
        const sound = this.sounds[soundName];
        if (!sound || !sound.paused) return;
        sound.currentTime = 0;
        this.safePlay(sound);
    }

    /**
     * Plays a loop sound safely without resetting currentTime.
     * @param {string} soundName - The sound key.
     */
    playLoop(soundName) {
        if (this.isMuted) return;
        const sound = this.sounds[soundName];
        if (!sound || !sound.paused) return;
        this.safePlay(sound);
    }

    /**
     * Safely starts audio and catches browser play errors.
     * @param {HTMLAudioElement} sound - The sound to play.
     */
    safePlay(sound) {
        if (!sound || this.isMuted) return;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }

    /**
     * Safely pauses audio.
     * @param {HTMLAudioElement} sound - The sound to pause.
     */
    safePause(sound) {
        if (!sound) return;
        try {
            sound.pause();
        } catch (_) {}
    }

    /**
     * Stops a specific sound and resets it.
     * @param {string} soundName - The sound key.
     */
    stop(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        this.safePause(sound);
        sound.currentTime = 0;
    }

    /**
     * Pauses a specific sound without resetting it.
     * @param {string} soundName - The sound key.
     */
    pause(soundName) {
        const sound = this.sounds[soundName];
        if (!sound || sound.paused) return;
        this.safePause(sound);
    }

    /**
     * Stops and resets all sounds.
     */
    stopAll() {
        Object.values(this.sounds).forEach((sound) => {
            this.safePause(sound);
            sound.currentTime = 0;
        });
    }

    /**
     * Mutes all sounds.
     */
    muteAll() {
        this.isMuted = true;
        localStorage.setItem('muted', true);
        this.applyMuteState();
    }

    /**
     * Unmutes all sounds.
     */
    unmuteAll() {
        this.isMuted = false;
        localStorage.setItem('muted', false);
        this.applyMuteState();
    }

    /**
     * Toggles the mute state.
     */
    toggleMute() {
        this.isMuted ? this.unmuteAll() : this.muteAll();
    }

    /**
     * Applies the mute state to all sounds.
     */
    applyMuteState() {
        Object.values(this.sounds).forEach((sound) => {
            sound.muted = this.isMuted;
        });
    }
}