const apiBase = '/api';
const LOG_STORAGE_KEY = 'dsl2db_logs';

function getStoredLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOG_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function storeLogs(logs) {
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
}

function clearLogs() {
  storeLogs([]);
  renderLogs();
}

function renderLogs() {
  const logs = getStoredLogs();
  const logsSection = document.getElementById('logs-section');
  if (!logsSection) return;
  logsSection.innerHTML = '';
  logs.forEach(log => {
    const logDiv = document.createElement('div');
    logDiv.className = `log-entry${log.isError ? ' log-error' : ''}`;
    logDiv.innerHTML = `<span class='log-time'>[${log.timestamp}]</span> <span class='log-source'>${log.source ? `[${log.source}]` : ''}</span> <span class='log-msg'>${log.message}</span>`;
    logsSection.appendChild(logDiv);
  });
  logsSection.scrollTop = logsSection.scrollHeight;
}

function appendLog(message, isError = false, source = null) {
  const logs = getStoredLogs();
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = { message, isError, source, timestamp };
  logs.push(logEntry);
  storeLogs(logs);
  renderLogs();
}

function initDslModelFromStorage() {
  try {
    const stored = localStorage.getItem('sharedDSL');
    if (stored) {
      window.DSL_MODEL = JSON.parse(stored);
      updateDslContentSectionFromWindowModel();
    }
  } catch(e) {
    console.error('Error al cargar el DSL:', e);
  }
}

function updateDslContentSectionFromWindowModel() {
  const container = document.getElementById('dsl-content-editor');
  if (!container) return;
  if (!window.dslJsonEditor) {
    window.dslJsonEditor = new JSONEditor(container, {
      mode: 'view',
      mainMenuBar: true,
      navigationBar: true,
      statusBar: true,
      onError: function (err) { alert(err.toString()); }
    });
  }
  if (window.DSL_MODEL) {
    let dslObj = window.DSL_MODEL;
    if (typeof dslObj === 'string') {
      try { dslObj = JSON.parse(dslObj); } catch(e) {}
    }
    window.dslJsonEditor.set(dslObj);
  } else {
    window.dslJsonEditor.set({ info: 'No DSL cargado.' });
  }
}

