class Move {
    constructor(x, y, piece) {
        this.x = x;
        this.y = y;
        this.piece = piece;

        this.display = false;
    }

    show() {
        if (this.display == true) {
            ellipseMode(CENTER);
            fill(0, 0, 0, 40);
            ellipse(this.x * 100 + 50, this.y * 100 + 50, 35, 35);
        }
    }
}