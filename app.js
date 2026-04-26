const TEAMS = [
  { id: "gen", name: "Gen.G", short: "GEN", logo: "https://opening-attachments.greetinghr.com/2026-03-05/4e815d1a-4fda-4398-8cb8-2c0a3f13dee7/GENGLOGO_GOLD.png" },
  { id: "krx", name: "KIWOOM DRX", short: "KRX", logo: "https://wstatic-prod-esports.pubgmobile.kr/esports/20260409/1FREvFWD.png" },
  { id: "ns", name: "Nongshim RedForce", short: "NS", logo: "https://i.namu.wiki/i/areQFExr-CT8pcYuMa1rA52fvfU0hr0PZBqQRRBbyVLoMg-XuVwD9dwljGmM-yA_l2I6Wb1sEGPIkDlDXaKUOQ.svg" },
  { id: "t1", name: "T1", short: "T1", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/T1_esports_logo.svg/1280px-T1_esports_logo.svg.png" },
  { id: "vl", name: "VARREL", short: "VL", logo: "https://i.namu.wiki/i/hBIPPijyMkqpWmDDP2ZBOtRU8jgImxnFRs4GMSHu6JmthZagrFZWz16-w00gPCoNQISm0nSIVYoAgucAOLEwag.svg" },
  { id: "fs", name: "FULL SENSE", short: "FS", logo: "https://i.namu.wiki/i/wFnSC8TrHC-2I-L9X8YUrcsD2wjuQPOOmw6BMrPNK0MP7eT4hDiN_veYO89v0xkDHb5OGcnrPvHIICZuKplhRg.svg" },
  { id: "dfm", name: "Detonation FocusMe", short: "DFM", logo: "https://i.namu.wiki/i/FKn1Na9dXdNDGUOkxdCQrdH7-pBL39cfukstZMFZHlR-B1taInJcdqX6cM027AXlbuWk5634azwvDU5e7QGFzA.svg" },
  { id: "zeta", name: "ZETA DIVISION", short: "ZETA", logo: "https://images.seeklogo.com/logo-png/47/2/zeta-division-logo-png_seeklogo-470671.png" },
  { id: "rrq", name: "Rex Regum Qeon", short: "RRQ", logo: "https://images.seeklogo.com/logo-png/42/2/team-rrq-logo-png_seeklogo-425108.png" },
  { id: "ts", name: "Team Secret", short: "TS", logo: "https://i.namu.wiki/i/CCs7VIeJubzuE-OZORc05mRRZkvCjgYCJtAr2OdYhlrnjCHPMYNlvOiL_HGklI-VOc1-en4s33ps1Dq54YkicA.svg" },
  { id: "ge", name: "Global Esports", short: "GE", logo: "https://i.namu.wiki/i/pTUbhyT8oZ34PXpxZC98iNB6eLt4zSX8V3R9M6eE30lxNLDH_iTOiqDpHrHRbNrmgqGew6d-65LbRIKu_97mGg.webp" },
  { id: "prx", name: "Paper Rex", short: "PRX", logo: "https://i.namu.wiki/i/02afraumaFDOsI5dIcfdtzoK01oL8PQzASKbTK9tDmQ-7RYK-P_ZBOR4qJHzfelKMYtSxNGCnQvr3fa_Scz07g.svg" },
];

const ENTRY_KEYS = ["omega2", "alpha3", "alpha2", "omega3", "alpha1", "omega1", "omega4", "alpha4"];
const MATCHES = [
  { id: "m1", title: "Match 1", date: "5/7", slots: [{ type: "entry", key: "omega2", seed: "ω 2위" }, { type: "entry", key: "alpha3", seed: "α 3위" }] },
  { id: "m2", title: "Match 2", date: "5/7", slots: [{ type: "entry", key: "alpha2", seed: "α 2위" }, { type: "entry", key: "omega3", seed: "ω 3위" }] },
  { id: "m3", title: "Match 3", date: "5/8", slots: [{ type: "entry", key: "alpha1", seed: "α 1위" }, { type: "winner", matchId: "m1", seed: "M1 승자" }] },
  { id: "m4", title: "Match 4", date: "5/8", slots: [{ type: "entry", key: "omega1", seed: "ω 1위" }, { type: "winner", matchId: "m2", seed: "M2 승자" }] },
  { id: "m5", title: "Match 5", date: "5/9", slots: [{ type: "loser", matchId: "m1", seed: "M1 패자" }, { type: "entry", key: "omega4", seed: "ω 4위" }] },
  { id: "m6", title: "Match 6", date: "5/9", slots: [{ type: "loser", matchId: "m2", seed: "M2 패자" }, { type: "entry", key: "alpha4", seed: "α 4위" }] },
  { id: "m7", title: "Match 7", date: "5/10", slots: [{ type: "loser", matchId: "m4", seed: "M4 패자" }, { type: "winner", matchId: "m5", seed: "M5 승자" }] },
  { id: "m8", title: "Match 8", date: "5/10", slots: [{ type: "loser", matchId: "m3", seed: "M3 패자" }, { type: "winner", matchId: "m6", seed: "M6 승자" }] },
  { id: "m9", title: "Match 9", date: "5/15", slots: [{ type: "winner", matchId: "m3", seed: "M3 승자" }, { type: "winner", matchId: "m4", seed: "M4 승자" }] },
  { id: "m10", title: "Match 10", date: "5/15", slots: [{ type: "winner", matchId: "m7", seed: "M7 승자" }, { type: "winner", matchId: "m8", seed: "M8 승자" }] },
  { id: "m11", title: "Match 11", date: "5/16", slots: [{ type: "loser", matchId: "m9", seed: "M9 패자" }, { type: "winner", matchId: "m10", seed: "M10 승자" }] },
  { id: "gf", title: "Grand Finals", date: "5/17", slots: [{ type: "winner", matchId: "m9", seed: "M9 승자" }, { type: "winner", matchId: "m11", seed: "M11 승자" }] },
];

const state = {
  session: null,
  rankings: null,
  view: "public",
  pickerSlot: null,
  authForm: {
    username: "",
    password: "",
  },
  adminEntryDraft: createEmptyEntries(),
  adminResultsDraft: {},
  userPredictionDraft: {},
  isPredicting: false,
  flash: null,
};

const TEAM_ID_ALIASES = { drx: "krx" };
const DRAFT_PREFIX = "vct_prediction_draft_v1:";

const matchEls = Object.fromEntries(MATCHES.map((match) => [match.id, document.getElementById(`match-${match.id}`)]));
const statusText = document.getElementById("statusText");
const subStatusText = document.getElementById("subStatusText");
const topControls = document.getElementById("topControls");
const flashMessage = document.getElementById("flashMessage");
const rankingPanel = document.getElementById("rankingPanel");
const pickerModal = document.getElementById("pickerModal");
const pickerLabel = document.getElementById("pickerLabel");
const pickerList = document.getElementById("pickerList");
const closePickerButton = document.getElementById("closePickerButton");

function createEmptyEntries() {
  return Object.fromEntries(ENTRY_KEYS.map((key) => [key, null]));
}

function normalizeEntries(entries) {
  return Object.fromEntries(
    ENTRY_KEYS.map((key) => {
      const rawValue = entries?.[key];
      const value = typeof rawValue === "string" ? TEAM_ID_ALIASES[rawValue] || rawValue : null;
      return [key, value || null];
    }),
  );
}

function getWinTarget(matchId) {
  return matchId === "m11" || matchId === "gf" ? 3 : 2;
}

function normalizeResults(results) {
  const nextResults = {};

  if (!results || typeof results !== "object") {
    return nextResults;
  }

  MATCHES.forEach((match) => {
    const value = results[match.id];
    const winTarget = getWinTarget(match.id);

    if (value === 0 || value === 1) {
      nextResults[match.id] = {
        winner: value,
        scores: value === 0 ? [winTarget, 0] : [0, winTarget],
      };
      return;
    }

    if (
      value &&
      typeof value === "object" &&
      (value.winner === 0 || value.winner === 1) &&
      Array.isArray(value.scores) &&
      value.scores.length === 2
    ) {
      const loserIndex = value.winner === 0 ? 1 : 0;
      const loserScore = Number.isInteger(value.scores[loserIndex]) ? value.scores[loserIndex] : 0;
      nextResults[match.id] = {
        winner: value.winner,
        scores:
          value.winner === 0
            ? [winTarget, clamp(loserScore, 0, winTarget - 1)]
            : [clamp(loserScore, 0, winTarget - 1), winTarget],
      };
    }
  });

  return nextResults;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeUsernameKey(username) {
  return String(username || "").trim().toLowerCase();
}

function draftStorageKey() {
  const username = state.session?.user?.username;
  return username ? `${DRAFT_PREFIX}${normalizeUsernameKey(username)}` : null;
}

function loadDraftFromStorage() {
  const key = draftStorageKey();
  if (!key) {
    return {};
  }

  try {
    const raw = localStorage.getItem(key);
    return raw ? normalizeResults(JSON.parse(raw)) : {};
  } catch (error) {
    return {};
  }
}

function saveDraftToStorage() {
  const key = draftStorageKey();
  if (!key || !state.session?.user || state.session.user.isAdmin) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(state.userPredictionDraft));
}

function clearDraftFromStorage() {
  const key = draftStorageKey();
  if (key) {
    localStorage.removeItem(key);
  }
}

function getTeam(teamId) {
  return TEAMS.find((team) => team.id === teamId) || null;
}

function usedTeamIds(entries, exceptKey = null) {
  return Object.entries(entries)
    .filter(([key, value]) => key !== exceptKey && value)
    .map(([, value]) => value);
}

function resolveMatchParticipants(matchId, entries, resolved) {
  const match = MATCHES.find((item) => item.id === matchId);
  return match.slots.map((slot) => {
    if (slot.type === "entry") {
      return getTeam(entries[slot.key]);
    }

    const upstream = resolved[slot.matchId];
    if (!upstream || upstream.winner == null) {
      return null;
    }

    const winnerTeam = upstream.participants[upstream.winner];
    const loserTeam = upstream.participants[upstream.winner === 0 ? 1 : 0];
    return slot.type === "winner" ? winnerTeam : loserTeam;
  });
}

function computeBracket(entries, results) {
  const resolved = {};
  const safeEntries = normalizeEntries(entries);
  const safeResults = normalizeResults(results);

  MATCHES.forEach((match) => {
    const participants = resolveMatchParticipants(match.id, safeEntries, resolved);
    const result = safeResults[match.id];
    const winner =
      result &&
      (result.winner === 0 || result.winner === 1) &&
      participants[0] &&
      participants[1]
        ? result.winner
        : null;

    resolved[match.id] = {
      ...match,
      participants,
      result: winner == null ? null : result,
      winner,
    };
  });

  return resolved;
}

function logoMarkup(team) {
  if (!team) {
    return '<span class="logo-placeholder">로고</span>';
  }

  if (team.logo) {
    return `<img class="team-logo-image" src="${team.logo}" alt="${team.name} 로고" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" /><div class="logo-badge fallback-badge" style="display:none;">${team.short}</div>`;
  }

  return `<div class="logo-badge">${team.short}</div>`;
}

function getContext() {
  const session = state.session;
  const isLoggedIn = Boolean(session?.authenticated);
  const isAdmin = Boolean(session?.user?.isAdmin);
  const globalEntries = normalizeEntries(session?.globalBracket?.entryAssignments);
  const actualResults = normalizeResults(session?.actualResults?.results);

  if (!isLoggedIn) {
    return {
      entries: globalEntries,
      results: {},
      editableEntries: false,
      editableResults: false,
      showComparison: false,
      role: "guest",
      view: "public",
    };
  }

  if (isAdmin) {
    if (state.view === "admin-results") {
      return {
        entries: globalEntries,
        results: normalizeResults(state.adminResultsDraft),
        editableEntries: false,
        editableResults: true,
        showComparison: false,
        role: "admin",
        view: "admin-results",
      };
    }

    return {
      entries: normalizeEntries(state.adminEntryDraft),
      results: {},
      editableEntries: true,
      editableResults: false,
      showComparison: false,
      role: "admin",
      view: "admin-bracket",
    };
  }

  if (state.view === "actual") {
    return {
      entries: globalEntries,
      results: actualResults,
      editableEntries: false,
      editableResults: false,
      showComparison: false,
      role: "user",
      view: "actual",
    };
  }

  if (state.view === "ranking") {
    return {
      entries: globalEntries,
      results: {},
      editableEntries: false,
      editableResults: false,
      showComparison: false,
      role: session.user.isAdmin ? "admin" : "user",
      view: "ranking",
    };
  }

  const submitted = Boolean(session.submittedPrediction?.submitted);
  return {
    entries: globalEntries,
    results: submitted ? normalizeResults(session.submittedPrediction.results) : normalizeResults(state.userPredictionDraft),
    editableEntries: false,
    editableResults: !submitted && Boolean(session.settings?.predictionWindowOpen) && state.isPredicting,
    showComparison: true,
    role: "user",
    view: "prediction",
  };
}

function getActualComparison(currentBracket, actualBracket, matchId) {
  const currentMatch = currentBracket[matchId];
  const actualMatch = actualBracket[matchId];

  if (!currentMatch?.result || !actualMatch?.result || actualMatch.winner == null || currentMatch.winner == null) {
    return { winnerCorrect: null, scoreCorrect: null };
  }

  const predictedWinnerTeam = currentMatch.participants[currentMatch.winner];
  const actualWinnerTeam = actualMatch.participants[actualMatch.winner];

  if (!predictedWinnerTeam || !actualWinnerTeam) {
    return { winnerCorrect: null, scoreCorrect: null };
  }

  const winnerCorrect = predictedWinnerTeam.id === actualWinnerTeam.id;
  const predictedLoserIndex = currentMatch.winner === 0 ? 1 : 0;
  const actualLoserIndex = actualMatch.winner === 0 ? 1 : 0;
  const scoreCorrect =
    winnerCorrect &&
    currentMatch.result.scores[predictedLoserIndex] === actualMatch.result.scores[actualLoserIndex];

  return { winnerCorrect, scoreCorrect };
}

function setFlash(message, type = "info") {
  state.flash = message ? { message, type } : null;
  renderFlash();
}

function renderFlash() {
  if (!state.flash) {
    flashMessage.className = "flash hidden";
    flashMessage.textContent = "";
    return;
  }

  flashMessage.className = `flash flash-${state.flash.type}`;
  flashMessage.textContent = state.flash.message;
}

function setStatusLines(context) {
  const session = state.session;

  if (!session?.authenticated) {
    statusText.textContent = "로그인 후 예측 기능을 사용할 수 있습니다.";
    subStatusText.textContent = "비로그인 상태에서는 현재 공개 대진표만 볼 수 있습니다.";
    return;
  }

  if (session.user.isAdmin) {
    if (context.view === "admin-results") {
      statusText.textContent = "Admin 결과 입력 모드";
      subStatusText.textContent = "승자를 클릭하고, 진 팀의 숫자 칸을 눌러 점수를 바꾼 뒤 결과 저장을 누르세요.";
      return;
    }

    if (context.view === "ranking") {
      statusText.textContent = "랭킹";
      subStatusText.textContent = "실제 결과를 기준으로 유저 점수를 집계한 순위표입니다.";
      return;
    }

    statusText.textContent = "Admin 대진표 편집 모드";
    subStatusText.textContent = "왼쪽 빈 칸을 눌러 8팀을 채운 뒤 적용을 누르면 모든 계정에 반영됩니다.";
    return;
  }

  if (context.view === "actual") {
    statusText.textContent = "경기 결과 보기";
    subStatusText.textContent = "Admin이 저장한 실제 경기 결과가 표시됩니다.";
    return;
  }

  if (context.view === "ranking") {
    statusText.textContent = "랭킹";
    subStatusText.textContent = "승자 적중 +10점, 점수 적중 +15점 기준으로 집계됩니다.";
    return;
  }

  if (session.submittedPrediction?.submitted) {
    statusText.textContent = "내 예측";
    subStatusText.textContent = "이미 확정한 예측입니다. 실제 결과와 비교 색상이 함께 표시됩니다.";
    return;
  }

  if (!session.settings?.predictionWindowOpen) {
    statusText.textContent = "예측 종료";
    subStatusText.textContent = "Admin이 예측을 종료해 더이상 수정하거나 확정할 수 없습니다.";
    return;
  }

  statusText.textContent = state.isPredicting ? "예측 작성 중" : "내 예측";
  subStatusText.textContent = state.isPredicting
    ? "승자를 클릭하고, 진 팀 점수 칸을 눌러 숫자를 바꾼 뒤 확정을 누르세요."
    : "예측하기를 누르면 승자와 점수를 선택할 수 있습니다.";
}

function renderControls() {
  const session = state.session;

  if (!session?.authenticated) {
    topControls.innerHTML = `
      <div class="auth-panel">
        <input id="authUsername" class="auth-input" type="text" placeholder="아이디" value="${escapeHtml(state.authForm.username)}" />
        <input id="authPassword" class="auth-input" type="password" placeholder="비밀번호" value="${escapeHtml(state.authForm.password)}" />
        <button class="toolbar-button" data-action="login">로그인</button>
        <button class="toolbar-button secondary" data-action="register">회원가입</button>
      </div>
    `;
    return;
  }

  if (session.user.isAdmin) {
    topControls.innerHTML = `
      <div class="user-strip">
        <span class="user-badge">Admin</span>
        <button class="toolbar-button ${state.view === "admin-bracket" ? "active" : ""}" data-action="admin-bracket">대진표 편집</button>
        <button class="toolbar-button ${state.view === "ranking" ? "active" : ""}" data-action="view-ranking">랭킹</button>
        <button class="toolbar-button" data-action="publish-bracket">적용</button>
        <button class="toolbar-button ${state.view === "admin-results" ? "active" : ""}" data-action="admin-results">결과</button>
        <button class="toolbar-button" data-action="save-results">결과 저장</button>
        <button class="toolbar-button warning" data-action="toggle-window">${session.settings?.predictionWindowOpen ? "예측 종료!" : "예측 다시 열기"}</button>
        <button class="toolbar-button danger" data-action="reset-all">전체 리셋</button>
        <button class="toolbar-button secondary" data-action="logout">로그아웃</button>
      </div>
    `;
    return;
  }

  const submitted = Boolean(session.submittedPrediction?.submitted);
  const canPredict = !submitted && Boolean(session.settings?.predictionWindowOpen);
  topControls.innerHTML = `
    <div class="user-strip">
      <span class="user-badge">${escapeHtml(session.user.username)}</span>
      <button class="toolbar-button ${state.view === "prediction" ? "active" : ""}" data-action="view-prediction">내 예측</button>
      <button class="toolbar-button ${state.view === "actual" ? "active" : ""}" data-action="view-actual">경기 결과</button>
      <button class="toolbar-button ${state.view === "ranking" ? "active" : ""}" data-action="view-ranking">랭킹</button>
      <button class="toolbar-button" data-action="start-predict" ${canPredict ? "" : "disabled"}>${submitted ? "예측 확정됨" : "예측하기"}</button>
      <button class="toolbar-button warning" data-action="submit-prediction" ${canPredict && state.isPredicting ? "" : "disabled"}>확정</button>
      <button class="toolbar-button secondary" data-action="logout">로그아웃</button>
    </div>
  `;
}

function renderBoard() {
  const context = getContext();
  if (context.view === "ranking") {
    document.querySelector(".board").classList.add("hidden");
    renderRankings();
    setStatusLines(context);
    return;
  }

  document.querySelector(".board").classList.remove("hidden");
  rankingPanel.classList.add("hidden");
  const bracket = computeBracket(context.entries, context.results);
  const actualBracket = computeBracket(
    normalizeEntries(state.session?.globalBracket?.entryAssignments),
    normalizeResults(state.session?.actualResults?.results),
  );

  setStatusLines(context);

  MATCHES.forEach((match) => {
    const current = bracket[match.id];
    const comparison = context.showComparison ? getActualComparison(bracket, actualBracket, match.id) : { winnerCorrect: null, scoreCorrect: null };

    const rows = current.slots
      .map((slot, index) => {
        const participant = current.participants[index];
        const isEntry = slot.type === "entry";
        const hasBoth = Boolean(current.participants[0] && current.participants[1]);
        const isSelected = current.winner === index;
        const canPickEntry = context.editableEntries && isEntry;
        const canPickWinner = context.editableResults && hasBoth;
        const result = current.result;
        const scoreValue = result ? result.scores[index] : 0;
        const canAdjustScore = context.editableResults && hasBoth && result && result.winner !== index;
        const scoreClass = comparison.scoreCorrect == null ? "" : comparison.scoreCorrect ? " score-correct" : " score-wrong";
        const logoClass =
          comparison.winnerCorrect == null || !isSelected
            ? ""
            : comparison.winnerCorrect
              ? " winner-correct"
              : " winner-wrong";
        const entryAttrs = canPickEntry ? `data-entry-key="${slot.key}" data-seed="${slot.seed}"` : "";
        const winnerAttrs = !canPickEntry && canPickWinner ? `data-match-id="${match.id}" data-winner-index="${index}"` : "";
        const scoreAttrs = canAdjustScore ? `data-score-match-id="${match.id}" data-score-row="${index}"` : "";

        return `
          <div class="row ${isSelected ? "row-selected" : ""} ${hasBoth && !isSelected && current.winner != null ? "row-dimmed" : ""}">
            <div class="team-cell">
              <button
                type="button"
                class="team-button ${isSelected ? "selected" : ""} ${!participant ? "placeholder" : ""} ${(entryAttrs || winnerAttrs) ? "clickable" : ""}"
                ${entryAttrs}
                ${winnerAttrs}
              >
                <span class="team-name">${escapeHtml(participant ? participant.name : isEntry ? "미정" : slot.seed)}</span>
                <span class="team-seed">${escapeHtml(participant ? slot.seed : isEntry ? slot.seed : "")}</span>
              </button>
            </div>
            <div class="logo-cell${isSelected ? " logo-selected" : ""}${logoClass}">${logoMarkup(participant)}</div>
            <button type="button" class="score-cell${isSelected ? " score-selected" : ""}${scoreClass} ${scoreAttrs ? "score-clickable" : ""}" ${scoreAttrs}>${scoreValue}</button>
          </div>
        `;
      })
      .join("");

    matchEls[match.id].innerHTML = `
      <div class="match-title">${match.title} (${match.date})</div>
      <div class="match-body">${rows}</div>
    `;
  });
}

function renderRankings() {
  const rankings = state.rankings;
  rankingPanel.classList.remove("hidden");

  if (!rankings) {
    rankingPanel.innerHTML = `<div class="ranking-card"><strong>랭킹을 불러오는 중입니다.</strong></div>`;
    return;
  }

  const currentUserHtml = rankings.currentUser
    ? `
      <div class="ranking-summary-card">
        <span class="ranking-summary-label">내 현재 순위</span>
        <strong class="ranking-summary-rank">${rankings.currentUser.rank}등</strong>
        <span class="ranking-summary-meta">${escapeHtml(rankings.currentUser.username)} · ${rankings.currentUser.points}점</span>
      </div>
    `
    : `
      <div class="ranking-summary-card">
        <span class="ranking-summary-label">내 현재 순위</span>
        <strong class="ranking-summary-rank">집계 제외</strong>
        <span class="ranking-summary-meta">Admin 계정은 랭킹에 포함되지 않습니다.</span>
      </div>
    `;

  const rows = rankings.top10.length
    ? rankings.top10
        .map(
          (entry) => `
            <div class="ranking-row">
              <div class="ranking-rank">#${entry.rank}</div>
              <div class="ranking-user">${escapeHtml(entry.username)}</div>
              <div class="ranking-points">${entry.points}점</div>
            </div>
          `,
        )
        .join("")
    : `<div class="ranking-empty">아직 랭킹 데이터가 없습니다.</div>`;

  rankingPanel.innerHTML = `
    <div class="ranking-shell">
      ${currentUserHtml}
      <div class="ranking-card">
        <div class="ranking-card-title">Top 10</div>
        <div class="ranking-list">${rows}</div>
      </div>
    </div>
  `;
}

function render() {
  renderFlash();
  renderControls();
  renderBoard();
}

function openPicker(slotKey, seed) {
  const context = getContext();
  if (!context.editableEntries) {
    return;
  }

  state.pickerSlot = slotKey;
  pickerLabel.textContent = `${seed} 위치에 들어갈 팀을 선택하세요.`;
  const used = new Set(usedTeamIds(state.adminEntryDraft, slotKey));
  const current = state.adminEntryDraft[slotKey];

  pickerList.innerHTML = TEAMS.map((team) => `
    <button type="button" class="picker-button" data-team-id="${team.id}" ${used.has(team.id) ? "disabled" : ""}>
      ${logoMarkup(team)}
      <div class="picker-copy">
        <strong>${escapeHtml(team.name)}${current === team.id ? " (선택됨)" : ""}</strong>
        <span>${team.short}</span>
      </div>
    </button>
  `).join("");

  pickerModal.classList.remove("hidden");
}

function closePicker() {
  state.pickerSlot = null;
  pickerModal.classList.add("hidden");
}

function updateAdminWinner(matchId, winnerIndex) {
  const next = normalizeResults(state.adminResultsDraft);
  const winTarget = getWinTarget(matchId);
  next[matchId] =
    winnerIndex === 0
      ? { winner: 0, scores: [winTarget, next[matchId]?.scores?.[1] ?? 0] }
      : { winner: 1, scores: [next[matchId]?.scores?.[0] ?? 0, winTarget] };

  const loserIndex = winnerIndex === 0 ? 1 : 0;
  next[matchId].scores[loserIndex] = clamp(next[matchId].scores[loserIndex], 0, winTarget - 1);
  state.adminResultsDraft = next;
}

function updateUserWinner(matchId, winnerIndex) {
  const next = normalizeResults(state.userPredictionDraft);
  const winTarget = getWinTarget(matchId);
  next[matchId] =
    winnerIndex === 0
      ? { winner: 0, scores: [winTarget, next[matchId]?.scores?.[1] ?? 0] }
      : { winner: 1, scores: [next[matchId]?.scores?.[0] ?? 0, winTarget] };

  const loserIndex = winnerIndex === 0 ? 1 : 0;
  next[matchId].scores[loserIndex] = clamp(next[matchId].scores[loserIndex], 0, winTarget - 1);
  state.userPredictionDraft = next;
  saveDraftToStorage();
}

function cycleLoserScore(targetResults, matchId) {
  const current = targetResults[matchId];
  if (!current || (current.winner !== 0 && current.winner !== 1)) {
    return targetResults;
  }

  const winTarget = getWinTarget(matchId);
  const loserIndex = current.winner === 0 ? 1 : 0;
  const next = normalizeResults(targetResults);
  next[matchId].scores[loserIndex] = (next[matchId].scores[loserIndex] + 1) % winTarget;
  return next;
}

async function api(path, method = "GET", body) {
  const response = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "요청에 실패했습니다.");
  }
  return payload;
}

