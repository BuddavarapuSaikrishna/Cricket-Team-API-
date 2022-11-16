const express = require("express");
const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let database = null;

const initializationDBAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server is running in the port 3000");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
    process.exit(1);
  }
};

const CreateAndChangeObject = (Object) => {
  return {
    playerId: Object.player_id,
    playerName: Object.player_name,
    jerseyNumber: Object.jersey_number,
    role: Object.role,
  };
};

initializationDBAndServer();

app.get("/players", async (request, response) => {
  const dbQuery = `SELECT * FROM cricket_team`;

  const player_details = await database.all(dbQuery);

  response.send(
    player_details.map((eachPlayer) => CreateAndChangeObject(eachPlayer))
  );
});

app.post("/players", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const dbQuery = `INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES
    ('${playerName}',
      ${jerseyNumber},
      '${role}'
    );
    `;
  await database.run(dbQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const dbQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;

  const Player = await database.get(dbQuery);
  response.send(CreateAndChangeObject(Player));
});

app.put("/players/:playerId", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;

  const dbQuery = `UPDATE cricket_team SET 
    
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${playerId};
    `;
  await database.run(dbQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const dbQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;

  await database.run(dbQuery);
  response.send("Player removed");
});
