from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np


class APP:

    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

        # Load model
        self.pipe = self.load_model()

        # Load data sekolah
        self.cutoff_dict = self.load_cutoff()
        self.daya_tampung_dict = self.load_daya_tampung()

        self.median_cutoff = np.median(list(self.cutoff_dict.values()))
        self.mean_cut, self.std_cut = self.calculate_cutoff_stats()

        self.register_routes()

    # ================= LOADERS =================

    def load_model(self):
        return joblib.load("backend/Stacking_SVM___RF.pkl")

    def load_cutoff(self):
        return {
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

    def load_daya_tampung(self):
        return {
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

    def calculate_cutoff_stats(self):
        cutoff_values = np.array(list(self.cutoff_dict.values()))
        return cutoff_values.mean(), cutoff_values.std()

    # ================= HELPER =================

    def normalize_sekolah(self, nama):
        return (
            nama.upper()
            .replace("  ", " ")
            .replace("SMA NEGERI 0", "SMA NEGERI ")
            .strip()
        )

    def get_zona_cutoff(self, cutoff):
        low_cut = self.mean_cut - self.std_cut
        high_cut = self.mean_cut + self.std_cut

        if cutoff < low_cut:
            return 0
        elif cutoff < high_cut:
            return 1
        else:
            return 2

    def calculate_features(self, rapor, tka, jarak, sekolah):
        cutoff = self.cutoff_dict.get(sekolah, self.median_cutoff)
        daya = self.daya_tampung_dict.get(sekolah, 0)

        skor = 0.4 * rapor + 0.6 * tka
        zona = self.get_zona_cutoff(cutoff)

        sample = pd.DataFrame([{
            "skor_seleksi": skor,
            "zona_cutoff": zona,
            "log_jarak_rumah": np.log1p(jarak),
            "daya_tampung": daya
        }])

        return sample, skor, zona, daya

    # ================= ROUTES =================

    def register_routes(self):

        @self.app.route("/")
        def home():
            return "API SPMB TKA Aktif"

        @self.app.route("/predict", methods=["POST"])
        def predict():
            return self.handle_predict()

    def handle_predict(self):
        try:
            data = request.get_json()

            rapor = float(data["rapor_avg"])
            tka = float(data["nilai_tes_tka"])
            jarak = float(data["jarak_rumah_km"])
            sekolah_raw = data["sekolah_tujuan"]

            sekolah = self.normalize_sekolah(sekolah_raw)

            sample, skor, zona, daya = self.calculate_features(
                rapor, tka, jarak, sekolah
            )

            prob = self.pipe.predict_proba(sample)[0, 1]

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


# ================= RUN =================

if __name__ == "__main__":
    app_instance = APP()
    app_instance.app.run(host="127.0.0.1", port=5000, debug=True)