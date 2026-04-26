const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");
const SESSION_COOKIE = "vct_session";
const ADMIN_USERNAME = "Admin";
const ADMIN_USERNAME_KEY = "admin";
const ADMIN_PASSWORD = "mnasdvoiewf23";
const ENTRY_SLOT_IDS = [
  "omega2",
  "alpha3",
  "alpha2",
  "omega3",
  "alpha1",
  "omega1",
  "omega4",
  "alpha4",
];
const MATCH_IDS = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "gf"];
const MATCHES = [
  { id: "m1", slots: [{ type: "entry", key: "omega2" }, { type: "entry", key: "alpha3" }] },
  { id: "m2", slots: [{ type: "entry", key: "alpha2" }, { type: "entry", key: "omega3" }] },
  { id: "m3", slots: [{ type: "entry", key: "alpha1" }, { type: "winner", matchId: "m1" }] },
  { id: "m4", slots: [{ type: "entry", key: "omega1" }, { type: "winner", matchId: "m2" }] },
  { id: "m5", slots: [{ type: "loser", matchId: "m1" }, { type: "entry", key: "omega4" }] },
  { id: "m6", slots: [{ type: "loser", matchId: "m2" }, { type: "entry", key: "alpha4" }] },
  { id: "m7", slots: [{ type: "loser", matchId: "m4" }, { type: "winner", matchId: "m5" }] },
  { id: "m8", slots: [{ type: "loser", matchId: "m3" }, { type: "winner", matchId: "m6" }] },
  { id: "m9", slots: [{ type: "winner", matchId: "m3" }, { type: "winner", matchId: "m4" }] },
  { id: "m10", slots: [{ type: "winner", matchId: "m7" }, { type: "winner", matchId: "m8" }] },
  { id: "m11", slots: [{ type: "loser", matchId: "m9" }, { type: "winner", matchId: "m10" }] },
  { id: "gf", slots: [{ type: "winner", matchId: "m9" }, { type: "winner", matchId: "m11" }] },
];
const TEAM_ID_ALIASES = {
  drx: "krx",
};
const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const sessions = new Map();

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function sanitizeUsername(username) {
  return String(username || "").trim();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function defaultSubmittedPrediction() {
  return {
    submitted: false,
    results: {},
    submittedAt: null,
  };
}

function defaultGlobalBracket() {
  return {
    entryAssignments: Object.fromEntries(ENTRY_SLOT_IDS.map((slotId) => [slotId, null])),
    publishedAt: null,
    publishedBy: null,
  };
}

function defaultSettings() {
  return {
    predictionWindowOpen: true,
    predictionClosedAt: null,
    predictionClosedBy: null,
  };
}

function defaultActualResults() {
  return {
    results: {},
    updatedAt: null,
    updatedBy: null,
  };
}

function getWinTarget(matchId) {
  return matchId === "m11" || matchId === "gf" ? 3 : 2;
}

function normalizeResults(results) {
  const nextResults = {};
  if (!results || typeof results !== "object") {
    return nextResults;
  }

  MATCH_IDS.forEach((matchId) => {
    const value = results[matchId];
    const winTarget = getWinTarget(matchId);

    if (value === 0 || value === 1) {
      nextResults[matchId] = {
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
      nextResults[matchId] = {
        winner: value.winner,
        scores:
          value.winner === 0
            ? [winTarget, Math.max(0, Math.min(winTarget - 1, loserScore))]
            : [Math.max(0, Math.min(winTarget - 1, loserScore)), winTarget],
      };
    }
  });

  return nextResults;
}

function normalizeEntryAssignments(entryAssignments) {
  return Object.fromEntries(
    ENTRY_SLOT_IDS.map((slotId) => {
      const rawValue = entryAssignments?.[slotId];
      const value =
        typeof rawValue === "string" && rawValue.length > 0
          ? TEAM_ID_ALIASES[rawValue] || rawValue
          : null;
      return [slotId, value];
    }),
  );
}

function normalizeSubmittedPredictionPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return {
    submitted: true,
    results: normalizeResults(payload.results),
    submittedAt: new Date().toISOString(),
  };
}

function normalizeGlobalBracketPayload(payload) {
  if (!payload || typeof payload !== "object" || !payload.entryAssignments) {
    return null;
  }

  return {
    entryAssignments: normalizeEntryAssignments(payload.entryAssignments),
  };
}

function normalizeActualResultsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return {
    results: normalizeResults(payload.results),
  };
}

