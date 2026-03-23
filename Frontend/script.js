const THEME_KEY = "pos-theme";
const ACCENT_KEY = "pos-accent";

function applyAccent(accentColor) {
	document.body.style.setProperty("--accent", accentColor);
}

function initAccentPicker() {
	const accentPicker = document.getElementById("accent-picker");
	const colorCircle = document.getElementById("color-theme-circle");
	const accentPalette = document.getElementById("accent-palette");
	const swatches = document.querySelectorAll(".accent-swatch");

	if (!accentPicker || !colorCircle || !accentPalette || swatches.length === 0) {
		return;
	}

	const defaultAccent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#f04b66";
	const savedAccent = localStorage.getItem(ACCENT_KEY) || defaultAccent;

	applyAccent(savedAccent);
	swatches.forEach((swatch) => {
		swatch.classList.toggle("active", swatch.dataset.color === savedAccent);
	});

	colorCircle.addEventListener("click", (event) => {
		event.stopPropagation();
		accentPalette.classList.toggle("hidden");
		const isExpanded = !accentPalette.classList.contains("hidden");
		colorCircle.setAttribute("aria-expanded", String(isExpanded));
	});

	swatches.forEach((swatch) => {
		swatch.addEventListener("click", (event) => {
			event.stopPropagation();
			const selectedAccent = swatch.dataset.color;

			if (!selectedAccent) {
				return;
			}

			applyAccent(selectedAccent);
			localStorage.setItem(ACCENT_KEY, selectedAccent);

			swatches.forEach((item) => item.classList.remove("active"));
			swatch.classList.add("active");

			accentPalette.classList.add("hidden");
			colorCircle.setAttribute("aria-expanded", "false");
		});
	});

	document.addEventListener("click", (event) => {
		if (!accentPicker.contains(event.target)) {
			accentPalette.classList.add("hidden");
			colorCircle.setAttribute("aria-expanded", "false");
		}
	});
}

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

	if (toggleButton) {
		const savedTheme = localStorage.getItem(THEME_KEY);
		const initialTheme = savedTheme === "light" ? "light" : "dark";
		applyTheme(initialTheme, toggleButton);

		toggleButton.addEventListener("click", () => {
			const isLightMode = document.body.classList.contains("light-mode");
			const nextTheme = isLightMode ? "dark" : "light";

			applyTheme(nextTheme, toggleButton);
			localStorage.setItem(THEME_KEY, nextTheme);
		});
	}

	initAccentPicker();
});

let username = "admin";
let password = "admin123";

const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (event) => {
	event.preventDefault();
	const username = document.getElementById("username").value.trim();
	const password = document.getElementById("password").value.trim();
	
	if (username === "") {
		alert("Please enter a username.");
		return;
	}else if (username !== "admin") {
		alert("Invalid username. Please try again.");
		return;
	}
	
	if (password === "") {
		alert("Please enter a password.");
		return;
	} else if (password !== "admin123") {
		alert("Invalid password. Please try again.");
		return;
	}
	
	document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;	
	document.getElementById("login").classList.add("hidden");
	document.getElementById("main-app").classList.remove("hidden");

	fetchCustomers(); // Load customers immediately after login
});

// --- Navigation Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        
        // Toggle Active Link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle Active Section
        pages.forEach(p => {
            p.classList.remove('active');
			p.classList.add('hidden');
            if(p.id === target){
				p.classList.add('active');
				p.classList.remove('hidden');
			} 
        });
    });
});




// ==========================================
// --- BACKEND INTEGRATION (SPRING BOOT) ---
// ==========================================
const API_BASE_URL = 'http://localhost:8080/api';
let customersList = [];

// 1. Fetch all customers from MySQL
function fetchCustomers() {
    fetch(`${API_BASE_URL}/customers/all`)
        .then(response => {
            if (!response.ok) throw new Error("Backend not running");
            return response.json();
        })
        .then(data => {
            customersList = data;
            renderCustomerTable();
            updateDashboardStats(); // Updates the total count on your dashboard
        })
        .catch(err => console.error("Could not fetch customers (Make sure Spring Boot is running!):", err));
}

// 2. Render customers into your HTML table
function renderCustomerTable() {
    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = ''; // Clear existing dummy rows

    customersList.forEach(cust => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>CUS-${cust.id}</td>
            <td>${cust.name}</td>
            <td>${cust.phone}</td>
            <td>${cust.address || 'N/A'}</td>
            <td><button class="btn-delete" onclick="alert('Delete functionality coming soon!')">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

// 3. Save a new customer to MySQL
const saveCustomerBtn = document.getElementById('save-customer');
if (saveCustomerBtn) {
    saveCustomerBtn.addEventListener('click', () => {
        const newCustomer = {
            name: document.getElementById('cust-name-input').value,
            phone: document.getElementById('cust-phone-input').value,
            address: document.getElementById('cust-address-input').value
        };

        fetch(`${API_BASE_URL}/customers/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCustomer)
        })
        .then(response => response.json())
        .then(savedCustomer => {
            alert('Customer Saved to POS System Database!');
            fetchCustomers(); // Refresh the table instantly
            
            // Clear the inputs
            document.getElementById('cust-name-input').value = '';
            document.getElementById('cust-phone-input').value = '';
            document.getElementById('cust-address-input').value = '';
        })
        .catch(err => alert("Error saving customer. Is your Java backend running?"));
    });
}

// 4. Update the Dashboard Number
function updateDashboardStats() {
    const statCustomers = document.getElementById('stat-customers-count');
    if (statCustomers) {
        statCustomers.textContent = customersList.length;
    }
}

