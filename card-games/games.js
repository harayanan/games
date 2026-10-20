// Rules for every game. Each game has the same shape so app.js can render it:
//   type      'math' | 'strategy' | 'speed' (the group it is listed under)
//   tags      every type it should match in the filter
//   players   player counts it works for; decks: 1 or 2; level: 1 Easy, 2 Medium, 3 Challenging
//   remind    the short "on your turn" list shown near the top
//   sections  [{ title, text, steps, bullets, html }] in reading order
//   fair      ways to even things out between an adult and a child
//   three     notes for three players (null if it is a two-player game)

const GAMES = [

  // ===================================================================
  //  CLASSIC & STRATEGY
  // ===================================================================

  {
    id: 'crazy-eights',
    name: 'Crazy Eights',
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 1, time: '10–15 min', level: 1, needs: [],
    icon: '7h 7c 8s',
    blurb: `Match the suit or the number. Eights are wild.`,
    learn: `Matching, planning ahead, keeping track of which suits are left`,
    goal: `Be the first to play every card in your hand.`,
    remind: [
      `Play a card that matches the suit or the number`,
      `An 8 goes on anything; name the next suit`,
      `Can't play? Draw until you can`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Shuffle one deck. Deal 7 cards to each player (5 each with three players).`,
          `Put the rest face down in the middle. This is the <b>stock</b>.`,
          `Turn the top card of the stock face up beside it. This starts the <b>discard pile</b>. If it is an 8, push it into the middle of the stock and turn another.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `The player to the dealer's left goes first. Turns go clockwise.`,
          `On your turn, put one card on the discard pile. It must match the top card by <b>suit</b> (any ♥ on a ♥) or by <b>number</b> (any 7 on a 7).`,
          `An <b>8</b> can go on anything. When you play one, say which suit comes next: "Eight. Now it's spades." The next player must play a spade or another 8.`,
          `If you can't play, draw from the stock one card at a time until you get a card you can play, then play it. You may also draw when you could play, if you would rather keep your cards.`,
          `If the stock runs out, keep the top discard, shuffle the rest and turn it face down as the new stock.`,
        ],
        html: fig(
          felt(
            row(lab(c('7h'), 'Top of discard pile')),
            divider(),
            row(lab(fan('7c! 3h! 8s! Kc~ 2d~'), 'Your hand')),
          ),
          `The top card is ${t('7h')}. You can play <b>${t('7c')}</b> (same number), <b>${t('3h')}</b> (same suit) or <b>${t('8s')}</b> (wild). ${t('Kc')} and ${t('2d')} do not match.`,
          'Which cards can you play?'
        ),
      },
      {
        title: 'Winning',
        text: `The first player with no cards wins the round. For a longer game, the winner scores points for the cards the others still hold: each 8 = 50, J, Q, K = 10, Ace = 1, other cards = their number. First to 100 wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>Save your 8s. Playing one early wastes it; playing one when you are stuck, or as your last card, wins games. Notice which suit the other player keeps drawing on: they don't have it, so switch to that suit with your 8.</div>`,
      },
    ],
    fair: [
      `Play the first few rounds with all hands face up and talk through the choices out loud.`,
      `The adult starts with 3 extra cards.`,
    ],
    three: `Deal 5 cards each. Everything else stays the same.`,
    variants: [
      { name: 'Action Eights', text: `Add jobs for some cards. <b>2</b>: the next player draws two and misses their turn, unless they play a 2 too, which passes four cards on. <b>Queen</b>: skip the next player. <b>Ace</b>: reverse direction (three players).` },
      { name: 'Last card', text: `Say "Last card!" when you have one card left. If someone else spots it first, draw two.` },
      { name: 'On the clock', text: `Set the chess clock app to 2 minutes each. Tap it at the end of every turn. If your time runs out, you lose the round.` },
    ],
  },

  {
    id: 'kings-corner',
    name: "Kings Corner",
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 1, time: '15 min', level: 1, needs: [],
    icon: 'Kc 6h 5s',
    blurb: `Build piles downward in alternating colours around a cross. Kings take the corners.`,
    learn: `Counting down, colours, spotting moves a few steps ahead`,
    goal: `Be the first to play every card in your hand.`,
    remind: [
      `Draw 1 card`,
      `Play cards one lower and the opposite colour`,
      `Kings go in the corners`,
      `Move a whole pile to free up a side spot`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Deal 7 cards to each player. Put the rest face down in the middle as the stock.`,
          `Turn 4 cards face up and put one on each side of the stock: top, right, bottom and left. These are the four <b>side piles</b>.`,
          `Leave the four corners empty. Only a King can start a corner pile.`,
          `If one of the four starting cards is a King, move it to a corner and turn a new card for that side.`,
        ],
        html: fig(
          felt(grid3(
            slot('King<br>only'), lab(c('9c'), 'side'), slot('King<br>only'),
            lab(c('4h'), 'side'), pile('x', 'stock'), lab(c('Qd'), 'side'),
            slot('King<br>only'), lab(c('7s'), 'side'), slot('King<br>only'),
          )),
          `The cross at the start. Four side piles around the stock; the corners wait for Kings.`,
          'The table'
        ),
      },
      {
        title: 'How to play',
        steps: [
          `Start your turn by drawing one card from the stock.`,
          `Then make as many moves as you like, in any order:
            <ul>
              <li><b>Play a card</b> on any pile if it is <b>one lower and the opposite colour</b>. A red 6 goes on a black 7. A black Jack goes on a red Queen.</li>
              <li><b>Put a King</b> in any empty corner.</li>
              <li><b>Move a whole pile</b> on top of another pile, if the bottom card of the pile you move fits on the top card of the other pile.</li>
              <li><b>Fill an empty side spot</b> with any card from your hand.</li>
            </ul>`,
          `When you can't or don't want to move any more, your turn ends.`,
          `Order from high to low: K, Q, J, 10, 9 … 2, A. Nothing goes on an Ace.`,
        ],
        html: figs(
          fig(
            felt(row(lab(c('7s'), 'on the table'), arrow('←'), lab(c('6h!'), 'from your hand'))),
            `<b>${t('6h')}</b> goes on ${t('7s')}: one lower, red on black. ${t('6s')} would not fit (same colour).`,
            'Play a card'
          ),
          fig(
            felt(row(
              lab(fan('8d 7c'), 'left pile'),
              arrow(),
              lab(c('9s'), 'top pile'),
            ), row(lab(fan('9s 8d 7c'), 'after the move'), lab(slot('empty'), 'left spot'))),
            `The left pile starts with ${t('8d')}, which fits on ${t('9s')}. Move the whole pile across. The left spot is now empty: fill it with any card from your hand.`,
            'Move a whole pile'
          ),
        ),
      },
      {
        title: 'Winning',
        text: `The first player to empty their hand wins the round. To keep score, the others count penalty points for cards still in hand: each King = 10, every other card = 1. After 5 rounds, the lowest total wins.`,
      },
    ],
    fair: [
      `The adult must play every card they can each turn. The child may choose to hold cards back.`,
      `Once per round, the child may ask "Do I have a move?" and the adult must point one out.`,
    ],
    three: `Deal 7 cards each. Same rules.`,
    variants: [
      { name: 'Open hands', text: `For learning, everyone plays with their hand face up. Talk through each move before making it.` },
    ],
  },

  {
    id: 'rummy',
    name: 'Rummy',
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 1, time: '20–30 min', level: 2, needs: ['paper and pencil'],
    icon: '7s 7h 7d',
    blurb: `Collect sets and runs, lay them down, and be first to get rid of your cards.`,
    learn: `Sorting, sequences, adding up points, noticing what the other player collects`,
    goal: `Get rid of all your cards by laying them down in sets and runs.`,
    remind: [
      `Draw 1 card (stock or discard pile)`,
      `Lay down sets or runs (if you want)`,
      `Add cards to melds on the table (if you want)`,
      `Discard 1 card`,
    ],
    sections: [
      {
        title: 'What you are collecting',
        text: `A group of cards laid on the table is called a <b>meld</b>. There are two kinds.`,
        html: figs(
          fig(row(cards('7s 7h 7d')), `<b>Set:</b> 3 or 4 cards of the same number.`, 'Set'),
          fig(row(cards('4c 5c 6c 7c')), `<b>Run:</b> 3 or more cards in order, all the same suit.`, 'Run'),
          fig(row(cards('Ah 2h 3h'), cards('Qd Kd Ad~')),
            `Ace is low. A-2-3 is a run; Q-K-A is <span class="no">not</span>.`, 'Aces'),
          fig(row(cards('4c 5h~ 6c')), `<span class="no">Not a run</span>: the suits are mixed.`, 'Not a run'),
        ),
      },
      {
        title: 'Set up',
        steps: [
          `Deal 10 cards each for two players, 7 each for three.`,
          `Put the rest face down as the stock. Turn the top card face up to start the discard pile.`,
          `Sort your hand by suit and number so you can see what is close to a set or run.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `<b>Draw</b>: take the top card of the stock, or the top card of the discard pile.`,
          `<b>Meld</b> (optional): lay any sets or runs face up in front of you.`,
          `<b>Lay off</b> (optional): add cards to any meld on the table, yours or another player's.`,
          `<b>Discard</b>: end your turn by putting one card face up on the discard pile. You can't discard the card you just picked up from the discard pile.`,
          `If the stock runs out, keep the top discard, shuffle the rest and turn it over as the new stock.`,
        ],
        html: fig(
          felt(
            row(lab(cards('5d 6d 7d'), 'run on the table'), lab(cards('9s 9h 9c'), 'set on the table')),
            divider(),
            row(lab(fan('4d! 8d! 9d! Kc~'), 'your hand')),
          ),
          `You can lay off <b>${t('4d')}</b> or <b>${t('8d')}</b> on the diamond run, and <b>${t('9d')}</b> on the set of 9s. ${t('Kc')} fits nowhere.`,
          'Laying off'
        ),
      },
      {
        title: 'Winning and scoring',
        text: `The round ends as soon as a player has no cards left. Their last card can be a discard. Everyone else adds up the cards still in their hand: J, Q, K = 10, Ace = 1, number cards = their number. The winner scores that total. First to 100 points wins (try 50 for a first game).`,
        html: `<div class="box"><h3>Thinking tip</h3>Watch what the other player picks up from the discard pile. If they take a 6, avoid throwing 5s, 6s and 7s of that suit. Get rid of high cards early: a King left in your hand costs 10.</div>`,
      },
    ],
    fair: [
      `The adult may only draw from the stock, never from the discard pile.`,
      `The child plays to 50 points, the adult to 100.`,
    ],
    three: `Deal 7 cards each. Same rules.`,
    variants: [
      { name: 'Rummy!', text: `If someone discards a card that could be laid off on a meld, the first player to shout "Rummy!" takes it and lays it off. Keeps everyone watching.` },
      { name: 'On the clock', text: `Chess clock app, 3 minutes each per round. Tap after your discard. Run out of time and you lose the round, scoring nothing.` },
    ],
  },

  {
    id: 'golf',
    name: 'Golf',
    type: 'strategy', tags: ['strategy', 'math'],
    players: [2, 3], decks: 1, time: '20 min (9 rounds)', level: 1, needs: ['paper and pencil'],
    icon: 'Kd 2s 5h',
    blurb: `Six cards each, face down. Swap them for lower cards. Lowest score wins.`,
    learn: `Adding with negative numbers, memory, judging a risk`,
    goal: `Have the lowest total score after nine rounds (called "holes").`,
    remind: [
      `Draw from the stock or the discard pile`,
      `Swap it for one of your 6 cards, or throw it away`,
      `A matching pair in a column scores 0`,
    ],
    sections: [
      {
        title: 'Card values',
        html: fig(
          row(lab(c('Ah'), '1'), lab(c('2s'), '−2 (minus two)'), lab(cards('3d 10c'), 'their number'), lab(cards('Jh Qs'), '10'), lab(c('Kd'), '0')),
          `Kings are worth nothing and 2s take two points off. Two cards of the same number in the same column cancel out to 0.`
        ),
      },
      {
        title: 'Set up',
        steps: [
          `Deal 6 cards face down to each player. Without looking, lay them in front of you in 2 rows of 3.`,
          `Put the rest face down as the stock. Turn the top card face up to start the discard pile.`,
          `Each player turns any 2 of their own 6 cards face up.`,
        ],
        html: fig(
          felt(grid3(c('x'), c('5h'), c('x'), c('Kd'), c('x'), c('x'))),
          `A starting grid after turning two cards. The other four stay face down until you swap them or the round ends.`,
          'Your grid'
        ),
      },
      {
        title: 'How to play',
        steps: [
          `On your turn, take either the top discard or the top card of the stock.`,
          `<b>Swap</b>: put it in place of any one of your 6 cards (face up or face down). The new card sits face up. The card you replaced goes face up on the discard pile.`,
          `<b>Or throw it away</b>: if you took it from the stock and don't want it, put it on the discard pile.`,
          `The round ends when one player has all 6 cards face up. Every other player gets one last turn. Then everyone turns over their remaining cards and adds up.`,
        ],
      },
      {
        title: 'Scoring',
        html: fig(
          felt(grid3(c('5h!'), c('Ks'), c('7c'), c('5d!'), c('3h'), c('2s'))),
          `Column 1: two 5s pair up = <b>0</b>. Column 2: K + 3 = 0 + 3 = <b>3</b>. Column 3: 7 + (−2) = <b>5</b>. Total: 0 + 3 + 5 = <b>8</b>.<br>Note: two 2s in a column score 0, which is worse than −4. Don't pair your 2s.`,
          'Adding up a grid'
        ),
        text: `Write each player's score after every round. After 9 rounds, the lowest total wins.`,
      },
    ],
    fair: [
      `The child turns 3 cards face up at the start instead of 2.`,
      `Once per round, the child may peek at one of their face-down cards.`,
      `Play 5 holes instead of 9 for a shorter game.`,
    ],
    three: `Same rules. Deal 6 each.`,
    variants: [
      { name: 'Four-card Golf', text: `Deal 4 cards in a 2 × 2 square. At the start, look at your two bottom cards once, then turn them back down. Nothing starts face up. Same scoring. Good for memory.` },
    ],
  },

  {
    id: 'german-whist',
    name: 'German Whist',
    type: 'strategy', tags: ['strategy'],
    players: [2], decks: 1, time: '20 min', level: 2, needs: ['paper and pencil'],
    icon: 'As Kh Qs',
    blurb: `A trick-taking game for two. Win good cards in the first half, then win the tricks that count.`,
    learn: `Following suit, trumps, remembering which cards have been played`,
    goal: `Win more of the last 13 tricks than the other player.`,
    remind: [
      `Follow suit if you can`,
      `Trumps beat every other suit`,
      `Part 1: winner takes the face-up stock card`,
      `Part 2: count your tricks`,
    ],
    sections: [
      {
        title: 'Words you need',
        bullets: [
          `<b>Trick</b>: each player plays one card. The better card wins both.`,
          `<b>Lead</b>: the first card played in a trick.`,
          `<b>Follow suit</b>: play the same suit as the lead. You must if you can.`,
          `<b>Trumps</b>: one suit that beats all the others for this hand.`,
          `Order from high to low: A, K, Q, J, 10 … 2.`,
        ],
      },
      {
        title: 'Set up',
        steps: [
          `Deal 13 cards to each player.`,
          `Put the other 26 face down as the stock. Turn its top card face up and leave it on top.`,
          `The suit of that first face-up card is <b>trumps</b> for the whole hand.`,
        ],
        html: fig(
          felt(row(lab(c('Qs'), 'face up on the stock'), lab(c('x', 'stack'), '25 cards under it'))),
          `The first face-up card is ${t('Qs')}, so <b>spades are trumps</b>. Write it down so nobody forgets.`,
          'Choosing trumps'
        ),
      },
      {
        title: 'Part 1: collecting cards (first 13 tricks)',
        steps: [
          `The player who did not deal leads any card.`,
          `The other player must follow suit if they can. If they can't, they may play a trump or any other card.`,
          `The trick goes to the highest trump played. If no trump was played, it goes to the highest card of the suit led.`,
          `The winner takes the face-up card from the stock into their hand. The loser takes the next card, face down, without showing it. Then turn the next stock card face up.`,
          `The winner leads the next trick. Tricks in Part 1 don't count: push them aside.`,
        ],
        html: figs(
          fig(row(lab(c('9h'), 'led'), lab(c('Kh!'), 'played')), `Both hearts. <b>${t('Kh')}</b> is higher and wins.`, 'Same suit'),
          fig(row(lab(c('9h'), 'led'), lab(c('2s!'), 'played')), `No hearts left, so a trump was played. <b>${t('2s')}</b> wins: even a small trump beats other suits.`, 'Trumped'),
          fig(row(lab(c('9h!'), 'led'), lab(c('Kd'), 'played')), `No hearts and no trump played. ${t('Kd')} can't win, so <b>${t('9h')}</b> takes it.`, 'Thrown away'),
        ),
      },
      {
        title: 'Part 2: playing for points (last 13 tricks)',
        steps: [
          `When the stock is gone, each player has 13 cards.`,
          `Play 13 more tricks with the same rules. Keep the tricks you win in a pile in front of you.`,
          `Count them at the end.`,
        ],
      },
      {
        title: 'Winning and scoring',
        text: `Whoever wins 7 or more of the Part 2 tricks wins the hand and scores the number of tricks they won minus 6 (9 tricks = 3 points). First to 10 points wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>In Part 1, look at the face-up card before you play. If it is a trump or an Ace, try hard to win the trick. If it is a low card, play your worst card and lose on purpose: the card the loser gets might be better. There are 13 trumps in total; count them as they appear.</div>`,
      },
    ],
    fair: [
      `In Part 2, the adult plays with their hand face up.`,
      `The child may ask "How many trumps are still out?" once per hand, and the adult must answer.`,
    ],
    three: null,
    variants: [
      { name: 'Open Part 1', text: `For a first game, both players lay Part 1 hands face up so you can talk about which card to play and why.` },
    ],
  },

  {
    id: 'oh-hell',
    name: 'Oh Hell!',
    type: 'strategy', tags: ['strategy'],
    players: [3, 2], decks: 1, time: '30 min', level: 2, needs: ['paper and pencil'],
    icon: 'Ah 9s 5s',
    blurb: `Say exactly how many tricks you will win, then win that many. Not one more, not one less.`,
    learn: `Predicting, judging how strong a hand is, trick-taking`,
    goal: `Score the most points by winning exactly the number of tricks you said you would.`,
    remind: [
      `Bid how many tricks you will win`,
      `Follow suit if you can; trumps beat other suits`,
      `Exactly right = 10 + your bid. Otherwise 0`,
    ],
    sections: [
      {
        title: 'Set up',
        text: `If tricks and trumps are new, read the "Words you need" part of <a href="#/game/german-whist">German Whist</a> first. Draw a score sheet with one column per player. The number of cards changes each round:`,
        bullets: [
          `Round 1: 1 card each. Round 2: 2 cards each. Keep going up to 7, then back down to 1. That's 13 rounds.`,
          `Short game: go from 1 up to 5 and stop.`,
          `The dealer moves one seat to the left every round.`,
        ],
      },
      {
        title: 'Each round',
        steps: [
          `Deal the cards for this round. Turn the next card of the deck face up: its suit is <b>trumps</b> for this round. Aces are high.`,
          `<b>Bid</b>: starting left of the dealer, each player says how many tricks they will win. 0 is allowed. Write the bids down.`,
          `<b>The dealer's catch</b>: the dealer bids last and may not say the number that makes all the bids add up to the number of tricks. This means at least one player will miss.`,
          `<b>Play</b>: the player left of the dealer leads. Follow suit if you can; if not, play a trump or anything. The highest trump wins, or the highest card of the suit led if no trump was played. The winner leads next.`,
          `<b>Score</b>: if you won exactly what you bid, score 10 + your bid. If not, score 0.`,
        ],
        html: fig(
          table(
            ['Round 3 (3 cards each)', 'Bid', 'Won', 'Points'],
            [
              ['Shakti', '1', '1', '<span class="ok">10 + 1 = 11</span>'],
              ['Dad', '2', '1', '<span class="no">0</span>'],
              ['Friend (dealer)', '1', '1', '<span class="ok">10 + 1 = 11</span>'],
            ]
          ),
          `There are 3 tricks. Shakti and Dad bid 1 + 2 = 3, so the dealer was not allowed to bid 0 (that would make the total 3). The dealer bid 1, and Dad was the one who missed.`,
          'A sample score sheet'
        ),
      },
      {
        title: 'Winning',
        text: `After the last round, add up. Highest total wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>Aces and high trumps usually win tricks. Low cards in a suit you hold lots of usually lose. With a weak hand, bidding 0 is a good plan: you then try to lose every trick, which is its own puzzle.</div>`,
      },
    ],
    fair: [
      `Leave out the dealer's catch for the child's first games.`,
      `Once per game, the child may change their bid after seeing the first trick.`,
    ],
    three: `This is the best player count. All rules above are for three.`,
    variants: [
      { name: 'Two players', text: `It works with two. Go up to 10 cards a round. The dealer's catch matters even more.` },
    ],
  },

  {
    id: 'spite-and-malice',
    name: 'Spite and Malice',
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 2, time: '30 min', level: 2, needs: [],
    icon: 'Ks Qh Ad',
    blurb: `Race to empty your payoff pile by building shared piles from Ace up to Queen. Kings are wild.`,
    learn: `Counting up in order, planning several moves, blocking the other player`,
    goal: `Be the first to play every card from your payoff pile.`,
    remind: [
      `Fill your hand up to 5`,
      `Build centre piles A → Q, any suit. Kings are wild`,
      `Play from hand, payoff pile or the top of your discard piles`,
      `End your turn by discarding 1 card`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Shuffle two decks together (104 cards, no jokers).`,
          `Deal each player a <b>payoff pile</b> of 20 cards face down (10 for a first game). Turn the top card face up.`,
          `Deal 5 cards to each player's hand. Put the rest face down in the middle as the <b>stock</b>.`,
          `Leave room in the middle for up to 4 <b>centre piles</b> that both players share, and room in front of each player for up to 4 <b>discard piles</b> of their own.`,
          `The player whose face-up payoff card is higher goes first.`,
        ],
        html: fig(
          felt(
            row(zone('Dad', row(pile('9c', 'payoff'), slot('discard'), slot('discard'), slot('discard'), slot('discard')))),
            row(pile('x', 'stock'), lab(c('3h'), 'centre'), lab(c('Kd'), 'centre<br>(King = 7)'), slot('centre'), slot('centre')),
            row(zone('Shakti', row(pile('4s', 'payoff'), lab(c('Jc'), 'discard'), lab(c('8d'), 'discard'), slot('discard'), slot('discard')), row(lab(fan('Ac 2h 5h Kh 10s'), 'hand')))),
          ),
          `Shakti's payoff card is ${t('4s')} and a centre pile shows ${t('3h')}, so she can play it straight away.`,
          'The table during a game'
        ),
      },
      {
        title: 'How to play',
        steps: [
          `Start your turn by drawing from the stock until you have 5 cards in hand.`,
          `Play cards onto the centre piles. A centre pile must start with an <b>Ace</b> and goes up one at a time: A, 2, 3 … 10, J, Q. Suits don't matter. Start a new centre pile in any empty centre spot.`,
          `<b>Kings are wild</b>: a King can be played as any card.`,
          `You can play cards from three places: your hand, the top of your payoff pile, and the top card of any of your discard piles. When you play your payoff card, turn the next one face up.`,
          `If you play all 5 cards from your hand, draw 5 more and keep going.`,
          `When you can't or don't want to play more, end your turn by putting one card from your hand on one of your discard piles.`,
          `When a centre pile reaches a Queen, set it aside. When the stock runs out, shuffle the set-aside piles to make a new stock.`,
        ],
        html: `<div class="box"><h3>Not allowed</h3>
          <ul>
            <li>Playing on the other player's discard piles or payoff pile.</li>
            <li>Moving a card from one of your discard piles to another.</li>
            <li>Putting a payoff card on a discard pile. Payoff cards only go to the centre.</li>
          </ul></div>`,
      },
      {
        title: 'Winning',
        text: `The first player to clear their payoff pile wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>Only the top card of each discard pile can be played, so stack them high to low: put a 9 down, then a 7, then a 5, so they come back off in a useful order. Watch the other player's payoff card: if it is an 8, don't build a centre pile up to 7 for them. Keep a King for the moment your payoff card is one step away.</div>`,
      },
    ],
    fair: [
      `The child gets a 10-card payoff pile, the adult 20.`,
      `The child may keep up to 6 cards in hand.`,
    ],
    three: `Use 15-card payoff piles. Same rules.`,
    variants: [
      { name: 'Short game', text: `10-card payoff piles each. About 10 minutes.` },
    ],
  },

  // ===================================================================
  //  FAST & LOUD
  // ===================================================================

  {
    id: 'speed',
    name: 'Speed',
    type: 'speed', tags: ['speed'],
    players: [2], decks: 1, time: '5 min', level: 1, needs: [],
    icon: '6h 7c 8d',
    blurb: `No turns. Both players play at once: one higher or one lower, as fast as you can.`,
    learn: `Counting up and down by one, quick eyes, quick hands`,
    goal: `Be the first to play all your cards.`,
    remind: [
      `No turns: play at the same time`,
      `One higher or one lower, any suit`,
      `Never hold more than 5`,
      `Both stuck? Both flip a side card`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Deal two <b>side piles</b> of 5 cards face down, one at each end of the table.`,
          `Deal 2 cards face down in the middle, between the side piles. These start the two <b>play piles</b>.`,
          `Deal the other 40 cards: 20 to each player. Each player picks up 5 as their hand and puts the other 15 face down in front of them as their <b>draw pile</b>.`,
        ],
        html: fig(
          felt(
            row(lab(fan('x x x x x'), 'Dad: hand (5)'), pile('x', 'Dad: draw pile (15)')),
            rowNoWrap(pile('x', 'side pile (5)'), c('x'), c('x'), pile('x', 'side pile (5)')),
            row(pile('x', 'Shakti: draw pile (15)'), lab(fan('x x x x x'), 'Shakti: hand (5)')),
          ),
          `Ready to start. The two middle cards are turned over together on "Speed!"`,
          'Set up'
        ),
      },
      {
        title: 'How to play',
        steps: [
          `Both players say "Ready, set, Speed!" and each turns over one of the two middle cards at the same time.`,
          `Now play as fast as you can. There are no turns. Put a card from your hand on either play pile if it is <b>one higher or one lower</b> than the top card. Suits don't matter. Ace joins King and 2, so K-A-2 counts as in order.`,
          `Use one hand to play. Keep your hand topped up to 5 by drawing from your own draw pile. Never hold more than 5.`,
          `If neither player can play, both say "Speed!" and each flips the top card of the side pile nearest them onto a play pile.`,
          `If the side piles run out and nobody can play, shuffle the two play piles together and deal two new side piles.`,
          `If two cards land at once, the one that touched first stays. The other goes back to its owner's hand.`,
        ],
        html: fig(
          felt(
            row(lab(c('7c'), 'play pile'), lab(c('Qh'), 'play pile')),
            divider(),
            row(lab(fan('8d! 6s! Jc! 3h~ Kd!'), 'your hand')),
          ),
          `${t('8d')} or ${t('6s')} can go on ${t('7c')}. ${t('Jc')} or ${t('Kd')} can go on ${t('Qh')}. After ${t('8d')} lands, a 7 or a 9 can follow. ${t('3h')} has nowhere to go yet.`,
          'What can you play?'
        ),
      },
      {
        title: 'Winning',
        text: `The first player to get rid of every card in their hand and draw pile slaps the table, shouts "Speed!" and wins.`,
      },
    ],
    fair: [
      `The adult plays with their other hand (left hand if right-handed).`,
      `The adult may only hold 4 cards.`,
      `The adult starts with 3 cards from the child's draw pile added to their own.`,
    ],
    three: null,
    variants: [
      { name: 'Two-step Speed', text: `Play a card if it is exactly 2 higher or 2 lower (6 on 8 or on 4). Good practice for counting in twos. Try 3s next.` },
    ],
  },

  {
    id: 'egyptian-ratscrew',
    name: 'Egyptian Ratscrew',
    type: 'speed', tags: ['speed'],
    players: [2, 3], decks: 1, time: '15 min', level: 1, needs: ['timer (optional)'],
    icon: 'Jh 7s 7d',
    blurb: `Take turns flipping cards into the middle. Slap doubles and sandwiches to win the pile.`,
    learn: `Spotting patterns, quick reactions, keeping count`,
    goal: `Win all the cards.`,
    remind: [
      `Flip one card onto the middle pile`,
      `Face card or Ace = challenge: J 1, Q 2, K 3, A 4 chances`,
      `Slap a double or a sandwich to take the pile`,
      `Wrong slap: one card goes under the pile`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Deal out the whole deck face down, as evenly as you can.`,
          `Square up your cards into one face-down pile. Don't look at them.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Take turns, going clockwise. On your turn, flip the top card of your pile face up onto the middle pile. Flip it away from you, so you don't see it before everyone else.`,
          `<b>Face cards and Aces start a challenge.</b> The next player must turn up a face card or Ace within a set number of tries: Jack = 1 try, Queen = 2, King = 3, Ace = 4. If they do, the challenge passes to the player after them with the new number of tries. If they run out of tries, the player who played the last face card or Ace takes the whole pile.`,
          `<b>Slap!</b> Anyone can slap the middle pile, at any time, when they see a <b>double</b> or a <b>sandwich</b> (see below). The first hand on the pile takes all of it, even during a challenge and even if it's not your turn.`,
          `<b>Wrong slap</b>: put one card from your pile face down under the middle pile.`,
          `Whoever takes a pile starts the next one by flipping a card.`,
          `If you run out of cards, you're not out yet: you can still slap to get back in. A wrong slap with no cards puts you out.`,
        ],
        html: figs(
          fig(row(fan('3c Kh 7s 7d!')), `<b>Double</b>: two cards of the same number, one on top of the other.`, 'Slap!'),
          fig(row(fan('2h 7s! Kh 7d!')), `<b>Sandwich</b>: same number with one card between.`, 'Slap!'),
          fig(row(fan('7s 8d 9c')), `No pattern. <span class="no">Don't slap</span>.`, 'Hands off'),
        ),
      },
      {
        title: 'Face card challenges',
        html: fig(
          table(['Card played', 'Tries the next player gets'], [
            [c('Js'), '1'], [c('Qh'), '2'], [c('Kc'), '3'], [c('Ad'), '4'],
          ]),
          `Example: Dad plays ${t('Qh')}. Shakti has 2 tries: she flips ${t('5c')}, then ${t('Js')}. Now Dad must find a face card or Ace in 1 try. He flips ${t('9d')}, so Shakti takes the pile.`
        ),
      },
      {
        title: 'Winning',
        text: `Collect every card to win. For a shorter game, set a timer for 10 minutes; most cards when it rings wins.`,
        html: `<div class="box"><h3>Slapping safely</h3>Flat hand only. Take off rings and keep nails short. The lowest hand, the one touching the cards, wins the slap.</div>`,
      },
    ],
    fair: [
      `The adult keeps their hands in their lap until each card lands.`,
      `The adult can only slap sandwiches. The child can slap doubles and sandwiches.`,
    ],
    three: `Same rules. Deal the whole deck between three (one player gets an extra card).`,
    variants: [
      { name: 'More slaps', text: `Add one new slap rule at a time once the basics are easy. <b>Tens</b>: the top two cards add up to 10 (3 and 7, A and 9). <b>Top and bottom</b>: the top card matches the bottom card of the pile. <b>Royal couple</b>: a King and Queen together. <b>Run</b>: three in order, like 4, 5, 6.` },
    ],
  },

  {
    id: 'spoons',
    name: 'Spoons',
    type: 'speed', tags: ['speed'],
    players: [3], decks: 1, time: '10–20 min', level: 1, needs: ['spoons (one fewer than players)'],
    icon: 'Qc Qd Qh Qs',
    blurb: `Pass cards fast to collect four of a kind, then grab a spoon before they run out.`,
    learn: `Matching, watching other players, staying calm under pressure`,
    goal: `Don't be the one left without a spoon.`,
    remind: [
      `Pick up, keep 4, pass 1 to your left`,
      `Four of a kind? Take a spoon quietly`,
      `See a spoon move? Grab one`,
      `No spoon = a letter of S-P-O-O-N`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Put spoons in the middle of the table where everyone can reach: one fewer spoon than players. Three players, two spoons.`,
          `Deal 4 cards to each player. The dealer puts the rest face down beside them as the stock.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `The dealer picks up the top card of the stock, so they have 5 cards. They keep 4 and pass one face down to the player on their left.`,
          `That player picks it up, keeps 4, and passes one to their left. Always keep exactly 4 cards in hand.`,
          `The last player puts the card they pass face down on a discard pile.`,
          `Keep going, fast. Nobody waits: the dealer draws again as soon as they have passed a card.`,
          `When the stock runs out, the dealer picks up the discard pile and uses it as the new stock.`,
          `When you hold four of a kind (four Queens, four 7s), take a spoon. You can do it quietly and keep passing cards to see who notices.`,
          `As soon as anyone sees a spoon gone, they can grab one too. The player left without a spoon loses the round.`,
        ],
        html: fig(
          felt(
            row(pile('x', 'stock'), arrow(), lab(fan('x x x x'), 'Dealer'), arrow(), lab(fan('x x x x'), 'Player 2'), arrow(), lab(fan('x x x x'), 'Player 3'), arrow(), pile('x', 'discard')),
            divider(),
            row(lab('<span class="spoons">🥄 🥄</span>', 'two spoons for three players')),
          ),
          `Cards move one way: stock → dealer → left → left → discard pile.`,
          'Passing cards'
        ),
      },
      {
        title: 'Winning',
        text: `The player without a spoon takes a letter: first S, then P, O, O, N. Spell SPOON and you're out. The last player still in wins.`,
        bullets: [
          `If you take a spoon without four of a kind, you get a letter.`,
          `Use wooden or plastic spoons. Grab them from the middle, never out of someone's hand.`,
        ],
      },
    ],
    fair: [
      `The child can win a spoon with four of a kind <i>or</i> four cards of the same suit.`,
    ],
    three: `This game needs at least three players.`,
    variants: [
      { name: 'Quick Spoons', text: `Use only three ranks (all the Aces, Kings and Queens: 12 cards). Deal 4 each, no stock. On "Pass!", everyone passes one card to the left at the same time. Rounds last under a minute.` },
    ],
  },

  // ===================================================================
  //  MATHS
  // ===================================================================

  {
    id: 'math-war',
    name: 'Maths War',
    type: 'math', tags: ['math'],
    players: [2, 3], decks: 1, time: '10 min', level: 1, needs: ['timer (optional)'],
    icon: '7h 8c',
    blurb: `Everyone flips two cards and works out the answer. Biggest answer wins the cards.`,
    learn: `Adding and times tables, said fast and checked by others`,
    goal: `Win the most cards.`,
    remind: [
      `Flip two cards`,
      `Say your answer out loud`,
      `Biggest answer takes all the cards`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number, Jack = 11, Queen = 12, King = 13. For an easier game, take out the Jacks, Queens and Kings.`,
      },
      {
        title: 'Set up',
        steps: [
          `Shuffle and deal all the cards face down, one pile per player. Don't look at your pile.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Everyone turns over the top two cards of their pile at the same time.`,
          `Work out your answer and say it out loud. <b>Level 1</b>: add the two cards. <b>Level 2</b>: multiply them.`,
          `Check each other. The biggest answer wins all the turned-over cards. Put them face down under your pile.`,
          `If someone says a wrong answer and another player catches it, the catcher wins those cards.`,
          `<b>Tie? War!</b> Each tied player puts 3 cards face down, then turns 2 more and works out a new answer. The winner takes every card in the middle. If you run short, use what you have.`,
          `Play until one player has all the cards, or set a timer for 10 minutes and count.`,
        ],
        html: fig(
          felt(
            row(zone('Shakti', row(cards('7h 8c'), say('7 × 8 = 56')))),
            row(zone('Dad', row(cards('9s 6d'), say('9 × 6 = 54')))),
          ),
          `Level 2. 56 beats 54, so Shakti takes all four cards.`,
          'One round'
        ),
      },
    ],
    fair: [
      `The adult flips 3 cards: multiply two of them, then subtract the third. The child flips 2.`,
      `The adult must answer within 3 seconds or lose the round.`,
    ],
    three: `Same rules. The biggest of three answers wins.`,
    variants: [
      { name: 'Subtraction War', text: `Take the smaller card from the bigger. The biggest difference wins.` },
      { name: 'Three-card War', text: `Flip 3. Choose any two to multiply, then add the third. Try to make the biggest answer: with 2, 9 and 7, which two do you multiply?` },
      { name: 'Fraction War', text: `Put the smaller card on top to make a fraction (3 and 4 make ¾). The bigger fraction wins. Use number cards only.` },
      { name: 'Plus-and-Minus War', text: `Black cards are positive, red cards are negative. ${t('7s')} and ${t('5h')} make 7 + (−5) = 2. Biggest total wins.` },
    ],
  },

  {
    id: 'salute',
    name: 'Salute!',
    type: 'math', tags: ['math'],
    players: [3, 2], decks: 1, time: '10 min', level: 1, needs: [],
    icon: 'x 6s 7h',
    blurb: `Two players hold a card to their forehead. The caller says the answer. Work out the card you can't see.`,
    learn: `Working backwards: subtraction from addition, division from times tables`,
    goal: `Win the most cards by naming your own hidden card first.`,
    remind: [
      `Card on your forehead, don't peek`,
      `The caller says the total`,
      `First to name their own card wins both`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number. Take out the Jacks, Queens and Kings (for a harder game, keep them as 11, 12 and 13).`,
      },
      {
        title: 'Set up (three players)',
        steps: [
          `One player is the <b>Caller</b>. Deal the cards evenly to the other two, face down.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `The Caller says "Salute!" Both players take their top card and, without looking, hold it against their forehead facing out.`,
          `The Caller looks at both cards and says the <b>sum</b> (Level 1) or the <b>product</b> (Level 2): "Forty-two!"`,
          `Each player can see the other's card but not their own. Work out yours.`,
          `The first player to say their own card correctly wins both cards.`,
          `Swap roles every 10 rounds so everyone has a turn as Caller. Most cards at the end wins.`,
        ],
        html: fig(
          felt(row(
            `<div class="person">${c('6s')}<span class="head"></span><small>Player A</small><em>Sees 7. Hears 42.<br>42 ÷ 7 = 6. "I'm 6!"</em></div>`,
            `<div class="person"><span class="say">"42!"</span><span class="head" style="margin-top:8px"></span><small>Caller</small><em>Sees 6 and 7</em></div>`,
            `<div class="person">${c('7h')}<span class="head"></span><small>Player B</small><em>Sees 6. Hears 42.<br>42 ÷ 6 = 7</em></div>`,
          )),
          `Level 2. Player A gets there first and wins both cards.`,
          'One round'
        ),
      },
      {
        title: 'Two players: Mystery Card',
        steps: [
          `Player A draws two cards and looks at both secretly.`,
          `A shows one card, keeps the other hidden, and says the sum or product of both: "I'm showing a 4. Together they make 36."`,
          `Player B names the hidden card (9). Right: B keeps both cards. Wrong: A keeps them.`,
          `Swap roles every turn. Most cards when the deck runs out wins.`,
        ],
      },
    ],
    fair: [
      `Adult against child: the child gets sums and the adult gets products.`,
      `The adult counts to 3 silently before answering.`,
    ],
    three: `This is the main version. See above.`,
    variants: [
      { name: 'Difference Salute', text: `The Caller says the difference. Now there can be two answers: if you see a 7 and hear "3", you could be a 4 or a 10. You must name both to win.` },
    ],
  },

  {
    id: 'make-24',
    name: 'Make 24',
    type: 'math', tags: ['math'],
    players: [2, 3], decks: 1, time: '10–15 min', level: 2, needs: ['timer'],
    icon: '4s 7h 8d 8c',
    blurb: `Turn four cards. Use all four numbers once, with + − × ÷, to make 24.`,
    learn: `Mental maths, the order you do things in, trying different routes`,
    goal: `Win the most cards by being first to make 24.`,
    remind: [
      `Turn 4 cards`,
      `Use every number exactly once, + − × ÷`,
      `Tap the table, then explain step by step`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number. Take out Jacks, Queens and Kings (40 cards left).`,
      },
      {
        title: 'How to play',
        steps: [
          `Put the shuffled cards face down in the middle. Turn 4 face up where everyone can see them.`,
          `Everyone looks for a way to make 24 using each of the four numbers exactly once. You can add, subtract, multiply and divide, in any order.`,
          `The first player who finds a way taps the table and explains it one step at a time. If it works, they win the 4 cards.`,
          `If the explanation is wrong, the others keep looking.`,
          `Some sets can't make 24. If nobody has an answer after 1 minute on the timer, put the four cards aside and turn new ones.`,
          `When the pile runs out, most cards wins.`,
        ],
        html: figs(
          fig(
            row(cards('2s 3h 4d Ac')),
            `<div class="work">2 × 3 = 6<br>6 × 4 = 24<br>24 × 1 = 24 <span class="ok">✓</span></div>`,
            'Example 1'
          ),
          fig(
            row(cards('4s 7h 8d 8c')),
            `<div class="work">8 ÷ 8 = 1<br>7 − 1 = 6<br>6 × 4 = 24 <span class="ok">✓</span></div>`,
            'Example 2'
          ),
          fig(
            row(cards('6c 4h 9s 2d')),
            `<div class="work">9 − 6 = 3<br>3 × 4 = 12<br>12 × 2 = 24 <span class="ok">✓</span></div>`,
            'Example 3'
          ),
        ),
      },
      {
        title: 'How to look for an answer',
        text: `Most answers end with one of these steps. Spot a number from the list, then try to turn the other cards into its partner.`,
        html: table(['Last step', 'If you have…', 'make the rest into…'], [
          ['3 × 8', 'an 8', '3'],
          ['4 × 6', 'a 4 or a 6', '6 or 4'],
          ['2 × 12', 'a 2', '12'],
          ['20 + 4', 'a 4', '20'],
          ['30 − 6', 'a 6', '30'],
          ['48 ÷ 2', 'a 2', '48'],
        ]),
      },
    ],
    fair: [
      `The child may use any 3 of the 4 cards.`,
      `The adult waits until 20 seconds have gone on the timer before tapping.`,
    ],
    three: `Same rules.`,
    variants: [
      { name: 'Make 10', text: `Easier. Turn 3 cards and make 10.` },
      { name: 'Royal 24', text: `Harder. Keep Jacks, Queens and Kings as 11, 12 and 13.` },
      { name: 'Team 24', text: `With three players, the child and one adult play as a team against the other adult.` },
    ],
  },

  {
    id: 'target',
    name: 'Target',
    type: 'math', tags: ['math'],
    players: [2, 3], decks: 1, time: '15 min', level: 2, needs: ['timer', 'paper and pencil'],
    icon: '9c 8h As',
    blurb: `Two cards make a target number. Use five more cards and + − × ÷ to get as close as you can before the timer rings.`,
    learn: `Mental maths, estimating, writing working out clearly`,
    goal: `Score 7 points first by getting closest to the target.`,
    remind: [
      `Two cards make the target`,
      `Five working cards, each used once at most`,
      `Write it down before the timer rings`,
      `Closest = 1 point. Exact = 2`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number. Take out Jacks, Queens and Kings.`,
      },
      {
        title: 'Set up',
        steps: [
          `Shuffle the 40 cards into a face-down pile. Each player has paper and a pencil.`,
          `Set the timer for 2 minutes. Once you're used to the game, try 1 minute.`,
        ],
      },
      {
        title: 'Each round',
        steps: [
          `<b>Make the target</b>: turn two cards. The first is the tens, the second is the ones. A 10 counts as 0. If the first card is a 10, turn another. A 7 then a 3 makes 73.`,
          `<b>Turn five more cards</b> face up. These are the working cards.`,
          `<b>Start the timer.</b> Everyone writes a calculation that uses the working cards to get as close to the target as possible. Use each card no more than once; you don't need to use them all. Every step must give a whole number.`,
          `When the timer rings, pencils down. Each player says how close they got, then shows their working.`,
          `Closest scores 1 point. An exact hit scores 2. If players tie, both score.`,
        ],
        html: fig(
          felt(
            row(lab(cards('7h 3s'), 'target'), say('73')),
            row(lab(cards('9c 8h As 4d 6c'), 'working cards')),
          ),
          `<div class="work">9 × 8 = 72<br>72 + 1 = 73 <span class="ok">✓ exact, 2 points</span></div>Another player wrote 6 × 4 × 3… but there is no 3 in the working cards, so that doesn't count. Check each other's working.`,
          'A round'
        ),
      },
      {
        title: 'Winning',
        text: `First to 7 points wins.`,
      },
    ],
    fair: [
      `The child gets 6 working cards. The adult uses only 5.`,
      `The child scores a point for being within 5 of the target, even if the adult is closer.`,
    ],
    three: `Same rules.`,
    variants: [
      { name: 'Big Numbers', text: `Put the Jacks, Queens and Kings back as 25, 50 and 75. Make a three-digit target from three cards (hundreds, tens, ones).` },
    ],
  },

  {
    id: 'number-builder',
    name: 'Number Builder',
    type: 'math', tags: ['math'],
    players: [2, 3], decks: 1, time: '10 min', level: 1, needs: ['paper and pencil'],
    icon: '4s 9h 8d',
    blurb: `As each card is turned, write it in your hundreds, tens or ones box. Closest to the target wins.`,
    learn: `Place value, comparing numbers, thinking about chance`,
    goal: `Score 5 points first by building the number closest to the target.`,
    remind: [
      `One card is turned; everyone uses it`,
      `Write it in one box. No moving it later`,
      `Closest to the target wins the round`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, 2 to 9 = that digit, 10 = 0. Take out Jacks, Queens and Kings.`,
      },
      {
        title: 'Set up',
        steps: [
          `Each player draws three boxes on paper, labelled H (hundreds), T (tens) and O (ones).`,
          `Agree a target. Use 500 for the first game.`,
          `Shuffle the 40 cards into a face-down pile.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Turn one card face up. Every player uses this same card.`,
          `Each player writes that digit in one of their empty boxes. Once it is written, it can't move.`,
          `Turn the next card, then the next, until all three boxes are full.`,
          `Read your numbers out. Closest to the target wins 1 point. Exactly on target wins 2. Ties: both score.`,
        ],
        html: fig(
          felt(
            row(lab(cards('4s 9h 8d'), 'cards in the order turned')),
            divider(),
            row(zone('Shakti: 498', `<div class="pv">${lab(c('4s'), 'H')}${lab(c('9h'), 'T')}${lab(c('8d'), 'O')}</div>`),
                zone('Dad: 489', `<div class="pv">${lab(c('4s'), 'H')}${lab(c('8d'), 'T')}${lab(c('9h'), 'O')}</div>`)),
          ),
          `Target 500. Both put the 4 in the hundreds. Shakti put the 9 in the tens straight away. Dad put the 9 in the ones, hoping another 9 would come for the tens; the 8 came instead. 498 is 2 away; 489 is 11 away. Shakti wins the round.`,
          'One round'
        ),
        text: `<b>Thinking tip</b>: say the target is 500 and the first card is a 5. In the hundreds it gives 5 _ _, somewhere from 500 to 599, and you then hope for 10s (zeros). Or you could put the 5 lower down and hope a 4 comes for the hundreds. Which risk would you take?`,
      },
      {
        title: 'Winning',
        text: `First to 5 points. Change the target each game: 250, 999 (biggest possible), 100, or turn three cards to make a target.`,
      },
    ],
    fair: [
      `Once per game, the child may swap two of their digits after the last card.`,
    ],
    three: `Same rules.`,
    variants: [
      { name: 'Thousands', text: `Four boxes (Th, H, T, O). Target 5,000.` },
      { name: 'Add to 1,000', text: `Draw two rows of three boxes to make two three-digit numbers. Six cards are turned. Add your two numbers: closest to 1,000 wins.` },
      { name: 'Biggest gap', text: `Two rows of three boxes. Subtract the smaller number from the bigger. Biggest difference wins.` },
    ],
  },

  {
    id: 'times-showdown',
    name: 'Times Table Showdown',
    type: 'math', tags: ['math'],
    players: [2], decks: 1, time: '5 min', level: 1, needs: ['chess clock app'],
    icon: '7s 8h',
    blurb: `Times tables against the chess clock. Answer right, tap your clock, and don't run out of time.`,
    learn: `Times tables, quick and accurate`,
    goal: `Have time left on your clock when the cards run out.`,
    remind: [
      `Flip two cards and multiply out loud`,
      `Right? Take the cards and tap the clock`,
      `Wrong? Try again while your time runs`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number. Take out Jacks, Queens and Kings (for 11, 12 and 13 times tables, keep them in).`,
      },
      {
        title: 'Set up',
        steps: [
          `Shuffle the 40 cards and put them face down between the players.`,
          `Open the chess clock app and set 2 minutes for each player, no extra time per move. Put the phone where both of you can reach it.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Player B taps the clock to start Player A's time.`,
          `Player A turns two cards and says the answer out loud: "Seven eights are fifty-six."`,
          `Player B checks. If it is right, A keeps the two cards and taps the clock. Now B's time runs, and B turns two cards.`,
          `If it is wrong, B says "Try again". A's clock keeps running until A gets it right.`,
          `Keep going until the cards run out (10 turns each) or someone's clock reaches 0.`,
        ],
        html: fig(
          col(
            `<div class="clock"><div><b>1:42</b><small>Shakti</small></div><div class="on"><b>1:55</b><small>Dad · running</small></div></div>`,
            row(cards('7s 8h'), say('7 × 8 = 56')),
          ),
          `Dad's clock is running. Once he says 56, he taps his side and Shakti's time starts.`,
          'During a game'
        ),
      },
      {
        title: 'Winning',
        text: `If your clock reaches 0, you lose. If the cards run out first, the player with more time left wins.`,
      },
    ],
    fair: [
      `Give the child 2 minutes and the adult 1 minute.`,
      `The adult flips three cards each turn and multiplies all three.`,
    ],
    three: null,
    variants: [
      { name: 'One table', text: `Put a 7 face up as the table card. Each turn, flip one card and multiply it by 7. Change the table card each game.` },
      { name: 'Adding sprint', text: `Flip three cards and add them.` },
      { name: 'Squares', text: `Flip one card and square it (8 × 8 = 64).` },
    ],
  },

  {
    id: 'casino',
    name: 'Casino',
    type: 'math', tags: ['math', 'strategy'],
    players: [2, 3], decks: 1, time: '20–30 min', level: 3, needs: ['paper and pencil'],
    icon: '9s 5c 4h',
    blurb: `Capture cards from the table by matching numbers or adding them up. An old adding game with real strategy.`,
    learn: `Adding to a total, finding several combinations at once, planning a move ahead`,
    goal: `Score 21 points first by capturing the most valuable cards.`,
    remind: [
      `Play one card from your hand`,
      `Pair it, add to it, build with it, or trail it`,
      `Clear the whole table = a sweep (1 point)`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number. Jacks, Queens and Kings have no number: they can only capture the same face card (a Queen takes a Queen).`,
      },
      {
        title: 'Set up',
        steps: [
          `Deal 4 cards to each player, one at a time. Then deal 4 cards face up in the middle. These are the <b>table cards</b>.`,
          `Put the rest aside face down as the stock.`,
        ],
      },
      {
        title: 'How to play',
        text: `Start with the player left of the dealer. On your turn, play <b>one</b> card from your hand and do one of these four things:`,
        steps: [
          `<b>Pair</b>: take table cards with the same number as your card. A 6 takes every 6 on the table.`,
          `<b>Add</b>: take table cards that add up to your card. A 9 takes a 5 and a 4. One card can take several groups at once: a 9 can take a 9, a 5 + 4 and a 6 + 3 together.`,
          `<b>Build</b>: put your card on a table card to make a total you can capture <i>next</i> turn with a card you are holding. Say the total out loud.`,
          `<b>Trail</b>: if you can't or don't want to do any of those, put your card face up on the table.`,
        ],
        html: figs(
          fig(
            felt(
              row(lab(cards('9d! 5c! 4h! 6s! 3d! Kc~'), 'table')),
              row(lab(c('9s'), 'you play'), say('Take 9, 5 + 4 and 6 + 3')),
            ),
            `With one ${t('9s')}, you capture five cards. ${t('Kc')} stays: only a King can take it.`,
            'Capturing'
          ),
          fig(
            felt(
              row(lab(c('3d'), 'table'), arrow('+'), lab(c('5c!'), 'you play'), say('"Building eight"')),
              row(lab(fan('8h Qs'), 'you still hold')),
            ),
            `You hold an 8, so you put ${t('5c')} on ${t('3d')} to build 8. Next turn your ${t('8h')} takes it. Careful: if the other player has an 8, they can take your build first.`,
            'Building'
          ),
        ),
        bullets: [
          `Captured cards go face down in a pile in front of you.`,
          `<b>Sweep</b>: if you capture every card on the table, that's a sweep. Turn one of your captured cards face up to remember it.`,
          `While you have a build on the table, you can't trail. Capture it, or make another capture or build.`,
          `When everyone's hand is empty, deal 4 more to each player (none to the table). When the stock is gone and the last cards are played, whoever captured last takes any cards left on the table.`,
        ],
      },
      {
        title: 'Scoring each round',
        html: table(['What you captured', 'Points'], [
          ['Most cards (27 or more)', '3'],
          ['Most spades (7 or more)', '1'],
          [`Big Casino: ${t('10d')}`, '2'],
          [`Little Casino: ${t('2s')}`, '1'],
          ['Each Ace', '1'],
          ['Each sweep', '1'],
        ]),
        text: `If players tie for most cards or most spades, nobody gets those points. Keep score on paper. First to 21 wins.`,
      },
    ],
    fair: [
      `For the first games, leave out building: just pair, add and trail.`,
      `Play the first game with hands face up and point out every capture each player could make.`,
    ],
    three: `Deal 4 cards each. The "most cards" and "most spades" points go to whoever has more than each of the others; with three players that can be as few as 18 cards or 5 spades.`,
    variants: [
      { name: 'Raising a build', text: `Once building is easy: you may add a card from your hand to any build, yours or the other player's, to make a bigger total you hold. A build of 6 plus your 2 becomes a build of 8.` },
    ],
  },
];

