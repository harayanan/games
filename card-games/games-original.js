// Ten games made up for this site (original: true). Same shape as games.js.
// Balance numbers quoted in the rules (win rates, best stopping point) come from
// computer simulations, not table play.

const BUST_RISK = table(['Cards already in your line', 'Chance the next card busts you'], [
  ['1', '6% (about 1 in 17)'], ['2', '12% (about 1 in 8)'], ['3', '18% (about 1 in 5)'],
  ['4', '25% (1 in 4)'], ['5', '32% (about 1 in 3)'], ['6', '39% (about 2 in 5)'],
]);

GAMES.push(

  {
    id: 'treasure-dive',
    original: true,
    name: 'Treasure Dive',
    type: 'strategy', tags: ['strategy', 'math'],
    players: [2, 3], decks: 1, time: '15 min', level: 1, needs: ['paper and pencil'],
    icon: '4s 9h Jc 9c',
    blurb: `Turn cards one at a time into your dive. Stop and bank your treasure before the same number turns up twice.`,
    learn: `Adding a running total, judging risk, the chance of something happening`,
    goal: `Be the first to bank 100 points of treasure.`,
    remind: [
      `Turn one card at a time into your line`,
      `Same number twice = bust, score 0`,
      `Stop whenever you like and bank the total`,
      `5 or more cards banked = +10 bonus`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number, Jack, Queen, King = 10.`,
      },
      {
        title: 'How to play',
        steps: [
          `Shuffle and put the deck face down as the stock. Each player has a column on the score sheet.`,
          `On your turn, turn the top card of the stock face up in front of you. This starts your <b>dive</b>.`,
          `Choose: <b>dive deeper</b> (turn another card and add it to the line) or <b>surface</b> (stop).`,
          `<b>Bust</b>: if the card you turn has the same number or letter as a card already in your line (a second 9, a second Jack), the dive fails. All your line goes to the discard pile and you score 0 this turn.`,
          `<b>Surface</b>: add up your line and write the total on the score sheet. If your line has 5 or more cards, add a 10-point bonus. Then put the cards on the discard pile.`,
          `Play passes to the left. When the stock runs out, shuffle the discard pile to make a new one.`,
        ],
        html: figs(
          fig(
            felt(row(lab(cards('4s 9h Jc 2d'), 'your line'), arrow(), lab(c('9c!'), 'next card'))),
            `${t('9c')} matches the ${t('9h')} already in the line. <span class="no">Bust</span>: this turn scores 0. Surfacing before turning it would have banked 4 + 9 + 10 + 2 = 25.`,
            'A bust'
          ),
          fig(
            felt(row(lab(cards('3d Kh 8s Ac 6h'), 'your line'), say('Surface!'))),
            `<div class="work">3 + 10 + 8 + 1 + 6 = 28<br>5 cards: +10 bonus<br>Bank <b>38</b></div>`,
            'Surfacing with a bonus'
          ),
        ),
      },
      {
        title: 'How risky is the next card?',
        text: `Each number appears four times in the deck, so every new number in your line makes a bust more likely:`,
        html: BUST_RISK + `<div class="box"><h3>Thinking tip</h3>Over many turns, surfacing at 5 cards (with the bonus) scores the most. When you are far behind near the end, it can be worth diving deeper anyway. Ask: what do I need to catch up?</div>`,
      },
      {
        title: 'Winning',
        text: `When a player reaches 100 or more, finish the round so everyone has had the same number of turns. Highest total wins.`,
      },
    ],
    fair: [
      `The child gets the +10 bonus for 4 cards; the adult needs 5.`,
      `The adult plays to 120.`,
    ],
    three: `Same rules.`,
    variants: [
      { name: 'Life jacket', text: `Each player gets one coin at the start of the game. Once per game, hand it in to ignore a bust: throw away the matching card and keep diving.` },
    ],
  },

  {
    id: 'round-numbers',
    original: true,
    name: 'Round Numbers',
    type: 'math', tags: ['math', 'strategy'],
    players: [2, 3], decks: 1, time: '15 min', level: 2, needs: ['beans or coins for points'],
    icon: '3s 7d Qh',
    blurb: `Everyone shares one running total. Add, subtract, double or halve it to land exactly on 10, 20, 30 and so on.`,
    learn: `Adding and subtracting in your head, doubling and halving, thinking about what you leave for the next player`,
    goal: `Collect the most points by landing the total on round numbers.`,
    remind: [
      `Play one card: add it or take it away`,
      `Queen doubles, King halves`,
      `Land on 10, 20, 30… = 1 point. 50 = 2. 100 = 3`,
      `Say the new total out loud`,
    ],
    sections: [
      {
        title: 'Cards you need',
        text: `Take out the four Jacks. Ace = 1 and number cards = their number. Queens and Kings have special jobs (below). That leaves 48 cards.`,
      },
      {
        title: 'Set up',
        steps: [
          `Deal 4 cards to each player. The rest is the stock.`,
          `The total starts at 0. Put a bowl of beans or coins in the middle for points.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `On your turn, play one card face up on the discard pile and change the total:
            <ul>
              <li><b>Number card</b>: add it <i>or</i> take it away. You choose.</li>
              <li><b>Queen</b>: double the total.</li>
              <li><b>King</b>: halve the total. If it is odd, round down (15 → 7).</li>
            </ul>`,
          `The total can never go below 0 or above 100.`,
          `Say the new total out loud, then draw back up to 4 cards.`,
          `<b>Points</b>: land exactly on 10, 20, 30, 40, 60, 70, 80 or 90 to take 1 bean. Land on 50 for 2 beans. Land on 100 for 3 beans, and the total goes back to 0. (Landing on 0 doesn't score.)`,
          `If someone says a wrong total and another player catches it, the wrong player gets no bean for that turn.`,
        ],
        html: fig(
          felt(
            row(lab(say('37'), 'total now')),
            divider(),
            row(lab(fan('3s! 7d! Qh 5c'), 'your hand')),
          ),
          `<b>${t('3s')}</b>: 37 + 3 = 40, a bean. <b>${t('7d')}</b>: 37 − 7 = 30, also a bean. ${t('Qh')} would make 74, and ${t('5c')} makes 42 or 32: no bean.`,
          'Finding a round number'
        ),
      },
      {
        title: 'Winning',
        text: `When the stock runs out, the game ends. Most beans wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>Look at what you leave for the next player. A total ending in 5 (like 35) can only reach a round number with a 5, which is hard. But watch out: a Queen doubles 35 to 70. A total ending in 2 or 8 gives them two chances (a 2 or an 8).</div>`,
      },
    ],
    fair: [
      `The child holds 5 cards, the adult 4.`,
      `The child may ask "Can I score?" once per round and the adult must say yes or no.`,
    ],
    three: `Same rules.`,
    variants: [
      { name: 'Jacks back in', text: `Add the Jacks: a Jack takes 10 off or adds 10, and makes the next player miss a turn.` },
      { name: 'Hundreds', text: `Play to 1,000 and score on multiples of 100. Number cards count as tens (a 7 is 70).` },
    ],
  },

  {
    id: 'turnabout',
    original: true,
    name: 'Turnabout',
    type: 'strategy', tags: ['strategy'],
    players: [2], decks: 1, time: '5 min', level: 1, needs: [],
    icon: 'Qd 9h 4s',
    blurb: `Place cards on a 3 × 3 grid. A higher card turns the other player's smaller neighbours around to your side.`,
    learn: `Comparing numbers, choosing where to put things, thinking about the other player's next move`,
    goal: `Own more of the grid than the other player when it is full.`,
    remind: [
      `Place one card in an empty square`,
      `Upright = Player 1, sideways = Player 2`,
      `Beat a neighbour (up, down, left, right) to turn it`,
      `Ace beats King`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Shuffle and deal 5 cards to each player. Put the rest away.`,
          `You need room for a 3 × 3 grid of cards in the middle. Leave enough space between squares for a card turned sideways.`,
          `Player 1's cards point <b>upright</b> (the long side points at the players). Player 2's cards go <b>sideways</b>. Ownership is shown only by the way a card is turned.`,
        ],
      },
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number, Jack = 11, Queen = 12, King = 13. One exception: an <b>Ace beats a King</b>.`,
      },
      {
        title: 'How to play',
        steps: [
          `Players take turns. On your turn, put one card from your hand into any empty square, turned your way.`,
          `Look at the cards directly next to it: above, below, left and right (not corners).`,
          `Every one of those that belongs to the other player and has a <b>lower</b> number is captured: turn it to your way. Equal numbers do nothing.`,
          `Captured cards don't capture anything themselves. Only the card you just placed checks its neighbours.`,
          `A captured card can be captured back later by a higher card placed next to it.`,
        ],
        html: figs(
          fig(
            felt(gridN(3, [
              '', c('4s>'), '',
              c('Qd>'), slot('play<br>here'), c('7c'),
              '', '', '',
            ], 'sq')),
            `Shakti plays upright. Dad's cards are sideways.`,
            'Before'
          ),
          fig(
            felt(gridN(3, [
              '', c('4s!'), '',
              c('Qd>'), c('9h!'), c('7c'),
              '', '', '',
            ], 'sq')),
            `Shakti plays ${t('9h')} in the middle. ${t('4s')} is lower, so it turns upright: now hers. ${t('Qd')} is higher and stays Dad's. ${t('7c')} was already hers.`,
            'After'
          ),
        ),
      },
      {
        title: 'Winning',
        text: `The grid is full after 9 cards: Player 1 has placed 5 and Player 2 has placed 4. Player 2 counts their last card in hand as 1 extra point. Count the cards turned your way. Higher score wins; 5–5 is a draw. Swap who goes first each game.`,
        html: `<div class="box"><h3>Thinking tip</h3>A corner card has only 2 neighbours, an edge card 3, the middle 4. A King in a corner is very hard to take (only an Ace can). Save a high card for late in the game when it can turn several cards at once.</div>`,
      },
    ],
    fair: [
      `Deal the child 7 cards; they choose which 5 to use.`,
      `Play with the adult's hand face up.`,
    ],
    three: null,
    variants: [
      { name: 'Open hands', text: `Both players' hands face up. Now nothing is hidden and every move can be thought through, like chess.` },
      { name: 'Big board', text: `A 4 × 4 grid with 8 cards each (16 squares). Player 2 has no extra point at the end; ties are draws.` },
      { name: 'On the clock', text: `Chess clock app, 1 minute each for the whole game.` },
    ],
  },

  {
    id: 'grab-pairs',
    original: true,
    name: 'Grab Pairs',
    type: 'speed', tags: ['speed', 'math'],
    players: [2, 3], decks: 1, time: '5–10 min', level: 1, needs: [],
    icon: '6c 4h',
    blurb: `Twelve cards face up. Everyone races to grab two that add up to the target.`,
    learn: `Number bonds to 10 and beyond, spotting pairs quickly`,
    goal: `Collect the most pairs.`,
    remind: [
      `No turns: everyone looks at once`,
      `Grab two cards that make the target and say the sum`,
      `Refill the gaps`,
      `Wrong grab: give a pair back`,
    ],
    sections: [
      {
        title: 'Cards you need',
        text: `Ace = 1, number cards = their number. Take out the Jacks, Queens and Kings.`,
      },
      {
        title: 'Set up',
        steps: [
          `Shuffle the 40 cards. Lay 12 face up in 3 rows of 4. The rest is the stock.`,
          `Choose the target. First game: <b>10</b>.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Someone says "Go!" Everyone looks at the grid at the same time.`,
          `When you see two cards that add up to the target, grab them with one hand and say the sum out loud: "6 and 4!" Keep the pair in front of you.`,
          `The grabber fills the two gaps from the stock straight away.`,
          `If two players touch the same card, the first hand on it gets it.`,
          `<b>Wrong grab</b>: put the cards back and give one of your pairs to the bottom of the stock.`,
          `<b>Stuck</b>: if everyone agrees there is no pair, deal 3 more cards face up next to the grid.`,
        ],
        html: fig(
          felt(gridN(4, [c('6c!'), c('9d'), c('2s'), c('7h!'),
                         c('Ad'), c('4h!'), c('8c'), c('5s'),
                         c('3d!'), c('10s'), c('9h'), c('2c')])),
          `Target 10. ${t('6c')} + ${t('4h')} and ${t('7h')} + ${t('3d')} are there. So are ${t('9d')} + ${t('Ad')} and ${t('8c')} + ${t('2s')}. Once a card is grabbed it's gone, so the fastest eyes take the most.`,
          'Find the pairs'
        ),
      },
      {
        title: 'Winning',
        text: `The game ends when the stock is empty and nobody can find another pair. Most pairs wins.`,
      },
    ],
    fair: [
      `The adult must grab three cards that make the target; the child grabs two.`,
      `The adult uses their other hand.`,
    ],
    three: `Same rules. It gets loud.`,
    variants: [
      { name: 'Moving target', text: `Before the game, turn one card and add 10 to it: a 4 makes the target 14.` },
      { name: 'Triples', text: `Grab three cards that add up to 20.` },
      { name: 'Difference pairs', text: `Grab two cards with a difference of 3 (9 and 6, 4 and 1).` },
    ],
  },

  {
    id: 'dragons-hoard',
    original: true,
    name: "Dragon's Hoard",
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 1, time: '10 min', level: 2, needs: ['paper and pencil'],
    icon: '7d Ks 7h',
    blurb: `Bid secretly with your gold cards for treasure. Highest bid wins the treasure; lowest bid gets the dragon.`,
    learn: `Bluffing, guessing what the other player will do, remembering which cards have been used`,
    goal: `Have the most treasure points after 13 rounds.`,
    remind: [
      `Turn a treasure`,
      `Both pick a gold card and show together`,
      `Diamond: highest bid wins. Exact bid = card back`,
      `Dragon: lowest bid takes it (−5)`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Player 1 takes all 13 hearts. Player 2 takes all 13 clubs. These are your <b>gold</b>: Ace = 1 up to King = 13.`,
          `Make the <b>treasure pile</b>: the ten diamonds from Ace to 10, plus the Jack, Queen and King of spades (the three <b>dragons</b>). Shuffle these 13 cards and put them face down.`,
          `Put all other cards away.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `Turn over the top treasure card.`,
          `Each player chooses one gold card from their hand and puts it face down. When both are ready, turn them over together.`,
          `<b>Diamond</b>: the higher bid wins it. The diamond is worth its number (Ace = 1, 10 = 10).`,
          `<b>Exact change</b>: if the winning bid is exactly the diamond's number, the winner takes their gold card back into their hand.`,
          `<b>Dragon</b> (a spade): the <i>lower</i> bid takes it. Each dragon is worth −5.`,
          `<b>Tie</b>: nobody takes the treasure. Put it aside.`,
          `Used gold cards go face up in a row in front of their owner, so both players can see what's been spent.`,
        ],
        html: figs(
          fig(
            felt(row(lab(c('7d'), 'treasure'), lab(c('7h!'), 'Shakti bids'), lab(c('5c'), 'Dad bids'))),
            `Shakti wins the ${t('7d')} (7 points). Her bid was exactly 7, so she takes ${t('7h')} back to use again.`,
            'Exact change'
          ),
          fig(
            felt(row(lab(c('Ks'), 'dragon!'), lab(c('2h!'), 'Shakti bids'), lab(c('4c'), 'Dad bids'))),
            `A dragon. Shakti's 2 is the lower bid, so she takes it: −5. She saved her big cards, though.`,
            'Dragon'
          ),
        ),
      },
      {
        title: 'Winning',
        text: `After all 13 treasures, add your diamonds and take off 5 for each dragon. Highest score wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>The 10 diamonds are worth 55 points in total, and you have 13 gold cards for 13 rounds. Spending your King on a 2 of diamonds wastes it. When a dragon comes up, the other player will probably throw a low card, so a middle card might be enough to stay safe.</div>`,
      },
    ],
    fair: [
      `The child may change their bid once per game, after seeing the adult's bid.`,
      `The child's dragons count −3, the adult's −5.`,
    ],
    three: `With a second deck, the third player takes all 13 hearts from it. If the top bids tie, nobody gets the treasure; if the lowest bids tie on a dragon, nobody gets it either.`,
    variants: [
      { name: 'Royal treasure', text: `Add the Jack, Queen and King of diamonds (worth 11, 12, 13) and leave out three low diamonds, so the treasure pile stays at 13 cards.` },
    ],
  },

  {
    id: 'safe-cracker',
    original: true,
    name: 'Safe Cracker',
    type: 'strategy', tags: ['strategy', 'math'],
    players: [2, 3], decks: 1, time: '15 min', level: 2, needs: ['paper and pencil', 'coins (optional)'],
    icon: 'x x x',
    blurb: `Hide a three-card code. The other player guesses, and you tell them how close they are with clicks and clunks.`,
    learn: `Logical thinking, using clues, crossing out what can't be true`,
    goal: `Crack the other player's code in fewer guesses than they need for yours.`,
    remind: [
      `Guess three different numbers`,
      `● click = right number, right place`,
      `○ clunk = right number, wrong place`,
      `Fewest guesses wins`,
    ],
    sections: [
      {
        title: 'Cards you need',
        text: `Only number cards Ace to 9 (Ace = 1). For a first game, use only Ace to 5.`,
      },
      {
        title: 'How to play',
        steps: [
          `The <b>setter</b> picks 3 cards with different numbers and lays them face down in a row: left, middle, right. This is the code. The setter can look at them again whenever they need to.`,
          `The <b>cracker</b> writes a guess on paper: three different numbers in order, like <b>1 2 3</b>.`,
          `The setter checks the guess and gives clues, without saying which number each clue is about:
            <ul>
              <li>a <b>click ●</b> for each number that is in the code and in the right place;</li>
              <li>a <b>clunk ○</b> for each number that is in the code but in a different place.</li>
            </ul>
            Write the clues next to the guess. (Or use coins: heads for a click, tails for a clunk.)`,
          `Keep guessing until you get ● ● ●. Count how many guesses it took.`,
          `Turn the code over to check the clues were right. Then swap roles.`,
        ],
        html: fig(
          col(
            row(lab(cards('3c 7h As'), 'the code (shown at the end)')),
            table(['Guess', 'Clues', 'What the cracker can work out'], [
              ['1 2 3', '<span class="mark">○○</span>', 'Two of 1, 2, 3 are in the code, but not where they were guessed.'],
              ['3 1 4', '<span class="mark">●○</span>', 'One right place and one wrong place.'],
              ['3 5 1', '<span class="mark">●●</span>', '3 on the left and 1 on the right fit everything so far. 5 is out.'],
              ['3 7 1', '<span class="mark">●●●</span>', 'Cracked in 4 guesses.'],
            ]),
          ),
          `After guess 3 the code must be 3 _ 1. The middle can't be 2, 4 or 5, because each of those would have given different clues earlier. That leaves 6, 7, 8 or 9, and this cracker tried 7 first.`,
          'A game, guess by guess'
        ),
      },
      {
        title: 'Winning',
        text: `Play two rounds each. Add up your guesses. Fewest total wins.`,
      },
    ],
    fair: [
      `The adult cracks codes from Ace to 9; the child cracks codes from Ace to 5.`,
      `The adult has a 4-card code to crack.`,
    ],
    three: `Two players work as a team to crack the third player's code, talking it through out loud. Rotate who sets the code.`,
    variants: [
      { name: 'Four-lock safe', text: `A 4-card code, numbers Ace to 9.` },
      { name: 'Repeat numbers', text: `The code may use the same number twice (two different 7s). Much harder.` },
    ],
  },

  {
    id: 'bridge-builders',
    original: true,
    name: 'Bridge Builders',
    type: 'strategy', tags: ['strategy', 'math'],
    players: [2, 3], decks: 1, time: '10 min', level: 1, needs: ['3 beans or coins'],
    icon: '7s 9h 8c',
    blurb: `A team game: everyone wins or loses together. Build a bridge of cards, each one or two away from the last.`,
    learn: `Counting on and back by 1 and 2, planning as a team, helping without telling`,
    goal: `As a team, build a bridge of 15 cards before it cracks three times.`,
    remind: [
      `Next card must be 1 or 2 away from the last`,
      `Stuck? Say "Help!" Someone else may play`,
      `Nobody can play: crack (lose a bean)`,
      `Don't say your numbers`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number, Jack = 11, Queen = 12, King = 13. No wrapping round: Ace and King are not next to each other.`,
      },
      {
        title: 'Set up',
        steps: [
          `Shuffle. Deal 4 cards to each player. The rest is the stock.`,
          `Turn one card face up on the table. This is the first plank of the bridge.`,
          `Put 3 beans in the middle. They are the bridge's strength.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `On your turn, add one card from your hand to the end of the bridge. It must be <b>1 or 2 higher or lower</b> than the last plank. The same number is not allowed.`,
          `Draw a card to get back to 4.`,
          `If you can't play, say "Help!" Any other player may play one card for you (and draws a card).`,
          `If nobody can play: <b>crack</b>. Take away a bean, then turn the top card of the stock onto the bridge as the next plank, whatever it is.`,
          `<b>Talking rule</b>: you may not say the numbers in your hand or show your cards. You may say things like "I can help", "I'm stuck", or "Try to keep it in the middle".`,
        ],
        html: fig(
          felt(
            row(lab(cards('7s 9h 8c 6d'), 'the bridge so far')),
            divider(),
            row(lab(fan('5c! 4h! 8s! Kd~'), 'your hand')),
          ),
          `The last plank is ${t('6d')}. You can play ${t('5c')} or ${t('4h')} (1 or 2 lower) or ${t('8s')} (2 higher). ${t('Kd')} doesn't fit. Middle numbers keep more choices open for your team: ${t('5c')} or ${t('8s')} are safer than ${t('4h')}.`,
          'Which planks fit?'
        ),
      },
      {
        title: 'Winning and losing',
        text: `The team wins when the bridge is 15 cards long. The team loses when the third bean is taken, or if the stock runs out first.`,
        html: table(['Difficulty', '2 players', '3 players'], [
          ['Starter', '15 cards (wins about 3 games in 4)', '20 cards (about 9 in 10)'],
          ['Harder', '20 cards (about half)', '25 cards (about 4 in 5)'],
        ]) + `<p>Win rates are from computer simulations of careful play; expect to lose more at first.</p>`,
      },
    ],
    fair: [
      `It is a team game, so the adult can coach out loud, as long as no numbers are said.`,
    ],
    three: `With three, the bridge is easier: start at 20 cards.`,
    variants: [
      { name: 'Silent build', text: `No talking at all, not even "Help!" Raise a hand to ask for help instead.` },
      { name: 'Colour bridge', text: `Planks must also alternate red and black. Much harder: allow 5 beans.` },
    ],
  },

  {
    id: 'bunny-race',
    original: true,
    name: 'Bunny Race',
    type: 'strategy', tags: ['strategy'],
    players: [2, 3], decks: 1, time: '15 min', level: 1, needs: ['a small token per player (button, coin, toy)'],
    icon: '3h Qh 9s',
    blurb: `Hop your bunny along a track of face-down cards. Hearts push you forward, spades send you back.`,
    learn: `Counting spaces, choosing which card to use, remembering what's on the track`,
    goal: `Be the first bunny to reach the carrot at the end of the track.`,
    remind: [
      `Play a movement card (A–5) and hop`,
      `Turn over the card you land on`,
      `♥ +2 · ♠ −2 · ♦ extra card · ♣ mud`,
      `Land on a bunny: bump it back 1`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Sort the deck into two piles. <b>Movement cards</b>: every Ace, 2, 3, 4 and 5 (20 cards). <b>Track cards</b>: everything else (6 to King).`,
          `Shuffle the track cards and lay 20 of them face down in a winding path across the table. Put the rest away.`,
          `Put any small object at the end as the <b>carrot</b> (the finish). Each player's token (their bunny) starts just before the first track card.`,
          `Shuffle the movement cards and deal 3 to each player. The rest is the movement stock.`,
        ],
      },
      {
        title: 'How to play',
        steps: [
          `On your turn, play one movement card and move your bunny that many track cards forward (Ace = 1).`,
          `Draw a new movement card. When the movement stock runs out, shuffle the played ones.`,
          `If you land on a face-down card, turn it face up. Then, whether it was new or already face up, do what its suit says:`,
          `If you land on a card where another bunny is sitting, that bunny is bumped back 1 card (it doesn't do that card's action).`,
        ],
        html: table(['You land on…', 'What happens'], [
          ['♥ Heart', 'Clover: hop forward 2 more. Don\'t do the action of the card you land on.'],
          ['♠ Spade', 'Fox: hop back 2. Don\'t do the action of the card you land on.'],
          ['♦ Diamond', 'Carrot patch: draw an extra movement card. Your hand can grow.'],
          ['♣ Club', 'Mud: on your next turn you move 1 less than your card says.'],
        ]) + fig(
          felt(row(
            lab(c('6c'), token('Shakti', 'a')), lab(c('x'), '+1'), lab(c('9h'), '+2'), lab(c('x'), token('Dad', 'b')), lab(c('Qs'), '+4'), lab(c('7d'), '+5'),
          ), row(lab(fan('2c 3d 5h'), 'Shakti\'s hand'))),
          `With the <b>2</b>, Shakti lands on ${t('9h')} and hops 2 more to ${t('Qs')}; a hop doesn't set off the fox. With the <b>3</b>, she lands on Dad and bumps him back to ${t('9h')}. With the <b>5</b>, she reaches ${t('7d')} and draws an extra card.`,
          'Choosing a hop'
        ),
      },
      {
        title: 'Winning',
        text: `The first bunny to move past the last track card reaches the carrot and wins. You don't need the exact number.`,
      },
    ],
    fair: [
      `The child holds 4 movement cards, the adult 3.`,
      `The child ignores the first fox they land on.`,
    ],
    three: `Same rules. More bumping.`,
    variants: [
      { name: 'Exact finish', text: `You must land exactly on the carrot. If your card is too big, bounce back the extra spaces.` },
      { name: 'Long track', text: `Use 28 track cards for a longer race.` },
    ],
  },

  {
    id: 'ruby-hunt',
    original: true,
    name: 'Ruby Hunt',
    type: 'strategy', tags: ['strategy'],
    players: [2], decks: 1, time: '15 min', level: 2, needs: ['a standing book or cereal box each', 'paper and pencil'],
    icon: 'Ad Kh 4c',
    blurb: `Hide four red rubies among black rocks. Find the other player's rubies using clues about how many are nearby.`,
    learn: `Grid references, logical clues, counting neighbours`,
    goal: `Find all four of the other player's rubies first.`,
    remind: [
      `Call a square, like B3`,
      `"Ruby!" = red card. Go again`,
      `"Rock, 2" = black card with 2 rubies touching it`,
      `Mark everything on your paper grid`,
    ],
    sections: [
      {
        title: 'Set up',
        steps: [
          `Each player takes 4 red cards (the <b>rubies</b>) and 12 black cards (the <b>rocks</b>).`,
          `Stand a book or cereal box in front of you as a screen. Behind it, lay your 16 cards face up in a 4 × 4 grid. Put the rubies wherever you like.`,
          `Rows are A, B, C, D from the top; columns are 1, 2, 3, 4 from the left.`,
          `On paper, draw an empty 4 × 4 grid with the same labels. This is where you record what you find on the other player's board.`,
        ],
        html: fig(
          felt(gridN(5, [
            '', '<b>1</b>', '<b>2</b>', '<b>3</b>', '<b>4</b>',
            '<b>A</b>', c('3c'), c('Ad'), c('8s'), c('5c'),
            '<b>B</b>', c('Js'), c('2c!'), c('9c'), c('Kh'),
            '<b>C</b>', c('7h'), c('10s'), c('4c'), c('6s'),
            '<b>D</b>', c('Qc'), c('2s'), c('9d'), c('8c'),
          ])),
          `Rubies at A2, B4, C1 and D3. If the other player calls <b>B2</b>, the answer is "<b>Rock, 2</b>": of the eight squares around B2, A2 and C1 hold rubies.`,
          'Your hidden board (behind the screen)'
        ),
      },
      {
        title: 'How to play',
        steps: [
          `Take turns. On your turn, call a square on the other player's board: "B2".`,
          `They look and answer honestly:
            <ul>
              <li>"<b>Ruby!</b>" if it's a red card. You get another turn straight away.</li>
              <li>"<b>Rock, 2</b>" (or whatever the number is) if it's black. The number is how many rubies are in the squares touching it, including corners.</li>
            </ul>`,
          `Write each answer on your paper grid: R for a ruby, the number for a rock.`,
          `Use the numbers to work out where rubies must be, and where they can't be.`,
        ],
        html: `<div class="box"><h3>Thinking tip</h3>"Rock, 0" is useful: every square around it is a rock, so don't waste turns calling them. A corner square has only 3 neighbours, so "Rock, 3" in a corner tells you exactly where three rubies are.</div>`,
      },
      {
        title: 'Winning',
        text: `The first to find all four rubies wins. If the first player finishes, the second player gets one more turn to tie. At the end, both lift their screens to check the clues.`,
      },
    ],
    fair: [
      `The child calls two squares per turn.`,
      `The child may ask one "Is this a rock?" question per game without using a turn.`,
    ],
    three: null,
    variants: [
      { name: 'Big mine', text: `A 5 × 5 grid (rows A–E) with 5 rubies each. Needs two decks: each player uses 5 red and 20 black cards.` },
      { name: 'Row and column clues', text: `Easier: instead of neighbours, "Rock, 2" means 2 rubies are in the same row or column.` },
    ],
  },

  {
    id: 'card-cricket',
    original: true,
    name: 'Card Cricket',
    type: 'strategy', tags: ['strategy', 'math'],
    players: [2, 3], decks: 1, time: '15 min', level: 1, needs: ['paper and pencil'],
    icon: '10h 4c 6s',
    blurb: `One player bats, one bowls. Both pick a card in secret; the difference decides the runs, or the wicket.`,
    learn: `Subtraction, keeping a scorecard, planning when to use your best cards`,
    goal: `Score more runs than the other player in your innings.`,
    remind: [
      `Both pick a card, show together`,
      `Same number = OUT (bowled)`,
      `Batter higher = runs from the difference`,
      `Bowler 7+ higher = OUT (caught)`,
    ],
    sections: [
      {
        title: 'Card values',
        text: `Ace = 1, number cards = their number, Jack = 11, Queen = 12, King = 13.`,
      },
      {
        title: 'Set up',
        steps: [
          `Toss a coin to decide who bats first. Draw a scorecard: one line per ball, with runs and wickets.`,
          `An <b>innings</b> lasts 2 overs (6 balls each) or until 3 wickets fall, whichever comes first.`,
          `At the start of each over, shuffle what's left of the deck and deal 6 cards each to the batter and the bowler. You must use all 6 during the over, one per ball, so think about the order.`,
        ],
      },
      {
        title: 'Each ball',
        steps: [
          `The bowler and batter each choose one card from their hand and put it face down.`,
          `Turn them over together. Work out what happened from the table below.`,
          `Write it on the scorecard. Both cards are now out of the game.`,
        ],
        html: table(['Cards', 'Result'], [
          ['Same number', '<span class="no">OUT</span> (bowled)'],
          ['Batter higher by 1 or 2', '1 run'],
          ['Batter higher by 3 or 4', '2 runs'],
          ['Batter higher by 5 or 6', '4 runs (a four)'],
          ['Batter higher by 7 or more', '6 runs (a six)'],
          ['Bowler higher by 1 to 6', 'Dot ball, no runs'],
          ['Bowler higher by 7 or more', '<span class="no">OUT</span> (caught)'],
        ]) + figs(
          fig(felt(row(lab(c('10h'), 'batter'), lab(c('4c'), 'bowler'))), `10 − 4 = 6: <b>four runs</b>.`, 'Boundary'),
          fig(felt(row(lab(c('3d'), 'batter'), lab(c('Js'), 'bowler'))), `11 − 3 = 8, bowler higher by 7 or more: <span class="no">caught</span>.`, 'Wicket'),
          fig(felt(row(lab(c('8s'), 'batter'), lab(c('8h'), 'bowler'))), `Same number: <span class="no">bowled</span>.`, 'Wicket'),
        ),
      },
      {
        title: 'Winning',
        text: `After the first innings, swap: the bowler now bats and needs one run more than the first score. If they pass it, they win straight away. One deck covers all four overs (48 cards). If the scores end level, shuffle every card back in and play a super over: one over each, highest score wins.`,
        html: `<div class="box"><h3>Thinking tip</h3>Batting: a low card against the bowler's King is out, so play your low cards when you think the bowler is playing low too. Bowling: you can't stop runs every ball, but matching the batter's number gets a wicket. If the batter has a King left late in the over, a King of your own would bowl them.</div>`,
      },
    ],
    fair: [
      `The child's innings lasts 3 overs, the adult's 2.`,
      `The child is only out when caught, not when the numbers are equal.`,
    ],
    three: `Everyone bats once. The player on the batter's left bowls one over, and the other player bowls the second. Highest score wins. Shuffle the whole deck before each innings.`,
    variants: [
      { name: 'Test match', text: `Two innings each, 5 wickets per innings. Shuffle the whole deck at the start of each innings.` },
      { name: 'Free hit', text: `After a six, the next ball can't be a wicket.` },
    ],
  },
);
