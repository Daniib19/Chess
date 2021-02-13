class Piece {
    constructor(x, y, isWhite, image) {
        this.x = x;
        this.y = y;
        this.id = null;
        this.symbol; 

        this.isWhite = isWhite;
        this.taken = false;
        this.image = image;
        this.first_turn = true;

        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;

        this.grid_i = 0;
        this.grid_j = 0;
    }

    show() {
        if (highlight) {
            if (this.taken == false) {
                textSize(32);
                fill(0);
                textAlign(CORNER);
                //text(this.symbol, this.x + 40, this.y + 60);
                text(this.grid_i + ', ' + this.grid_j, this.x + 20, this.y + 60);
            }
        } else {
            if (this.taken == false) {
                imageMode(CORNER);
                image(this.image, this.x + 3.5, this.y + 3, 90, 90);
            }
        }
    }

    update() {
        if (this.dragging) {
            this.x = mouseX - 50;
            this.y = mouseY - 50;
        }
    }

    pressed() {
        this.dragging = true;
    }

    released(x, y) {
        this.dragging = false;

        this.grid_i = x;
        this.grid_j = y;

        this.x = board[x][y].x;
        this.y = board[x][y].y;
    }
}