/**
 * store.js - Gestión de estado y persistencia en LocalStorage
 * Aplicación de Control de Stock de Panes - Sandwichería & Gastro
 */

const STORAGE_KEY = 'stock_panes_app_v2';

// Base de datos de catálogo oficial del usuario
const INITIAL_DATA = {
  breadTypes: [
    { id: 'b_sesamo', name: 'Pan c/sesamo', stock: 0 },
    { id: 'b_alargado', name: 'Pan alargado', stock: 0 },
    { id: 'b_bimbo_alargado', name: 'PAN BIMBO ALARGADO', stock: 0 },
    { id: 'b_brioche', name: 'Pan brioche', stock: 0 },
    { id: 'b_papa', name: 'Pan de papa', stock: 0 },
    { id: 'b_croissant', name: 'Croissant', stock: 0 },
    { id: 'b_pebete', name: 'Pebete', stock: 0 },
    { id: 'b_bagel', name: 'Bagel', stock: 0 },
    { id: 'b_ciabatta', name: 'Ciabatta', stock: 0 },
    { id: 'b_miga', name: 'Miga', stock: 0}
  ],
  products: [
    {
      id: 'p_01',
      name: 'COMBO SANDW. MC TASTY FOOD',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_02',
      name: '.Armado del sandwich Max Veggie Food',
      recipe: [{ breadId: 'b_alargado', qty: 1 }]
    },
    {
      id: 'p_03',
      name: 'MILA BOX',
      recipe: [{ breadId: 'b_alargado', qty: 1 }]
    },
    {
      id: 'p_04',
      name: 'Mila box sap',
      recipe: [{ breadId: 'b_alargado', qty: 1 }]
    },
    {
      id: 'p_05',
      name: '.Armado del sandwich Big Max Food',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_06',
      name: '.Armado del sandwich 1/4 de Libra',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_07',
      name: '.COMBO SANDW. MC POLLO FOOD (1 MEDALLÓN, 1CHEDDAR, L PEP CEB DESH, KET MAYOT) (PSDIV) (22274)',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_08',
      name: '.Armado del sandwich MAX DELUXE CHICKEN',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_09',
      name: 'Sandw. Burger Mc FERNANDEZ',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    },
    {
      id: 'p_10',
      name: 'Sandw. Burger McALLISTER',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    },
    {
      id: 'p_11',
      name: 'Sandw. Burger Mc ALVAREZ',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    },
    {
      id: 'p_12',
      name: 'SAND. SUPREMA LECH-TOM PAN BIMBO ALARGADO',
      recipe: [{ breadId: 'b_alargado', qty: 1 }]
    },
    {
      id: 'p_13',
      name: 'Sand. de Hamburguesa de quinoa porotos y hongos.',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    },
    {
      id: 'p_14',
      name: 'Sand de Hamburguesa de quinoa y brocoli LTQ (Termosellado)(MELI)',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    },
    {
      id: 'p_15',
      name: 'SANDW. BURGUER DIBU',
      recipe: [{ breadId: 'b_papa', qty: 1 }]
    },
    {
      id: 'p_16',
      name: 'Show de hamburguesas',
      recipe: [{ breadId: 'b_sesamo', qty: 2 }]
    },
    {
      id: 'p_17',
      name: 'SAND. SUPREMA JQ PAN BIMBO ALARGADO (115 GR LIMPIO) (FRITA)(TERMOSELLADO)(MELI (22541)',
      recipe: [{ breadId: 'b_bimbo_alargado', qty: 1 }]
    },
    {
      id: 'p_18',
      name: 'SAND. SUPREMA LECH-TOM PAN BIMBO ALARGADO(115 GR LIMPIO) (FRITA) (TERMOSELLADO)(MELI) (22542)',
      recipe: [{ breadId: 'b_bimbo_alargado', qty: 1 }]
    },
    {
      id: 'p_19',
      name: 'Croissant de Jamon y Queso (Termosellado)(MELI) (R-22643)',
      recipe: [{ breadId: 'b_croissant', qty: 1 }]
    },
    {
      id: 'p_20',
      name: 'Pbt JQ (X2) (11660)',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_21',
      name: 'SANDW. PBT J-Q (X2) DOBLE (Termosellado) (MELI) (22569)',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_22',
      name: 'Pbt JQLTH x 2 (R-11662)',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_23',
      name: 'Pbt JQLTH x 2 (R-22568) doble Termosellado',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_24',
      name: 'Pbt Comb (Salm-Jam) x 2 (R-11875) (18834)',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_25',
      name: 'Pbt Comb (Salm-Jam) x 2 (R- 22572 )',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_26',
      name: 'Pbt Salame-Q x 1 ( R 2505) (18832) (13383)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_27',
      name: 'Pbt J-Q x 1 ( R 22533) Termosellado (22533)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_28',
      name: 'Pbt SUPREMA JQ (frita) (R-11716) (12088)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_29',
      name: 'Pbt Combinado XL (JQ + Sal-Q) (32161)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_30',
      name: 'Pbt JQ-LTH (x 2u) XL y LTH xSalida) (R-) (32162)',
      recipe: [{ breadId: 'b_pebete', qty: 2 }]
    },
    {
      id: 'p_31',
      name: 'SANDW BAGEL MULTIC (JAM, QUE, LECH, TOM) (21603)',
      recipe: [{ breadId: 'b_bagel', qty: 2}]
    },
    {
      id: 'p_32',
      name: 'SANDW BAGEL MULTIC (JAM, QUE, LECH, TOM) (22571) Termosellado',
      recipe: [{ breadId: 'b_bagel', qty: 1 }]
    },
    {
      id: 'p_33',
      name: 'SANDW CIABATTA (JQ, Tom, Lech, Hue) (21599)',
      recipe: [{ breadId: 'b_ciabatta', qty: 1 }]
    },
    {
      id: 'p_34',
      name: 'SANDW CIABATTA (JQ, Tom, Lech, Hue) (22536) (termosellado)',
      recipe: [{ breadId: 'b_ciabatta', qty: 1 }]
    },
    {
      id: 'p_35',
      name: 'SANDW BAGEL (JAM, QUE, LECH, TOM) (21601)',
      recipe: [{ breadId: 'b_bagel', qty: 1 }]
    },
    {
      id: 'p_36',
      name: 'BAGEL JQ x 1 (TERMOSELLADO) (MELI) (22653)',
      recipe: [{ breadId: 'b_bagel', qty: 1 }]
    },
    {
      id: 'p_37',
      name: 'Pbt Queso-Mortadela (X1) (18833)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_38',
      name: 'Pbt SUPREMA JQ (Pan Bimbo Alargado) (R-22545)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    },
    {
      id: 'p_39',
      name: 'SAND. MAC CHEESE CHICKEN (TERMOSELLADO)(MELI) (22544)',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_40',
      name: 'SAND. MAC CHEESE DOBLE (2H+2CHEDDAR)(TERMOSELLADO)(MELI) (1U) (22543)',
      recipe: [{ breadId: 'b_sesamo', qty: 1 }]
    },
    {
      id: 'p_41',
      name: 'SANDW. MIGA x 2 (Termosellado) (MELI) (22652)',
      recipe: [{ breadId: 'b_miga', qty: 1 }]
    }
    ,
    {
      id: 'p_42',
      name: 'SANDW. PBT J-Q (2506)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    }
    ,
    {
      id: 'p_43',
      name: 'TRIPLE J-Q EVENTOS (1U) (20094)',
      recipe: [{ breadId: 'b_miga', qty: 1 }]
    }
    ,
    {
      id: 'p_44',
      name: 'SANDW DE MILA CUADRADA (140G BTO) (FRITA) (20292)',
      recipe: [{ breadId: 'b_pebete', qty: 1 }]
    }
     ,
    {
      id: 'p_45',
      name: 'SANDW. PHILLY CHEESE (CUADR, CEB TQ, MAYO CHIMI) PAN BRIOCHE (AGREGAR 22658-22661-21467) EMPOTADO (22660)',
      recipe: [{ breadId: 'b_brioche', qty: 1 }]
    }
    ,
    {
      id: 'p_46',
      name: 'SANDW. MIGA (X 5) (11688)',
      recipe: [{ breadId: 'b_miga', qty: 1 }]
    }
    ,
    {
      id: 'p_47',
      name: 'SANDW. MIGA (X 5) (11688)',
      recipe: [{ breadId: 'b_miga', qty: 1 }]
    }
  ],
  weeklyPlan: {
    lunes: [
      
    ],
    martes: [
     
    ],
    miercoles: [
      
    ],
    jueves: [
     
    ],
    viernes: [
      
    ],
    sabado: [
      
    ],
    domingo: [
     
    ]
  }
};

class Store {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  // Generador de ID únicos
  generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  // Cargar datos de LocalStorage
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveToStorage(INITIAL_DATA);
        return JSON.parse(JSON.stringify(INITIAL_DATA));
      }
      const parsed = JSON.parse(raw);
      // Validar estructura básica
      if (!parsed.breadTypes || !parsed.products || !parsed.weeklyPlan) {
        throw new Error('Formato inválido');
      }
      return parsed;
    } catch (e) {
      console.warn('Error leyendo localStorage, restableciendo a catálogo oficial:', e);
      this.saveToStorage(INITIAL_DATA);
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  // Guardar en LocalStorage y notificar
  save() {
    this.saveToStorage(this.data);
    this.notify();
  }

  saveToStorage(dataObj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataObj));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
      alert('Error: No se pudo guardar la información en el almacenamiento local.');
    }
  }

  // Suscribirse a cambios
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.data);
      } catch (err) {
        console.error('Error en listener de Store:', err);
      }
    });
  }

  // Restablecer al catálogo oficial
  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
  }

  // Limpiar LocalStorage completamente
  clearLocalStorage(reloadInitial = true) {
    try {
      localStorage.clear();
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error al vaciar localStorage:', e);
    }

    if (reloadInitial) {
      this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
      this.save();
    } else {
      this.data = {
        breadTypes: [],
        products: [],
        weeklyPlan: {
          lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: []
        }
      };
      this.save();
    }
    this.notify();
    return true;
  }

  // Exportar datos a JSON
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  // Importar datos desde JSON
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.breadTypes || !parsed.products || !parsed.weeklyPlan) {
        throw new Error('Estructura de respaldo inválida.');
      }
      this.data = parsed;
      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /* ====================================================
     GESTIÓN DE TIPOS DE PAN
  ==================================================== */
  getBreadTypes() {
    return [...this.data.breadTypes];
  }

  getBreadById(id) {
    return this.data.breadTypes.find(b => b.id === id) || null;
  }

  addBreadType(name, initialStock = 0) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre del pan no puede estar vacío.');
    
    // Evitar nombres duplicados
    const exists = this.data.breadTypes.some(b => b.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) throw new Error(`Ya existe un tipo de pan llamado "${cleanName}".`);

    const newBread = {
      id: this.generateId('b'),
      name: cleanName,
      stock: Math.max(0, parseInt(initialStock, 10) || 0)
    };

    this.data.breadTypes.push(newBread);
    this.save();
    return newBread;
  }

  updateBreadType(id, name, stock = null) {
    const bread = this.getBreadById(id);
    if (!bread) throw new Error('Tipo de pan no encontrado.');

    if (name !== undefined) {
      const cleanName = (name || '').trim();
      if (!cleanName) throw new Error('El nombre del pan no puede estar vacío.');
      const exists = this.data.breadTypes.some(b => b.id !== id && b.name.toLowerCase() === cleanName.toLowerCase());
      if (exists) throw new Error(`Ya existe otro tipo de pan llamado "${cleanName}".`);
      bread.name = cleanName;
    }

    if (stock !== null && stock !== undefined) {
      bread.stock = Math.max(0, parseInt(stock, 10) || 0);
    }

    this.save();
    return bread;
  }

  updateBreadStock(id, newStock) {
    const bread = this.getBreadById(id);
    if (!bread) throw new Error('Tipo de pan no encontrado.');
    bread.stock = Math.max(0, parseInt(newStock, 10) || 0);
    this.save();
    return bread;
  }

  // Verifica si un pan está en uso por algún producto
  getProductsUsingBread(breadId) {
    return this.data.products.filter(p => 
      p.recipe && p.recipe.some(r => r.breadId === breadId && r.qty > 0)
    );
  }

  deleteBreadType(id) {
    const index = this.data.breadTypes.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Tipo de pan no encontrado.');

    // Verificar si está en uso
    const usedIn = this.getProductsUsingBread(id);
    if (usedIn.length > 0) {
      const names = usedIn.map(p => p.name).join(', ');
      throw new Error(`No se puede eliminar porque está asociado a los productos: ${names}. Modifica esos productos primero.`);
    }

    this.data.breadTypes.splice(index, 1);
    this.save();
    return true;
  }

  /* ====================================================
     GESTIÓN DE PRODUCTOS Y RECETAS
  ==================================================== */
  getProducts() {
    return [...this.data.products];
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id) || null;
  }

  addProduct(name, recipe = []) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre del producto no puede estar vacío.');

    const exists = this.data.products.some(p => p.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) throw new Error(`Ya existe un producto llamado "${cleanName}".`);

    // Validar y limpiar receta
    const cleanRecipe = this.sanitizeRecipe(recipe);

    const newProd = {
      id: this.generateId('p'),
      name: cleanName,
      recipe: cleanRecipe
    };

    this.data.products.push(newProd);
    this.save();
    return newProd;
  }

  updateProduct(id, name, recipe) {
    const prod = this.getProductById(id);
    if (!prod) throw new Error('Producto no encontrado.');

    if (name !== undefined) {
      const cleanName = (name || '').trim();
      if (!cleanName) throw new Error('El nombre del producto no puede estar vacío.');
      const exists = this.data.products.some(p => p.id !== id && p.name.toLowerCase() === cleanName.toLowerCase());
      if (exists) throw new Error(`Ya existe otro producto con el nombre "${cleanName}".`);
      prod.name = cleanName;
    }

    if (recipe !== undefined) {
      prod.recipe = this.sanitizeRecipe(recipe);
    }

    this.save();
    return prod;
  }

  sanitizeRecipe(recipe) {
    if (!Array.isArray(recipe)) return [];
    const valid = [];
    recipe.forEach(item => {
      const breadId = item.breadId;
      const qty = parseInt(item.qty, 10) || 0;
      if (breadId && qty > 0) {
        // Verificar que el tipo de pan exista
        if (this.data.breadTypes.some(b => b.id === breadId)) {
          valid.push({ breadId, qty });
        }
      }
    });
    return valid;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado.');

    // Eliminar también de las planificaciones semanales
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    days.forEach(day => {
      if (this.data.weeklyPlan[day]) {
        this.data.weeklyPlan[day] = this.data.weeklyPlan[day].filter(item => item.productId !== id);
      }
    });

    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  /* ====================================================
     GESTIÓN DE PLANIFICACIÓN SEMANAL
  ==================================================== */
  getWeeklyPlan() {
    return { ...this.data.weeklyPlan };
  }

  getDayPlan(dayKey) {
    return this.data.weeklyPlan[dayKey] ? [...this.data.weeklyPlan[dayKey]] : [];
  }

  addProductToDay(dayKey, productId, qty) {
    if (!this.data.weeklyPlan[dayKey]) {
      this.data.weeklyPlan[dayKey] = [];
    }

    const prod = this.getProductById(productId);
    if (!prod) throw new Error('Producto inexistente.');

    const quantity = parseInt(qty, 10);
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0.');
    }

    const dayItems = this.data.weeklyPlan[dayKey];
    const existingIndex = dayItems.findIndex(item => item.productId === productId);

    if (existingIndex >= 0) {
      // Si ya existe, retornar advertencia para que la UI decida sumar o alertar
      return {
        alreadyExists: true,
        currentQty: dayItems[existingIndex].qty,
        updateQty: (addMore = true) => {
          if (addMore) {
            dayItems[existingIndex].qty += quantity;
          } else {
            dayItems[existingIndex].qty = quantity;
          }
          this.save();
          return dayItems[existingIndex];
        }
      };
    }

    const newItem = {
      productId,
      qty: quantity
    };

    dayItems.push(newItem);
    this.save();
    return { alreadyExists: false, item: newItem };
  }

  updateProductDayQty(dayKey, productId, newQty) {
    if (!this.data.weeklyPlan[dayKey]) return;
    const quantity = parseInt(newQty, 10);
    if (isNaN(quantity) || quantity <= 0) {
      this.removeProductFromDay(dayKey, productId);
      return;
    }
    const item = this.data.weeklyPlan[dayKey].find(i => i.productId === productId);
    if (item) {
      item.qty = quantity;
      this.save();
    }
  }

  removeProductFromDay(dayKey, productId) {
    if (!this.data.weeklyPlan[dayKey]) return;
    this.data.weeklyPlan[dayKey] = this.data.weeklyPlan[dayKey].filter(i => i.productId !== productId);
    this.save();
  }

  clearDayPlan(dayKey) {
    if (this.data.weeklyPlan[dayKey]) {
      this.data.weeklyPlan[dayKey] = [];
      this.save();
    }
  }

  clearEntireWeek() {
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    days.forEach(day => {
      this.data.weeklyPlan[day] = [];
    });
    this.save();
  }

  // Descontar consumo real del día del stock disponible
  deductDayRequirements(dayKey, dayRequirements) {
    dayRequirements.forEach(req => {
      const bread = this.getBreadById(req.breadId);
      if (bread) {
        bread.stock = Math.max(0, bread.stock - req.required);
      }
    });
    this.save();
  }
}

// Exportar instancia global
window.appStore = new Store();