async function loadSession() {
  const payload = await api("/api/session");
  state.session = payload;

  if (!payload.authenticated) {
    state.view = "public";
    state.isPredicting = false;
    state.adminEntryDraft = normalizeEntries(payload.globalBracket?.entryAssignments);
    state.adminResultsDraft = normalizeResults(payload.actualResults?.results);
    state.userPredictionDraft = {};
    state.rankings = null;
    render();
    return;
  }

  if (payload.user.isAdmin) {
    state.view = state.view === "admin-results" ? "admin-results" : "admin-bracket";
    state.isPredicting = false;
    state.adminEntryDraft = normalizeEntries(payload.globalBracket?.entryAssignments);
    state.adminResultsDraft = normalizeResults(payload.actualResults?.results);
  } else {
    const submitted = Boolean(payload.submittedPrediction?.submitted);
    const savedDraft = loadDraftFromStorage();
    state.view = state.view === "actual" ? "actual" : "prediction";
    state.isPredicting = false;
    state.userPredictionDraft = submitted ? normalizeResults(payload.submittedPrediction.results) : savedDraft;
  }

  try {
    state.rankings = await api("/api/rankings");
  } catch (error) {
    state.rankings = null;
  }

  render();
}

async function handleAuth(action) {
  const usernameInput = document.getElementById("authUsername");
  const passwordInput = document.getElementById("authPassword");
  const username = usernameInput?.value || "";
  const password = passwordInput?.value || "";
  state.authForm = { username, password };

  const path = action === "login" ? "/api/login" : "/api/register";
  const payload = await api(path, "POST", { username, password });
  state.authForm.password = "";
  state.flash = { message: payload.message, type: "success" };
  await loadSession();
}

