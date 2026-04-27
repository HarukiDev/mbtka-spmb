import { UI } from "./UI.js";
import { Form } from "./form.js";
import { API } from "./API.js";

class Main {
    constructor() {
        this.ui = new UI();
        this.form = new Form();
        this.api = new API();

        this.init();
    }

    init() {
        this.ui.initFormValidationUI();
        this.predictBtn = document.getElementById("predictBtn");
        this.resetBtn = document.getElementById("resetBtn");
        this.registerEvents();
    }

    registerEvents() {
        this.predictBtn?.addEventListener("click", () => this.handlePredict());
        this.resetBtn?.addEventListener("click", () => this.handleReset());
    }

    async handlePredict() {
        const { isValid } = this.form.validateForm();

        if (!isValid) {
            this.ui.showFormAlert();
            return;
        }

        const formData = this.form.getFormData();
        this.ui.startLoading();

        try {
            const response = await this.api.predictKelulusan(formData);
            const result = await response.json();

            if (!response.ok) {
                this.ui.stopLoading("Error");
                return;
            }

            this.ui.stopLoading(
                `${(result.probability * 100).toFixed(1)} %`
            );

        } catch (err) {
            this.ui.stopLoading("Error");
        }
    }

    handleReset() {
        this.form.reset();
        this.ui.resetValidationUI();
        this.ui.stopLoading("0%");
    }
}

new Main();