/**
 * Class: SoundsManager
 * 
 * Manages all game audio, including background music, character sounds,
 * collectible sounds, and enemy sounds. Supports play, stop, mute, and volume control.
 */

class SoundsManager {
    constructor() {
        this.sounds = {
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

        // Loop and volume setup
        this.sounds.background_music.loop = true;
        this.sounds.run.loop = true;
        this.sounds.snoring.loop = true;

        this.sounds.boss_fight = new Audio('audio/endboss/boss_music.mp3');
        this.sounds.boss_fight.loop = true;
        this.sounds.boss_fight.volume = 0.1;

        this.sounds.background_music.volume = 0.1;
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'background_music' && key !== 'boss_fight') {
                this.sounds[key].volume = 0.1;
            }
        });

        this.isMuted = JSON.parse(localStorage.getItem('muted')) || false;
        this.applyMuteState();
    }

    /**
     * Plays a sound by name, if not muted and not already playing.
     * Prevents AbortError by checking if sound is already playing.
     * @param {string} soundName - Key of the sound in the sounds dictionary.
     */
    play(soundName) {
        if (this.isMuted) return;
        const sound = this.sounds[soundName];
        if (!sound) return;

        if (sound.paused) {
            sound.currentTime = 0;
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // AbortError silently ignored
                });
            }
        }
    }

    /**
     * Stops a specific sound and resets it to the beginning.
     * @param {string} soundName - Key of the sound to stop.
     */
    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Stops all sounds and resets them to the beginning.
     */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (!sound.paused) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }

    /**
     * Mutes all sounds and updates localStorage.
     */
    muteAll() {
        this.isMuted = true;
        localStorage.setItem('muted', true);
        this.applyMuteState();
    }

    /**
     * Unmutes all sounds and updates localStorage.
     */
    unmuteAll() {
        this.isMuted = false;
        localStorage.setItem('muted', false);
        this.applyMuteState();
    }

    /**
     * Toggles the mute state on or off.
     */
    toggleMute() {
        this.isMuted ? this.unmuteAll() : this.muteAll();
    }

    /**
     * Applies the current mute state to all sounds.
     */
    applyMuteState() {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
    }
}
