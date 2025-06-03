class Game {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => Math.round(Math.random()))
        );
    }

    nextGeneration() {
        const next = this.createEmptyGrid();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const alive = this.grid[r][c];
                const neighbors = this.countNeighbors(r, c);

                if (alive && (neighbors === 2 || neighbors === 3)) {
                    next[r][c] = 1;
                } else if (!alive && neighbors === 3) {
                    next[r][c] = 1;
                } else {
                    next[r][c] = 0;
                }
          }
        }
        this.grid = next;
    }

    createEmptyGrid() {
        return Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => 0)
        );
    }

    countNeighbors(r, c) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    count += this.grid[nr][nc];
                }
            }
        }
        return count;
    }
}

module.exports = Game;
