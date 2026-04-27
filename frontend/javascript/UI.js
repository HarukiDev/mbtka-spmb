export class UI {
	constructor() {
		this.loadingInterval = null;
		this.sudahKlikPrediksi = false;
	}

	/* ================= VALIDATION ================= */

	initFormValidationUI() {
		const predictBtn = document.getElementById("predictBtn");

		predictBtn?.addEventListener("click", () => {
			this.sudahKlikPrediksi = true;

			this.validateClick(document.getElementById("rapor_avg"), 0, 100);
			this.validateClick(document.getElementById("nilai_tes_tka"), 0, 100);
			this.validateClick(document.getElementById("jarak_rumah_km"), 0, 50);
		});

		this.initRealtimeValidation();
        this.initStarRealtime();
	}

	validateClick(input, min, max) {
		if (!input) return;

		const raw = input.value;
		const value = parseFloat(raw.replace(",", "."));

		if (!raw || isNaN(value) || value < min || value > max) {
			this.addError(input);
		} else {
			this.removeError(input);
		}
	}

	validateRealtime(input, min, max) {
		if (!input) return;

		const raw = input.value;
		const value = parseFloat(raw.replace(",", "."));

		if (!raw) {
			this.removeError(input);
			return;
		}

		if (isNaN(value) || value < min || value > max) {
			this.addError(input);
			return;
		}

		this.removeError(input);
	}

	initRealtimeValidation() {
		const fields = [
			{ id: "rapor_avg", min: 0, max: 100 },
			{ id: "nilai_tes_tka", min: 0, max: 100 },
			{ id: "jarak_rumah_km", min: 0, max: 50 },
		];

		fields.forEach(({ id, min, max }) => {
			const input = document.getElementById(id);

			input?.addEventListener("input", () => {
				this.validateRealtime(input, min, max);
			});
		});
	}

    initStarRealtime() {
        const starMap = {
            rapor_avg: "label_rapor",
            nilai_tes_tka: "label_tka",
            jarak_rumah_km: "label_jarak",
        };

        Object.keys(starMap).forEach((inputId) => {
            const input = document.getElementById(inputId);
            const label = document.getElementById(starMap[inputId]);
            const star = label?.querySelector(".required-star");

            input?.addEventListener("input", () => {
                if (!star) return;

                star.classList.toggle("hidden", input.value.trim() !== "");
            });
        });
    }

	addError(input) {
		input.classList.add("border-red-500", "ring-2", "ring-red-200");
	}

	removeError(input) {
		input.classList.remove("border-red-500", "ring-2", "ring-red-200");
	}

	resetValidationUI() {
		this.sudahKlikPrediksi = false;

		document.querySelectorAll(".input-field").forEach((input) => {
			this.removeError(input);
		});

		document.querySelectorAll(".required-star").forEach((star) => {
			star.classList.remove("hidden");
		});
	}

	/* ================= LOADING ================= */

	startLoading() {
		const el = document.getElementById("resultValue");
		let dots = 0;
		el.textContent = "Tunggu";

		this.loadingInterval = setInterval(() => {
			dots = (dots + 1) % 4;
			el.textContent = "Tunggu" + ".".repeat(dots);
		}, 500);
	}

	stopLoading(html) {
		clearInterval(this.loadingInterval);
		document.getElementById("resultValue").innerHTML = html;
	}

	showFormAlert() {
		const alertBox = document.getElementById("formAlert");
		if (!alertBox) return;

		alertBox.classList.remove("hidden");

		setTimeout(() => {
			alertBox.classList.add("hidden");
		}, 3000);
	}
}