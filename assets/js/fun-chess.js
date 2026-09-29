/* Lichess daily puzzle on a real Chessground board.
 *
 * Chessground is the board UI Lichess itself uses; it deliberately holds no
 * chess rules, so chess.js supplies legal moves, FEN and check state.
 * Puzzles come from the public Lichess API, which needs no key and sends
 * Access-Control-Allow-Origin: *, so this works from a static site.
 */
import { Chessground } from 'https://cdn.jsdelivr.net/npm/@lichess-org/chessground@10.4.0/+esm';
import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const el = {
  board: document.querySelector('#lichess-board'),
  status: document.querySelector('#puzzle-status'),
  turn: document.querySelector('#puzzle-turn'),
  meta: document.querySelector('#puzzle-meta'),
  label: document.querySelector('#puzzle-label'),
  link: document.querySelector('#puzzle-lichess-link'),
  hint: document.querySelector('[data-action="hint"]'),
  solve: document.querySelector('[data-action="solve"]'),
  reset: document.querySelector('[data-action="reset"]'),
  next: document.querySelector('[data-action="next"]'),
  promo: document.querySelector('#promotion-picker')
};

if (el.board) {
  const MIN_RATING = parseInt(el.board.dataset.minRating, 10) || 2000;
  const MAX_TRIES = 3;      // Lichess 429s on bursts
  const RETRY_GAP = 1200;
  const REPLY_DELAY = 480;

  let ground = null;
  let chess = null;
  let puzzle = null;
  let solution = [];
  let ply = 0;
  let lastMove;
  let locked = false;
  let solved = false;

  /* ---------- small helpers ------------------------------------------ */

  const colorName = c => (c === 'w' ? 'white' : 'black');
  const sideName = c => (c === 'w' ? 'White' : 'Black');
  const wait = ms => new Promise(r => window.setTimeout(r, ms));

  const uciParts = uci => ({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined
  });

  const uciSquares = uci =>
    (uci && uci.length >= 4 ? [uci.slice(0, 2), uci.slice(2, 4)] : undefined);

  function prettyTheme(theme) {
    return theme
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Za-z])([0-9])/g, '$1 $2')
      .replace(/^./, c => c.toUpperCase());
  }

  function say(text, tone) {
    el.status.textContent = text;
    el.status.className = 'puzzle-status' + (tone ? ' is-' + tone : '');
  }

  // Chessground has no rules of its own; hand it chess.js's move list.
  function legalDests() {
    const dests = new Map();
    for (const m of chess.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  /* ---------- board state -------------------------------------------- */

  function sync({ movable }) {
    const side = colorName(chess.turn());
    el.turn.textContent = solved ? 'Puzzle complete' : sideName(chess.turn()) + ' to move';

    ground.set({
      fen: chess.fen(),
      turnColor: side,
      check: chess.isCheck(),
      lastMove,
      movable: movable
        ? { free: false, color: side, dests: legalDests(), events: { after: onUserMove } }
        : { color: undefined, dests: new Map() }
    });
  }

  function applyUci(uci) {
    const { from, to, promotion } = uciParts(uci);
    try {
      chess.move({ from, to, promotion });
    } catch (err) {
      // chess.js 1.x throws on an illegal move; a solution move never is.
      console.error('Could not apply ' + uci, err);
      return false;
    }
    lastMove = [from, to];
    return true;
  }

  /* ---------- promotion ---------------------------------------------- */

  function isPromotion(from, to) {
    const piece = chess.get(from);
    if (!piece || piece.type !== 'p') return false;
    return (piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1');
  }

  function askPromotion() {
    return new Promise(resolve => {
      el.promo.hidden = false;
      const buttons = el.promo.querySelectorAll('[data-piece]');
      const done = value => {
        el.promo.hidden = true;
        buttons.forEach(b => b.removeEventListener('click', onClick));
        document.removeEventListener('keydown', onKey);
        resolve(value);
      };
      const onClick = e => done(e.currentTarget.dataset.piece);
      const onKey = e => { if (e.key === 'Escape') done(null); };
      buttons.forEach(b => b.addEventListener('click', onClick));
      document.addEventListener('keydown', onKey);
      buttons[0].focus();
    });
  }

  /* ---------- play ----------------------------------------------------- */

  async function onUserMove(orig, dest) {
    if (locked || solved || ply >= solution.length) return;
    locked = true;
    ground.setAutoShapes([]);

    let promotion;
    if (isPromotion(orig, dest)) {
      promotion = await askPromotion();
      if (!promotion) {            // cancelled — put the piece back
        sync({ movable: true });
        locked = false;
        return;
      }
    }

    const tried = orig + dest + (promotion || '');
    const want = solution[ply];

    if (tried !== want) {
      sync({ movable: true });     // Chessground already moved it; undo that
      say('Not quite — try another move.', 'wrong');
      el.board.classList.add('is-wrong');
      window.setTimeout(() => el.board.classList.remove('is-wrong'), 420);
      locked = false;
      return;
    }

    applyUci(want);
    ply++;
    sync({ movable: false });

    if (ply >= solution.length) return finish();

    say('Good move.', 'correct');
    await wait(REPLY_DELAY);

    applyUci(solution[ply]);
    ply++;
    sync({ movable: false });

    if (ply >= solution.length) return finish();

    say('Your move.');
    locked = false;
    sync({ movable: true });
  }

  function finish() {
    solved = true;
    locked = true;
    sync({ movable: false });
    say('Solved — that is the whole line.', 'solved');
    el.hint.disabled = true;
    el.solve.disabled = true;

    // Restart the pulse even if it has already played once this session.
    el.board.classList.remove('is-solved');
    void el.board.offsetWidth;
    el.board.classList.add('is-solved');
  }

  /* ---------- controls -------------------------------------------------- */

  el.hint.addEventListener('click', () => {
    if (locked || solved || !ground) return;
    ground.setAutoShapes([{ orig: uciParts(solution[ply]).from, brush: 'green' }]);
    say('Try moving the circled piece.');
  });

  el.solve.addEventListener('click', async () => {
    if (solved || !ground) return;
    locked = true;
    ground.setAutoShapes([]);
    sync({ movable: false });
    while (ply < solution.length) {
      applyUci(solution[ply]);
      ply++;
      sync({ movable: false });
      await wait(REPLY_DELAY);
    }
    finish();
    say('That is the solution.', 'solved');
  });

  el.reset.addEventListener('click', () => { if (puzzle) start(puzzle, el.label.textContent); });

  el.next.addEventListener('click', loadHard);

  /* ---------- starting a puzzle ----------------------------------------- */

  function start(data, label) {
    if (!data || !data.puzzle || !data.puzzle.fen) {
      return failed(new Error('that puzzle came back without a position'));
    }

    puzzle = data;
    solution = data.puzzle.solution.slice();
    ply = 0;
    solved = false;
    locked = false;
    chess = new Chess(data.puzzle.fen);
    lastMove = uciSquares(data.puzzle.lastMove);

    el.label.textContent = label;
    el.hint.disabled = false;
    el.solve.disabled = false;
    el.reset.disabled = false;
    el.promo.hidden = true;
    el.board.classList.remove('is-solved');

    const side = colorName(chess.turn());

    if (!ground) {
      ground = Chessground(el.board, {
        fen: chess.fen(),
        orientation: side,
        turnColor: side,
        lastMove,
        coordinates: true,
        animation: { enabled: true, duration: 220 },
        highlight: { lastMove: true, check: true },
        movable: { free: false, color: side, dests: legalDests(), showDests: true,
                   events: { after: onUserMove } },
        draggable: { enabled: true, showGhost: true },
        selectable: { enabled: true },
        drawable: { enabled: true, visible: true }
      });
    } else {
      ground.set({ orientation: side });
      ground.setAutoShapes([]);
      sync({ movable: true });
    }

    renderMeta();
    say('Find the best move.');
    el.turn.textContent = sideName(chess.turn()) + ' to move';
  }

  function renderMeta() {
    el.meta.replaceChildren();
    const chip = text => {
      const s = document.createElement('span');
      s.className = 'puzzle-chip';
      s.textContent = text;
      el.meta.appendChild(s);
    };

    chip('Rating ' + puzzle.puzzle.rating);

    // "short"/"long" describe length rather than motif — not interesting here.
    const skip = new Set(['short', 'long', 'veryLong', 'oneMove']);
    (puzzle.puzzle.themes || [])
      .filter(t => !skip.has(t))
      .slice(0, 3)
      .forEach(t => chip(prettyTheme(t)));

    el.link.href = 'https://lichess.org/training/' + encodeURIComponent(puzzle.puzzle.id);
    el.link.hidden = false;
  }

  /* ---------- fetching --------------------------------------------------- */

  function fetchJson(url) {
    return fetch(url, { headers: { Accept: 'application/json' } }).then(res => {
      if (res.status === 429) {
        const e = new Error('Lichess is rate-limiting requests — give it a minute');
        e.rateLimited = true;
        throw e;
      }
      if (!res.ok) throw new Error('Lichess returned ' + res.status);
      return res.json();
    });
  }

  function failed(err) {
    el.turn.textContent = 'Puzzle unavailable';
    say('Could not load a puzzle from Lichess (' + err.message + '). You can solve '
      + 'today’s at lichess.org/training/daily.', 'wrong');
    el.link.href = 'https://lichess.org/training/daily';
    el.link.hidden = false;
    el.hint.disabled = true;
    el.solve.disabled = true;
  }

  function loadDaily() {
    say('Loading today’s puzzle…');
    return fetchJson('https://lichess.org/api/puzzle/daily')
      .then(d => start(d, 'Lichess · daily puzzle'))
      .catch(failed);
  }

  // Unauthenticated, difficulty=hardest is anchored to no rating, so keep
  // asking until one clears the floor. /api/puzzle/next omits `fen`, unlike
  // /daily and /{id}, so the winner is fetched again by id.
  function loadHard() {
    if (locked && !solved) { /* allow switching mid-puzzle */ }
    el.next.disabled = true;
    say('Looking for a hard one…');

    let best = null;
    let tries = 0;

    const again = () => {
      if (tries >= MAX_TRIES) return Promise.resolve(best);
      tries++;
      return fetchJson('https://lichess.org/api/puzzle/next?difficulty=hardest')
        .then(d => {
          if (!best || d.puzzle.rating > best.puzzle.rating) best = d;
          if (d.puzzle.rating >= MIN_RATING) return d;
          return wait(RETRY_GAP).then(again);
        })
        .catch(err => {
          if (err.rateLimited && best) return best;   // better than nothing
          throw err;
        });
    };

    return again()
      .then(d => {
        if (!d) throw new Error('no puzzle came back');
        return fetchJson('https://lichess.org/api/puzzle/' + d.puzzle.id);
      })
      .then(full => {
        el.next.disabled = false;
        start(full, 'Lichess · harder puzzle');
      })
      .catch(err => { el.next.disabled = false; failed(err); });
  }

  loadDaily();
}
