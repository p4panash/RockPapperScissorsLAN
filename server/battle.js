class BattleCOM {
  constructor(playerChoice, playerId) {
    this._choices = ['r', 'p', 's'];
    this._id = Math.floor(playerId * Math.random());
    this._playerChoice = playerChoice;
    this._choice = Math.floor(3 * Math.random());

    var date = new Date();
    var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(time + "|In COM Battle #" + this._id + " , the server chose " + this._choices[this._choice]);
  }

  Battle() {
    if (this._choices[this._choice] == this._playerChoice) {
      var date = new Date();
      var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      console.log(time + "|In COM Battle #" + this._id + " tie");

      return "tie";
    }
    if (this._playerChoice + this._choices[this._choice] == "rs" ||
        this._playerChoice + this._choices[this._choice] == "sp" ||
        this._playerChoice + this._choices[this._choice] == "pr") {
        var date = new Date();
        var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        console.log(time + "|In COM Battle #" + this._id + " win");

        return "win";
    }
    var date = new Date();
    var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(time + "|In COM Battle #" + this._id + " lose");

    return "lose";
  }

  get choice() {
    return this._choices[this._choice];
  }
}

module.exports = BattleCOM;
