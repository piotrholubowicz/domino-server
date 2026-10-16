const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../app");

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("domino-server API lifecycle", async (t) => {
  const jsonHeader = { "Content-Type": "application/json" };
  const authB2 = {
    "Content-Type": "application/json",
    Authorization: "Basic QnJhdm86QjI=",
  };

  // 1. Initial state: NO_GAME
  await t.test("GET /game returns NO_GAME initially", async () => {
    const res = await fetch(`${baseUrl}/game`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { state: "NO_GAME" });
  });

  await t.test("GET /players returns 404 when no game is active", async () => {
    const res = await fetch(`${baseUrl}/players`);
    assert.equal(res.status, 404);
  });

  // 2. Validation when creating game
  await t.test("POST /game with missing or invalid players fails", async () => {
    const res1 = await fetch(`${baseUrl}/game`, {
      method: "POST",
      headers: jsonHeader,
      body: JSON.stringify({ players: ["Alpha", "Bravo"] }),
    });
    assert.equal(res1.status, 400);

    const res2 = await fetch(`${baseUrl}/game`, {
      method: "POST",
      headers: jsonHeader,
      body: JSON.stringify({ players: ["Alpha", "Bravo", "Alpha", "Delta"] }),
    });
    assert.equal(res2.status, 400);
  });

  // 3. Create mock game
  await t.test("POST /game creates a game successfully", async () => {
    const res = await fetch(`${baseUrl}/game?mock=1`, {
      method: "POST",
      headers: jsonHeader,
      body: JSON.stringify({
        players: ["Alpha", "Bravo", "Charlie", "Delta"],
      }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.id, "X");
    assert.equal(body.state, "GAME_IN_PROGRESS");
    assert.equal(body.currentPlayer, "Bravo");
  });

  await t.test("POST /game returns 409 when game already exists", async () => {
    const res = await fetch(`${baseUrl}/game`, {
      method: "POST",
      headers: jsonHeader,
      body: JSON.stringify({
        players: ["Alpha", "Bravo", "Charlie", "Delta"],
      }),
    });
    assert.equal(res.status, 409);
  });

  // 4. Players list
  await t.test("GET /players returns active player list", async () => {
    const res = await fetch(`${baseUrl}/players`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, ["Alpha", "Bravo", "Charlie", "Delta"]);
  });

  // 5. Player passwords
  await t.test("PUT /players sets passwords", async () => {
    for (const [player, pwd] of [
      ["Alpha", "A1"],
      ["Bravo", "B2"],
      ["Charlie", "C3"],
      ["Delta", "D4"],
    ]) {
      const res = await fetch(`${baseUrl}/players/${player}`, {
        method: "PUT",
        headers: jsonHeader,
        body: JSON.stringify({ password: pwd }),
      });
      assert.equal(res.status, 204);
    }
  });

  await t.test("PUT /players password idempotency and conflict", async () => {
    // Same password -> 204
    const resSame = await fetch(`${baseUrl}/players/Bravo`, {
      method: "PUT",
      headers: jsonHeader,
      body: JSON.stringify({ password: "B2" }),
    });
    assert.equal(resSame.status, 204);

    // Different password -> 409
    const resDiff = await fetch(`${baseUrl}/players/Bravo`, {
      method: "PUT",
      headers: jsonHeader,
      body: JSON.stringify({ password: "DifferentPassword" }),
    });
    assert.equal(resDiff.status, 409);
  });

  // 6. Game view with and without authentication
  await t.test("GET /game redirects to /game/X", async () => {
    const res = await fetch(`${baseUrl}/game`, { redirect: "manual" });
    assert.equal(res.status, 302);
    assert.match(res.headers.get("location"), /game\/X/);
  });

  await t.test("GET /game/X unauthenticated hides other hands", async () => {
    const res = await fetch(`${baseUrl}/game/X`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(typeof body.hands.Bravo, "number");
    assert.equal(body.hands.Bravo, 7);
  });

  await t.test("GET /game/X with invalid auth returns 403", async () => {
    const res = await fetch(`${baseUrl}/game/X`, {
      headers: {
        Authorization: "Basic QnJhdm86V3Jvbmc=", // Bravo:Wrong
      },
    });
    assert.equal(res.status, 403);
  });

  await t.test("GET /game/X with valid auth exposes player hand", async () => {
    const res = await fetch(`${baseUrl}/game/X`, { headers: authB2 });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.hands.Bravo));
    assert.equal(body.hands.Bravo.length, 7);
  });

  // 7. Making moves
  await t.test("POST /game/X rejects move when not player's turn", async () => {
    const res = await fetch(`${baseUrl}/game/X`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic QWxwaGE6QTE=", // Alpha (not turn)
      },
      body: JSON.stringify({
        move: { piece: [6, 6], placement: "left" },
      }),
    });
    assert.equal(res.status, 400);
  });

  await t.test("POST /game/X accepts valid move from current player", async () => {
    const res = await fetch(`${baseUrl}/game/X`, {
      method: "POST",
      headers: authB2,
      body: JSON.stringify({
        move: { piece: [6, 6], placement: "left" },
      }),
    });
    assert.equal(res.status, 204);

    // Verify next player is Charlie
    const checkRes = await fetch(`${baseUrl}/game/X`);
    const checkBody = await checkRes.json();
    assert.equal(checkBody.currentPlayer, "Charlie");
    assert.deepEqual(checkBody.table, [[6, 6]]);
  });

  // 8. Reset player password and cleanup
  await t.test("DELETE /players/:id resets password", async () => {
    const res = await fetch(`${baseUrl}/players/Alpha`, {
      method: "DELETE",
    });
    assert.equal(res.status, 204);
  });

  await t.test("DELETE /game/X ends the game", async () => {
    const res = await fetch(`${baseUrl}/game/X`, {
      method: "DELETE",
    });
    assert.equal(res.status, 204);

    const checkRes = await fetch(`${baseUrl}/game`);
    const checkBody = await checkRes.json();
    assert.deepEqual(checkBody, { state: "NO_GAME" });
  });
});
