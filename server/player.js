class Player {
  constructor (id, name) {
    this._id = id;
    this._name = name;
    this._numberOfVictories = 0;
    this._numberOfDefeats = 0;
    this._numberOfTies = 0;
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get numberOfVictories() {
    return this._numberOfVictories;
  }

  get numberOfDefeats() {
    return this._numberOfDefeats;
  }

  get numberOfTies() {
    return this._numberOfTies;
  }


  set name(name) {
    this._name = name;
  }

  set id(id) {
    this._id = id;
  }

  set numberOfVictories(numberOfVictories) {
    this._numberOfVictories = numberOfVictories;
  }

  set numberOfDefeats(numberOfDefeats) {
    this._numberOfDefeats = numberOfDefeats;
  }

  set numberOfTies(numberOfTies) {
    this._numberOfTies = numberOfTies;
  }
}

module.exports = Player;
