"""Versión ligera del inventario de acierta.pro para losprofesionalesinmobiliarios.com (casas, departamentos y terrenos con foto)."""
import json, os, re, urllib.request
FUENTE = os.environ.get("FUENTE", "https://acierta.pro/data.json")
d = json.load(open(FUENTE, encoding="utf-8")) if os.path.exists(FUENTE) else json.loads(urllib.request.urlopen(urllib.request.Request(FUENTE, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read())
TIPOS = {"departamento": "d", "casa": "c", "casa en condominio": "c", "terreno": "t", "terreno habitacional": "t"}
def n(v):
    try: return float(v)
    except Exception: return 0
out = []
for x in d:
    t = TIPOS.get(str(x.get("tipo", "")).lower())
    if not t or str(x.get("revisar")) == "True" or not x.get("foto") or n(x.get("precio")) < 1000: continue
    out.append({"e": x["eb"], "o": "V" if x.get("operacion") == "VENTA" else "R", "p": int(n(x["precio"])), "t": t, "r": int(n(x.get("recamaras"))) or None,
                "b": n(x.get("banos")) or None, "m": int(n(x.get("m2"))) or None, "c": str(x.get("colonia") or "")[:40], "u": str(x.get("municipio") or "")[:24],
                "f": x["foto"], "ti": re.sub(r"\s+", " ", str(x.get("titulo") or ""))[:90]})
json.dump(out, open("inventario.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(out), "propiedades;", round(os.path.getsize("inventario.json") / 1048576, 2), "MB")
