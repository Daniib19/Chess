let tileSize = 800 / 8;
let img = [12];
let pieces = [];
let board;
let sounds = [2];

let color_light;
let color_dark;
let highlight = false;
let turn;
let shift_pressed = false;

let legalMoves = [];
let all_moves_attacking_king = [];
let is_check = false;

// da frate

// kings id = {28 B, 29 W};

function setup() {
   createCanvas(800, 800);

   color_dark = color(0, 153, 153);
   color_light = color(255, 255, 255, 150);

   board = make2DArray(8, 8);

   for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
         let col = (i + j) % 2 == 0;
         let square = new Square(i * width / 8, j * height / 8, col);
         board[i][j] = square;
      }
   }

   turn = 1; // 1 is white 0 is black

   button_random_colors = createButton('Random board colors');
   button_random_colors.position(10, height + 20);
   button_random_colors.mousePressed(randomBoardColors);

   // button_flip_board = createButton('Flip board');
   // button_flip_board.position(200, height + 20);
   // button_flip_board.mousePressed(flipBoard);

   button_flip_board = createButton('Highlight pieces');
   button_flip_board.position(200, height + 20);
   button_flip_board.mousePressed(highlightPieces);

   // pawns

   for (let i = 0; i < 8; i++) {
      // place black pawns
      let pawn = new Piece(i * width / 8, 100, -1, img[1]);
      pawn.grid_i = i;
      pawn.grid_j = 1;
      pawn.id = i;
      pawn.symbol = 'p';
      board[i][1].hasPiece = true;
      board[i][1].pieceId = i;
      pieces.push(pawn);
   }

   for (let i = 0; i < 8; i++) {
      // place white pawns
      let pawn = new Piece(i * width / 8, 600, 1, img[0]);
      pawn.grid_i = i;
      pawn.grid_j = 6;
      pawn.id = i + 8;
      pawn.symbol = 'p';
      board[i][6].hasPiece = true;
      board[i][6].pieceId = pawn.id;
      pieces.push(pawn);
   }

   // rooks

   for (let i = 0; i < 2; i++) {
      // place black rooks 
      let rook = new Piece(i * 700, 0, -1, img[7]);
      rook.grid_i = i * 7;
      rook.grid_j = 0;
      rook.id = i + 16;
      rook.symbol = 'R';
      board[i * 7][0].hasPiece = true;
      board[i * 7][0].pieceId = rook.id;
      pieces.push(rook);
   }

   for (let i = 0; i < 2; i++) {
      // place white rooks 
      let rook = new Piece(i * 700, 700, 1, img[6]);
      rook.grid_i = i * 7;
      rook.grid_j = 7;
      rook.id = i + 18;
      rook.symbol = 'R';
      board[i * 7][7].hasPiece = true;
      board[i * 7][7].pieceId = rook.id;
      pieces.push(rook);
   }

   // knights 

   for (let i = 0, x = 1; i < 2; i++, x += 5) {
      // place black knights
      let kngiht = new Piece(x * 100, 0, -1, img[5]);
      kngiht.grid_i = x;
      kngiht.grid_j = 0;
      kngiht.id = i + 20;
      kngiht.symbol = 'N';
      board[x][0].hasPiece = true;
      board[x][0].pieceId = kngiht.id;
      pieces.push(kngiht);
   }

   for (let i = 0, x = 1; i < 2; i++, x += 5) {
      // place white knights
      let kngiht = new Piece(x * 100, 700, 1, img[4]);
      kngiht.grid_i = x;
      kngiht.grid_j = 7;
      kngiht.id = i + 22;
      kngiht.symbol = 'N';
      board[x][7].hasPiece = true;
      board[x][7].pieceId = kngiht.id;
      pieces.push(kngiht);
   }

   // place bishops

   for (let i = 0, x = 2; i < 2; i++, x += 3) {
      // place black bishops
      let bishop = new Piece(x * 100, 0, -1, img[3]);
      bishop.grid_i = x;
      bishop.grid_j = 0;
      bishop.id = i + 24;
      bishop.symbol = 'B';
      board[x][0].hasPiece = true;
      board[x][0].pieceId = bishop.id;
      pieces.push(bishop);
   }

   for (let i = 0, x = 2; i < 2; i++, x += 3) {
      // place white bishops
      let bishop = new Piece(x * 100, 700, 1, img[2]);
      bishop.grid_i = x;
      bishop.grid_j = 7;
      bishop.id = i + 26;
      bishop.symbol = 'B';
      board[x][7].hasPiece = true;
      board[x][7].pieceId = bishop.id;
      pieces.push(bishop);
   }

   // place kings
   let iswhite = -1;
   for (let i = 0; i < 2; i++) {
      // place all kings 
      let king = new Piece(400, i * 700, iswhite, img[11 - i]);
      king.grid_i = 4;
      king.grid_j = i * 7;
      king.id = i + 28;
      king.symbol = 'K';
      board[4][i * 7].hasPiece = true;
      board[4][i * 7].pieceId = king.id;
      pieces.push(king);
      iswhite *= -1;
   }

   // place queens
   iswhite = -1;
   for (let i = 0; i < 2; i++) {
      // place all queens 
      let queen = new Piece(300, i * 700, iswhite, img[9 - i]);
      queen.grid_i = 3;
      queen.grid_j = i * 7;
      queen.id = i + 30;
      queen.symbol = 'Q';
      board[3][i * 7].hasPiece = true;
      board[3][i * 7].pieceId = queen.id;
      pieces.push(queen);
      iswhite *= -1;
   }
}

