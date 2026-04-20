window.VocabularyEditor = (function () {
  let container = null;
  let vocabNameInput,
    vocabDescInput,
    vocabDateInput,
    vocabDateTypeInput,
    vocabLangSelect;
  let editingIndex = null;
  let onSaveCallback = null;

  function init(targetElement, onSave) {
    container = targetElement;
    onSaveCallback = onSave;
    renderBaseForm();
  }

  function renderBaseForm() {
    container.innerHTML = `
      <div class="position-relative">
        <div class="card shadow-sm rounded border-0 mb-5"> <!-- Margen inferior para el botón fijo -->
          <div class="card-header bg-light py-2 px-3">
            <h6 class="card-title d-flex align-items-center mb-0">
              <i class="bi bi-book me-1 text-primary"></i>Vocabulary Editor
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-tag me-1 text-primary"></i>
                Name
                <span class="ms-1 text-danger">*</span>
              </label>
              <input type="text" class="form-control form-control-sm rounded shadow-sm" 
                    id="vocabNameInput" placeholder="Enter vocabulary name" required />
              <div class="invalid-feedback small" id="nameError">Name is required</div>
            </div>
            
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-file-text me-1 text-primary"></i>
                Description
                <span class="ms-1 text-danger">*</span>
              </label>
              <textarea class="form-control form-control-sm shadow-sm rounded" id="vocabDescInput" 
                      rows="2" placeholder="Enter a short description" required></textarea>
              <div class="invalid-feedback small" id="descError">Description is required</div>
            </div>
            
            <div class="row g-2">
              <div class="col-md-6 mb-2">
                <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                  <i class="bi bi-calendar me-1 text-primary"></i>
                  Date
                </label>
                <div class="input-group input-group-sm shadow-sm rounded overflow-hidden">
                  <span class="input-group-text py-0 px-2 border-0 bg-light">
                    <i class="bi bi-clock"></i>
                  </span>
                  <input type="datetime-local" class="form-control form-control-sm border-0" 
                        id="vocabDateInput" placeholder="YYYY-MM-DDThh:mm:ss" />
                </div>
                <div class="form-text text-muted small">
                  <i class="bi bi-info-circle me-1"></i>Date in ISO 8601 format
                </div>
              </div>
              
              <div class="col-md-6 mb-2">
                <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                  <i class="bi bi-info-circle me-1 text-primary"></i>
                  Date Type
                </label>
                <div class="input-group input-group-sm shadow-sm rounded overflow-hidden">
                  <span class="input-group-text py-0 px-2 border-0 bg-light">
                    <i class="bi bi-calendar-check"></i>
                  </span>
                  <input type="text" class="form-control form-control-sm border-0" 
                        id="vocabDateTypeInput" placeholder="Enter date type...">
                </div>
              </div>
            </div>
            
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-translate me-1 text-primary"></i>
                Language
                <span class="ms-1 text-danger">*</span>
              </label>
              <div class="input-group input-group-sm shadow-sm rounded overflow-hidden">
                <span class="input-group-text py-0 px-2 border-0 bg-light">
                  <i class="bi bi-globe2"></i>
                </span>
                <input type="text" class="form-control form-control-sm border-0" 
                      id="vocabLangSelect" placeholder="Enter language code (e.g. eng, spa)" required>
              </div>
              <div class="invalid-feedback small" id="langError">Please enter a language</div>
              <div class="form-text text-muted small">
                <i class="bi bi-info-circle me-1"></i>Preferably use 3-letter ISO language code
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botón de acción fijo en la parte inferior -->
        <div class="position-sticky bottom-0 bg-light py-2 px-3 d-flex justify-content-end border-top shadow-sm" style="z-index: 1000;">
          <button class="btn btn-sm btn-primary" id="btnSaveVocabulary">
            <i class="bi bi-check-circle me-1"></i>Save
          </button>
        </div>
      </div>
    `;

    vocabNameInput = container.querySelector("#vocabNameInput");
    vocabDescInput = container.querySelector("#vocabDescInput");
    vocabDateInput = container.querySelector("#vocabDateInput");
    vocabDateTypeInput = container.querySelector("#vocabDateTypeInput");
    vocabLangSelect = container.querySelector("#vocabLangSelect");

    // Initialize validation event listeners
    vocabNameInput.addEventListener("input", function() {
      validateField(vocabNameInput, "#nameError", "Name is required");
    });
    
    vocabDescInput.addEventListener("input", function() {
      validateField(vocabDescInput, "#descError", "Description is required");
    });
    
    vocabLangSelect.addEventListener("input", function() {
      validateField(vocabLangSelect, "#langError", "Language is required");
    });

    initializeDateTimePicker(vocabDateInput);

    container
      .querySelector("#btnSaveVocabulary")
      .addEventListener("click", save);
  }

  function validateField(field, errorSelector, errorMessage) {
    const errorElement = container.querySelector(errorSelector);
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      if (errorElement) errorElement.textContent = errorMessage;
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  function showConfirmationDialog(message, callback) {
    // First check if we're using the standard confirmation
    const confirmed = confirm(message);
    if (confirmed && callback) {
      callback();
    }
  }

  function edit(vocab, index) {
    editingIndex = index;
    vocabNameInput.value = vocab.name || "";
    vocabDescInput.value = vocab.description || "";
    vocabDateInput.value = vocab.date ? formatDateForInput(vocab.date) : "";
    vocabDateTypeInput.value = vocab.date_type || "";
    vocabLangSelect.value = vocab.language || "";
    
    // Remove validation classes to start fresh
    vocabNameInput.classList.remove("is-invalid", "is-valid");
    vocabDescInput.classList.remove("is-invalid", "is-valid");
    vocabLangSelect.classList.remove("is-invalid", "is-valid");
  }

  function reset() {
    editingIndex = null;
    vocabNameInput.value = "";
    vocabDescInput.value = "";
    vocabDateInput.value = "";
    vocabDateTypeInput.value = "";
    vocabLangSelect.value = "";
    
    // Remove validation classes
    vocabNameInput.classList.remove("is-invalid", "is-valid");
    vocabDescInput.classList.remove("is-invalid", "is-valid");
    vocabLangSelect.classList.remove("is-invalid", "is-valid");
  }

  function save() {
    if (!validateForm()) {
      return;
    }
    
    const dateValue = vocabDateInput.value.trim();
    let formattedDate = dateValue;
    if (dateValue) {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        showInlineError(vocabDateInput, "The date must be a valid date-time in ISO 8601 format.");
        return;
      }
      formattedDate = date.toISOString();
    }
    
    const result = {
      name: vocabNameInput.value.trim(),
      description: vocabDescInput.value.trim(),
      date: formattedDate,
      date_type: vocabDateTypeInput.value.trim(),
      language: vocabLangSelect.value.trim(),
    };
    
    if (onSaveCallback) {
      onSaveCallback(result, editingIndex);
    }
    
    reset();
    showSuccessMessage("Vocabulary saved successfully!");
  }

  function validateForm() {
    let isValid = true;
    
    // Validate required fields
    isValid = validateField(vocabNameInput, "#nameError", "Name is required") && isValid;
    isValid = validateField(vocabDescInput, "#descError", "Description is required") && isValid;
    isValid = validateField(vocabLangSelect, "#langError", "Please select a language (3-letter ISO code)") && isValid;
    
    // Language pattern validation is handled by the select element
    
    return isValid;
  }

  function showInlineError(inputElement, message) {
    // Find sibling feedback element or create one
    let feedbackElement = inputElement.nextElementSibling;
    if (!feedbackElement || !feedbackElement.classList.contains("invalid-feedback")) {
      feedbackElement = document.createElement("div");
      feedbackElement.className = "invalid-feedback";
      inputElement.parentNode.insertBefore(feedbackElement, inputElement.nextSibling);
    }
    
    feedbackElement.textContent = message;
    inputElement.classList.add("is-invalid");
  }

  function showSuccessMessage(message) {
    // You can implement a toast or other subtle notification here
    // For now, we'll use the existing notification system
    if (typeof showNotification === "function") {
      showNotification(message);
    } else {
      console.log(message);
    }
  }

  function initializeDateTimePicker(input) {
    if (typeof flatpickr !== "undefined") {
      flatpickr(input, {
        enableTime: true,
        dateFormat: "Y-m-d\\TH:i:S.000\\Z",
        time_24hr: true,
        allowInput: true,
        altInput: true,
        altFormat: "M j, Y H:i",
        minDate: "1900-01-01",
        maxDate: "2100-12-31",
        utc: true,
        animate: false,
        onOpen: function() {
          input.classList.add("active");
        },
        onClose: function() {
          input.classList.remove("active");
        }
      });
    } else {
      console.warn(
        "flatpickr library is not loaded. Using native date picker instead."
      );
    }
  }

  function formatDateForInput(isoDate) {
    const date = new Date(isoDate);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1);
    return localISOTime;
  }

  return {
    init,
    edit,
    reset,
  };
})();