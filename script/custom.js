$(document).ready(function () {

  var mycards = function() {
    var self = this,
      suits = ["spades", "hearts", "diamonds", "clubs", "joker"], 
      ranks = [, "ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king"],
      Card  = function(suit, rank) {
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
        this.cardOnTopId;
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
            this.cards[i] = new Card(suit, rank); i++;
          }
        }
      },
      shuffle: function() {
        var i = this.cards.length;
        while (--i > 0) {
          var j = Math.floor(Math.random() * (i + 1));
          this.cards.swap(i, j);
        }
        this.cardOnTopId = this.cards.length-1;
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
      renderFirstTime: function() {
        var html = '', top = 125, left = 190, zindex = -52, self=this;
        for(var i=0; i<this.cards.length; i++){
          html+='<img src="'+this.cards[i].url(false)
          +'" style="top:'+top+'px; left:'+left+'px; z-index:'+zindex
          +';" data-card-id="'+i+'" />';
          if (i%7 === 0) { top -= 1; left -= 1; }
          zindex += 1;
        }
        $("#card-table").html(html);
        $('img[data-card-id]').click(function(){
          self.moveCardOnTop();
          $(this).unbind('click');
        });
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
          // console.log(this);
          this.players.push(new Player(player1, this));
          this.players.push(new Player(player2, this));
          this.turn = this.players[0];
          this.deck.shuffle();
          // this.players[0].hand = this.deck.dealHand(2);
          // this.players[1].hand = this.deck.dealHand(2);

          // graphics
          // //Start by initalizing the library
          // cards.init({table:'#card-table'});
          // //Create a new deck of cards
          // deck = new cards.Deck(); 
          this.deck.renderFirstTime();

          
          // // //cards.all contains all cards, put them all in the deck
          // deck.addCards(cards.all); 
          // // //No animation here, just get the deck onto the table.
          // deck.render({immediate:true});

          // // //Now lets create a couple of hands, one face down, one face up.
          // upperhand = new cards.Hand({faceUp:false, y:50});
          // lowerhand = new cards.Hand({faceUp:true, y:350});
          // //Deck has a built in method to deal to hands.
          // deck.deal(2, [upperhand, lowerhand], 50)


        },
        start: function() {
          // this.deck.view()
          // this.turn.play();
        },
        switchTurns: function() {
          this.turn = (this.turn == this.players[0] ? this.players[1] : this.players[0]); 
        },
        playCard: function(card) {
          console.log(this.turn.name + " just played: " + card.toString());
          // var card = this.turn.play();
          // display card
          this.switchTurns();
          this.turn.play();
        }
      }
    };
  }();
  var renderCards = function(){

  }();
  // var game = cards();
  // console.log(serial_maker.gensym())
  // var card = game.newCard(0, 0);
  // var card = game.newCard(0, 0);
  // var deck = game.newDeck();
  // console.log( cards);
  // console.log( cards.newCard(1, 2).toString());
  // console.log( cards.newCard(2, 3).toString() );
  // var deck = cards.newDeck();
  // console.log( deck.sample );
  // deck.shuffle();
  // console.log(deck.dealHand(5));
  // console.log(deck.deal());
  // console.log(deck.cards);

  // var p1 = cards.newPlayer("nour");
  // var p2 = cards.newPlayer("pal");

  // p1.hand = deck.dealHand(3);
  // p2.hand = deck.dealHand(3);
  // console.log(deck.cardsLeft());
  // console.log(p1.hand);
  // console.log(p2.hand);

  $("#p1").click(function(){
    // p1.play();
  });
  $("#p2").click(function() {
    // p2.play();
  });
mycards.game.init("nour", "pal");
mycards.game.start();






    
// deck.click(function(card){
//   if (card === deck.topCard()) {
//     lowerhand.addCard(deck.topCard());
//     lowerhand.render();
//   }
// });

// deck.x -= 50;
// deck.render();
// discardPile = new cards.Deck({faceUp:true});
// discardPile.x += 50;
// deck.render({callback:function() {
//   discardPile.addCard(deck.topCard());
//   discardPile.render();
// }});
  
//   lowerhand.click(function(card){
//   if (card.suit == discardPile.topCard().suit 
//     || card.rank == discardPile.topCard().rank) {
//     discardPile.addCard(card);
//     discardPile.render();
//     //lowerhand.render();
//   }
// });


  // console.log(  )
  // console.log( cards.game.deck )
  // console.log(deck.deal().toString());
  // console.log(deck.cardsLeft());

  // deck.changeDeck();
  // var deck2 = cards.newDeck();
  // console.log( deck.sample );
  // console.log( deck2.cards );
  // console.log( cards.newDeck().init() );
  // console.log( cards.newDeck().changeDeck() );
  // console.log( cards.newDeck().getDeck() );
  // console.log( deck.cards );
  // console.log(new cards.Card(0, 1).toString());
  // console.log(new cards.Card(0, 0).legalCard());

});
      // this.print = function() {
      //   for(var i=0; i<suits.length; i++) {
      //     console.log(suits[i]);
      //   }
      //   for(var i=0; i<ranks.length; i++) {
      //     console.log(ranks[i]);
      //   }
      // }