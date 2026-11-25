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

  // Redondea cantidades de pan a un máximo de 2 decimales (especialmente para pan de miga)
  roundQty(val) {
    if (val === null || val === undefined || isNaN(val)) return 0;
    return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
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
          requirements[breadId].requiredQty = this.roundQty(requirements[breadId].requiredQty + totalNeededForThisProd);
          requirements[breadId].breakdown.push({
            productId: product.id,
            productName: product.name,
            productQty: productQty,
            breadsPerUnit: this.roundQty(breadsPerUnit),
            breadsNeeded: this.roundQty(totalNeededForThisProd)
          });
        }
      });
    });

    return requirements;
  }

  /**
   * Calcula la evolución del stock día a día a lo largo de la semana en tiempo real.
   * Si en un día se cargan productos, se descuenta de forma acumulativa para los días siguientes.
   */
  calculateWeeklyProgression() {
    const breadTypes = this.store.getBreadTypes();
    const progression = {};
    
    // Inicializar inventario corriendo con el stock físico disponible
    const runningStock = {};
    breadTypes.forEach(b => {
      runningStock[b.id] = this.roundQty(b.stock);
    });

    DAYS_CONFIG.forEach(d => {
      const dayReqs = this.calculateDayRequirements(d.key);
      const dayBreads = [];
      let totalBreadsNeeded = 0;
      let dayShortages = 0;

      breadTypes.forEach(b => {
        const req = this.roundQty(dayReqs[b.id]?.requiredQty || 0);
        const startStock = this.roundQty(runningStock[b.id]);
        const remaining = this.roundQty(startStock - req);
        const isShortage = remaining < 0;

        totalBreadsNeeded = this.roundQty(totalBreadsNeeded + req);
        if (isShortage && req > 0) dayShortages++;

        dayBreads.push({
          breadId: b.id,
          name: b.name,
          startStock: startStock,
          required: req,
          remainingStock: remaining,
          isShortage: isShortage,
          shortageAmount: isShortage ? this.roundQty(Math.abs(remaining)) : 0,
          breakdown: dayReqs[b.id]?.breakdown || []
        });

        // Descontar para los días siguientes en tiempo real
        runningStock[b.id] = remaining;
      });

      progression[d.key] = {
        dayKey: d.key,
        dayName: d.name,
        totalBreadsNeeded,
        shortagesCount: dayShortages,
        breads: dayBreads
      };
    });

    return {
      byDay: progression,
      finalStock: runningStock
    };
  }

  /**
   * Genera el resumen comparativo completo de stock para el panel general al final de la semana
   */
  getDetailedStockReport() {
    const todayKey = this.getTodayKey();
    const tomorrowKey = this.getNextDayKey(todayKey);

    const todayReqs = this.calculateDayRequirements(todayKey);
    const tomorrowReqs = this.calculateDayRequirements(tomorrowKey);
    const weeklySummary = this.getWeeklySummary();

    const breadTypes = this.store.getBreadTypes();

    const report = breadTypes.map(bread => {
      const reqToday = this.roundQty(todayReqs[bread.id]?.requiredQty || 0);
      const reqTomorrow = this.roundQty(tomorrowReqs[bread.id]?.requiredQty || 0);
      const weeklyItem = weeklySummary.find(w => w.breadId === bread.id);
      const totalWeek = weeklyItem ? this.roundQty(weeklyItem.totalWeeklyRequired) : 0;
      const finalRemaining = this.roundQty(bread.stock - totalWeek);
      const isShortage = finalRemaining < 0;

      return {
        breadId: bread.id,
        name: bread.name,
        stock: this.roundQty(bread.stock),
        reqToday,
        reqTomorrow,
        totalWeek,
        remainingStock: finalRemaining,
        isShortage: isShortage,
        shortageAmount: isShortage ? this.roundQty(Math.abs(finalRemaining)) : 0,
        breakdownToday: todayReqs[bread.id]?.breakdown || [],
        breakdownTomorrow: tomorrowReqs[bread.id]?.breakdown || []
      };
    });

    // Métricas globales
    const totalStock = this.roundQty(report.reduce((acc, r) => acc + r.stock, 0));
    const totalWeek = this.roundQty(report.reduce((acc, r) => acc + r.totalWeek, 0));
    const totalReqToday = this.roundQty(report.reduce((acc, r) => acc + r.reqToday, 0));
    const totalReqTomorrow = this.roundQty(report.reduce((acc, r) => acc + r.reqTomorrow, 0));
    const shortagesCount = report.filter(r => r.isShortage).length;

    return {
      todayKey,
      tomorrowKey,
      items: report,
      summary: {
        totalStock,
        totalWeek,
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
        currentStock: this.roundQty(b.stock),
        totalWeeklyRequired: 0,
        byDay: {}
      };
    });

    DAYS_CONFIG.forEach(d => {
      const dayReqs = this.calculateDayRequirements(d.key);
      breadTypes.forEach(b => {
        const qty = this.roundQty(dayReqs[b.id]?.requiredQty || 0);
        result[b.id].byDay[d.key] = qty;
        result[b.id].totalWeeklyRequired = this.roundQty(result[b.id].totalWeeklyRequired + qty);
      });
    });

    return Object.values(result).map(item => ({
      ...item,
      currentStock: this.roundQty(item.currentStock),
      totalWeeklyRequired: this.roundQty(item.totalWeeklyRequired),
      balance: this.roundQty(item.currentStock - item.totalWeeklyRequired),
      toPurchase: this.roundQty(Math.max(0, item.totalWeeklyRequired - item.currentStock))
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
        const formattedQty = this.roundQty(r.qty);
        return `${formattedQty}x ${name}`;
      })
      .join(', ');
  }
}

// Instancia global del calculador
window.DAYS_CONFIG = DAYS_CONFIG;
window.stockCalculator = new StockCalculator(window.appStore);
