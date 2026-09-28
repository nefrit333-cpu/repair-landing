const formSection = document.querySelector("#request-form");
const form = document.querySelector("#estimate-form");
const status = form.querySelector(".form-status");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

const validators = {
  name(value) {
    if (value.trim().length < 2) {
      return "Введите имя, минимум 2 символа.";
    }
    return "";
  },
  phone(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 12) {
      return "Введите телефон в удобном формате, минимум 10 цифр.";
    }
    return "";
  },
  apartment(value) {
    if (!value) {
      return "Выберите тип квартиры.";
    }
    return "";
  },
  area(value) {
    const area = Number(value);
    if (!area || area < 10 || area > 250) {
      return "Укажите площадь от 10 до 250 м².";
    }
    return "";
  },
  scope(value) {
    if (value.trim().length < 12) {
      return "Коротко опишите задачу, чтобы расчёт был полезнее.";
    }
    return "";
  },
};

function getFieldErrorElement(field) {
  return form.querySelector(`[data-error-for="${field.name}"]`);
}

function validateField(field) {
  const validate = validators[field.name];
  if (!validate) {
    return true;
  }

  const message = validate(field.value);
  const errorElement = getFieldErrorElement(field);
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", message ? "true" : "false");

  if (errorElement) {
    errorElement.textContent = message;
  }

  return !message;
}

function validateForm() {
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const results = fields.map(validateField);
  return results.every(Boolean);
}

function clearStatus() {
  status.textContent = "";
  status.classList.remove("is-success");
}

function clearFormErrors() {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.classList.remove("is-invalid");
    field.setAttribute("aria-invalid", "false");
  });

  form.querySelectorAll(".field-error").forEach((errorElement) => {
    errorElement.textContent = "";
  });
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    clearStatus();
    form.querySelector(".is-invalid")?.focus();
    return;
  }

  status.textContent = "Спасибо. Данные приняты, можно передавать заявку на расчёт.";
  status.classList.add("is-success");
  form.reset();
  clearFormErrors();
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href="#request-form"]');
  if (link) {
    event.preventDefault();
    closeMobileMenu();
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      form.querySelector("input, select, textarea")?.focus({ preventScroll: true });
    }, 520);
  }
});

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  mobileMenu.classList.remove("is-open");
}

function toggleMobileMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
  mobileMenu.classList.toggle("is-open", !isOpen);
}

menuToggle?.addEventListener("click", toggleMobileMenu);

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

function handleFieldEdit(field) {
  clearStatus();
  if (field.classList.contains("is-invalid")) {
    validateField(field);
  }
}

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => handleFieldEdit(field));
  field.addEventListener("change", () => handleFieldEdit(field));
});

form.addEventListener("submit", handleSubmit);
