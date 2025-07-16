import { Pool } from 'pg';
import { Handler } from '@netlify/functions';
import { ThreatLog } from '../../src/types'; // Importamos el tipo desde tu archivo original

export const handler: Handler = async (event, context) => {
  // Usaremos una variable de entorno para la cadena de conexión por seguridad
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return { statusCode: 500, body: JSON.stringify({ error: "DATABASE_URL no está configurada." }) };
  }

  const pool = new Pool({ connectionString });

  try {
    // Pedimos a la DB 100 registros aleatorios para que la demo sea rápida
    const { rows } = await pool.query('SELECT url, is_phishing FROM threat_logs ORDER BY RANDOM() LIMIT 100;');
    
    // Transformamos los datos al formato exacto que el frontend espera
    const threatLogs: ThreatLog[] = rows.map((row, index) => ({
      id: String(index + 1),
      url: row.url,
      isPhishing: row.is_phishing,
      confidenceScore: row.is_phishing ? 0.95 : 0.05,
      analysisDetails: [{
        module: 'Database Record',
        reason: `Entrada cargada desde el dataset de Neon.tech.`,
        triggeredRules: [row.is_phishing ? 'KnownPhishing' : 'KnownLegitimate']
      }],
      visualSimilarityScore: 0,
      suggestedLegitimateSite: '',
      timestamp: new Date().toISOString()
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(threatLogs),
    };
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Fallo al obtener los datos.' }) };
  } finally {
    await pool.end();
  }
};