# backend/app/create_tables.py

from app.db.models import Base
from app.db.database import engine

# Crear todas las tablas definidas en los modelos
Base.metadata.create_all(bind=engine)

print("✅ Tablas creadas exitosamente.")