function randomBoardColors() {
   let r = random(0, 255);
   let g = random(0, 255);
   let b = random(0, 255);

   color_dark = color(r, g, b);
}

function flipBoard() {
   for (let i = 0, j = 7; i < 4; i++, j--) {
      let aux = board[i].reverse();
      board[i] = board[j].reverse();
      board[j] = aux;
   }
   clear();
}

function highlightPieces() {
   if (highlight)
      highlight = false;
   else
      highlight = true;
}

function preload() {
   img[0] = loadImage('pieces/pawn_w.png');
   img[1] = loadImage('pieces/pawn_b.png');
   img[2] = loadImage('pieces/bishop_w.png');
   img[3] = loadImage('pieces/bishop_b.png');
   img[4] = loadImage('pieces/knight_w.png');
   img[5] = loadImage('pieces/knight_b.png');
   img[6] = loadImage('pieces/rook_w.png');
   img[7] = loadImage('pieces/rook_b.png');
   img[8] = loadImage('pieces/queen_w.png');
   img[9] = loadImage('pieces/queen_b.png');
   img[10] = loadImage('pieces/king_w.png');
   // img[10] = loadImage('pieces/dybala.png');
   img[11] = loadImage('pieces/king_b.png');

   sounds[0] = loadSound('sounds/Move.mp3');
   sounds[1] = loadSound('sounds/Capture.mp3');
}

function make2DArray(cols, rows) {
   var arr = new Array(cols);
   for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
   }

   return arr;
}

function mousePressed() {
   for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
         if (board[i][j].pressed()) {
            if (mouseIsPressed) {
               if (mouseButton === RIGHT) {
                  if (keyIsPressed === true && keyCode === SHIFT) {
                     board[i][j].change_color('green');
                  }
                  else if (keyIsPressed === true && keyCode === CONTROL) {
                     board[i][j].change_color('blue');
                  }
                  else 
                     board[i][j].change_color('red');
               } else {
                  for (let i = 0; i < 8; i++) {
                     for (let j = 0; j < 8; j++)
                        board[i][j].pressed_ = 0;
                  }

                  if (board[i][j].hasPiece == true) {
                     if (pieces[board[i][j].pieceId].isWhite == turn) {
                        pieces[board[i][j].pieceId].pressed();
                        calculateLegalMoves(pieces[board[i][j].pieceId], i, j);
                     }
                  }
               }
            }
            
         }
      }
   }
}

