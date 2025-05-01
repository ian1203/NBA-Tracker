from app.db.database import SessionLocal
from app.db.models import PlayerStats
import pandas as pd

def insert_player_data(df: pd.DataFrame):
    db = SessionLocal()
    try:
        for _, row in df.iterrows():
            player = PlayerStats(
                player=row.get("Player", ""),
                team=row.get("Team", ""),
                pos=row.get("Pos", "N/A"),
                pts=pd.to_numeric(row.get("PTS", None), errors="coerce"),
                ast=pd.to_numeric(row.get("AST", None), errors="coerce"),
                trb=pd.to_numeric(row.get("TRB", None), errors="coerce"),
                stl=pd.to_numeric(row.get("STL", None), errors="coerce"),
                blk=pd.to_numeric(row.get("BLK", None), errors="coerce"),
                tov=pd.to_numeric(row.get("TOV", None), errors="coerce"),
                fg_pct=pd.to_numeric(row.get("FG%", None), errors="coerce"),
                threep_pct=pd.to_numeric(row.get("3P%", None), errors="coerce"),
                ft_pct=pd.to_numeric(row.get("FT%", None), errors="coerce"),
                per=pd.to_numeric(row.get("PER", None), errors="coerce"),
                usg_pct=pd.to_numeric(row.get("USG%", None), errors="coerce"),
                bpm=pd.to_numeric(row.get("BPM", None), errors="coerce"),
            )
            db.add(player)
        db.commit()
        print("✅ Datos insertados exitosamente.")
    except Exception as e:
        db.rollback()
        print("❌ Error al insertar datos:", e)
    finally:
        db.close()
