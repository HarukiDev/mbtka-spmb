from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL
# =========================
pipe = joblib.load("backend/model_stacking_tka.pkl")

# =========================
# CUTOFF SEKOLAH
# =========================
cutoff_dict = {
    "SMA NEGERI 1 PALEMBANG": 87.11,
    "SMA NEGERI 2 PALEMBANG": 67.89,
    "SMA NEGERI 3 PALEMBANG": 90.81,
    "SMA NEGERI 4 PALEMBANG": 72.91,
    "SMA NEGERI 5 PALEMBANG": 78.31,
    "SMA NEGERI 6 PALEMBANG": 83.00,
    "SMA NEGERI 7 PALEMBANG": 70.40,
    "SMA NEGERI 8 PALEMBANG": 76.11,
    "SMA NEGERI 9 PALEMBANG": 63.26,
    "SMA NEGERI 10 PALEMBANG": 83.57,
    "SMA NEGERI 11 PALEMBANG": 52.61,
    "SMA NEGERI 12 PALEMBANG": 41.38,
    "SMA NEGERI 13 PALEMBANG": 62.96,
    "SMA NEGERI 14 PALEMBANG": 59.45,
    "SMA NEGERI 15 PALEMBANG": 47.14,
    "SMA NEGERI 16 PALEMBANG": 60.79,
    "SMA NEGERI 18 PALEMBANG": 61.38,
    "SMA NEGERI 19 PALEMBANG": 60.12,
    "SMA NEGERI 20 PALEMBANG": 42.63,
    "SMA NEGERI 21 PALEMBANG": 43.79,
    "SMA NEGERI 22 PALEMBANG": 60.71
}

median_cutoff = np.median(list(cutoff_dict.values()))


daya_tampung_dict = {
    "SMA NEGERI 1 PALEMBANG": 65,
    "SMA NEGERI 2 PALEMBANG": 66,
    "SMA NEGERI 3 PALEMBANG": 87,
    "SMA NEGERI 4 PALEMBANG": 90,
    "SMA NEGERI 5 PALEMBANG": 84,
    "SMA NEGERI 6 PALEMBANG": 74,
    "SMA NEGERI 7 PALEMBANG": 87,
    "SMA NEGERI 8 PALEMBANG": 54,
    "SMA NEGERI 9 PALEMBANG": 68,
    "SMA NEGERI 10 PALEMBANG": 79,
    "SMA NEGERI 11 PALEMBANG": 70,
    "SMA NEGERI 12 PALEMBANG": 44,
    "SMA NEGERI 13 PALEMBANG": 137,
    "SMA NEGERI 14 PALEMBANG": 142,
    "SMA NEGERI 15 PALEMBANG": 124,
    "SMA NEGERI 16 PALEMBANG": 84,
    "SMA NEGERI 18 PALEMBANG": 84,
    "SMA NEGERI 19 PALEMBANG": 90,
    "SMA NEGERI 20 PALEMBANG": 43,
    "SMA NEGERI 21 PALEMBANG": 111,
    "SMA NEGERI 22 PALEMBANG": 167,
}

# =========================
# HELPER
# =========================
def normalize_sekolah(nama):
    return (
        nama.upper()
        .replace("  ", " ")
        .replace("SMA NEGERI 0", "SMA NEGERI ")
        .strip()
    )
    
cutoff_values = np.array(list(cutoff_dict.values()))

mean_cut = cutoff_values.mean()
std_cut  = cutoff_values.std()

low_cut  = mean_cut - std_cut
high_cut = mean_cut + std_cut

def get_zona_cutoff(cutoff):
    if cutoff < low_cut:
        return 0      # Longgar
    elif cutoff < high_cut:
        return 1      # Ketat
    else:
        return 2      # Sangat Ketat

# =========================
# ROUTES
# =========================
@app.route("/")
def home():
    return "API SPMB TKA Aktif"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        rapor = float(data["rapor_avg"])
        tka   = float(data["nilai_tes_tka"])
        jarak = float(data["jarak_rumah_km"])
        sekolah_raw = data["sekolah_tujuan"]

        sekolah = normalize_sekolah(sekolah_raw)

        cutoff = cutoff_dict.get(sekolah, median_cutoff)
        daya = daya_tampung_dict[sekolah]

        skor = 0.4 * rapor + 0.6 * tka
        zona = get_zona_cutoff(cutoff)

        sample = pd.DataFrame([{
            "skor_seleksi": skor,
            "zona_cutoff": zona,
            "log_jarak_rumah": np.log1p(jarak),
            "daya_tampung": daya
        }])

        prob = pipe.predict_proba(sample)[0, 1]

        return jsonify({
            "probability": round(float(prob), 4),
            "skor_seleksi": round(skor, 2),
            "zona_cutoff": int(zona),
            "daya_tampung": int(daya)
        })

    except KeyError as e:
        return jsonify({"message": f"Field hilang: {e}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)