function calculateLegalMoves(piece, current_x, current_y) {
   // console.log(piece_type);
   legalMoves = [];
   if (piece.symbol == 'p') {
      let l = 1;
      let move;
      let pos_y;
      let m;

      if (piece.first_turn == true) {
         l = 2;
      }
      for (let i = 0; i < l; i++) {

         if (piece.isWhite == 1)
            pos_y = current_y - i - 1;
         else
            pos_y = current_y + i + 1;

         move = new Move(current_x, pos_y, 'pawn');

         let n = -1;
         if (piece.isWhite == 1)
            n = 1;

         if (i == 0) {
            if (board[current_x][pos_y].hasPiece == false) {
               move.display = true;
               legalMoves.push(move);
            }
         } else {
            if (board[current_x][pos_y].hasPiece == false && board[current_x][pos_y + n].hasPiece == false) {
               move.display = true;
               legalMoves.push(move);
            }
         }

         // CAPTURES
         if (i == 0) {
            m = 1;
            for (let j = 0; j < 2; j++) {
               if (current_x - m > 7 || current_x - m < 0) {
                  break;
               } else {
                  if (board[current_x - m][pos_y].hasPiece == true) {
                     let id = board[current_x - m][pos_y].pieceId;
                     if (pieces[id].isWhite != piece.isWhite){
                        let movecapture = new Move(current_x - m, pos_y, 'pawn');
                        movecapture.display = true;
                        legalMoves.push(movecapture);
                     }
                  }
                  m = m * (-1);
               }
            }
         }
      }

   }
   else if (piece.symbol == 'B') {
      // stanga sus
      for (let i = piece.grid_i - 1, j = piece.grid_j - 1; i >= 0; i--, j--) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'bishop');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'bishop');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // stanga jos

      for (let i = piece.grid_i - 1, j = piece.grid_j + 1; i >= 0; i--, j++) {
         if (board[i][j] == null)
            // console.log(i + ',' + j);
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'bishop');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'bishop');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // dreapta sus
      for (let i = piece.grid_i + 1, j = piece.grid_j - 1; i < 8; i++, j--) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'bishop');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'bishop');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // dreapta jos
      for (let i = piece.grid_i + 1, j = piece.grid_j + 1; i < 8; i++, j++) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'bishop');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'bishop');
            move.display = true;
            legalMoves.push(move);
         }
      }
   }
   else if (piece.symbol == 'R') {
      // sus
      for (let j = piece.grid_j - 1; j >= 0; j--) {
         if (board[piece.grid_i][j].hasPiece == true) {
            let id = board[piece.grid_i][j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(piece.grid_i, j, 'rook');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(piece.grid_i, j, 'rook');
         move.display = true;
         legalMoves.push(move);
      }      

      // jos
      for (let j = piece.grid_j + 1; j < 8; j++) {
         if (board[piece.grid_i][j].hasPiece == true) {
            let id = board[piece.grid_i][j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(piece.grid_i, j, 'rook');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(piece.grid_i, j, 'rook');
         move.display = true;
         legalMoves.push(move);
      }

      // stanga
      for (let i = piece.grid_i - 1; i >= 0; i--) {
         if (board[i][piece.grid_j].hasPiece == true) {
            let id = board[i][piece.grid_j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(i, piece.grid_j, 'rook');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(i, piece.grid_j, 'rook');
         move.display = true;
         legalMoves.push(move);
      }

      // dreapta
      for (let i = piece.grid_i + 1; i < 8; i++) {
         if (board[i][piece.grid_j].hasPiece == true) {
            let id = board[i][piece.grid_j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(i, piece.grid_j, 'rook');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(i, piece.grid_j, 'rook');
         move.display = true;
         legalMoves.push(move);
      }
   }
   else if (piece.symbol == 'Q') {
      // sus
      for (let j = piece.grid_j - 1; j >= 0; j--) {
         if (board[piece.grid_i][j].hasPiece == true) {
            let id = board[piece.grid_i][j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(piece.grid_i, j, 'queen');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(piece.grid_i, j, 'queen');
         move.display = true;
         legalMoves.push(move);
      }      

      // jos
      for (let j = piece.grid_j + 1; j < 8; j++) {
         if (board[piece.grid_i][j].hasPiece == true) {
            let id = board[piece.grid_i][j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(piece.grid_i, j, 'queen');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(piece.grid_i, j, 'queen');
         move.display = true;
         legalMoves.push(move);
      }

      // stanga
      for (let i = piece.grid_i - 1; i >= 0; i--) {
         if (board[i][piece.grid_j].hasPiece == true) {
            let id = board[i][piece.grid_j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(i, piece.grid_j, 'queen');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(i, piece.grid_j, 'queen');
         move.display = true;
         legalMoves.push(move);
      }

      // dreapta
      for (let i = piece.grid_i + 1; i < 8; i++) {
         if (board[i][piece.grid_j].hasPiece == true) {
            let id = board[i][piece.grid_j].pieceId;
            if (pieces[id].isWhite == piece.isWhite) {
               break;
            } else {
               // insert move then break
               let move = new Move(i, piece.grid_j, 'queen');
               move.display = true;
               legalMoves.push(move);
               break;
            }
         }
         let move = new Move(i, piece.grid_j, 'queen');
         move.display = true;
         legalMoves.push(move);
      }

      // stanga sus
      for (let i = piece.grid_i - 1, j = piece.grid_j - 1; i >= 0; i--, j--) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'queen');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'queen');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // stanga jos

      for (let i = piece.grid_i - 1, j = piece.grid_j + 1; i >= 0; i--, j++) {
         if (board[i][j] == null)
            // console.log(i + ',' + j);
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'queen');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'queen');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // dreapta sus
      for (let i = piece.grid_i + 1, j = piece.grid_j - 1; i < 8; i++, j--) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'queen');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'queen');
            move.display = true;
            legalMoves.push(move);
         }
      }

      // dreapta jos
      for (let i = piece.grid_i + 1, j = piece.grid_j + 1; i < 8; i++, j++) {
         if (board[i][j] == null)
            break;
         else {
            if (board[i][j].hasPiece == true) {
               let id = board[i][j].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
                  break;
               } else {
                  // insert move then break
                  let move = new Move(i, j, 'queen');
                  move.display = true;
                  legalMoves.push(move);
                  break;
               }
            }
            let move = new Move(i, j, 'queen');
            move.display = true;
            legalMoves.push(move);
         }
      }
   }
   else if (piece.symbol == 'N') {
      // sus
      let n = 1;
      for (let i = 0; i < 2; i++) {
         if (piece.grid_i + n > -1 && piece.grid_i + n < 8 && piece.grid_j - 2 > -1 && piece.grid_j - 2 < 8) {
            if (board[piece.grid_i + n][piece.grid_j - 2].hasPiece == true) {
               let id = board[piece.grid_i + n][piece.grid_j - 2].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
               } else {
                  let move = new Move(piece.grid_i + n, piece.grid_j - 2, 'knight');
                  move.display = true;
                  legalMoves.push(move);
               }
            } else {
               let move = new Move(piece.grid_i + n, piece.grid_j - 2, 'knight');
               move.display = true;
               legalMoves.push(move);
            }
         }
         n *= -1;
      }

      // jos
      n = 1;
      for (let i = 0; i < 2; i++) {
         if (piece.grid_i + n > -1 && piece.grid_i + n < 8 && piece.grid_j + 2 > -1 && piece.grid_j + 2 < 8) {
            if (board[piece.grid_i + n][piece.grid_j + 2].hasPiece == true) {
               let id = board[piece.grid_i + n][piece.grid_j + 2].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
               } else {
                  let move = new Move(piece.grid_i + n, piece.grid_j + 2, 'knight');
                  move.display = true;
                  legalMoves.push(move);
               }
            } else {
               let move = new Move(piece.grid_i + n, piece.grid_j + 2, 'knight');
               move.display = true;
               legalMoves.push(move);
            }
         }
         n *= -1;
      }

      n = 1;
      // dreapta
      for (let i = 0; i < 2; i++) {
         if (piece.grid_i + 2 > -1 && piece.grid_i + 2 < 8 && piece.grid_j - n > -1 && piece.grid_j - n < 8) {
            if (board[piece.grid_i + 2][piece.grid_j - n].hasPiece == true) {
               let id = board[piece.grid_i + 2][piece.grid_j - n].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
               } else {
                  let move = new Move(piece.grid_i + 2, piece.grid_j - n, 'knight');
                  move.display = true;
                  legalMoves.push(move);
               }
            } else {
               let move = new Move(piece.grid_i + 2, piece.grid_j - n, 'knight');
               move.display = true;
               legalMoves.push(move);
            }
         }
         n *= -1;
      }

      // stanga
      n = 1;
      for (let i = 0; i < 2; i++) {
         if (piece.grid_i - 2 > -1 && piece.grid_i - 2 < 8 && piece.grid_j - n > -1 && piece.grid_j - n < 8) {
            if (board[piece.grid_i - 2][piece.grid_j - n].hasPiece == true) {
               let id = board[piece.grid_i - 2][piece.grid_j - n].pieceId;
               if (pieces[id].isWhite == piece.isWhite) {
               } else {
                  let move = new Move(piece.grid_i - 2, piece.grid_j - n, 'knight');
                  move.display = true;
                  legalMoves.push(move);
               }
            } else {
               let move = new Move(piece.grid_i - 2, piece.grid_j - n, 'knight');
               move.display = true;
               legalMoves.push(move);
            }
         }
         n *= -1;
      }
   }
   else if (piece.symbol == 'K') {

      for (let i = piece.grid_i - 1; i < piece.grid_i + 2; i++){
         for (let j = piece.grid_j - 1; j < piece.grid_j + 2; j++) {
            
            if (i >= 0 && i <= 7 && j >= 0 && j < 8) {
               if (i == piece.grid_i && j == piece.grid_j) {
                  // gerili
               } else {
                  if (board[i][j].hasPiece == true) {
                     let id = board[i][j].pieceId;
                     if (pieces[id].isWhite == piece.isWhite)
                     {
                        // asta e
                     } else {
                        let move = new Move(i, j, 'king');
                        move.display = true;
                        legalMoves.push(move);
                     }
                  } else {
                     let move = new Move(i, j, 'king');
                     move.display = true;
                     legalMoves.push(move);
                  }
               }
            } else {
               // console.log('da');
            }
         }
      }
      
   }
   // console.log(legalMoves);
}

function checkSquare() {
   let arr = [];
   for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
         if (board[i][j].pressed()) {
            arr[0] = i;
            arr[1] = j;
            break;
         }
      }
   }

   return arr;
}

