import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Obtenemos la URL de la base de datos de las variables de entorno
const connectionString = process.env.DATABASE_URL!;

// Iniciamos el cliente de Postgres
const client = postgres(connectionString, { prepare: false });

// Exportamos 'db' directamente, que es lo que tus APIs están esperando
export const db = drizzle(client, { schema });

export { schema };