function resolveMatchParticipants(matchId, entries, resolved) {
  const match = MATCHES.find((item) => item.id === matchId);
  return match.slots.map((slot) => {
    if (slot.type === "entry") {
      return entries[slot.key] || null;
    }

    const upstream = resolved[slot.matchId];
    if (!upstream || upstream.winner == null) {
      return null;
    }

    return slot.type === "winner"
      ? upstream.participants[upstream.winner]
      : upstream.participants[upstream.winner === 0 ? 1 : 0];
  });
}

function computeBracket(entries, results) {
  const resolved = {};
  const safeEntries = normalizeEntryAssignments(entries);
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
      participants,
      result: winner == null ? null : result,
      winner,
    };
  });

  return resolved;
}

function scorePrediction(entries, predictedResults, actualResults) {
  const predictedBracket = computeBracket(entries, predictedResults);
  const actualBracket = computeBracket(entries, actualResults);
  let points = 0;
  let winnerHits = 0;
  let scoreHits = 0;

  MATCH_IDS.forEach((matchId) => {
    const predicted = predictedBracket[matchId];
    const actual = actualBracket[matchId];

    if (!predicted?.result || !actual?.result || predicted.winner == null || actual.winner == null) {
      return;
    }

    const predictedWinnerTeam = predicted.participants[predicted.winner];
    const actualWinnerTeam = actual.participants[actual.winner];
    if (!predictedWinnerTeam || !actualWinnerTeam) {
      return;
    }

    const winnerCorrect = predictedWinnerTeam === actualWinnerTeam;
    if (winnerCorrect) {
      points += 10;
      winnerHits += 1;
    }

    const predictedLoserIndex = predicted.winner === 0 ? 1 : 0;
    const actualLoserIndex = actual.winner === 0 ? 1 : 0;
    const scoreCorrect =
      winnerCorrect &&
      predicted.result.scores[predictedLoserIndex] === actual.result.scores[actualLoserIndex];

    if (scoreCorrect) {
      points += 15;
      scoreHits += 1;
    }
  });

  return { points, winnerHits, scoreHits };
}

