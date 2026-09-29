---
title: Fun
permalink: /fun/
---

<header class="page-heading">
  <!-- <h1>Chess puzzles</h1> -->
  <p class="lede">Chess puzzle! Take a <a href="https://www.youtube.com/watch?v=GaCW_NtCUMg">stab</a>.</p>
</header>

<section class="puzzle">
  <div class="puzzle-board-col">
    <div id="lichess-board" class="lichess-board" data-min-rating="{{ site.puzzle_min_rating }}" aria-label="Daily Lichess chess puzzle"></div>
  </div>

  <div class="puzzle-side">
    <p class="list-card-meta" id="puzzle-label">Daily puzzle</p>
    <p class="puzzle-turn" id="puzzle-turn">Loading&hellip;</p>

    <div class="puzzle-meta" id="puzzle-meta"></div>

    <p class="puzzle-status" id="puzzle-status" role="status" aria-live="polite">Loading from Lichess&hellip;</p>

    <div class="puzzle-actions">
      <button class="button" type="button" data-action="hint">Hint</button>
      <button class="button" type="button" data-action="solve">Solution</button>
      <button class="button" type="button" data-action="reset">Reset</button>
      <button class="button" type="button" data-action="next">Harder puzzle</button>
    </div>

    <p class="puzzle-credit">
      <a id="puzzle-lichess-link" href="https://lichess.org/training/daily" hidden>Open on Lichess &rarr;</a>
    </p>
  </div>
</section>

<div id="promotion-picker" class="promotion-picker" hidden role="dialog" aria-modal="true" aria-label="Choose promotion piece">
  <div class="promotion-picker-inner">
    <p>Promote to</p>
    <div class="promotion-options">
      <button type="button" data-piece="q">Queen</button>
      <button type="button" data-piece="r">Rook</button>
      <button type="button" data-piece="b">Bishop</button>
      <button type="button" data-piece="n">Knight</button>
    </div>
  </div>
</div>

<noscript>
  <p>The board is drawn in the browser from the Lichess API, so it needs JavaScript.
  You can solve the daily puzzle at <a href="https://lichess.org/training/daily">lichess.org/training/daily</a>.</p>
</noscript>

<p class="puzzle-credit">Board by <a href="https://github.com/lichess-org/chessground">Chessground</a>, rules by <a href="https://github.com/jhlywa/chess.js">chess.js</a>, puzzles from the <a href="https://lichess.org/api#tag/Puzzles">Lichess API</a>.</p>

<script type="module" src="{{ '/assets/js/fun-chess.js' | relative_url }}"></script>
