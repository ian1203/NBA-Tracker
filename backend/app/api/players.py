from fastapi import APIRouter, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import SessionLocal
import pandas as pd
import numpy as np

router = APIRouter()


@router.get("/compare")
def compare_players(player1: str = Query(...), player2: str = Query(...)):
    db: Session = SessionLocal()

    query = text("""
        SELECT "Player", "Team", "Pos_per_game", "PTS", "AST", "TRB", "STL", "BLK",
               "TOV", "FG%", "3P%", "FT%", "PER", "USG%", "BPM",
               "ORB", "DRB", "ORB%", "DRB%", "TRB%", "STL%", "BLK%",
               "TS%", "3PAr", "FTr", "OWS", "DWS", "OBPM", "DBPM"
        FROM raw_player_data
        WHERE "Player" IN (:p1, :p2)
    """)

    try:
        df = pd.read_sql(query, db.bind, params={"p1": player1.strip(), "p2": player2.strip()})

        if df.empty:
            raise HTTPException(status_code=404, detail="One or both players not found")

        # Prefer rows where Team = '2TM', '3TM', etc., otherwise first available
        result = []
        for player in [player1, player2]:
            player_rows = df[df['Player'] == player]
            if player_rows.empty:
                raise HTTPException(status_code=404, detail=f"Player {player} not found")

            multi_team_row = player_rows[player_rows['Team'].str.contains('TM', na=False)]
            if not multi_team_row.empty:
                result.append(multi_team_row.iloc[0])
            else:
                result.append(player_rows.iloc[0])

        df_final = pd.DataFrame(result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

    COLUMN_REMAP = {
        "Player": "player",
        "Team": "team",
        "Pos_per_game": "position",
        "PTS": "pts",
        "AST": "ast",
        "TRB": "trb",
        "STL": "stl",
        "BLK": "blk",
        "TOV": "tov",
        "FG%": "fg_pct",
        "3P%": "threep_pct",
        "FT%": "ft_pct",
        "PER": "per",
        "USG%": "usg_pct",
        "BPM": "bpm",
        "ORB": "orb",
        "DRB": "drb",
        "ORB%": "orb_pct",
        "DRB%": "drb_pct",
        "TRB%": "trb_pct",
        "STL%": "stl_pct",
        "BLK%": "blk_pct",
        "TS%": "ts_pct",
        "3PAr": "threepar",
        "FTr": "ftr",
        "OWS": "ows",
        "DWS": "dws",
        "OBPM": "obpm",
        "DBPM": "dbpm",
    }

    df_final.rename(columns=COLUMN_REMAP, inplace=True)

    return df_final.to_dict(orient="records")


@router.get("/players")
def list_players():
    db: Session = SessionLocal()

    query = text("""
        SELECT DISTINCT "Player"
        FROM raw_player_data
        WHERE "Player" IS NOT NULL
        ORDER BY "Player"
    """)

    try:
        df = pd.read_sql(query, db.bind)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

    return df["Player"].tolist()


@router.get("/all_stats")
def get_all_stats():
    db: Session = SessionLocal()

    query = text("""
        SELECT "Player", "Team", "Pos_per_game", "PTS", "AST", "TRB", "STL", "BLK",
               "TOV", "FG%", "3P%", "FT%", "PER", "USG%", "BPM",
               "ORB", "DRB", "ORB%", "DRB%", "TRB%", "STL%", "BLK%",
               "TS%", "3PAr", "FTr", "OWS", "DWS", "OBPM", "DBPM"
        FROM raw_player_data
        WHERE "Player" IS NOT NULL
    """)

    try:
        df = pd.read_sql(query, db.bind)

        df.sort_values(by=["Player", "Team"], inplace=True)
        df = df[~df.duplicated(subset="Player", keep=False) | df["Team"].str.contains("TM")]
        df = df.drop_duplicates(subset="Player", keep="first")

        COLUMN_REMAP = {
            "Player": "player",
            "Team": "team",
            "Pos_per_game": "position",
            "PTS": "pts",
            "AST": "ast",
            "TRB": "trb",
            "STL": "stl",
            "BLK": "blk",
            "TOV": "tov",
            "FG%": "fg_pct",
            "3P%": "threep_pct",
            "FT%": "ft_pct",
            "PER": "per",
            "USG%": "usg_pct",
            "BPM": "bpm",
            "ORB": "orb",
            "DRB": "drb",
            "ORB%": "orb_pct",
            "DRB%": "drb_pct",
            "TRB%": "trb_pct",
            "STL%": "stl_pct",
            "BLK%": "blk_pct",
            "TS%": "ts_pct",
            "3PAr": "threepar",
            "FTr": "ftr",
            "OWS": "ows",
            "DWS": "dws",
            "OBPM": "obpm",
            "DBPM": "dbpm",
        }

        df.rename(columns=COLUMN_REMAP, inplace=True)

        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df = df.where(pd.notnull(df), None)

        return df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()