function buildRankingsPayload(store, currentUsernameKey = null) {
  const entries = normalizeEntryAssignments(store.globalBracket?.entryAssignments);
  const actualResults = normalizeResults(store.actualResults?.results);

  const rankings = store.users
    .filter((user) => !user.isAdmin)
    .map((user) => {
      const prediction = getUserPrediction(store, user.usernameKey);
      const score = prediction.submitted
        ? scorePrediction(entries, prediction.results, actualResults)
        : { points: 0, winnerHits: 0, scoreHits: 0 };

      return {
        username: user.usernameDisplay,
        usernameKey: user.usernameKey,
        submitted: prediction.submitted,
        submittedAt: prediction.submittedAt,
        ...score,
      };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.scoreHits !== a.scoreHits) return b.scoreHits - a.scoreHits;
      if (b.winnerHits !== a.winnerHits) return b.winnerHits - a.winnerHits;
      if (a.submitted !== b.submitted) return Number(b.submitted) - Number(a.submitted);
      const aTime = a.submittedAt ? Date.parse(a.submittedAt) : Number.MAX_SAFE_INTEGER;
      const bTime = b.submittedAt ? Date.parse(b.submittedAt) : Number.MAX_SAFE_INTEGER;
      if (aTime !== bTime) return aTime - bTime;
      return a.username.localeCompare(b.username, "ko");
    })
    .map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      submitted: entry.submitted,
      points: entry.points,
      winnerHits: entry.winnerHits,
      scoreHits: entry.scoreHits,
      usernameKey: entry.usernameKey,
    }));

  const currentUser =
    currentUsernameKey && currentUsernameKey !== ADMIN_USERNAME_KEY
      ? rankings.find((entry) => entry.usernameKey === currentUsernameKey) || null
      : null;

  return {
    currentUser: currentUser
      ? {
          rank: currentUser.rank,
          username: currentUser.username,
          points: currentUser.points,
          winnerHits: currentUser.winnerHits,
          scoreHits: currentUser.scoreHits,
        }
      : null,
    top10: rankings.slice(0, 10).map((entry) => ({
      rank: entry.rank,
      username: entry.username,
      points: entry.points,
      winnerHits: entry.winnerHits,
      scoreHits: entry.scoreHits,
      submitted: entry.submitted,
    })),
  };
}

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let store;
  if (!fs.existsSync(STORE_PATH)) {
    store = {
      users: [],
      predictions: {},
      globalBracket: defaultGlobalBracket(),
      settings: defaultSettings(),
      actualResults: defaultActualResults(),
    };
  } else {
    store = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    if (!Array.isArray(store.users)) {
      store.users = [];
    }
    if (!store.predictions || typeof store.predictions !== "object") {
      store.predictions = {};
    }
    store.globalBracket = {
      ...defaultGlobalBracket(),
      ...(store.globalBracket || {}),
      entryAssignments: normalizeEntryAssignments(store.globalBracket?.entryAssignments),
    };
    store.settings = {
      ...defaultSettings(),
      ...(store.settings || {}),
      predictionWindowOpen:
        store.settings?.predictionWindowOpen !== undefined
          ? Boolean(store.settings.predictionWindowOpen)
          : true,
    };
    store.actualResults = {
      ...defaultActualResults(),
      ...(store.actualResults || {}),
      results: normalizeResults(store.actualResults?.results),
    };
  }

  const adminExists = store.users.some((user) => user.usernameKey === ADMIN_USERNAME_KEY);
  if (!adminExists) {
    const passwordData = hashPassword(ADMIN_PASSWORD);
    store.users.push({
      usernameKey: ADMIN_USERNAME_KEY,
      usernameDisplay: ADMIN_USERNAME,
      salt: passwordData.salt,
      passwordHash: passwordData.hash,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });
  } else {
    store.users = store.users.map((user) =>
      user.usernameKey === ADMIN_USERNAME_KEY ? { ...user, isAdmin: true } : user,
    );
  }

  store.users = store.users.map((user) => ({
    ...user,
    isAdmin: Boolean(user.isAdmin),
  }));

  store.users.forEach((user) => {
    const existingPrediction = store.predictions[user.usernameKey];
    store.predictions[user.usernameKey] = {
      ...defaultSubmittedPrediction(),
      ...(existingPrediction && typeof existingPrediction === "object" ? existingPrediction : {}),
      submitted: Boolean(existingPrediction?.submitted),
      results: normalizeResults(existingPrediction?.results),
      submittedAt: existingPrediction?.submittedAt || null,
    };
  });

  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function parseCookies(cookieHeader = "") {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        const key = index >= 0 ? part.slice(0, index) : part;
        const value = index >= 0 ? part.slice(index + 1) : "";
        return [key, decodeURIComponent(value)];
      }),
  );
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function notFound(res) {
  sendText(res, 404, "Not found");
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function createSession(usernameKey) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, usernameKey);
  return token;
}

function clearSession(token) {
  if (token) {
    sessions.delete(token);
  }
}

