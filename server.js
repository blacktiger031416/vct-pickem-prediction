
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
    await writeStore(session.store);
    sendJson(res, 200, {
      message: isOpen ? "예측 가능 상태로 전환했습니다." : "예측이 종료되었습니다.",
      settings: session.store.settings,
    });
    return true;
  }

  if (req.method === "PUT" && url.pathname === "/api/admin/results") {
    const session = await getSessionUser(req);
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
    await writeStore(session.store);
    sendJson(res, 200, {
      message: "결과가 저장되었습니다.",
      actualResults: session.store.actualResults,
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/reset-all") {
    const session = await getSessionUser(req);
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

    await writeStore(session.store);
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

async function startServer() {
  await ensureStore();
  server.listen(PORT, HOST, () => {
    console.log(`VCT Predictor server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