class ApiService {
  static async post(endpoint, data) {
    const res = await fetch(`${apiBase}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  static async get(endpoint) {
    const res = await fetch(`${apiBase}${endpoint}`);
    return res.json();
  }
}

class UIController {
  constructor() {
    this.loadedDslJson = null;
    this.jsonEditor = null;
    this.dbReady = false;
    this.init();
  }

  init() {
    renderLogs();
    initDslModelFromStorage();
    this.cacheDom();
    this.bindEvents();
    this.setDbDependentButtons(false);
    appendLog('App loaded.', false, 'System');
  }

  cacheDom() {
    this.clearLogsBtn = document.getElementById('logs-clear-btn');
    this.catalogBtn = document.getElementById('catalog-btn');
    this.functionsBtn = document.getElementById('functions-btn');
    this.applyDslBtn = document.getElementById('deploy-dsl-btn');
    this.undeployDslBtn = document.getElementById('undeploy-dsl-btn');
    this.mainDbHelpBtn = document.getElementById('main-db-help-btn');
    this.createdbHelpBtn = document.getElementById('createdb-help-btn');
    this.dbstructureHelpBtn = document.getElementById('dbstructure-help-btn');
  }

  bindEvents() {
    if (this.clearLogsBtn) {
      this.clearLogsBtn.addEventListener('click', () => {
        clearLogs();
        appendLog('Logs cleared.', false, 'System');
      });
    }
    this.bindForms();
    this.bindLogButtons();
    this.bindDslButtons();
    this.bindHelpButtons();
  }

  setDbDependentButtons(enabled) {
    ['catalog-btn', 'functions-btn', 'generate-structure-btn', 'deploy-dsl-btn', 'undeploy-dsl-btn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = !enabled;
    });
  }

  setDbConnectionButtons(enabled) {
    const btn = document.getElementById('createdb-submit-btn');
    if (btn) btn.disabled = !enabled;
  }

  bindForms() {
    this.handleForm('connect-form', '/connect', 'Connect');
    this.handleForm('createdb-form', '/createdb', 'Create/Load', true);
  }

  handleForm(formId, endpoint, sourceLabel, isDbForm = false) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      appendLog(`${sourceLabel === 'Connect' ? 'Connecting to database...' : 'Creating or loading database...'}`, false, sourceLabel);
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      if (formId === 'connect-form') payload.port = Number(payload.port);
      try {
        const data = await ApiService.post(endpoint, payload);
        if (data.success) {
          appendLog(`${sourceLabel === 'Connect' ? 'Database connection successful!' : 'Database created successfully!'}`, false, sourceLabel);
          if (formId === 'connect-form') {
            this.setDbConnectionButtons(true);
            this.setDbDependentButtons(false);
          } else if (isDbForm) {
            this.setDbDependentButtons(true);
          }
        } else {
          appendLog(data.message || `${sourceLabel} failed.`, true, sourceLabel);
          if (formId === 'connect-form') {
            this.setDbConnectionButtons(false);
            this.setDbDependentButtons(false);
          } else if (isDbForm) {
            this.setDbDependentButtons(false);
          }
        }
      } catch (err) {
        appendLog(`Error: ${err.message}`, true, sourceLabel);
        if (formId === 'connect-form') {
          this.setDbConnectionButtons(false);
          this.setDbDependentButtons(false);
        } else if (isDbForm) {
          this.setDbDependentButtons(false);
        }
      }
    });
  }

  bindLogButtons() {
    this.bindLogButton(this.catalogBtn, 'Catalog', '/catalog');
    this.bindLogButton(this.functionsBtn, 'Functions', '/functions');
  }

  bindLogButton(btn, label, endpoint) {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      appendLog(`Requesting ${label.toLowerCase()}...`, false, label);
      try {
        const params = this.getDbParams();
        const data = await ApiService.post(endpoint, params);
        if (data.success) {
          if (label === 'Catalog') {
            appendLog(`Catalog loaded: ${JSON.stringify(data.details.message)}`, false, label);
          } else if (label === 'Functions') {
            if (Array.isArray(data.details)) {
              const firstMsg = data.details.length > 0 && data.details[0].message ? data.details[0].message : '';
              appendLog(`Functions loaded: ${firstMsg}`, false, label);
            } else {
              appendLog(`Functions loaded: ${JSON.stringify(data.details)}`, false, label);
            }
          }
        } else {
          appendLog(data.message || `Failed to load ${label.toLowerCase()}.`, true, label);
        }
      } catch (err) {
        appendLog(`Error loading ${label.toLowerCase()}: ${err.message}`, true, label);
      }
    });
  }

  getDbParams() {
    return {
      database: document.getElementById('db-createdb').value,
      host: document.getElementById('db-host').value,
      port: parseInt(document.getElementById('db-port').value, 10),
      user: document.getElementById('db-user').value,
      password: document.getElementById('db-password').value
    };
  }

  bindDslButtons() {
    const generateBtn = document.getElementById('generate-structure-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        appendLog('Running catalog script...', false, 'Catalog');
        try {
          const params = this.getDbParams();
          const catalogData = await ApiService.post('/catalog', params);
          if (catalogData.success) {
            appendLog('Catalog script executed successfully on the database.', false, 'Catalog');
            if (catalogData.details && catalogData.details.message) {
              appendLog(`Details: ${catalogData.details.message}`, false, 'Catalog');
            }
            appendLog('Running functions scripts...', false, 'Functions');
            try {
              const functionsData = await ApiService.post('/functions', params);
              if (functionsData.success) {
                appendLog('Functions scripts executed successfully on the database.', false, 'Functions');
              } else {
                appendLog(functionsData.message || 'Error running the functions scripts.', true, 'Functions');
                if (applyDslBtn) applyDslBtn.disabled = true;
              }
            } catch (err) {
              appendLog(`Unexpected error running the functions scripts: ${err.message}`, true, 'Functions');
              if (applyDslBtn) applyDslBtn.disabled = true;
            }
          } else {
            appendLog(catalogData.message || 'Error running the catalog script.', true, 'Catalog');
            if (catalogData.error) {
              appendLog(`Details: ${catalogData.error}`, true, 'Catalog');
            }
            if (applyDslBtn) applyDslBtn.disabled = true;
          }
        } catch (err) {
          appendLog(`Unexpected error running the catalog script: ${err.message}`, true, 'Catalog');
          if (applyDslBtn) applyDslBtn.disabled = true;
        }
      });
    }
    if (this.applyDslBtn) this.bindApplyDsl();
    if (this.undeployDslBtn) this.bindUndeployDsl();
  }

  bindApplyDsl() {
    this.applyDslBtn.addEventListener('click', async () => {
      let dslJson = null;
      if (window.dslJsonEditor) {
        try {
          dslJson = window.dslJsonEditor.get();
        } catch (err) {
          appendLog('Invalid JSON in DSL Model editor.', true, 'Apply DSL');
          return;
        }
      }
      if (!dslJson) {
        appendLog('No DSL JSON loaded. Please load and edit a DSL JSON file first.', true, 'Apply DSL');
        return;
      }
      appendLog('Sending DSL JSON to server...', false, 'Apply DSL');
      try {
        const params = { ...this.getDbParams(), dsl: dslJson };
        const data = await ApiService.post('/deploy-dsl', params);
        if (data.success) {
          appendLog('DSL JSON applied successfully!', false, 'Apply DSL');
        } else {
          appendLog(data.message || 'Failed to apply DSL JSON.', true, 'Apply DSL');
        }
      } catch (err) {
        appendLog(`Error applying DSL JSON: ${err.message}`, true, 'Apply DSL');
      }
    });
  }

  bindUndeployDsl() {
    this.undeployDslBtn.addEventListener('click', async () => {
      let dslJson = null;
      if (window.dslJsonEditor) {
        try {
          dslJson = window.dslJsonEditor.get();
        } catch (err) {
          appendLog('Invalid JSON in DSL Model editor.', true, 'Undeploy DSL');
          return;
        }
      }
      if (!dslJson) {
        appendLog('No DSL JSON loaded. Please load and edit a DSL JSON file first.', true, 'Undeploy DSL');
        return;
      }
      appendLog('Sending DSL JSON to server...', false, 'Undeploy DSL');
      try {
        const params = { ...this.getDbParams(), dsl: dslJson };
        const data = await ApiService.post('/undeploy-dsl', params);
        if (data.success) {
          appendLog('DSL JSON undeployed successfully!', false, 'Undeploy DSL');
        } else {
          appendLog(data.message || 'Failed to undeploy DSL JSON.', true, 'Undeploy DSL');
        }
      } catch (err) {
        appendLog(`Error undeploying DSL JSON: ${err.message}`, true, 'Undeploy DSL');
      }
    });
  }

  bindHelpButtons() {
    this._bindHelpModal(this.mainDbHelpBtn, 'mainDbHelpModal');
    this._bindHelpModal(this.createdbHelpBtn, 'createdbHelpModal');
    this._bindHelpModal(this.dbstructureHelpBtn, 'dbstructureHelpModal');
  }

  _bindHelpModal(btn, modalId) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById(modalId));
      modal.show();
    });
  }
}

new UIController();