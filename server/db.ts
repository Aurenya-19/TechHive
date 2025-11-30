import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Optimize connection pool for 20k+ concurrent users
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 100, // Max 100 concurrent connections (supports 20k+ users)
  min: 10, // Maintain minimum 10 warm connections
  idleTimeoutMillis: 60000, // Keep idle connections longer
  connectionTimeoutMillis: 5000, // Longer timeout for queue
  statement_timeout: 30000, // Query timeout 30s
  query_timeout: 30000,
});

// Connection pool monitoring
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export { pool };
export const db = drizzle({ client: pool, schema });