async function handleLogout() {
  const payload = await api("/api/logout", "POST");
  clearDraftFromStorage();
  state.flash = { message: payload.message, type: "success" };
  state.session = null;
  state.userPredictionDraft = {};
  state.isPredicting = false;
  await loadSession();
}

async function handlePublishBracket() {
  const filled = Object.values(state.adminEntryDraft).filter(Boolean).length;
  if (filled !== 8) {
    throw new Error("8개 팀을 모두 채운 뒤 적용할 수 있습니다.");
  }

  const payload = await api("/api/admin/bracket", "PUT", {
    entryAssignments: normalizeEntries(state.adminEntryDraft),
  });
  state.flash = { message: payload.message, type: "success" };
  await loadSession();
}

async function handleSaveResults() {
  const payload = await api("/api/admin/results", "PUT", {
    results: normalizeResults(state.adminResultsDraft),
  });
  state.flash = { message: payload.message, type: "success" };
  await loadSession();
}

async function handleToggleWindow() {
  const payload = await api("/api/admin/prediction-window", "PUT", {
    isOpen: !state.session.settings?.predictionWindowOpen,
  });
  state.flash = { message: payload.message, type: "success" };
  await loadSession();
}

async function handleResetAll() {
  const payload = await api("/api/admin/reset-all", "POST");
  clearDraftFromStorage();
  state.flash = { message: payload.message, type: "success" };
  state.view = "admin-bracket";
  await loadSession();
}

