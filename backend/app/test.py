import pandas as pd
from sqlalchemy import create_engine

# Configura tu conexión real aquí
db_url = "postgresql://ianvicente:Axcarlo1203%40@localhost:5431/nba_tracker"
engine = create_engine(db_url)

# Cargar el archivo Excel completo
df_raw = pd.read_excel("/Users/ianvicente/Desktop/NBA-Tracker/Out_6.xlsx")

# Escribir en la base de datos (sobreescribe si existe)
df_raw.to_sql("raw_player_data", engine, if_exists="replace", index=False)

print("✅ Todos los datos del Excel han sido insertados en 'raw_player_data'")
