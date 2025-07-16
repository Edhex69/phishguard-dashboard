import pandas as pd
import psycopg2
import sys

# 1. Solicitar la cadena de conexión
db_connection_string_raw = input("Pega tu cadena de conexión de Neon y presiona Enter:\n")
db_connection_string = db_connection_string_raw.strip()

if not db_connection_string.startswith("postgresql://"):
    print("La cadena de conexión no parece válida. Asegúrate de que empiece con 'postgresql://'.")
    sys.exit()

# 2. Cargar el dataset CSV y seleccionar solo las columnas necesarias
try:
    # El dataset no tiene una columna de URL, así que construiremos una de ejemplo 
    # y usaremos la columna de clasificación real.
    print("Cargando el archivo phishing_dataset.csv...")
    df = pd.read_csv('phishing_dataset.csv', usecols=['CLASS_LABEL'])
    
    # Como no tenemos URLs, crearemos URLs de ejemplo para la demo
    df['url'] = [f"http://example-site-{i}.com" for i in range(len(df))]
    
    # La columna 'CLASS_LABEL' contiene 0 para legítimo y 1 para phishing.
    # La convertimos a booleano (True si es 1, False si es 0)
    df['is_phishing'] = df['CLASS_LABEL'].apply(lambda x: True if x == 1 else False)
    
except FileNotFoundError:
    print("Error: 'phishing_dataset.csv' no encontrado.")
    sys.exit()
except KeyError as e:
    print(f"Error de columna: No se encontró la columna esperada {e} en el archivo CSV.")
    sys.exit()

conn = None
try:
    # 3. Conectar a la base de datos de Neon
    print("Conectando a la base de datos de Neon...")
    conn = psycopg2.connect(db_connection_string)
    cur = conn.cursor()

    # 4. Crear la tabla si no existe
    print("Creando la tabla 'threat_logs' si no existe...")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS threat_logs (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
            is_phishing BOOLEAN NOT NULL
        );
    """)
    conn.commit()

    # 5. Insertar los datos en la tabla
    total_rows = len(df)
    print(f"Insertando {total_rows} registros...")
    for index, row in df.iterrows():
        cur.execute(
            "INSERT INTO threat_logs (url, is_phishing) VALUES (%s, %s) ON CONFLICT (url) DO NOTHING",
            (row['url'], row['is_phishing'])
        )
        if (index + 1) % 1000 == 0:
            print(f"Progreso: {index + 1} / {total_rows} registros procesados...")
    
    conn.commit()
    cur.close()
    print("¡Éxito! Los datos han sido cargados a tu base de datos en Neon.")

except Exception as e:
    print(f"Ocurrió un error: {e}")
finally:
    if conn is not None:
        conn.close()
        print("Conexión cerrada.")