async function handleSubmitPrediction() {
  const payload = await api("/api/prediction/submit", "PUT", {
    results: normalizeResults(state.userPredictionDraft),
  });
  clearDraftFromStorage();
  state.flash = { message: payload.message, type: "success" };
  state.isPredicting = false;
  await loadSession();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.body.addEventListener("input", (event) => {
  if (event.target.id === "authUsername") {
    state.authForm.username = event.target.value;
  }

  if (event.target.id === "authPassword") {
    state.authForm.password = event.target.value;
  }
});

document.body.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    try {
      const action = actionButton.dataset.action;
      if (action === "login" || action === "register") {
        await handleAuth(action);
      } else if (action === "logout") {
        await handleLogout();
      } else if (action === "admin-bracket") {
        state.view = "admin-bracket";
        render();
      } else if (action === "admin-results") {
        state.view = "admin-results";
        render();
      } else if (action === "publish-bracket") {
        await handlePublishBracket();
      } else if (action === "save-results") {
        await handleSaveResults();
      } else if (action === "toggle-window") {
        await handleToggleWindow();
      } else if (action === "reset-all") {
        await handleResetAll();
      } else if (action === "view-prediction") {
        state.view = "prediction";
        render();
      } else if (action === "view-actual") {
        state.view = "actual";
        render();
      } else if (action === "view-ranking") {
        state.view = "ranking";
        render();
      } else if (action === "start-predict") {
        state.view = "prediction";
        state.isPredicting = true;
        render();
      } else if (action === "submit-prediction") {
        await handleSubmitPrediction();
      }
    } catch (error) {
      setFlash(error.message, "error");
      render();
    }
    return;
  }

  const entryButton = event.target.closest("[data-entry-key]");
  if (entryButton) {
    openPicker(entryButton.dataset.entryKey, entryButton.dataset.seed);
    return;
  }

  const winnerButton = event.target.closest("[data-match-id]");
  if (winnerButton) {
    const matchId = winnerButton.dataset.matchId;
    const winnerIndex = Number(winnerButton.dataset.winnerIndex);
    const context = getContext();
    if (!context.editableResults) {
      return;
    }

    if (context.role === "admin") {
      updateAdminWinner(matchId, winnerIndex);
    } else {
      updateUserWinner(matchId, winnerIndex);
    }
    render();
    return;
  }

  const scoreButton = event.target.closest("[data-score-match-id]");
  if (scoreButton) {
    const context = getContext();
    if (!context.editableResults) {
      return;
    }

    const matchId = scoreButton.dataset.scoreMatchId;
    if (context.role === "admin") {
      state.adminResultsDraft = cycleLoserScore(state.adminResultsDraft, matchId);
    } else {
      state.userPredictionDraft = cycleLoserScore(state.userPredictionDraft, matchId);
      saveDraftToStorage();
    }
    render();
    return;
  }

  const teamChoice = event.target.closest("[data-team-id]");
  if (teamChoice && state.pickerSlot) {
    state.adminEntryDraft[state.pickerSlot] = teamChoice.dataset.teamId;
    closePicker();
    render();
    return;
  }

  if (event.target.closest("[data-close='true']")) {
    closePicker();
  }
});

closePickerButton.addEventListener("click", closePicker);

loadSession().catch((error) => {
  setFlash(error.message, "error");
  render();
});
