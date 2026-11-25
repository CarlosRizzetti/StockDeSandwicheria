/**
 * app.js - Controlador principal de interfaz y eventos
 * Aplicación de Control de Stock de Panes
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de la aplicación
  App.init();
});

const App = {
  // Estado local de la interfaz
  state: {
    currentView: 'planificacion', // 'planificacion' | 'admin'
    selectedConsultDay: 'hoy',    // 'hoy' | 'manana' | 'lunes' | ...
    activeDayFilter: 'todos',     // 'todos' | 'lunes' | ...
    
    // Estado del modal de agregar producto al día
    addingToDay: null,
    selectedProductToAdd: null,
    
    // Estado del modal de pegar desde Excel
    pastingToDay: null,
    currentParsedRows: [],
    
    // Estado de edición de receta
    editingProductId: null,
    editingBreadId: null,

    // Selección de tablas para imprimir
    printSelected: {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
      domingo: false,
      stock: true
    }
  },

  init() {
    this.cacheDom();
    this.bindEvents();
    this.updateHeaderDate();

    // Por defecto marcar HOY y STOCK para imprimir
    const todayKey = window.stockCalculator.getTodayKey();
    if (this.state.printSelected[todayKey] !== undefined) {
      this.state.printSelected[todayKey] = true;
    }
    this.state.printSelected.stock = true;
    this.updatePrintSelectedCount();

    this.render();

    // Escuchar cambios en la tienda
    window.appStore.subscribe(() => {
      this.render();
    });

    // Detectar hash en URL si existe
    if (window.location.hash === '#admin') {
      this.switchView('admin');
    }
  },

  cacheDom() {
    // Vistas y navegación
    this.navPlanificacionBtn = document.getElementById('navPlanificacionBtn');
    this.navAdminBtn = document.getElementById('navAdminBtn');
    this.viewPlanificacion = document.getElementById('viewPlanificacion');
    this.viewAdmin = document.getElementById('viewAdmin');
    this.btnAdminShortcut = document.getElementById('btnAdminShortcut');
    this.btnBackToPlanning = document.getElementById('btnBackToPlanning');

    // Elementos del encabezado
    this.todayDateText = document.getElementById('todayDateText');
    this.btnOpenUtilitiesModal = document.getElementById('btnOpenUtilitiesModal');

    // Columna izquierda (Planificación)
    this.dayFilterTabs = document.getElementById('dayFilterTabs');
    this.daysCardsContainer = document.getElementById('daysCardsContainer');
    this.globalStockSummarySection = document.getElementById('globalStockSummarySection');
    this.btnFilterJumpSummary = document.getElementById('btnFilterJumpSummary');

    // Columna derecha (Stock)
    this.stockConsultDaySelect = document.getElementById('stockConsultDaySelect');
    this.stockTableBody = document.getElementById('stockTableBody');
    this.thSelectedDayReq = document.getElementById('thSelectedDayReq');
    this.thStockRemaining = document.getElementById('thStockRemaining');
    this.metricTotalStock = document.getElementById('metricTotalStock');
    this.metricTotalWeek = document.getElementById('metricTotalWeek');
    this.metricReqToday = document.getElementById('metricReqToday');
    this.metricReqTomorrow = document.getElementById('metricReqTomorrow');
    this.metricShortagesCount = document.getElementById('metricShortagesCount');
    this.metricShortagesCard = document.getElementById('metricShortagesCard');
    this.btnDeductDayStock = document.getElementById('btnDeductDayStock');
    this.btnQuickAdjustStock = document.getElementById('btnQuickAdjustStock');
    this.btnWeeklyPurchaseModal = document.getElementById('btnWeeklyPurchaseModal');

    // Vista de Administración
    this.adminProductSearchInput = document.getElementById('adminProductSearchInput');
    this.adminProductsTableBody = document.getElementById('adminProductsTableBody');
    this.btnOpenNewProductModal = document.getElementById('btnOpenNewProductModal');

    this.adminBreadsTableBody = document.getElementById('adminBreadsTableBody');
    this.btnOpenNewBreadModal = document.getElementById('btnOpenNewBreadModal');

    // Modales
    this.modalAddDayProduct = document.getElementById('modalAddDayProduct');
    this.modalAddDayProductTitle = document.getElementById('modalAddDayProductTitle');
    this.dayProductSearchInput = document.getElementById('dayProductSearchInput');
    this.dayProductSearchResults = document.getElementById('dayProductSearchResults');
    this.daySelectedProductInfo = document.getElementById('daySelectedProductInfo');
    this.daySelectedProductName = document.getElementById('daySelectedProductName');
    this.daySelectedProductRecipe = document.getElementById('daySelectedProductRecipe');
    this.dayDuplicateWarning = document.getElementById('dayDuplicateWarning');
    this.dayDuplicateWarningText = document.getElementById('dayDuplicateWarningText');
    this.dayProductQtyInput = document.getElementById('dayProductQtyInput');
    this.btnConfirmAddDayProduct = document.getElementById('btnConfirmAddDayProduct');

    // Modal Producto
    this.modalProductForm = document.getElementById('modalProductForm');
    this.productForm = document.getElementById('productForm');
    this.modalProductFormTitle = document.getElementById('modalProductFormTitle');
    this.productFormId = document.getElementById('productFormId');
    this.productFormName = document.getElementById('productFormName');
    this.recipeRowsContainer = document.getElementById('recipeRowsContainer');
    this.btnAddRecipeBreadRow = document.getElementById('btnAddRecipeBreadRow');

    // Modal Pan
    this.modalBreadForm = document.getElementById('modalBreadForm');
    this.breadForm = document.getElementById('breadForm');
    this.modalBreadFormTitle = document.getElementById('modalBreadFormTitle');
    this.breadFormId = document.getElementById('breadFormId');
    this.breadFormName = document.getElementById('breadFormName');
    this.breadFormStock = document.getElementById('breadFormStock');

    // Modal Ajustar Stock
    this.modalAdjustStock = document.getElementById('modalAdjustStock');
    this.adjustStockForm = document.getElementById('adjustStockForm');
    this.adjustStockBreadSelect = document.getElementById('adjustStockBreadSelect');
    this.adjustStockCurrentVal = document.getElementById('adjustStockCurrentVal');
    this.adjustStockNewVal = document.getElementById('adjustStockNewVal');

    // Modal Breakdown
    this.modalBreakdown = document.getElementById('modalBreakdown');
    this.modalBreakdownTitle = document.getElementById('modalBreakdownTitle');
    this.modalBreakdownList = document.getElementById('modalBreakdownList');

    // Modal Pedido Semanal
    this.modalWeeklyPurchase = document.getElementById('modalWeeklyPurchase');
    this.weeklyPurchaseTableBody = document.getElementById('weeklyPurchaseTableBody');

    // Modal Utilidades
    this.modalUtilities = document.getElementById('modalUtilities');
    this.btnExportData = document.getElementById('btnExportData');
    this.importFileInput = document.getElementById('importFileInput');
    this.btnClearEntireWeek = document.getElementById('btnClearEntireWeek');
    this.btnResetToDefaults = document.getElementById('btnResetToDefaults');
    this.btnClearStorageHeaderBtn = document.getElementById('btnClearStorageHeaderBtn');
    this.btnClearLocalStorageModalBtn = document.getElementById('btnClearLocalStorageModalBtn');

    // Controles de Impresión
    this.printStockCheckbox = document.getElementById('printStockCheckbox');
    this.btnPrintSelectedTables = document.getElementById('btnPrintSelectedTables');
    this.printSelectedCount = document.getElementById('printSelectedCount');
    this.btnSelectAllPrint = document.getElementById('btnSelectAllPrint');
    this.btnSelectTodayStockPrint = document.getElementById('btnSelectTodayStockPrint');
    this.btnUnselectAllPrint = document.getElementById('btnUnselectAllPrint');
    this.printDateStamp = document.getElementById('printDateStamp');

    // Modal Pegar Planilla Excel
    this.modalPasteExcel = document.getElementById('modalPasteExcel');
    this.modalPasteExcelTitle = document.getElementById('modalPasteExcelTitle');
    this.pasteColOrderSelect = document.getElementById('pasteColOrderSelect');
    this.pasteDuplicateActionSelect = document.getElementById('pasteDuplicateActionSelect');
    this.pasteExcelTextarea = document.getElementById('pasteExcelTextarea');
    this.btnClearPasteText = document.getElementById('btnClearPasteText');
    this.pasteAnalysisSummaryBar = document.getElementById('pasteAnalysisSummaryBar');
    this.pasteMatchedCount = document.getElementById('pasteMatchedCount');
    this.pasteUnmatchedBadge = document.getElementById('pasteUnmatchedBadge');
    this.pasteUnmatchedCount = document.getElementById('pasteUnmatchedCount');
    this.pastePreviewContainer = document.getElementById('pastePreviewContainer');
    this.pastePreviewTableBody = document.getElementById('pastePreviewTableBody');
    this.btnConfirmImportPaste = document.getElementById('btnConfirmImportPaste');
    this.btnConfirmImportPasteText = document.getElementById('btnConfirmImportPasteText');

    // Toast Container
    this.toastContainer = document.getElementById('toastContainer');
  },

  bindEvents() {
    // Cambio de Vistas
    this.navPlanificacionBtn.addEventListener('click', () => this.switchView('planificacion'));
    this.navAdminBtn.addEventListener('click', () => this.switchView('admin'));
    this.btnAdminShortcut.addEventListener('click', () => this.switchView('admin'));
    this.btnBackToPlanning.addEventListener('click', () => this.switchView('planificacion'));

    // Filtros de días en la columna izquierda
    this.dayFilterTabs.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      const filter = chip.getAttribute('data-filter');

      if (filter === 'resumen') {
        if (this.globalStockSummarySection) {
          this.globalStockSummarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      this.dayFilterTabs.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      this.state.activeDayFilter = filter;
      this.renderDayCards();
    });

    // Selector de día en el Panel de Stock (si existe)
    if (this.stockConsultDaySelect) {
      this.stockConsultDaySelect.addEventListener('change', (e) => {
        this.state.selectedConsultDay = e.target.value;
        this.renderStockPanel();
      });
    }

    // Descontar Requerimiento de Hoy
    this.btnDeductDayStock.addEventListener('click', () => this.handleDeductTodayStock());

    // Ajustar Stock Rápido
    this.btnQuickAdjustStock.addEventListener('click', () => this.openAdjustStockModal());

    // Pedido Semanal Modal
    this.btnWeeklyPurchaseModal.addEventListener('click', () => this.openWeeklyPurchaseModal());

    // Modal Utilidades
    this.btnOpenUtilitiesModal.addEventListener('click', () => this.openModal(this.modalUtilities));
    this.btnExportData.addEventListener('click', () => this.handleExportData());
    this.importFileInput.addEventListener('change', (e) => this.handleImportData(e));
    this.btnClearEntireWeek.addEventListener('click', () => this.handleClearWeek());
    this.btnResetToDefaults.addEventListener('click', () => this.handleResetDefaults());
    if (this.btnClearStorageHeaderBtn) {
      this.btnClearStorageHeaderBtn.addEventListener('click', () => this.handleClearLocalStorage());
    }
    if (this.btnClearLocalStorageModalBtn) {
      this.btnClearLocalStorageModalBtn.addEventListener('click', () => this.handleClearLocalStorage());
    }

    // Búsqueda en administración de productos
    this.adminProductSearchInput.addEventListener('input', () => this.renderAdminProducts());

    // Botones de agregar en admin
    this.btnOpenNewProductModal.addEventListener('click', () => this.openProductModal());
    this.btnOpenNewBreadModal.addEventListener('click', () => this.openBreadModal());

    // Formularios admin
    this.productForm.addEventListener('submit', (e) => this.handleSaveProduct(e));
    this.breadForm.addEventListener('submit', (e) => this.handleSaveBread(e));
    this.btnAddRecipeBreadRow.addEventListener('click', () => this.addRecipeRow());

    // Ajustar Stock Form
    this.adjustStockForm.addEventListener('submit', (e) => this.handleSaveAdjustStock(e));
    this.adjustStockBreadSelect.addEventListener('change', () => this.updateAdjustStockFields());

    // Botones de incremento en modal de stock
    this.modalAdjustStock.querySelectorAll('.quick-stock-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.getAttribute('data-delta')) || 0;
        const current = parseFloat(this.adjustStockNewVal.value) || 0;
        this.adjustStockNewVal.value = this.formatBreadVal(Math.max(0, current + delta));
      });
    });

    // Búsqueda de productos en modal de agregar a día
    this.dayProductSearchInput.addEventListener('input', (e) => this.filterDayProductSearchResults(e.target.value));

    // Botones rápidos de cantidad en modal de agregar a día
    this.modalAddDayProduct.querySelectorAll('.quick-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const add = parseInt(btn.getAttribute('data-add'), 10) || 0;
        const current = parseInt(this.dayProductQtyInput.value, 10) || 0;
        this.dayProductQtyInput.value = current + add;
      });
    });

    // Confirmar agregar producto a día
    this.btnConfirmAddDayProduct.addEventListener('click', () => this.confirmAddProductToDay());

    // Cerrar modales con botones de cierre
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal-overlay');
        if (modal) this.closeModal(modal);
      });
    });

    // Cerrar al presionar escape o click fuera de la tarjeta
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay);
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) this.closeModal(openModal);
      }
    });

    // Controles de Impresión de Tablas
    if (this.printStockCheckbox) {
      this.printStockCheckbox.addEventListener('change', () => {
        this.state.printSelected.stock = this.printStockCheckbox.checked;
        const stockCard = document.querySelector('.stock-panel-card');
        if (stockCard) {
          stockCard.classList.toggle('print-active', this.printStockCheckbox.checked);
        }
        this.updatePrintSelectedCount();
      });
    }

    if (this.btnSelectAllPrint) {
      this.btnSelectAllPrint.addEventListener('click', () => {
        (window.DAYS_CONFIG || []).forEach(d => {
          this.state.printSelected[d.key] = true;
        });
        this.state.printSelected.stock = true;
        this.renderDayCards();
        this.renderStockPanel();
        this.updatePrintSelectedCount();
      });
    }

    if (this.btnSelectTodayStockPrint) {
      this.btnSelectTodayStockPrint.addEventListener('click', () => {
        const todayKey = window.stockCalculator.getTodayKey();
        (window.DAYS_CONFIG || []).forEach(d => {
          this.state.printSelected[d.key] = (d.key === todayKey);
        });
        this.state.printSelected.stock = true;
        this.renderDayCards();
        this.renderStockPanel();
        this.updatePrintSelectedCount();
      });
    }

    if (this.btnUnselectAllPrint) {
      this.btnUnselectAllPrint.addEventListener('click', () => {
        (window.DAYS_CONFIG || []).forEach(d => {
          this.state.printSelected[d.key] = false;
        });
        this.state.printSelected.stock = false;
        this.renderDayCards();
        this.renderStockPanel();
        this.updatePrintSelectedCount();
      });
    }

    if (this.btnPrintSelectedTables) {
      this.btnPrintSelectedTables.addEventListener('click', () => this.handlePrint());
    }

    // Eventos de Pegado desde Excel
    if (this.pasteExcelTextarea) {
      this.pasteExcelTextarea.addEventListener('input', () => this.handlePasteInputChange());
    }
    if (this.pasteColOrderSelect) {
      this.pasteColOrderSelect.addEventListener('change', () => this.handlePasteInputChange());
    }
    if (this.btnClearPasteText) {
      this.btnClearPasteText.addEventListener('click', () => {
        this.pasteExcelTextarea.value = '';
        this.handlePasteInputChange();
        this.pasteExcelTextarea.focus();
      });
    }
    if (this.btnConfirmImportPaste) {
      this.btnConfirmImportPaste.addEventListener('click', () => this.handleConfirmImportPaste());
    }
  },

  // ====================================================
  // NAVEGACIÓN Y VISTAS
  // ====================================================
  switchView(viewName) {
    this.state.currentView = viewName;
    window.location.hash = viewName === 'admin' ? '#admin' : '#planificacion';

    if (viewName === 'planificacion') {
      this.navPlanificacionBtn.classList.add('active');
      this.navAdminBtn.classList.remove('active');
      this.viewPlanificacion.classList.add('active');
      this.viewAdmin.classList.remove('active');
      this.renderWeeklyView();
    } else {
      this.navAdminBtn.classList.add('active');
      this.navPlanificacionBtn.classList.remove('active');
      this.viewAdmin.classList.add('active');
      this.viewPlanificacion.classList.remove('active');
      this.renderAdminView();
    }
  },

  updateHeaderDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = today.toLocaleDateString('es-ES', options);
    // Capitalizar primera letra
    this.todayDateText.textContent = `Hoy es ${dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)}`;
  },

  updatePrintSelectedCount() {
    let count = 0;
    (window.DAYS_CONFIG || []).forEach(d => {
      if (this.state.printSelected[d.key]) count++;
    });
    if (this.state.printSelected.stock) count++;

    if (this.printSelectedCount) {
      this.printSelectedCount.textContent = count;
    }
  },

  handlePrint() {
    // Verificar cuántas tablas hay seleccionadas
    const selectedDays = (window.DAYS_CONFIG || []).filter(d => this.state.printSelected[d.key]);
    const isStockSelected = !!this.state.printSelected.stock;

    if (selectedDays.length === 0 && !isStockSelected) {
      alert('Por favor selecciona al menos una tabla para imprimir (marca la casilla "Imprimir" en los días que desees o en la tabla de stock).');
      return;
    }

    // Si el usuario está en la vista de administración, volver a planificación
    if (this.state.currentView !== 'planificacion') {
      this.switchView('planificacion');
    }

    // Si había un filtro por día activado, pasar temporalmente a 'todos' para que todos los días seleccionados se rendericen
    const previousFilter = this.state.activeDayFilter;
    if (this.state.activeDayFilter !== 'todos') {
      this.state.activeDayFilter = 'todos';
      this.dayFilterTabs.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-filter') === 'todos');
      });
      this.renderDayCards();
    }

    // Colocar fecha y hora en la cabecera de la hoja
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateFormatted = now.toLocaleDateString('es-ES', options);
    if (this.printDateStamp) {
      this.printDateStamp.textContent = `Emitido: ${dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)} hs`;
    }

    // Disparar ventana de impresión del navegador
    window.print();

    // Restaurar filtro de pantalla si correspondía
    if (previousFilter !== 'todos') {
      this.state.activeDayFilter = previousFilter;
      this.dayFilterTabs.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-filter') === previousFilter);
      });
      this.renderDayCards();
    }
  },

  // ====================================================
  // RENDERIZADO GENERAL
  // ====================================================
  render() {
    if (this.state.currentView === 'planificacion') {
      this.renderWeeklyView();
    } else {
      this.renderAdminView();
    }
  },

  renderWeeklyView() {
    this.renderDayCards();
    this.renderStockPanel();
    this.updatePrintSelectedCount();
  },

  renderAdminView() {
    this.renderAdminProducts();
    this.renderAdminBreads();
  },

  // ====================================================
  // LISTADO DE DÍAS: PRODUCTOS + STOCK EN TIEMPO REAL
  // ====================================================
  renderDayCards() {
    const todayKey = window.stockCalculator.getTodayKey();
    const tomorrowKey = window.stockCalculator.getNextDayKey(todayKey);
    const filter = this.state.activeDayFilter;

    // Calcular la evolución progresiva acumulada de la semana en tiempo real
    const weeklyProg = window.stockCalculator.calculateWeeklyProgression();

    let html = '';

    const daysList = window.DAYS_CONFIG || [];
    daysList.forEach(day => {
      if (filter !== 'todos' && filter !== day.key) {
        return;
      }

      const isToday = day.key === todayKey;
      const isTomorrow = day.key === tomorrowKey;
      const isPrintActive = !!this.state.printSelected[day.key];
      const dayPlan = window.appStore.getDayPlan(day.key);
      const totalUnits = dayPlan.reduce((acc, item) => acc + (item.qty || 0), 0);
      const dayProg = weeklyProg.byDay[day.key] || { breads: [], shortagesCount: 0, totalBreadsNeeded: 0 };
      const dayActiveBreads = dayProg.breads.filter(b => b.required > 0);

      html += `
        <div class="day-card ${isToday ? 'is-today' : ''} ${isPrintActive ? 'print-active' : ''}" id="dayCard_${day.key}">
          
          <div class="day-card-header">
            <div class="day-title-wrap">
              <label class="print-card-checkbox-label" title="Incluir tabla del ${day.name} en la hoja de impresión">
                <input type="checkbox" class="print-checkbox-day" data-day="${day.key}" ${isPrintActive ? 'checked' : ''}>
                <span class="print-check-indicator"></span>
                <span class="print-check-tag">Imprimir</span>
              </label>
              <span class="day-name">${day.name}</span>
              ${isToday ? '<span class="badge-tag badge-today">HOY</span>' : ''}
              ${isTomorrow ? '<span class="badge-tag badge-tomorrow">MAÑANA</span>' : ''}
              <span class="day-meta-count">(${dayPlan.length} productos / ${totalUnits} unidades)</span>
            </div>

            <div class="day-card-actions">
              ${dayPlan.length > 0 ? `
                <button class="btn-icon-only danger btn-clear-day" data-day="${day.key}" title="Vaciar este día">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              ` : ''}

              <button class="btn btn-outline btn-sm btn-paste-day-table" data-day="${day.key}" title="Pegar contenido copiado de Excel o planilla">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                Pegar planilla
              </button>

              <button class="btn btn-primary btn-sm btn-add-day-prod" data-day="${day.key}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                + Agregar producto
              </button>
            </div>
          </div>

          <div class="day-card-split-body">
            
            <!-- SUBPANEL IZQUIERDO: PRODUCTOS PLANIFICADOS -->
            <div class="day-products-panel">
              <div class="day-panel-subheading">
                <span>🥪 Productos a Elaborar</span>
                <span class="day-sub-count">${dayPlan.length} productos / ${totalUnits} un.</span>
              </div>

              <div class="table-responsive">
                ${dayPlan.length === 0 ? `
                  <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <p>No hay productos cargados para el ${day.name}.</p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem;">
                      <button class="btn btn-outline btn-sm btn-add-day-prod" data-day="${day.key}">
                        + Agregar manual
                      </button>
                      <button class="btn btn-primary btn-sm btn-paste-day-table" data-day="${day.key}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        </svg>
                        Pegar desde Excel
                      </button>
                    </div>
                  </div>
                ` : `
                  <table class="clean-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th style="width: 150px;">Cantidad</th>
                        <th style="text-align: right; width: 60px;">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${dayPlan.map(item => {
                        const product = window.appStore.getProductById(item.productId);
                        const prodName = product ? product.name : 'Producto no encontrado';
                        const recipeSummary = product ? window.stockCalculator.getProductRecipeSummary(product) : '';

                        return `
                          <tr>
                            <td>
                              <div class="prod-name-cell">${this.escapeHtml(prodName)}</div>
                              <div class="prod-recipe-hint">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M12 6v6l4 2"/>
                                </svg>
                                ${this.escapeHtml(recipeSummary)}
                              </div>
                            </td>
                            <td>
                              <div class="qty-stepper">
                                <button type="button" class="qty-btn btn-qty-step" data-day="${day.key}" data-prod="${item.productId}" data-step="-1">−</button>
                                <input type="number" min="1" class="qty-input day-qty-input" data-day="${day.key}" data-prod="${item.productId}" value="${item.qty}">
                                <button type="button" class="qty-btn btn-qty-step" data-day="${day.key}" data-prod="${item.productId}" data-step="1">+</button>
                              </div>
                            </td>
                            <td style="text-align: right;">
                              <button class="btn-icon-only danger btn-delete-day-item" data-day="${day.key}" data-prod="${item.productId}" title="Eliminar producto de este día">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                `}
              </div>
            </div>

            <!-- SUBPANEL DERECHO: REQUERIMIENTOS Y STOCK EN TIEMPO REAL -->
            <div class="day-stock-panel">
              <div class="day-panel-subheading">
                <span>🥖 Panes Requeridos (${dayActiveBreads.length})</span>
                ${dayActiveBreads.length === 0 ? `
                  <span class="day-sub-count">Sin consumo</span>
                ` : (dayProg.shortagesCount > 0 ? `
                  <span class="badge-tag-danger">⚠️ Faltan ${dayProg.shortagesCount} tipos</span>
                ` : `
                  <span class="badge-tag-success">✓ Stock OK (${dayProg.totalBreadsNeeded} req.)</span>
                `)}
              </div>

              <div class="table-responsive">
                <table class="clean-table day-stock-table">
                  <thead>
                    <tr>
                      <th>Tipo de Pan</th>
                      <th style="text-align: center;">Requerido</th>
                      <th style="text-align: center;" title="Stock disponible al inicio de este día">Stock Disp.</th>
                      <th style="text-align: right;" title="Stock restante tras descontar el consumo de este día">Stock Restante</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dayActiveBreads.length === 0 ? `
                      <tr>
                        <td colspan="4" style="text-align: center; padding: 2.25rem 1rem; color: var(--text-muted); font-size: 0.85rem;">
                          <div style="opacity: 0.45; font-size: 1.5rem; margin-bottom: 0.25rem;">🥖</div>
                          No hay panes requeridos para el ${day.name}.
                        </td>
                      </tr>
                    ` : dayActiveBreads.map(b => `
                      <tr class="${b.isShortage ? 'tr-shortage' : ''}">
                        <td>
                          <div class="bread-name-cell">
                            <span class="bread-bullet"></span>
                            <span title="${this.escapeHtml(b.name)}">${this.escapeHtml(b.name)}</span>
                          </div>
                        </td>
                        <td style="text-align: center;">
                          <span class="val-badge req-highlight" 
                                style="cursor: pointer;" 
                                title="Clic para ver productos que consumen este pan"
                                onclick="App.showBreakdownModal('${b.breadId}', '${day.key}', '${day.name}')">
                            ${this.formatBreadVal(b.required)}
                            <small style="font-size: 0.7rem; margin-left: 2px;">ℹ</small>
                          </span>
                        </td>
                        <td style="text-align: center;">
                          <span class="val-mini">${this.formatBreadVal(b.startStock)}</span>
                        </td>
                        <td style="text-align: right;" class="stock-remaining-cell">
                          ${b.isShortage ? `
                            <span class="badge-status badge-shortage" title="Faltan ${this.formatBreadVal(b.shortageAmount)} panes para cubrir la producción">
                              FALTAN ${this.formatBreadVal(b.shortageAmount)}
                            </span>
                          ` : `
                            <span class="badge-status badge-ok" title="Stock restante suficiente">
                              ${this.formatBreadVal(b.remainingStock)}
                            </span>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      `;
    });

    this.daysCardsContainer.innerHTML = html;

    // Vincular casillas de selección de impresión de cada día
    this.daysCardsContainer.querySelectorAll('.print-checkbox-day').forEach(chk => {
      chk.addEventListener('change', () => {
        const dayKey = chk.getAttribute('data-day');
        this.state.printSelected[dayKey] = chk.checked;
        const card = document.getElementById(`dayCard_${dayKey}`);
        if (card) {
          card.classList.toggle('print-active', chk.checked);
        }
        this.updatePrintSelectedCount();
      });
    });

    // Vincular eventos dentro de las tarjetas
    this.daysCardsContainer.querySelectorAll('.btn-add-day-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayKey = btn.getAttribute('data-day');
        this.openAddProductToDayModal(dayKey);
      });
    });

    this.daysCardsContainer.querySelectorAll('.btn-paste-day-table').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayKey = btn.getAttribute('data-day');
        this.openPasteExcelModal(dayKey);
      });
    });

    this.daysCardsContainer.querySelectorAll('.btn-clear-day').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayKey = btn.getAttribute('data-day');
        const dayInfo = window.stockCalculator.getDayInfo(dayKey);
        if (confirm(`¿Vaciar todos los productos del ${dayInfo.name}?`)) {
          window.appStore.clearDayPlan(dayKey);
          this.showToast(`Se vació la planificación del ${dayInfo.name}.`);
        }
      });
    });

    this.daysCardsContainer.querySelectorAll('.btn-delete-day-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayKey = btn.getAttribute('data-day');
        const prodId = btn.getAttribute('data-prod');
        window.appStore.removeProductFromDay(dayKey, prodId);
        this.showToast('Producto eliminado de la lista del día.');
      });
    });

    this.daysCardsContainer.querySelectorAll('.btn-qty-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayKey = btn.getAttribute('data-day');
        const prodId = btn.getAttribute('data-prod');
        const step = parseInt(btn.getAttribute('data-step'), 10);
        const dayItems = window.appStore.getDayPlan(dayKey);
        const item = dayItems.find(i => i.productId === prodId);
        if (item) {
          const newQty = Math.max(1, item.qty + step);
          window.appStore.updateProductDayQty(dayKey, prodId, newQty);
        }
      });
    });

    this.daysCardsContainer.querySelectorAll('.day-qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const dayKey = input.getAttribute('data-day');
        const prodId = input.getAttribute('data-prod');
        const newQty = parseInt(input.value, 10);
        if (!isNaN(newQty) && newQty > 0) {
          window.appStore.updateProductDayQty(dayKey, prodId, newQty);
        } else {
          // Revertir a valor anterior
          this.renderDayCards();
        }
      });
    });
  },

  // ====================================================
  // AL FINAL DE LOS DÍAS: PANEL GENERAL DE CONTROL Y RESUMEN DE STOCK
  // ====================================================
  renderStockPanel() {
    const report = window.stockCalculator.getDetailedStockReport();

    // Actualizar métricas KPI
    this.metricTotalStock.textContent = this.formatBreadVal(report.summary.totalStock);
    if (this.metricTotalWeek) {
      this.metricTotalWeek.textContent = this.formatBreadVal(report.summary.totalWeek);
    }
    this.metricReqToday.textContent = this.formatBreadVal(report.summary.totalReqToday);
    this.metricReqTomorrow.textContent = this.formatBreadVal(report.summary.totalReqTomorrow);
    this.metricShortagesCount.textContent = report.summary.shortagesCount;

    if (report.summary.shortagesCount > 0) {
      this.metricShortagesCard.classList.add('alert-box');
      this.metricShortagesCard.classList.remove('ok-box');
    } else {
      this.metricShortagesCard.classList.remove('alert-box');
      this.metricShortagesCard.classList.add('ok-box');
    }

    // Estado de selección de impresión para la tabla de stock
    const isStockPrintActive = !!this.state.printSelected.stock;
    const stockCard = document.querySelector('.stock-panel-card');
    if (stockCard) {
      stockCard.classList.toggle('print-active', isStockPrintActive);
    }
    if (this.printStockCheckbox) {
      this.printStockCheckbox.checked = isStockPrintActive;
    }

    // Renderizar filas de la tabla de stock consolidada
    if (report.items.length === 0) {
      this.stockTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No hay tipos de panes cargados en el sistema.
          </td>
        </tr>
      `;
      return;
    }

    const todayKey = report.todayKey;
    const tomorrowKey = report.tomorrowKey;

    let html = '';
    report.items.forEach(item => {
      const isShortage = item.isShortage;

      html += `
        <tr class="${isShortage ? 'tr-shortage' : ''}">
          <td>
            <div class="bread-name-cell">
              <span class="bread-bullet"></span>
              <span>${this.escapeHtml(item.name)}</span>
            </div>
          </td>
          <td>
            <div class="inline-stock-edit">
              <span class="val-badge">${this.formatBreadVal(item.stock)}</span>
              <button class="btn-inline-edit btn-quick-edit-stock" data-bread-id="${item.breadId}" title="Editar stock">
                ✎
              </button>
            </div>
          </td>
          <td>
            <span class="val-badge ${item.totalWeek > 0 ? 'req-highlight' : 'req-zero'}">
              ${this.formatBreadVal(item.totalWeek)}
            </span>
          </td>
          <td>
            <span class="val-badge" style="cursor: pointer;" title="Ver qué productos consumen este pan hoy" onclick="App.showBreakdownModal('${item.breadId}', '${todayKey}', 'Hoy')">
              ${this.formatBreadVal(item.reqToday)}
              ${item.reqToday > 0 ? '<small style="color: var(--secondary); font-size: 0.75rem; margin-left: 2px;">ℹ</small>' : ''}
            </span>
          </td>
          <td>
            <span class="val-badge" style="cursor: pointer;" title="Ver qué productos consumen este pan mañana" onclick="App.showBreakdownModal('${item.breadId}', '${tomorrowKey}', 'Mañana')">
              ${this.formatBreadVal(item.reqTomorrow)}
              ${item.reqTomorrow > 0 ? '<small style="color: var(--secondary); font-size: 0.75rem; margin-left: 2px;">ℹ</small>' : ''}
            </span>
          </td>
          <td class="stock-remaining-cell">
            ${isShortage ? `
              <span class="badge-status badge-shortage">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                FALTAN ${this.formatBreadVal(item.shortageAmount)}
              </span>
            ` : `
              <span class="badge-status badge-ok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Sobra +${this.formatBreadVal(item.remainingStock)}
              </span>
            `}
          </td>
        </tr>
      `;
    });

    this.stockTableBody.innerHTML = html;

    // Vincular botones de edición rápida de stock en la tabla
    this.stockTableBody.querySelectorAll('.btn-quick-edit-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const breadId = btn.getAttribute('data-bread-id');
        this.openAdjustStockModal(breadId);
      });
    });
  },

  // ====================================================
  // MODAL: AGREGAR PRODUCTO A UN DÍA ESPECÍFICO
  // ====================================================
  openAddProductToDayModal(dayKey) {
    this.state.addingToDay = dayKey;
    this.state.selectedProductToAdd = null;

    const dayInfo = window.stockCalculator.getDayInfo(dayKey);
    this.modalAddDayProductTitle.textContent = `Agregar Producto al ${dayInfo.name}`;

    this.dayProductSearchInput.value = '';
    this.dayProductQtyInput.value = '10';
    this.daySelectedProductInfo.style.display = 'none';
    this.dayDuplicateWarning.style.display = 'none';
    this.btnConfirmAddDayProduct.disabled = true;

    this.filterDayProductSearchResults('');
    this.openModal(this.modalAddDayProduct);

    setTimeout(() => this.dayProductSearchInput.focus(), 150);
  },

  filterDayProductSearchResults(query) {
    const cleanQuery = (query || '').toLowerCase().trim();
    const products = window.appStore.getProducts();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(cleanQuery) || (p.code && p.code.toLowerCase().includes(cleanQuery))
    );

    if (filtered.length === 0) {
      this.dayProductSearchResults.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No se encontraron productos coincidentes.
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const isSelected = this.state.selectedProductToAdd && this.state.selectedProductToAdd.id === p.id;
      const recipeSummary = window.stockCalculator.getProductRecipeSummary(p);
      const codeBadge = p.code ? `<span style="display: inline-block; background-color: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 700; padding: 1px 5px; border-radius: 4px; margin-right: 0.35rem;">#${p.code}</span>` : '';

      html += `
        <div class="search-result-item ${isSelected ? 'selected' : ''}" data-product-id="${p.id}">
          <div>
            <div class="item-title">${codeBadge}${this.escapeHtml(p.name)}</div>
            <div class="item-sub">${this.escapeHtml(recipeSummary)}</div>
          </div>
          <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">Seleccionar</span>
        </div>
      `;
    });

    this.dayProductSearchResults.innerHTML = html;

    // Vincular clic en resultado
    this.dayProductSearchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const prodId = item.getAttribute('data-product-id');
        this.selectProductToAdd(prodId);
      });
    });
  },

  selectProductToAdd(productId) {
    const product = window.appStore.getProductById(productId);
    if (!product) return;

    this.state.selectedProductToAdd = product;

    // Resaltar en la lista
    this.dayProductSearchResults.querySelectorAll('.search-result-item').forEach(it => {
      it.classList.toggle('selected', it.getAttribute('data-product-id') === productId);
    });

    // Mostrar resumen del producto seleccionado
    this.daySelectedProductInfo.style.display = 'block';
    this.daySelectedProductName.textContent = product.name;
    this.daySelectedProductRecipe.textContent = `Consumo: ${window.stockCalculator.getProductRecipeSummary(product)}`;

    // Comprobar si ya existe en ese día
    const dayPlan = window.appStore.getDayPlan(this.state.addingToDay);
    const existing = dayPlan.find(item => item.productId === productId);

    if (existing) {
      this.dayDuplicateWarning.style.display = 'flex';
      this.dayDuplicateWarningText.textContent = 
        `Este producto ya está cargado con ${existing.qty} unidades. Si confirmas, se sumará la nueva cantidad a lo existente.`;
    } else {
      this.dayDuplicateWarning.style.display = 'none';
    }

    this.btnConfirmAddDayProduct.disabled = false;
  },

  confirmAddProductToDay() {
    if (!this.state.addingToDay || !this.state.selectedProductToAdd) return;

    const qty = parseInt(this.dayProductQtyInput.value, 10);
    if (isNaN(qty) || qty <= 0) {
      alert('Por favor ingresa una cantidad válida mayor a 0.');
      return;
    }

    const result = window.appStore.addProductToDay(this.state.addingToDay, this.state.selectedProductToAdd.id, qty);
    
    if (result.alreadyExists) {
      result.updateQty(true); // Suma la cantidad
      this.showToast(`Se sumaron ${qty} unidades a "${this.state.selectedProductToAdd.name}".`);
    } else {
      this.showToast(`"${this.state.selectedProductToAdd.name}" agregado con éxito.`);
    }

    this.closeModal(this.modalAddDayProduct);
  },

  // ====================================================
  // MODAL: PEGAR TABLA DE EXCEL / CUADRO
  // ====================================================
  openPasteExcelModal(dayKey) {
    this.state.pastingToDay = dayKey;
    const dayInfo = window.stockCalculator.getDayInfo(dayKey);

    this.modalPasteExcelTitle.textContent = `Pegar Planilla - ${dayInfo.name}`;
    this.pasteExcelTextarea.value = '';
    this.pasteAnalysisSummaryBar.style.display = 'none';
    this.pastePreviewContainer.style.display = 'none';
    this.pastePreviewTableBody.innerHTML = '';
    this.btnConfirmImportPaste.disabled = true;
    this.btnConfirmImportPasteText.textContent = `Cargar Productos al ${dayInfo.name}`;

    this.openModal(this.modalPasteExcel);
    setTimeout(() => this.pasteExcelTextarea.focus(), 150);
  },

  handlePasteInputChange() {
    const text = this.pasteExcelTextarea.value;
    const dayKey = this.state.pastingToDay;
    const dayInfo = dayKey ? window.stockCalculator.getDayInfo(dayKey) : { name: 'Día' };

    if (!text || !text.trim()) {
      this.state.currentParsedRows = [];
      this.pasteAnalysisSummaryBar.style.display = 'none';
      this.pastePreviewContainer.style.display = 'none';
      this.pastePreviewTableBody.innerHTML = '';
      this.btnConfirmImportPaste.disabled = true;
      this.btnConfirmImportPasteText.textContent = `Cargar Productos al ${dayInfo.name}`;
      return;
    }

    const result = this.parsePastedText(text);
    this.state.currentParsedRows = result.rows;

    this.renderPastePreviewRows(dayInfo);
  },

  renderPastePreviewRows(dayInfo) {
    const rows = this.state.currentParsedRows || [];
    const matchedCount = rows.filter(r => r.matched && r.product).length;
    const unmatchedCount = rows.filter(r => !r.matched || !r.product).length;

    this.pasteAnalysisSummaryBar.style.display = 'flex';
    this.pasteMatchedCount.textContent = matchedCount;

    if (unmatchedCount > 0) {
      this.pasteUnmatchedBadge.style.display = 'inline-flex';
      this.pasteUnmatchedCount.textContent = `${unmatchedCount} pendientes`;
    } else {
      this.pasteUnmatchedBadge.style.display = 'none';
    }

    if (rows.length === 0) {
      this.pastePreviewContainer.style.display = 'none';
      this.pastePreviewTableBody.innerHTML = '';
      this.btnConfirmImportPaste.disabled = true;
      this.btnConfirmImportPasteText.textContent = `Cargar Productos al ${dayInfo.name}`;
      return;
    }

    this.pastePreviewContainer.style.display = 'block';

    const allProducts = window.appStore.getProducts();

    let html = '';
    rows.forEach((r, index) => {
      const recipeSummary = r.product ? window.stockCalculator.getProductRecipeSummary(r.product) : '';

      html += `
        <tr style="${r.matched ? '' : 'background-color: #fff9f0;'}">
          <td style="font-weight: 700; width: 60px; vertical-align: middle;">
            <input type="number" min="1" class="form-control form-control-sm paste-row-qty-input" 
              data-row-index="${index}" value="${r.qty}" style="padding: 2px 4px; font-size: 0.8rem; width: 55px; text-align: center;">
          </td>
          <td style="vertical-align: middle;">
            <div style="font-weight: 500; font-size: 0.82rem; word-break: break-word;">${this.escapeHtml(r.rawDesc)}</div>
          </td>
          <td style="vertical-align: middle;">
            ${r.matched ? `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <div>
                  <strong style="color: var(--text-main); font-size: 0.85rem;">
                    ${r.product.code ? `<span class="product-code-badge" style="margin-right: 4px;">#${this.escapeHtml(r.product.code)}</span>` : ''}
                    ${this.escapeHtml(r.product.name)}
                  </strong>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${this.escapeHtml(recipeSummary)}</div>
                </div>
                <button type="button" class="btn-link btn-change-row-product" data-row-index="${index}" style="font-size: 0.72rem; color: var(--primary); text-decoration: underline; cursor: pointer; white-space: nowrap;">
                  Cambiar
                </button>
              </div>
            ` : `
              <div>
                <select class="form-control form-control-sm select-manual-match" data-row-index="${index}" style="font-size: 0.78rem; border-color: #f59e0b; background-color: #fffbeb;">
                  <option value="">⚠️ Asignar producto del catálogo...</option>
                  ${allProducts.map(p => `
                    <option value="${p.id}" ${r.manualSelectedId === p.id ? 'selected' : ''}>
                      ${p.code ? `[${p.code}] ` : ''}${this.escapeHtml(p.name)}
                    </option>
                  `).join('')}
                </select>
                <div style="font-size: 0.7rem; color: #b45309; margin-top: 2px;">Selecciona el producto si deseas incluirlo</div>
              </div>
            `}
          </td>
          <td style="text-align: right; vertical-align: middle;">
            ${r.matched ? `
              <span class="badge-tag-matched" style="font-size: 0.72rem;">✓ Listo</span>
            ` : `
              <span class="badge-tag-unmatched" style="font-size: 0.72rem;">Pendiente</span>
            `}
          </td>
        </tr>
      `;
    });

    this.pastePreviewTableBody.innerHTML = html;

    // Vincular cambios manuales en el dropdown de selección de producto
    this.pastePreviewTableBody.querySelectorAll('.select-manual-match').forEach(select => {
      select.addEventListener('change', (e) => {
        const rowIndex = parseInt(e.target.getAttribute('data-row-index'), 10);
        const selectedId = e.target.value;
        if (this.state.currentParsedRows[rowIndex]) {
          if (selectedId) {
            const product = window.appStore.getProductById(selectedId);
            this.state.currentParsedRows[rowIndex].product = product;
            this.state.currentParsedRows[rowIndex].matched = true;
            this.state.currentParsedRows[rowIndex].manualSelectedId = selectedId;
          } else {
            this.state.currentParsedRows[rowIndex].product = null;
            this.state.currentParsedRows[rowIndex].matched = false;
            this.state.currentParsedRows[rowIndex].manualSelectedId = null;
          }
          this.renderPastePreviewRows(dayInfo);
        }
      });
    });

    // Botón para cambiar producto ya asignado
    this.pastePreviewTableBody.querySelectorAll('.btn-change-row-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const rowIndex = parseInt(btn.getAttribute('data-row-index'), 10);
        if (this.state.currentParsedRows[rowIndex]) {
          this.state.currentParsedRows[rowIndex].product = null;
          this.state.currentParsedRows[rowIndex].matched = false;
          this.renderPastePreviewRows(dayInfo);
        }
      });
    });

    // Inputs de cantidad en la vista previa
    this.pastePreviewTableBody.querySelectorAll('.paste-row-qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const rowIndex = parseInt(e.target.getAttribute('data-row-index'), 10);
        const val = parseInt(e.target.value, 10);
        if (this.state.currentParsedRows[rowIndex] && val > 0) {
          this.state.currentParsedRows[rowIndex].qty = val;
        }
      });
    });

    if (matchedCount > 0) {
      this.btnConfirmImportPaste.disabled = false;
      this.btnConfirmImportPasteText.textContent = `Cargar ${matchedCount} Producto(s) al ${dayInfo.name}`;
    } else {
      this.btnConfirmImportPaste.disabled = true;
      this.btnConfirmImportPasteText.textContent = `Sin productos seleccionados para cargar`;
    }
  },

  normalizeForMatch(text) {
    if (!text) return '';
    return text.toString()
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/^["']+|["']+$/g, '')      // comillas exteriores
      .replace(/\u2026/g, '...')          // elipsis a tres puntos
      .replace(/[¨´`^]/g, '')             // dieresis o acentos flotantes
      .replace(/\u00A0/g, ' ')            // espacios no separables
      .replace(/\s+/g, ' ')
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")    // acentos
      .toLowerCase();
  },

  getBaseProductName(name) {
    const norm = this.normalizeForMatch(name);
    // Eliminar contenido entre paréntesis o corchetes
    const base = norm.replace(/\([^\)]*\)/g, '').replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
    return base;
  },

  standardizePunctuation(text) {
    const norm = this.normalizeForMatch(text);
    return norm
      .replace(/\)\s*\(/g, ') (')
      .replace(/\s*\(\s*/g, ' (')
      .replace(/\s*\)\s*/g, ') ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*-\s*/g, ' - ')
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  },

  findProductMatch(rawText) {
    if (!rawText) return null;
    const cleanRaw = (rawText.toString() || '').trim().replace(/^["']+|["']+$/g, '').trim();
    if (!cleanRaw) return null;

    const products = window.appStore.getProducts();
    const norm = this.normalizeForMatch(cleanRaw);
    if (!norm) return null;

    // 1. Coincidencia directa por código numérico (ej: "22653")
    if (/^\d{3,6}$/.test(cleanRaw)) {
      const byCode = products.find(p => p.code === cleanRaw);
      if (byCode) return byCode;
    }

    // 2. Coincidencia exacta de nombre completo normalizado
    const byExactName = products.find(p => this.normalizeForMatch(p.name) === norm);
    if (byExactName) return byExactName;

    // 3. Coincidencia con puntuación y paréntesis estandarizados
    const stdPunct = this.standardizePunctuation(cleanRaw);
    const byStdPunct = products.find(p => this.standardizePunctuation(p.name) === stdPunct);
    if (byStdPunct) return byStdPunct;

    // 4. Código numérico en prefijo ("22653 - Nombre" o "22653 Nombre" o "[22653] Nombre")
    const prefixMatch = cleanRaw.match(/^(?:\[|\()?(\d{3,6})(?:\]|\))?[\s\-_:]+(.+)$/);
    if (prefixMatch) {
      const code = prefixMatch[1];
      const descNorm = this.normalizeForMatch(prefixMatch[2]);
      const byCode = products.find(p => p.code === code);
      if (byCode) return byCode;
      const byDesc = products.find(p => this.normalizeForMatch(p.name) === descNorm);
      if (byDesc) return byDesc;
    }

    // 5. Código numérico en sufijo ("Nombre (22653)" o "Nombre 22653")
    const suffixMatch = cleanRaw.match(/^(.+?)[\s\-_:\(]+(\d{3,6})\)?$/);
    if (suffixMatch) {
      const code = suffixMatch[2];
      const byCode = products.find(p => p.code === code);
      if (byCode) return byCode;
    }

    // 6. Coincidencia por Nombre Base (sin especificaciones en paréntesis de ingredientes/empaque)
    const queryBase = this.getBaseProductName(cleanRaw);
    if (queryBase.length >= 4) {
      const byBaseExact = products.find(p => this.getBaseProductName(p.name) === queryBase);
      if (byBaseExact) return byBaseExact;

      const byPrefix = products.find(p => {
        const prodBase = this.getBaseProductName(p.name);
        return (prodBase && prodBase.startsWith(queryBase)) || 
               (this.normalizeForMatch(p.name).startsWith(queryBase));
      });
      if (byPrefix) return byPrefix;
    }

    // 7. Coincidencia ignorando punto o guión inicial (ej: ".Armado del sandwich..." o "- Mila box")
    const normNoLead = norm.replace(/^[.\s\-_]+/, '');
    if (normNoLead && normNoLead !== norm) {
      const byNoLead = products.find(p => this.normalizeForMatch(p.name).replace(/^[.\s\-_]+/, '') === normNoLead);
      if (byNoLead) return byNoLead;
    }

    // 8. Tolerancia a "Armado del sandwich X" vs "Combo Sandw. X"
    const armadoMatch = norm.match(/^(?:\.armado del sandwich|armado del sandwich)\s+(.+)$/);
    if (armadoMatch) {
      const sub = armadoMatch[1].trim();
      const byArmado = products.find(p => this.normalizeForMatch(p.name).includes(sub));
      if (byArmado) return byArmado;
    }

    return null;
  },

  parsePastedText(text) {
    if (!text || !text.trim()) {
      return { rows: [], matchedCount: 0, unmatchedCount: 0 };
    }

    const lines = text.split(/\r?\n/);
    const mode = this.pasteColOrderSelect ? this.pasteColOrderSelect.value : 'auto';
    const parsedRows = [];
    let matchedCount = 0;
    let unmatchedCount = 0;

    const headerKeywords = ['producto', 'articulo', 'artículo', 'codigo', 'código', 'cant', 'cantidad', 'item', 'detalle', 'descripcion', 'descripción', 'pan'];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Detectar si la fila es un encabezado
      const lower = trimmed.toLowerCase();
      const isHeader = headerKeywords.some(kw => {
        const re = new RegExp(`(^|[\\t;,\\s])${kw}([\\t;,\\s]|$)`, 'i');
        return re.test(lower);
      });
      if (isHeader && !this.findProductMatch(trimmed)) {
        return; // Omitir encabezados como "Cantidad \t Producto"
      }

      // Separadores: Tabulador, Punto y coma, 2 o más espacios, o Coma fuera de comillas
      let rawCells = trimmed.split('\t');
      if (rawCells.length < 2) rawCells = trimmed.split(';');
      if (rawCells.length < 2) rawCells = trimmed.split(/\s{2,}/);
      if (rawCells.length < 2) rawCells = trimmed.split(',');

      // Limpiar comillas exteriores que pone Excel en cada celda
      const cleanCells = rawCells
        .map(c => (c || '').replace(/^["']+|["']+$/g, '').trim())
        .filter(c => c.length > 0);

      if (cleanCells.length === 0) return;

      let matchedProduct = null;
      let qty = 0;
      let rawDesc = '';
      let productCellIndex = -1;

      if (mode === 'qty_prod' && cleanCells.length >= 2) {
        // Col 1: Cantidad | Col 2: Producto
        rawDesc = cleanCells[1];
        matchedProduct = this.findProductMatch(rawDesc);
        qty = parseInt(cleanCells[0].replace(/[^\d]/g, ''), 10) || 0;
        productCellIndex = 1;
      } else if (mode === 'prod_qty' && cleanCells.length >= 2) {
        // Col 1: Producto | Col 2: Cantidad
        rawDesc = cleanCells[0];
        matchedProduct = this.findProductMatch(rawDesc);
        qty = parseInt(cleanCells[1].replace(/[^\d]/g, ''), 10) || 0;
        productCellIndex = 0;
      } else if (mode === 'code_prod_qty' && cleanCells.length >= 3) {
        // Col 1: Código | Col 2: Producto | Col 3: Cantidad
        rawDesc = cleanCells[1];
        matchedProduct = this.findProductMatch(cleanCells[0]) || this.findProductMatch(rawDesc);
        qty = parseInt(cleanCells[2].replace(/[^\d]/g, ''), 10) || 0;
        productCellIndex = 1;
      } else if (mode === 'qty_code_prod' && cleanCells.length >= 3) {
        // Col 1: Cantidad | Col 2: Código | Col 3: Producto
        rawDesc = cleanCells[2];
        matchedProduct = this.findProductMatch(cleanCells[1]) || this.findProductMatch(rawDesc);
        qty = parseInt(cleanCells[0].replace(/[^\d]/g, ''), 10) || 0;
        productCellIndex = 2;
      } else if (mode === 'code_qty' && cleanCells.length >= 2) {
        // Col 1: Código | Col 2: Cantidad
        rawDesc = cleanCells[0];
        matchedProduct = this.findProductMatch(cleanCells[0]);
        qty = parseInt(cleanCells[1].replace(/[^\d]/g, ''), 10) || 0;
        productCellIndex = 0;
      } else {
        // MODO AUTO-DETECTAR INTELIGENTE (Por defecto)
        // 1. Escanear cada celda para ver si alguna coincide con un producto (código o nombre)
        for (let i = 0; i < cleanCells.length; i++) {
          const match = this.findProductMatch(cleanCells[i]);
          if (match) {
            matchedProduct = match;
            productCellIndex = i;
            rawDesc = cleanCells[i];
            break;
          }
        }

        // 2. Si no coincide individualmente, probar pares contiguos (ej: si código está en celda 0 y nombre en celda 1)
        if (!matchedProduct && cleanCells.length >= 2) {
          for (let i = 0; i < cleanCells.length - 1; i++) {
            const joined = `${cleanCells[i]} ${cleanCells[i + 1]}`;
            const match = this.findProductMatch(joined);
            if (match) {
              matchedProduct = match;
              productCellIndex = i;
              rawDesc = joined;
              break;
            }
          }
        }

        // 3. Determinar la cantidad buscando números enteros en las celdas restantes
        if (cleanCells.length >= 2) {
          for (let i = 0; i < cleanCells.length; i++) {
            if (i === productCellIndex) continue;
            const cellTxt = cleanCells[i];
            if (matchedProduct && matchedProduct.code === cellTxt) continue;
            const numMatch = cellTxt.match(/^\s*(\d+)\s*(?:u|un|unid|unidades)?\s*$/i);
            if (numMatch) {
              const val = parseInt(numMatch[1], 10);
              if (val > 0) {
                qty = val;
                break;
              }
            }
          }

          if (qty === 0) {
            for (let i = 0; i < cleanCells.length; i++) {
              if (i === productCellIndex) continue;
              const cellTxt = cleanCells[i];
              if (matchedProduct && matchedProduct.code === cellTxt) continue;
              const digits = cellTxt.replace(/[^\d]/g, '');
              if (digits.length > 0 && digits.length <= 4) {
                const val = parseInt(digits, 10);
                if (val > 0) {
                  qty = val;
                  break;
                }
              }
            }
          }
        }

        if (qty === 0) {
          const startNum = trimmed.match(/^(\d+)\s+(.+)$/);
          if (startNum && matchedProduct) {
            qty = parseInt(startNum[1], 10) || 1;
          } else {
            qty = 1;
          }
        }

        if (!rawDesc) {
          rawDesc = cleanCells.join(' | ');
        }
      }

      if (matchedProduct) {
        matchedCount++;
        parsedRows.push({
          lineIndex: index + 1,
          rawDesc,
          qty: qty > 0 ? qty : 1,
          matched: true,
          product: matchedProduct,
          manualSelectedId: null
        });
      } else {
        unmatchedCount++;
        parsedRows.push({
          lineIndex: index + 1,
          rawDesc,
          qty: qty > 0 ? qty : 1,
          matched: false,
          product: null,
          manualSelectedId: null
        });
      }
    });

    return { rows: parsedRows, matchedCount, unmatchedCount };
  },

  handleConfirmImportPaste() {
    if (!this.state.pastingToDay) return;
    const rows = this.state.currentParsedRows || [];
    const matchedRows = rows.filter(r => r.matched && r.product);

    if (matchedRows.length === 0) {
      alert('No se encontraron productos seleccionados para cargar.');
      return;
    }

    const dayKey = this.state.pastingToDay;
    const duplicateAction = this.pasteDuplicateActionSelect.value; // 'sum' | 'replace'
    let addedCount = 0;

    matchedRows.forEach(row => {
      const res = window.appStore.addProductToDay(dayKey, row.product.id, row.qty);
      if (res && res.alreadyExists) {
        if (duplicateAction === 'replace') {
          res.updateQty(false); // sobrescribir cantidad
        } else {
          res.updateQty(true);  // sumar cantidad
        }
      }
      addedCount++;
    });

    const dayInfo = window.stockCalculator.getDayInfo(dayKey);
    this.showToast(`¡Se cargaron ${addedCount} producto(s) exitosamente al ${dayInfo.name}!`);
    this.closeModal(this.modalPasteExcel);
  },

  // ====================================================
  // MODAL: DESGLOSE DE CONSUMO (TOOLTIP INFORMATIVO)
  // ====================================================
  showBreakdownModal(breadId, dayKey, dayLabel) {
    const bread = window.appStore.getBreadById(breadId);
    if (!bread) return;

    const dayReqs = window.stockCalculator.calculateDayRequirements(dayKey);
    const breadReq = dayReqs[breadId];

    this.modalBreakdownTitle.textContent = `Consumo de ${bread.name} (${dayLabel})`;

    if (!breadReq || breadReq.breakdown.length === 0) {
      this.modalBreakdownList.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No hay productos planificados que consuman este pan para el día ${dayLabel}.
        </div>
      `;
    } else {
      let html = '';
      breadReq.breakdown.forEach(item => {
        html += `
          <div class="breakdown-item">
            <div>
              <strong>${this.escapeHtml(item.productName)}</strong>
              <div style="color: var(--text-muted); font-size: 0.78rem;">
                ${item.productQty} unidades × ${this.formatBreadVal(item.breadsPerUnit)} pan(es)
              </div>
            </div>
            <div style="font-weight: 700; color: var(--primary-text); font-size: 0.95rem;">
              ${this.formatBreadVal(item.breadsNeeded)} panes
            </div>
          </div>
        `;
      });
      html += `
        <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border-color); font-weight: 800;">
          <span>TOTAL REQUERIDO:</span>
          <span style="color: var(--text-main); font-size: 1.05rem;">${this.formatBreadVal(breadReq.requiredQty)} panes</span>
        </div>
      `;
      this.modalBreakdownList.innerHTML = html;
    }

    this.openModal(this.modalBreakdown);
  },

  // ====================================================
  // DESCONTAR STOCK REAL DE HOY
  // ====================================================
  handleDeductTodayStock() {
    const todayKey = window.stockCalculator.getTodayKey();
    const todayInfo = window.stockCalculator.getDayInfo(todayKey);
    const todayReqs = window.stockCalculator.calculateDayRequirements(todayKey);

    const itemsToDeduct = Object.values(todayReqs).filter(r => r.requiredQty > 0);

    if (itemsToDeduct.length === 0) {
      alert(`No hay requerimientos de panes cargados para hoy (${todayInfo.name}).`);
      return;
    }

    let summaryText = itemsToDeduct.map(r => `• ${r.name}: ${this.formatBreadVal(r.requiredQty)} unidades`).join('\n');

    const confirmed = confirm(
      `¿Deseas descontar el consumo de hoy (${todayInfo.name}) de tu inventario real?\n\n` +
      `Se descontarán:\n${summaryText}\n\n` +
      `Esta acción modificará el Stock Disponible actual.`
    );

    if (confirmed) {
      itemsToDeduct.forEach(item => {
        const currentBread = window.appStore.getBreadById(item.breadId);
        if (currentBread) {
          const newStock = Math.max(0, currentBread.stock - item.requiredQty);
          window.appStore.updateBreadStock(item.breadId, newStock);
        }
      });
      this.showToast('¡Consumo del día descontado con éxito del inventario!');
    }
  },

  // ====================================================
  // MODAL: RESUMEN DE PEDIDO SEMANAL A PANADERÍA
  // ====================================================
  openWeeklyPurchaseModal() {
    const summary = window.stockCalculator.getWeeklySummary();
    
    let html = '';
    summary.forEach(item => {
      const isDeficit = item.toPurchase > 0;
      html += `
        <tr>
          <td>
            <strong>${this.escapeHtml(item.name)}</strong>
          </td>
          <td>${this.formatBreadVal(item.currentStock)}</td>
          <td style="font-weight: 700;">${this.formatBreadVal(item.totalWeeklyRequired)}</td>
          <td style="color: ${item.balance < 0 ? 'var(--danger)' : 'var(--success-text)'}; font-weight: 700;">
            ${item.balance > 0 ? '+' : ''}${this.formatBreadVal(item.balance)}
          </td>
          <td>
            ${isDeficit ? `
              <span class="badge-tag badge-today" style="font-size: 0.8rem; padding: 0.3rem 0.6rem;">
                Pedir ${this.formatBreadVal(item.toPurchase)} un.
              </span>
            ` : `
              <span class="badge-tag" style="background: var(--bg-subtle); color: var(--text-muted); font-size: 0.8rem;">
                Stock suficiente
              </span>
            `}
          </td>
        </tr>
      `;
    });

    this.weeklyPurchaseTableBody.innerHTML = html;
    this.openModal(this.modalWeeklyPurchase);
  },

  // ====================================================
  // MODAL: AJUSTAR STOCK RÁPIDO
  // ====================================================
  openAdjustStockModal(preselectedBreadId = null) {
    const breads = window.appStore.getBreadTypes();
    if (breads.length === 0) {
      alert('Debes agregar al menos un tipo de pan antes de cargar stock.');
      return;
    }

    let selectHtml = '';
    breads.forEach(b => {
      selectHtml += `<option value="${b.id}">${this.escapeHtml(b.name)}</option>`;
    });

    this.adjustStockBreadSelect.innerHTML = selectHtml;

    if (preselectedBreadId) {
      this.adjustStockBreadSelect.value = preselectedBreadId;
    }

    this.updateAdjustStockFields();
    this.openModal(this.modalAdjustStock);
    setTimeout(() => this.adjustStockNewVal.focus(), 150);
  },

  updateAdjustStockFields() {
    const breadId = this.adjustStockBreadSelect.value;
    const bread = window.appStore.getBreadById(breadId);
    if (bread) {
      this.adjustStockCurrentVal.value = `${this.formatBreadVal(bread.stock)} unidades`;
      this.adjustStockNewVal.value = this.formatBreadVal(bread.stock);
    }
  },

  handleSaveAdjustStock(e) {
    e.preventDefault();
    const breadId = this.adjustStockBreadSelect.value;
    const newStock = parseFloat(this.adjustStockNewVal.value);

    if (isNaN(newStock) || newStock < 0) {
      alert('El stock debe ser un número mayor o igual a 0.');
      return;
    }

    const roundedStock = Math.round((newStock + Number.EPSILON) * 100) / 100;
    window.appStore.updateBreadStock(breadId, roundedStock);
    this.showToast('Stock actualizado con éxito.');
    this.closeModal(this.modalAdjustStock);
  },

  // ====================================================
  // VISTA ADMINISTRACIÓN: PRODUCTOS Y RECETAS
  // ====================================================
  renderAdminProducts() {
    const query = (this.adminProductSearchInput.value || '').toLowerCase().trim();
    const products = window.appStore.getProducts();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query) || (p.code && p.code.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      this.adminProductsTableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No hay productos que coincidan con la búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    filtered.forEach(p => {
      const recipeTags = (p.recipe || []).map(r => {
        const bread = window.appStore.getBreadById(r.breadId);
        const breadName = bread ? bread.name : 'Pan eliminado';
        return `
          <span class="recipe-tag">
            <strong>${this.formatBreadVal(r.qty)}x</strong> ${this.escapeHtml(breadName)}
          </span>
        `;
      }).join('');

      const codeBadge = p.code ? `<span style="display: inline-block; background-color: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-right: 0.4rem;">#${p.code}</span>` : '';

      html += `
        <tr>
          <td>
            <div class="prod-name-cell">
              ${codeBadge}${this.escapeHtml(p.name)}
            </div>
          </td>
          <td>
            <div class="recipe-tags-list">
              ${recipeTags || '<span style="color: var(--text-subtle); font-size: 0.8rem;">Sin panes asociados</span>'}
            </div>
          </td>
          <td style="text-align: right;">
            <button class="btn-icon-only btn-edit-product" data-id="${p.id}" title="Modificar producto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon-only danger btn-delete-product" data-id="${p.id}" title="Eliminar producto">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </td>
        </tr>
      `;
    });

    this.adminProductsTableBody.innerHTML = html;

    // Vincular edición y eliminación
    this.adminProductsTableBody.querySelectorAll('.btn-edit-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openProductModal(id);
      });
    });

    this.adminProductsTableBody.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = window.appStore.getProductById(id);
        if (!prod) return;
        if (confirm(`¿Eliminar definitivamente el producto "${prod.name}"? También se removerá de las planificaciones semanales.`)) {
          window.appStore.deleteProduct(id);
          this.showToast(`Producto "${prod.name}" eliminado.`);
        }
      });
    });
  },

  openProductModal(productId = null) {
    this.state.editingProductId = productId;
    this.recipeRowsContainer.innerHTML = '';

    const breads = window.appStore.getBreadTypes();
    if (breads.length === 0) {
      alert('Debes crear al menos un tipo de pan en la columna de la derecha antes de crear productos.');
      return;
    }

    if (productId) {
      const prod = window.appStore.getProductById(productId);
      if (!prod) return;
      this.modalProductFormTitle.textContent = 'Modificar Producto';
      this.productFormId.value = prod.id;
      this.productFormName.value = prod.name;

      if (prod.recipe && prod.recipe.length > 0) {
        prod.recipe.forEach(r => this.addRecipeRow(r.breadId, r.qty));
      } else {
        this.addRecipeRow();
      }
    } else {
      this.modalProductFormTitle.textContent = 'Nuevo Producto';
      this.productFormId.value = '';
      this.productFormName.value = '';
      this.addRecipeRow();
    }

    this.openModal(this.modalProductForm);
    setTimeout(() => this.productFormName.focus(), 150);
  },

  addRecipeRow(selectedBreadId = null, qty = 1) {
    const breads = window.appStore.getBreadTypes();
    const row = document.createElement('div');
    row.className = 'recipe-row-item';

    let optionsHtml = '';
    breads.forEach(b => {
      optionsHtml += `<option value="${b.id}" ${b.id === selectedBreadId ? 'selected' : ''}>${this.escapeHtml(b.name)}</option>`;
    });

    row.innerHTML = `
      <select class="form-control recipe-bread-select">
        ${optionsHtml}
      </select>
      <input type="number" min="0.01" step="any" value="${qty || 1}" class="form-control recipe-qty-input" placeholder="Cant.">
      <button type="button" class="btn-icon-only danger btn-remove-recipe-row" title="Quitar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    row.querySelector('.btn-remove-recipe-row').addEventListener('click', () => {
      if (this.recipeRowsContainer.children.length > 1) {
        row.remove();
      } else {
        alert('El producto debe tener al menos un tipo de pan asociado.');
      }
    });

    this.recipeRowsContainer.appendChild(row);
  },

  handleSaveProduct(e) {
    e.preventDefault();
    const id = this.productFormId.value;
    const name = this.productFormName.value.trim();

    if (!name) {
      alert('Por favor ingresa el nombre del producto.');
      return;
    }

    // Extraer receta
    const recipe = [];
    const rows = this.recipeRowsContainer.querySelectorAll('.recipe-row-item');

    rows.forEach(row => {
      const breadId = row.querySelector('.recipe-bread-select').value;
      const qty = Math.round((parseFloat(row.querySelector('.recipe-qty-input').value) + Number.EPSILON) * 100) / 100;
      if (breadId && qty > 0) {
        recipe.push({ breadId, qty });
      }
    });

    if (recipe.length === 0) {
      alert('Debes indicar al menos un pan con cantidad mayor a 0.');
      return;
    }

    try {
      if (id) {
        window.appStore.updateProduct(id, name, recipe);
        this.showToast(`Producto "${name}" actualizado.`);
      } else {
        window.appStore.addProduct(name, recipe);
        this.showToast(`Producto "${name}" agregado con éxito.`);
      }
      this.closeModal(this.modalProductForm);
    } catch (err) {
      alert(err.message);
    }
  },

  // ====================================================
  // VISTA ADMINISTRACIÓN: TIPOS DE PANES
  // ====================================================
  renderAdminBreads() {
    const breads = window.appStore.getBreadTypes();

    if (breads.length === 0) {
      this.adminBreadsTableBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            No hay tipos de panes cargados.
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    breads.forEach(b => {
      const usedInProducts = window.appStore.getProductsUsingBread(b.id);
      const usedText = usedInProducts.length > 0
        ? `${usedInProducts.length} producto(s)`
        : '<span style="color: var(--text-subtle);">Sin uso</span>';

      html += `
        <tr>
          <td>
            <div class="bread-name-cell">
              <span class="bread-bullet"></span>
              <strong>${this.escapeHtml(b.name)}</strong>
            </div>
          </td>
          <td>
            <span class="val-badge">${this.formatBreadVal(b.stock)} un.</span>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted);">
            ${usedText}
          </td>
          <td style="text-align: right;">
            <button class="btn-icon-only btn-adjust-bread-stock" data-id="${b.id}" title="Ajustar stock">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button class="btn-icon-only btn-edit-bread" data-id="${b.id}" title="Modificar nombre">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-icon-only danger btn-delete-bread" data-id="${b.id}" title="Eliminar tipo de pan">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </td>
        </tr>
      `;
    });

    this.adminBreadsTableBody.innerHTML = html;

    // Vincular acciones
    this.adminBreadsTableBody.querySelectorAll('.btn-adjust-bread-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openAdjustStockModal(id);
      });
    });

    this.adminBreadsTableBody.querySelectorAll('.btn-edit-bread').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openBreadModal(id);
      });
    });

    this.adminBreadsTableBody.querySelectorAll('.btn-delete-bread').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const bread = window.appStore.getBreadById(id);
        if (!bread) return;

        try {
          if (confirm(`¿Eliminar el tipo de pan "${bread.name}"?`)) {
            window.appStore.deleteBreadType(id);
            this.showToast(`Tipo de pan "${bread.name}" eliminado.`);
          }
        } catch (err) {
          alert(err.message);
        }
      });
    });
  },

  openBreadModal(breadId = null) {
    this.state.editingBreadId = breadId;

    if (breadId) {
      const bread = window.appStore.getBreadById(breadId);
      if (!bread) return;
      this.modalBreadFormTitle.textContent = 'Modificar Tipo de Pan';
      this.breadFormId.value = bread.id;
      this.breadFormName.value = bread.name;
      this.breadFormStock.value = this.formatBreadVal(bread.stock);
    } else {
      this.modalBreadFormTitle.textContent = 'Nuevo Tipo de Pan';
      this.breadFormId.value = '';
      this.breadFormName.value = '';
      this.breadFormStock.value = '0';
    }

    this.openModal(this.modalBreadForm);
    setTimeout(() => this.breadFormName.focus(), 150);
  },

  handleSaveBread(e) {
    e.preventDefault();
    const id = this.breadFormId.value;
    const name = this.breadFormName.value.trim();
    const stock = Math.round((parseFloat(this.breadFormStock.value) + Number.EPSILON) * 100) / 100 || 0;

    if (!name) {
      alert('Por favor ingresa el nombre del pan.');
      return;
    }

    try {
      if (id) {
        window.appStore.updateBreadType(id, name, stock);
        this.showToast(`Tipo de pan "${name}" actualizado.`);
      } else {
        window.appStore.addBreadType(name, stock);
        this.showToast(`Tipo de pan "${name}" agregado con éxito.`);
      }
      this.closeModal(this.modalBreadForm);
    } catch (err) {
      alert(err.message);
    }
  },

  // ====================================================
  // UTILIDADES: RESPALDOS Y LIMPIEZA
  // ====================================================
  handleExportData() {
    const jsonStr = window.appStore.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);

    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_stock_panes_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Copia de seguridad descargada correctamente.');
  },

  handleImportData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = window.appStore.importJSON(content);
      if (res.success) {
        this.showToast('¡Respaldo importado correctamente!');
        this.closeModal(this.modalUtilities);
      } else {
        alert('Error al importar archivo: ' + res.error);
      }
      this.importFileInput.value = '';
    };
    reader.readAsText(file);
  },

  handleClearWeek() {
    if (confirm('¿Estás seguro de que deseas vaciar los productos de los 7 días de la semana? Esta acción no se puede deshacer.')) {
      window.appStore.clearEntireWeek();
      this.showToast('Se vaciaron todas las planificaciones de la semana.');
      this.closeModal(this.modalUtilities);
    }
  },

  handleResetDefaults() {
    if (confirm('¿Restablecer los datos de demostración de fábrica? Se sobrescribirá la información actual.')) {
      window.appStore.resetToDefault();
      this.showToast('Datos de fábrica restaurados con éxito.');
      this.closeModal(this.modalUtilities);
    }
  },

  handleClearLocalStorage() {
    const confirmed = confirm(
      '⚠️ ATENCIÓN: ¿Deseas LIMPIAR EL LOCALSTORAGE?\n\n' +
      'Esta acción vaciará la memoria guardada en el navegador y recargará la configuración y catálogo actualizado desde store.js.\n\n' +
      '¿Deseas continuar?'
    );

    if (!confirmed) return;

    window.appStore.clearLocalStorage(true);
    this.showToast('¡LocalStorage limpiado con éxito! Se recargó el catálogo desde store.js.');

    if (this.modalUtilities) {
      this.closeModal(this.modalUtilities);
    }

    this.render();
  },

  // ====================================================
  // MODALES Y TOASTS HELPERS
  // ====================================================
  openModal(modalElem) {
    if (!modalElem) return;
    modalElem.classList.add('open');
    modalElem.setAttribute('aria-hidden', 'false');
  },

  closeModal(modalElem) {
    if (!modalElem) return;
    modalElem.classList.remove('open');
    modalElem.setAttribute('aria-hidden', 'true');
  },

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : 'toast-success'}`;
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'error' 
          ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
          : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
        }
      </svg>
      <span>${this.escapeHtml(message)}</span>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  // Formatea cantidades de pan con un máximo de 2 decimales
  formatBreadVal(val) {
    if (val === null || val === undefined || isNaN(val)) return '0';
    const num = Number(val);
    const rounded = Math.round((num + Number.EPSILON) * 100) / 100;
    return rounded.toString();
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.App = App;
