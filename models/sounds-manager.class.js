class SoundsManager {
    constructor() {
        this.sounds = {
            game_start: new Audio('audio/game/gameStart.mp3'),
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
        };

        // Arka plan müziğini loop yap
        this.sounds.background_music.loop = true;
        this.sounds.run.loop = true;
        this.sounds.snoring.loop = true;

        
        // Ses seviyelerini ayarlayabilirsin
        this.sounds.background_music.volume = 0.1; // müzik daha düşük
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'background_music') this.sounds[key].volume = 0.3;
        });

        // Mute durumu Local Storage'dan yükle
        this.isMuted = JSON.parse(localStorage.getItem('muted')) || false;
        this.applyMuteState();
    }

    play(soundName) {
        if (this.isMuted) return;
        const sound = this.sounds[soundName];
        if (!sound) return;
        if (!sound.paused) return;
        sound.currentTime = 0;
        sound.play();
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    muteAll() {
        this.isMuted = true;
        localStorage.setItem('muted', true);
        this.applyMuteState();
    }

    unmuteAll() {
        this.isMuted = false;
        localStorage.setItem('muted', false);
        this.applyMuteState();
    }

    toggleMute() {
        this.isMuted ? this.unmuteAll() : this.muteAll();
    }

    applyMuteState() {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
    }
}
