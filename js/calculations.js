/**
 * calculations.js - Lógica matemática y cálculos de requerimiento de panes
 * Aplicación de Control de Stock de Panes
 */

const DAYS_CONFIG = [
  { key: 'lunes', name: 'Lunes', short: 'Lun', order: 1 },
  { key: 'martes', name: 'Martes', short: 'Mar', order: 2 },
  { key: 'miercoles', name: 'Miércoles', short: 'Mié', order: 3 },
  { key: 'jueves', name: 'Jueves', short: 'Jue', order: 4 },
  { key: 'viernes', name: 'Viernes', short: 'Vie', order: 5 },
  { key: 'sabado', name: 'Sábado', short: 'Sáb', order: 6 },
  { key: 'domingo', name: 'Domingo', short: 'Dom', order: 7 }
];

class StockCalculator {
  constructor(store) {
    this.store = store;
  }

  // Obtener la clave del día de la semana actual según la fecha del sistema
  getTodayKey() {
    const dayIndex = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ... 6 = Sábado
    const map = {
      0: 'domingo',
      1: 'lunes',
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado'
    };
    return map[dayIndex] || 'lunes';
  }

  // Obtener la clave del día siguiente
  getNextDayKey(currentDayKey) {
    const keys = DAYS_CONFIG.map(d => d.key);
    const idx = keys.indexOf(currentDayKey);
    if (idx === -1) return 'martes';
    return keys[(idx + 1) % keys.length];
  }

  // Obtener la información de un día por su clave
  getDayInfo(dayKey) {
    return DAYS_CONFIG.find(d => d.key === dayKey) || DAYS_CONFIG[0];
  }

  /**
   * Calcula los requerimientos de panes para un día específico
   * @param {string} dayKey - 'lunes', 'martes', etc.
   * @returns {Object} { [breadId]: { breadId, name, requiredQty, breakdown: [ { productName, productQty, breadsNeeded } ] } }
   */
  calculateDayRequirements(dayKey) {
    const dayPlan = this.store.getDayPlan(dayKey);
    const breadTypes = this.store.getBreadTypes();
    
    // Inicializar mapa de requerimientos con todos los panes existentes en 0
    const requirements = {};
    breadTypes.forEach(b => {
      requirements[b.id] = {
        breadId: b.id,
        name: b.name,
        availableStock: b.stock,
        requiredQty: 0,
        breakdown: [] // Detalles de qué productos lo consumen
      };
    });

    // Recorrer los productos cargados para este día
    dayPlan.forEach(planItem => {
      const product = this.store.getProductById(planItem.productId);
      if (!product || !product.recipe) return;

      const productQty = planItem.qty || 0;
      if (productQty <= 0) return;

      product.recipe.forEach(recipeItem => {
        const breadId = recipeItem.breadId;
        const breadsPerUnit = recipeItem.qty || 0;
        const totalNeededForThisProd = productQty * breadsPerUnit;

        if (requirements[breadId]) {
          requirements[breadId].requiredQty += totalNeededForThisProd;
          requirements[breadId].breakdown.push({
            productId: product.id,
            productName: product.name,
            productQty: productQty,
            breadsPerUnit: breadsPerUnit,
            breadsNeeded: totalNeededForThisProd
          });
        }
      });
    });

    return requirements;
  }

  /**
   * Genera el resumen comparativo completo de stock para el panel derecho
   * @param {string} selectedDayKey - Día que se está inspeccionando detalladamente (por defecto, hoy)
   */
  getDetailedStockReport(selectedDayKey = null) {
    const todayKey = this.getTodayKey();
    const tomorrowKey = this.getNextDayKey(todayKey);
    const focusDayKey = selectedDayKey || todayKey;

    const todayReqs = this.calculateDayRequirements(todayKey);
    const tomorrowReqs = this.calculateDayRequirements(tomorrowKey);
    const focusReqs = focusDayKey !== todayKey && focusDayKey !== tomorrowKey 
      ? this.calculateDayRequirements(focusDayKey) 
      : null;

    const breadTypes = this.store.getBreadTypes();

    const report = breadTypes.map(bread => {
      const reqToday = todayReqs[bread.id]?.requiredQty || 0;
      const reqTomorrow = tomorrowReqs[bread.id]?.requiredQty || 0;
      const reqSelected = focusReqs ? (focusReqs[bread.id]?.requiredQty || 0) : null;

      // El stock restante por defecto se calcula contra el día seleccionado o hoy
      const referenceRequirement = reqSelected !== null ? reqSelected : reqToday;
      const remainingStock = bread.stock - referenceRequirement;

      // Calculamos también la proyección si se cubriera hoy + mañana
      const remainingAfterTomorrow = bread.stock - (reqToday + reqTomorrow);

      return {
        breadId: bread.id,
        name: bread.name,
        stock: bread.stock,
        reqToday,
        reqTomorrow,
        reqSelected,
        remainingStock,
        remainingAfterTomorrow,
        isShortage: remainingStock < 0,
        shortageAmount: remainingStock < 0 ? Math.abs(remainingStock) : 0,
        breakdownToday: todayReqs[bread.id]?.breakdown || [],
        breakdownTomorrow: tomorrowReqs[bread.id]?.breakdown || [],
        breakdownSelected: focusReqs ? (focusReqs[bread.id]?.breakdown || []) : []
      };
    });

    // Métricas globales
    const totalStock = report.reduce((acc, r) => acc + r.stock, 0);
    const totalReqToday = report.reduce((acc, r) => acc + r.reqToday, 0);
    const totalReqTomorrow = report.reduce((acc, r) => acc + r.reqTomorrow, 0);
    const shortagesCount = report.filter(r => r.isShortage).length;

    return {
      todayKey,
      tomorrowKey,
      focusDayKey,
      items: report,
      summary: {
        totalStock,
        totalReqToday,
        totalReqTomorrow,
        shortagesCount
      }
    };
  }

  /**
   * Calcula el resumen total semanal (ideal para hacer pedidos a la panadería)
   */
  getWeeklySummary() {
    const breadTypes = this.store.getBreadTypes();
    const result = {};

    breadTypes.forEach(b => {
      result[b.id] = {
        breadId: b.id,
        name: b.name,
        currentStock: b.stock,
        totalWeeklyRequired: 0,
        byDay: {}
      };
    });

    DAYS_CONFIG.forEach(d => {
      const dayReqs = this.calculateDayRequirements(d.key);
      breadTypes.forEach(b => {
        const qty = dayReqs[b.id]?.requiredQty || 0;
        result[b.id].byDay[d.key] = qty;
        result[b.id].totalWeeklyRequired += qty;
      });
    });

    return Object.values(result).map(item => ({
      ...item,
      balance: item.currentStock - item.totalWeeklyRequired,
      toPurchase: Math.max(0, item.totalWeeklyRequired - item.currentStock)
    }));
  }

  /**
   * Obtiene la descripción legible de los panes que consume un producto
   * Ejemplo: "2x Pan de Hamburguesa, 1x Pancho"
   */
  getProductRecipeSummary(product) {
    if (!product || !product.recipe || product.recipe.length === 0) {
      return 'Sin panes asociados';
    }
    return product.recipe
      .map(r => {
        const bread = this.store.getBreadById(r.breadId);
        const name = bread ? bread.name : 'Pan desconocido';
        return `${r.qty}x ${name}`;
      })
      .join(', ');
  }
}

// Instancia global del calculador
window.DAYS_CONFIG = DAYS_CONFIG;
window.stockCalculator = new StockCalculator(window.appStore);
