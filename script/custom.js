$(document).ready(function () {

  var mycards = function() {
    var self = this,
      suits = ["spades", "hearts", "diamonds", "clubs", "joker"], 
      ranks = [, "ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"],
      Card  = function(id, suit, rank) {
        this.id = id;
        this.suit = suit;
        this.rank = rank;
        this.name = function() {
          var s = "";
          switch(this.suit) {
            case 0: s = "s"; break;
            case 1: s = "h"; break;
            case 2: s = "d"; break;
            case 3: s = "c"; break;
          }
          return s+this.rank+".svg"
        };
        this.url = function(faceUp) {
          return "img/svg/" + ( faceUp ? this.name() : "cardback_blue.svg" ); 
        }
      },
      Deck = function() {
        this.cards = [];
        this.init();
      }, 
      Player = function(name, game) {
        this.name = name;
        this.hand = [];
        this.game = game;
      };

    Card.prototype = {
      toString: function() {
        return "Suit: "+ suits[this.suit] + ", Rank: " + ranks[this.rank];
      },
      legalCard:function() {
        return (this.suit >= 0 && this.suit <= 4) && (this.rank >= 1 && this.rank <= 13);
      }
    };
    Deck.prototype = {
      init: function() {
        var i = 0, self = this;
        for (var suit=0; suit<=3; suit++) {
          for (var rank=1; rank<=13; rank++) {
            this.cards[i] = new Card(i, suit, rank); i++;
          }
        }
      },
      shuffle: function() {
        var i = this.cards.length;
        while (--i > 0) {
          var j = Math.floor(Math.random() * (i + 1));
          this.cards.swap(i, j);
        }
      },
      deal: function() {
        return this.dealHand(1)[0];
      },
      dealHand: function(numOfCards) {
        var hand = [];
        for(var i=0; i<numOfCards; i++) {
          hand.push(this.cards.pop());
        }
        return hand;
      },
      cardsLeft: function() {
        return this.cards.length;
      }
    };
    Player.prototype = {
      play: function() {
        if (this.hand.length) {
          var card = this.hand.pop();
          this.game.playCard(card);
        } else {
          console.log("No cards left!");
        }
        return;
      }
    };
    Array.prototype.swap = function (x, y) {
      var b = this[x];
      this[x] = this[y];
      this[y] = b;
      return this;
    };
    return {
      game: {
        players : [],
        turn: null,
        deck: new Deck(),
        init: function(player1, player2) {
          this.players.push(new Player(player1, this));
          this.players.push(new Player(player2, this));
          this.turn = this.players[0];
          this.deck.shuffle();
        },
        start: function() {
          // this.turn.play();
        },
        switchTurns: function() {
          this.turn = (this.turn == this.players[0] ? this.players[1] : this.players[0]); 
        },
        playCard: function(card) {
          console.log(this.turn.name + " just played: " + card.toString());
          this.switchTurns();
          this.turn.play();
        },
        dealHandsToPlayers:function (numOfCards){
          if (numOfCards * this.players.length > this.deck.cards.length) {
            console.log("# of cards in deck is not enough to deal hands to players");
            return false;
          } else {
            for(var i=0; i<this.players.length; i++){
              this.players[i].hand = this.deck.dealHand(numOfCards);
            }
            return true;
          }
        }
      }
    };
  }();
  var renderCards = function(game){
    return {
      game: game,
      cards: game.deck.cards,
      cardOnTopId: game.deck.cards.length - 1,
      players: game.players,
      cardsCss: {
        height: 130,
        width: 100
      },
      createCard: function(options){
        return $('<img />').attr({
          src:options['src'],
          'data-card-id':options['data-card-id']
        }).css({
          'left':options['left']+'px',
          'top':options['top']+'px',
          'z-index':options['zindex']
        });
      },
      renderDeck: function() {
        var self = this, html = "", deck = $('.deck'), zindex = -52,
        top = 170, left = 170;

        for(var i=0; i<this.cards.length; i++){
          html+= this.createCard({
            src: this.cards[i].url(false),
            top: top, left: left, zindex: zindex,
            'data-card-id': this.cards[i].id
          })[0].outerHTML;
          if (i%7 === 0) { top -= 1; left -= 1; }
          zindex += 1;
        }
        $('.deck').html(html);
      },
      makeDeckClickable: function() {
        var self = this;
        $('img[data-card-id]').click(function(){
          self.moveCardOnTop();
          $(this).unbind('click');
        });
      },
      moveCardOnTop: function() {
        if (this.cardOnTopId < 0) return;
        var self = this, $cardOnTop = $('img[data-card-id='+ this.cardOnTopId+']');
        $cardOnTop.animate({
          left: '+=120',
          top: '125px',
        }, 200);
        $cardOnTop.attr('src', self.cards[self.cardOnTopId].url(true)); 
        $cardOnTop.css('z-index', $cardOnTop.css('z-index')*-1);
        this.cardOnTopId -= 1;
      },
      renderPlayers: function(){
        for(var i=0; i<this.players.length; i++){
          $('.player'+i+' h3').text(this.players[i].name);          
        }
      },
      renderDealHands: function() {
        var self = this, html = '', top = 10, left = 200, zindex = -52;

        $("#dealHands").click(function(){

          if (mycards.game.dealHandsToPlayers(3)) {
            for (var i=0; i<self.players.length; i++) {
              html = "";
              for(var j=0; j<self.players[i].hand.length; j++) {
                // get card on top
                // $('.deck img[data-card-id]').filter(function(index) {
                  // return $(this).css('z-index') === -1 * this.cards.length;
                // })
                html+= self.createCard({
                  src: self.players[i].hand[j].url(true),
                  // left: left, top:top, zindex: zindex,
                  'data-card-id': self.players[i].hand[j].id
                })[0].outerHTML;
              }
              $('.player'+i+' .cards').html(html);
            }
            self.renderDeck();
          }

        });
      }
    };
  }(mycards.game);

  
mycards.game.init("nour", "pal");
mycards.game.dealHandsToPlayers(3);
// mycards.game.start();

renderCards.renderDeck();
// renderCards.makeDeckClickable();
renderCards.renderPlayers();
renderCards.renderDealHands();
});