function keyPressed() {
   if (keyCode === SHIFT)
      shift_pressed = true;
}

function mouseReleased() {
   for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].dragging == true) {

         let ii = pieces[i].grid_i;
         let j = pieces[i].grid_j;

         let pos = checkSquare();
         
         if (ii == pos[0] && j == pos[1]) {
            // its the same spot

            pieces[i].released(ii, j);
         }
         else {
            // already has a piece on it
            if (board[pos[0]][pos[1]].hasPiece == true) {
               let id = board[pos[0]][pos[1]].pieceId;
               // check if its enemy piece
               if (pieces[id].isWhite != pieces[i].isWhite) {
                  // move happens

                  for (let k = 0; k < legalMoves.length; k++) {
                     if (legalMoves[k].x == pos[0] && legalMoves[k].y == pos[1]) {
                        // its a legal move

                        // free the spot where we were
                        board[ii][j].hasPiece = false;
                        board[ii][j].pieceId = -1;
                        board[pos[0]][pos[1]].hasPiece = true;

                        // update the spot with piece id
                        board[pos[0]][pos[1]].pieceId = i;
                        pieces[i].released(pos[0], pos[1]);

                        // remove the other piece
                        pieces[id].taken = true;

                        pieces[i].first_turn = false;
                        // change the turn
                        turn *= -1;

                        check_forCheck();

                        sounds[1].play();
                        break;
                     } else {
                        // console.log('illegal move');
                        pieces[i].released(ii, j);
                     }
                  }
               } else {
                  pieces[i].released(ii, j);
               }
            } else {
               // move happens

               for (let k = 0; k < legalMoves.length; k++) {
                  if (legalMoves[k].x == pos[0] && legalMoves[k].y == pos[1]) {
                     // legal move

                     board[ii][j].hasPiece = false;
                     board[ii][j].pieceId = -1;
                     board[pos[0]][pos[1]].pieceId = i;
                     board[pos[0]][pos[1]].hasPiece = true;

                     pieces[i].released(pos[0], pos[1]);

                     pieces[i].first_turn = false;
                     // change the turn

                     check_forCheck();

                     sounds[0].play();
                     turn *= -1;
                     break;
                  } else {
                     // console.log('illegal move');
                     pieces[i].released(ii, j);
                  }
               }
            }
         }
      
         for (let i = 0; i < legalMoves.length; i++)
            if (legalMoves[i])
               legalMoves[i].display = false;
      }
   }
}

function check_forCheck() {

   for (let i = 0; i < pieces.length; i++)
   {
      let pos_x = pieces[i].grid_i;
      let pos_y = pieces[i].grid_j;
      
      if (pieces[i].taken == false) {
         calculateLegalMoves(pieces[i], pos_x, pos_y);
      
         for (let j = 0; j < legalMoves.length; j++) {
            // console.log(pos_x + ', ' + pos_y);
            if ((legalMoves[j].x == pieces[28].grid_i && legalMoves[j].y == pieces[28].grid_j) || (legalMoves[j].x == pieces[29].grid_i && legalMoves[j].y == pieces[29].grid_j)) {
               board[legalMoves[j].x][legalMoves[j].y].change_color('red');
               console.log(legalMoves[j]);
               break;
            }
         }
      }
      
   }
}

function draw() {
   background(220);

   for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
         board[i][j].hover();
         board[i][j].show();
      }
   }

   for (let i = 0; i < pieces.length; i++) {
      pieces[i].update();
      pieces[i].show();
   }

   for (let i = 0; i < legalMoves.length; i++) {
      legalMoves[i].show();
   }

}

