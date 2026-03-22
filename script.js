const THEME_KEY = "pos-theme";

function applyTheme(theme, button) {
	const isLight = theme === "light";
	document.body.classList.toggle("light-mode", isLight);

	if (!button) {
		return;
	}

	const icon = button.querySelector(".theme-icon");
	const label = button.querySelector(".theme-label");

	if (icon) {
		icon.textContent = isLight ? "☀" : "🌙";
	}

	if (label) {
		label.textContent = isLight ? "Light" : "Dark";
	}

	const nextModeLabel = isLight ? "dark" : "light";
	button.setAttribute("aria-label", `Switch to ${nextModeLabel} mode`);
}

document.addEventListener("DOMContentLoaded", () => {
	const toggleButton = document.getElementById("theme-toggle");

	if (!toggleButton) {
		return;
	}

	const savedTheme = localStorage.getItem(THEME_KEY);
	const initialTheme = savedTheme === "light" ? "light" : "dark";
	applyTheme(initialTheme, toggleButton);

	toggleButton.addEventListener("click", () => {
		const isLightMode = document.body.classList.contains("light-mode");
		const nextTheme = isLightMode ? "dark" : "light";

		applyTheme(nextTheme, toggleButton);
		localStorage.setItem(THEME_KEY, nextTheme);
	});
});
