class Score {
    constructor(base = 0) {
        this.baseScore = base;
        this.started = false;
        this.finished = false;
        this.startMillis = 0;
        this.endMillis = 0;
        this.timeBonusMax = 1800;
        this.pointsPerSecond = 10;
        this.maxSeconds = 180;
    }

    start() {
        this.started = true;
        this.startMillis = millis();
    }

    finish() {
        if (this.finished) return;
        this.finished = true;
        this.endMillis = millis();
    }

    getElapsedSeconds() {
        if (!this.started) return 0;
        const m = this.finished ? this.endMillis : millis();
        return Math.floor((m - this.startMillis) / 1000);
    }

    getTimeBonus() {
        const s = this.getElapsedSeconds();
        if (s > this.maxSeconds) return 0;
        const b = this.timeBonusMax - this.pointsPerSecond * s;
        return Math.max(0, b);
    }

    getFinalScore() {
        return this.baseScore + this.getTimeBonus();
    }
}
