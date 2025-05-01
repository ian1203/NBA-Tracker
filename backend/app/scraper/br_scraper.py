import pandas as pd
import requests
from bs4 import BeautifulSoup
from io import StringIO

def get_basketball_reference_table(url: str) -> pd.DataFrame:
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    # Buscar tabla real (ignorar comentarios HTML)
    comment_tables = soup.find_all(string=lambda text: isinstance(text, str) and "table" in text)
    for comment in comment_tables:
        try:
            temp_soup = BeautifulSoup(comment, "html.parser")
            table = temp_soup.find("table", {"class": "stats_table"})
            if table:
                df = pd.read_html(StringIO(str(table)))[0]

                # Eliminar filas duplicadas de encabezado
                df = df[df[df.columns[0]] != df.columns[0]]
                return df.reset_index(drop=True)
        except Exception:
            continue

    raise ValueError("❌ No se encontró una tabla válida en la URL proporcionada.")