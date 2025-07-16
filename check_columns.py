import pandas as pd

# Carga el archivo CSV
df = pd.read_csv('phishing_dataset.csv')

# Imprime los nombres de las columnas
print("Los nombres exactos de las columnas en tu archivo son:")
print(df.columns.tolist())