function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const usernameKey = sessions.get(token);
  if (!usernameKey) {
    return null;
  }

  const store = readStore();
  const user = store.users.find((candidate) => candidate.usernameKey === usernameKey);
  return user ? { store, user, token } : null;
}

function getUserPrediction(store, usernameKey) {
  return {
    ...defaultSubmittedPrediction(),
    ...(store.predictions[usernameKey] || {}),
    submitted: Boolean(store.predictions[usernameKey]?.submitted),
    results: normalizeResults(store.predictions[usernameKey]?.results),
    submittedAt: store.predictions[usernameKey]?.submittedAt || null,
  };
}

function sessionPayload(store, user = null) {
  return {
    authenticated: Boolean(user),
    user: user
      ? {
          username: user.usernameDisplay,
          isAdmin: Boolean(user.isAdmin),
        }
      : null,
    submittedPrediction: user ? getUserPrediction(store, user.usernameKey) : defaultSubmittedPrediction(),
    globalBracket: store.globalBracket || defaultGlobalBracket(),
    settings: store.settings || defaultSettings(),
    actualResults: store.actualResults || defaultActualResults(),
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/session") {
    const session = getSessionUser(req);
    const store = session ? session.store : readStore();
    sendJson(res, 200, sessionPayload(store, session?.user || null));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/rankings") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    sendJson(res, 200, buildRankingsPayload(session.store, session.user.usernameKey));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/register") {
    const body = await readRequestBody(req);
    const usernameDisplay = sanitizeUsername(body.username);
    const usernameKey = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (usernameDisplay.length < 3 || password.length < 4) {
      sendJson(res, 400, { message: "아이디는 3자 이상, 비밀번호는 4자 이상이어야 합니다." });
      return true;
    }

    const store = readStore();
    const exists = store.users.some((user) => user.usernameKey === usernameKey);
    if (exists) {
      sendJson(res, 409, { message: "이미 존재하는 아이디입니다." });
      return true;
    }

    const passwordData = hashPassword(password);
    store.users.push({
      usernameKey,
      usernameDisplay,
      salt: passwordData.salt,
      passwordHash: passwordData.hash,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });
    store.predictions[usernameKey] = defaultSubmittedPrediction();
    writeStore(store);

    const token = createSession(usernameKey);
    sendJson(
      res,
      201,
      {
        message: "회원가입이 완료되었습니다.",
        ...sessionPayload(store, store.users.find((user) => user.usernameKey === usernameKey)),
      },
      {
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`,
      },
    );
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await readRequestBody(req);
    const usernameKey = normalizeUsername(body.username);
    const password = String(body.password || "");
    const store = readStore();
    const user = store.users.find((candidate) => candidate.usernameKey === usernameKey);

    if (!user || !verifyPassword(password, user)) {
      sendJson(res, 401, { message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      return true;
    }

    const token = createSession(usernameKey);
    sendJson(
      res,
      200,
      {
        message: "로그인되었습니다.",
        ...sessionPayload(store, user),
      },
      {
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`,
      },
    );
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/logout") {
    const cookies = parseCookies(req.headers.cookie);
    clearSession(cookies[SESSION_COOKIE]);
    sendJson(
      res,
      200,
      { message: "로그아웃되었습니다." },
      { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax` },
    );
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/prediction/submit") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    if (session.user.isAdmin) {
      sendJson(res, 403, { message: "Admin 계정은 예측 제출 대상이 아닙니다." });
      return true;
    }

    if (!session.store.settings.predictionWindowOpen) {
      sendJson(res, 403, { message: "예측이 종료되어 더이상 제출할 수 없습니다." });
      return true;
    }

    const current = getUserPrediction(session.store, session.user.usernameKey);
    if (current.submitted) {
      sendJson(res, 409, { message: "이미 예측을 확정했습니다." });
      return true;
    }

    const body = await readRequestBody(req);
    const submittedPrediction = normalizeSubmittedPredictionPayload(body);
    if (!submittedPrediction) {
      sendJson(res, 400, { message: "제출할 예측 데이터가 올바르지 않습니다." });
      return true;
    }

    session.store.predictions[session.user.usernameKey] = submittedPrediction;
    writeStore(session.store);
    sendJson(res, 200, {
      message: "예측이 확정되었습니다.",
      submittedPrediction,
    });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/admin/bracket") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    if (!session.user.isAdmin) {
      sendJson(res, 403, { message: "Admin만 대진표를 적용할 수 있습니다." });
      return true;
    }

    const body = await readRequestBody(req);
    const globalBracket = normalizeGlobalBracketPayload(body);
    if (!globalBracket) {
      sendJson(res, 400, { message: "적용할 대진표 데이터가 올바르지 않습니다." });
      return true;
    }

    session.store.globalBracket = {
      ...globalBracket,
      publishedAt: new Date().toISOString(),
      publishedBy: session.user.usernameDisplay,
    };
    writeStore(session.store);
    sendJson(res, 200, {
      message: "대진표가 전체 계정에 적용되었습니다.",
      globalBracket: session.store.globalBracket,
    });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/admin/prediction-window") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    if (!session.user.isAdmin) {
      sendJson(res, 403, { message: "Admin만 예측 종료를 변경할 수 있습니다." });
      return true;
    }

    const body = await readRequestBody(req);
    const isOpen = Boolean(body.isOpen);
    session.store.settings = {
      ...session.store.settings,
      predictionWindowOpen: isOpen,
      predictionClosedAt: isOpen ? null : new Date().toISOString(),
      predictionClosedBy: isOpen ? null : session.user.usernameDisplay,
    };
    writeStore(session.store);
    sendJson(res, 200, {
      message: isOpen ? "예측 가능 상태로 전환했습니다." : "예측이 종료되었습니다.",
      settings: session.store.settings,
    });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/admin/results") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    if (!session.user.isAdmin) {
      sendJson(res, 403, { message: "Admin만 실제 결과를 저장할 수 있습니다." });
      return true;
    }

    const body = await readRequestBody(req);
    const actualResults = normalizeActualResultsPayload(body);
    if (!actualResults) {
      sendJson(res, 400, { message: "결과 데이터가 올바르지 않습니다." });
      return true;
    }

    session.store.actualResults = {
      ...actualResults,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.usernameDisplay,
    };
    writeStore(session.store);
    sendJson(res, 200, {
      message: "결과가 저장되었습니다.",
      actualResults: session.store.actualResults,
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/reset-all") {
    const session = getSessionUser(req);
    if (!session) {
      sendJson(res, 401, { message: "로그인이 필요합니다." });
      return true;
    }

    if (!session.user.isAdmin) {
      sendJson(res, 403, { message: "Admin만 전체 초기화를 할 수 있습니다." });
      return true;
    }

    session.store.globalBracket = defaultGlobalBracket();
    session.store.settings = defaultSettings();
    session.store.actualResults = defaultActualResults();

    session.store.users.forEach((user) => {
      session.store.predictions[user.usernameKey] = defaultSubmittedPrediction();
    });

    writeStore(session.store);
    sendJson(res, 200, {
      message: "대진표, 결과, 예측 종료 상태, 유저 예측이 모두 초기화되었습니다.",
      ...sessionPayload(session.store, session.user),
    });
    return true;
  }

  return false;
}

function serveStatic(req, res, url) {
  const rawPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT_DIR, safePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    notFound(res);
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    notFound(res);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": STATIC_TYPES[ext] || "application/octet-stream",
  };

  if (ext === ".html" || ext === ".js" || ext === ".css") {
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
  }

  res.writeHead(200, headers);
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) {
        notFound(res);
      }
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { message: "서버 오류가 발생했습니다." });
  }
});

ensureStore();
server.listen(PORT, HOST, () => {
  console.log(`VCT Predictor server running at http://${HOST}:${PORT}`);
});
