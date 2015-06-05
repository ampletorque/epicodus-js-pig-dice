function Player(name) {
  this.name = name;
  this.score = 0;
  this.computer = false;
}

Player.prototype.addToScore = function(newRoll) {
  return this.score += newRoll;
}

function Die() {
}

Die.prototype.roll = function() {
  return Math.floor(Math.random()*6 + 1);
}

function Game(player1, player2) {
  this.players = [new Player(player1), new Player(player2)];
  this.currentPlayerIndex = 0;
  this.turnScore = 0;
}

Game.prototype.switchTurn = function() {
  this.turnScore = 0;
  this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
}

Game.prototype.addToTurnScore = function(newRoll) {
  this.turnScore += newRoll;
}

Game.prototype.currentPlayer = function() {
  return this.players[this.currentPlayerIndex];
}

var updateGame = function(game) {
  game.switchTurn();
  $("#turn").text("Player turn: " + game.currentPlayer().name);
  $(".turn-status").hide();
}

function computerRoll(game, die) {
  $("#static-die").hide();
  $("#rolling-die").show();
  setTimeout(function(){
    $("#rolling-die").hide();
    $("#static-die").show();
    var newRoll = die.roll();
    if (newRoll != 1) {
      game.addToTurnScore(newRoll);
      $(".turn-status").show();
      $("#roll-value").text(newRoll);
      $("#score-value").text(game.turnScore);
      if (game.turnScore > 10) {
        alert("computer has more than 10 points this turn! computer holding.");
        computerHold(game);
      } else {
        setTimeout(function(){
          alert("computer will roll again!")
          computerRoll(game, die);
        }, 1000);
      }

    } else {
      $("#roll").hide();
      $("#hold").hide();
      $("#roll-value").text(newRoll);
      // $("#game #rolled-1").show();
      // $("#game #rolled-1").click(function(){
      //   $("#game #rolled-1").hide();
      //   $("#roll").show();
      //   $("#hold").show();
      alert("computer rolled a 1! computer has to pass.")
      $("#roll").show();
      $("#game #rolled-1").show();
      $(".player-name").text(game.currentPlayer().name)
      setTimeout(function(){
        $("#game #rolled-1").hide();
      }, 1000);
      updateGame(game);

      // });
    }
  }, 2000);
}

function computerHold(game) {
  game.currentPlayer().addToScore(game.turnScore);
  $("#score" + game.currentPlayerIndex).text(game.currentPlayer().score);
  if (game.currentPlayer().score >= 100) {
    $("#game-over").text(game.currentPlayer().name + " is the winner.");
    $("#new-game").show();
    $("#new-game").click(function(){
      $("#game").hide();
      $("#new-game").hide();
      $("#pregame").show();
    })
  } else {
    updateGame(game);
  }
}



$(function() {

  var newGame;

  $("form#new-players").submit(function(event) {
    event.preventDefault();

    var inputPlayer1 = $("input#player1").val(),
        inputPlayer2 = $("input#player2").val(),
        computerOpponent = $("input#computer-opponent").prop('checked');
        if (computerOpponent) {inputPlayer2 = "The Computer";}
        newGame = new Game(inputPlayer1, inputPlayer2);
        if (computerOpponent) {newGame.players[1].computer = true;}
    $("#pregame").hide();
    $("#game #player1-info #player1-name").text(newGame.players[0].name);
    $("#game #player2-info #player2-name").text(newGame.players[1].name);
    $("#score0").text(newGame.players[0].score);
    $("#score1").text(newGame.players[1].score);
    $("#game #rolled-1").hide();
    $(".turn-status").hide();
    $("#game-over").hide();
    $("#turn").text("Player turn: " + newGame.currentPlayer().name);
    $("#game").show();

    //remove click listener from roll button
    $("#roll").off();
    $("#rolling-die").hide();
    var newDie = new Die();

    if (newGame.currentPlayer().computer) {alert("computer");}

    $("#roll").click(function(){

      $("#static-die").hide();
      $("#rolling-die").show();
      setTimeout(function(){
        $("#rolling-die").hide();
        $("#static-die").show();
        var newRoll = newDie.roll();
        if (newRoll != 1) {
          newGame.addToTurnScore(newRoll);
          $(".turn-status").show();

          $("#roll-value").text(newRoll);
          $("#score-value").text(newGame.turnScore);
        } else {
          $("#roll").hide();
          $("#hold").hide();
          $("#roll-value").text(newRoll);
          $("#game #rolled-1").show();
          $(".player-name").text(newGame.currentPlayer().name);
          $("#game #rolled-1").click(function(){
            $("#game #rolled-1").hide();
            $("#roll").show();
            $("#hold").show();
            updateGame(newGame);
            if (newGame.currentPlayer().computer) {
                alert("computer play");
                $("#hold").hide();
                computerRoll(newGame, newDie);
                $("#hold").show();
            }
          });
        }
      }, 2000);
    });

    $("#hold").click(function() {
      newGame.currentPlayer().addToScore(newGame.turnScore);
      $("#score" + newGame.currentPlayerIndex).text(newGame.currentPlayer().score);
      if (newGame.currentPlayer().score >= 100) {
        $("#game-over").text(newGame.currentPlayer().name + " is the winner.");
        $("#new-game").show();
        $("#new-game").click(function(){
          $("#game").hide();
          $("#new-game").hide();
          $("#pregame").show();
        })
      } else {
        updateGame(newGame);
        if (newGame.currentPlayer().computer) {
          alert("computer play");
          $("#hold").hide();
          computerRoll(newGame, newDie);
          $("#hold").show();
        }
      }
    })

  });

});
