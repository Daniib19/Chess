class Square {
    constructor(x, y, isLightSquare) {
        this.x = x;
        this.y = y;

        this.isLightSquare = isLightSquare;

        this.hasPiece = false;
        this.pieceId = -1;
        this._color = new color_rgb(0, 0, 0);
        this.pressed_ = 0;
    }

    show() {
        noStroke();
        if (this.isLightSquare) {
            fill(color_light);
        } else {
            fill(color_dark);
        }
        if (this.pressed_ == 1)
        {
            fill(this._color.r, this._color.g, this._color.b, 150);
        }

        // if (highlight) {
        //     if (this.hasPiece == true) {
        //         if (pieces[this.pieceId].isWhite) {
        //             fill(255, 0, 0);
        //         } else {
        //             fill(0, 255, 0);
        //         }
        //     }
        // }
        
        rect(this.x, this.y, 100);
    }

    pressed() {
        if (mouseX > this.x && mouseX < this.x + 100 && mouseY > this.y && mouseY < this.y + 100) {
            return true;
        }
        return false;
    }

    hover() {
        if (mouseX > this.x && mouseX < this.x + 100 && mouseY > this.y && mouseY < this.y + 100) {
            if (this.hasPiece == true)
                cursor('grab');
            else
                cursor();
        }
    }

    change_color(color) {
        if (this.pressed_ == 1) {
            this.pressed_ = 0;
        } else {
            if (color == 'red') {
                this._color.r = 255;
                this._color.g = 0;
                this._color.b = 0;
                this.pressed_ = 1
            } else if (color == 'green') {
                this._color.r = 0;
                this._color.g = 255;
                this._color.b = 0;
                this.pressed_ = 1
            } else if (color == 'blue') {
                this._color.r = 0;
                this._color.g = 155;
                this._color.b = 255;
                this.pressed_ = 1
            }
        }
    }
}