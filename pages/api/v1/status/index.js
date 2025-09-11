import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const version = await database.query(`SHOW server_version;`);
  const maxConnections = await database.query(
    `SELECT setting FROM PG_SETTINGS WHERE NAME = 'max_connections';`,
  );
  const activiesConnections = await database.query(
    `SELECT COUNT(*) FROM pg_stat_activity;`,
  );

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: version.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].setting),
        actives_connections: parseInt(activiesConnections.rows[0].count),
      },
    },
  });
}

export default status;
