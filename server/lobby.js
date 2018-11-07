class Lobby {
  constructor(id, player1ID, player2ID) {
    this._id = id;
    this._player1ID = player1ID;
    this._player2ID = player2ID;
    this._rounds = 0;
  }

  get id() {
    return this._id;
  }

  get player1ID() {
    return this._player1ID;
  }

  get player2ID() {
    return this._player2ID;
  }
}
