/**
 * store.js - Gestion de estado y persistencia en LocalStorage
 * Aplicacion de Control de Stock de Panes - Sandwicheria & Gastro
 */

const STORAGE_KEY = 'stock_panes_app_v4';

// Base de datos de catalogo oficial del usuario
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
    { id: 'b_miga', name: 'Miga', stock: 0 },
    { id: 'b_baguette', name: 'Baguette', stock: 0 },
    { id: 'b_arabe', name: 'Pan arabe', stock: 0 }
  ],
  products: [
    {
        "id":  "p_001",
        "code":  "22653",
        "name":  "BAGEL JQ x 1 (TERMOSELLADO)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_002",
        "code":  "22536",
        "name":  "CIABATTA COMPLETA X 1",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_003",
        "code":  "22532",
        "name":  "CIABATTA, CAJA Y PAPEL SULFITO PARA MILABOX Y SANDW GOURMET (GRANEL)",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_004",
        "code":  "22272",
        "name":  "Combo Sandw. 1/4 de Libra Food (2H, 2cheddar, Pep, Ceb desh, Ket Mayo +Papas rustic) (Pote…) (R-)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_005",
        "code":  "22271",
        "name":  "Combo Sandw. Big Max Food (2H, aderezo BM, 2cheddar, Pep, Lech, Ceb desh, +Papas rustic) (Pote…) (R-)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_006",
        "code":  "22340",
        "name":  "Combo Sandw. Mac Soja Veggie Food c/Zan rustico (1 Mila Soja, 2 cheddar, Dip Zan, Lech, Tom, Ceb, Ket Mayo +ZAN rustic) (pSdiv)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_007",
        "code":  "22273",
        "name":  "Combo Sandw. Max Deluxe Chicken Food (1 ¨Pech apanada, 2 cheddar, Lech, Tom, Ceb, Ket Mayo +Papas rustic) (pSdiv) (R-)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_008",
        "code":  "22274",
        "name":  "COMBO SANDW. MC POLLO FOOD (1MEDALLÓN, 1CHEDDAR, L PEP CEB DESH. KET MAYO, PAPAS RUST)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_009",
        "code":  "22280",
        "name":  "COMBO SANDW. MC TASTY FOOD (2H, ADEREZO TASTY, 2CHEDDAR, CEB CAR, LT, CEB, PAPAS RUST)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_010",
        "code":  "22275",
        "name":  "COMBO SANDW. MC VEGGIE FOOD (1 MILA SOJA, 2 CHEDDAR, DIP ZAN, L T CEB, KET MAYO, BAT RUST (PSDIV)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_011",
        "code":  "22643",
        "name":  "CROISSANT DE JAMON Y QUESO TERMOSELLADO",
        "recipe":  [
                       {
                           "breadId":  "b_croissant",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_012",
        "code":  "13034",
        "name":  "mila box",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_013",
        "code":  "22359",
        "name":  "MILA BOX - GRANEL (Sandw Mila + papas) (agregar 22293) (Tasty, hue rev, LT + Papas rustic +caja)",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_014",
        "code":  "22358",
        "name":  "MILA BOX - SAP (Sandw Mila+Papas) (agregar 22293) ( Tasty, hue rev, LT + Papas rustic +P Sdiv)",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_016",
        "code":  "22360",
        "name":  "PAN, CAJA Y PAPEL SULFITO PARA MILABOX Y SANDW GOURMET (GRANEL) - EVENTO",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_017",
        "code":  "18835",
        "name":  "PEBETE DOBLE COMBINADO MORTADELA (PIRELLI)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_018",
        "code":  "18834",
        "name":  "PEBETE DOBLE COMBINADO SALAME (PIRELLI)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_019",
        "code":  "18833",
        "name":  "PEBETE SIMPLE MORTADELA (PIRELLI)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_020",
        "code":  "18832",
        "name":  "PEBETE SIMPLE SALAME (PIRELLI)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_021",
        "code":  "11660",
        "name":  "PEBTE DOBLE DE JAMON Y QUESO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_022",
        "code":  "20594",
        "name":  "SAND BIG FOOD (2H JQT PEP)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_023",
        "code":  "22572",
        "name":  "SAND COMBINADO DOBLE (MELI) TERMOSELLADO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_024",
        "code":  "22645",
        "name":  "SAND DE HAMBURGUESA DE QUINOA Y BROCOLI LTQ (TERMOSELLADO)(MELI)",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_025",
        "code":  "16478",
        "name":  "SAND DE MIGA X 5 UNIDADES",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  5
                       }
                   ]
    },
    {
        "id":  "p_026",
        "code":  "22647",
        "name":  "SAND DE MILANESA DE SOJA LTQ (TERMOSELLADO)(MELI)",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_027",
        "code":  "20050",
        "name":  "SAND. BIG FOOD (2H JQLT P105 RECT)(LECH PROCESADA)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_028",
        "code":  "22546",
        "name":  "SAND. CIABATTA DE VEGETALES GRILLADOS",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_029",
        "code":  "20047",
        "name":  "SAND. CROISSANT (LECH PROCESADA)(COMPLETO) (P/U) CATERING EX 11494",
        "recipe":  [
                       {
                           "breadId":  "b_croissant",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_030",
        "code":  "22544",
        "name":  "SAND. MAC CHEESE CHICKEN (TERMOSELLADO)(MELI)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_031",
        "code":  "22543",
        "name":  "SAND. MAC CHEESE DOBLE",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_032",
        "code":  "2507",
        "name":  "SAND. MIGA X 3",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  3
                       }
                   ]
    },
    {
        "id":  "p_033",
        "code":  "9772",
        "name":  "SAND. PALETA/QUESO PEBETE",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_034",
        "code":  "12087",
        "name":  "SAND. PBT SUPREMA (119 GR LIMPIO) ( FRITA)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_035",
        "code":  "12088",
        "name":  "SAND. PBT SUPREMA (119 GR LIMPIO) (HORNO)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_036",
        "code":  "12090",
        "name":  "SAND. PBT SUPREMA CON LECHUGA Y TOMATE - EVENTO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_037",
        "code":  "22533",
        "name":  "SAND. PEBETE JAMON Y QUESO 1 UN",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_038",
        "code":  "22541",
        "name":  "SAND. SUPREMA JQ PAN BIMBO ALARGADO",
        "recipe":  [
                       {
                           "breadId":  "b_bimbo_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_039",
        "code":  "22542",
        "name":  "SAND. SUPREMA LECH-TOM PAN BIMBO ALARGADO(115 GR LIMPIO) (FRITA) (Termosellado)(MELI)",
        "recipe":  [
                       {
                           "breadId":  "b_bimbo_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_040",
        "code":  "193",
        "name":  "SAND. TRIPLE MIGA EVENTO",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_041",
        "code":  "22571",
        "name":  "SANDW BAGEL MULTICEREAL DOBLE (TERMOSELLADO)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_042",
        "code":  "20221",
        "name":  "SANDW BIG FOOD ( 2 H LQT) SIN ARMAR",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_043",
        "code":  "20548",
        "name":  "SANDW BIG FOOD (2H JQT)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_044",
        "code":  "21029",
        "name":  "SANDW BIG FOOD (2H LT)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_045",
        "code":  "20632",
        "name":  "SANDW BIG FOOD (2H LTH)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_046",
        "code":  "20969",
        "name":  "SANDW BIG FOOD (2H, Q, CEB REHOGADA)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_047",
        "code":  "20782",
        "name":  "SANDW BIG FOOD DE POLLO (2 MEDALLONES JQ)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_048",
        "code":  "20744",
        "name":  "SANDW BIG FOOD DE POLLO (2 MEDALLONES JQT)(105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_049",
        "code":  "32163",
        "name":  "SANDW BIGFOOD(H QT)X2 (105RECT)XL TTE X SALIDA",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_050",
        "code":  "22539",
        "name":  "sandw ciabatta de mila",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_051",
        "code":  "22570",
        "name":  "SANDW DE MIGA X 5 (MELI TERMOSELLADO)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  0.09
                       }
                   ]
    },
    {
        "id":  "p_052",
        "code":  "20292",
        "name":  "SANDW DE MILA (FRITA) CUADRADA",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_054",
        "code":  "12854",
        "name":  "SANDW HAMBURGUESA (2H CEB JQ) PECG30",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_055",
        "code":  "12775",
        "name":  "SANDW MIGA (X2)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  2
                       }
                   ]
    },
   
    {
        "id":  "p_057",
        "code":  "22535",
        "name":  "SANDW MIGA X 3",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  3
                       }
                   ]
    },
    {
        "id":  "p_058",
        "code":  "21817",
        "name":  "SANDW PAN SUPREMA(XL-145G LIMPIO)(FRITA)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_059",
        "code":  "20329",
        "name":  "SANDW PBT COMBINADO (JQ SAL-Q)(LTH)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_060",
        "code":  "11662",
        "name":  "SANDW PBT J-Q-L-T X2",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_061",
        "code":  "32162",
        "name":  "SANDW PBT LQ-LTH(X2U)XL Y LTH X SALIDA",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_062",
        "code":  "12868",
        "name":  "SANDW PBTJQ X2 VERDURA APARTE",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_063",
        "code":  "12789",
        "name":  "SANDW TRIPLE DE MIGA X 2 SNACK FINOCHIETTO",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_064",
        "code":  "12859",
        "name":  "SANDW. (2H JQ) PECG30",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_066",
        "code":  "21601",
        "name":  "SANDW. BAGEL JAM, QUE, TOM, LECH (2 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_067",
        "code":  "21602",
        "name":  "SANDW. BAGEL JAMON Y QUESO (2 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_068",
        "code":  "21603",
        "name":  "SANDW. BAGEL MULTICEREAL JAM, QUE, LECH, TOM (2 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_069",
        "code":  "21604",
        "name":  "SANDW. BAGEL MULTICEREAL JAMON Y QUESO (2 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_070",
        "code":  "11713",
        "name":  "SANDW. BAGUETIN JQTL",
        "recipe":  [
                       {
                           "breadId":  "b_baguette",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_072",
        "code":  "20061",
        "name":  "SANDW. BIG FOOD ( 2H JQ P 105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_073",
        "code":  "12870",
        "name":  "SANDW. BIG FOOD ( 2H JQ VERDURA APARTE P 105 REC)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_074",
        "code":  "11954",
        "name":  "SANDW. BIG FOOD (2H JQLT P105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_075",
        "code":  "20950",
        "name":  "SANDW. BIG FOOD (2H Q CEB CARAMELIZ - 105 RECT)",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_076",
        "code":  "22626",
        "name":  "SANDW. BURGER G.O.A.T. (AGREGAR GUARN) (2H, ADEREZO, CEB CPY, PANCETA, CHEDDAR)GRANEL - PAN Y PAPEL X SALIDA (22626)",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_077",
        "code":  "22603",
        "name":  "SANDW. BURGER MC ALVAREZ (2 M.CARNE, BBK ESPECIADA, MERM CEB PANC, CHED, REP, TOM - PAN BRIOCHE",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_078",
        "code":  "22617",
        "name":  "SANDW. BURGER MC ALVAREZ (2 M.CARNE, BBK ESPECIADA, MERM CEB PANC, CHED, REP, TOM)GRANEL - PAN Y PAPEL X SALIDA",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_079",
        "code":  "22618",
        "name":  "SANDW. BURGER MCALLISTER (2H, BBK AHUM, CHED, CEB CRISP, JAM AGRID ) GRANEL - PAN, PAPEL X SALIDA",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_080",
        "code":  "22590",
        "name":  "SANDW. BURGER MCALLISTER (2H, BBK AHUM, CHED, CEB CRISP, JAM AGRID - PAN BRIOCHE)",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_081",
        "code":  "22490",
        "name":  "SANDW. CIABATTA GLACEADA, CREMA DE TOMATE, CRUDO Y RUCULA",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_082",
        "code":  "21599",
        "name":  "SANDW. CIABATTA JAM, QUE, TOM, LECH, HUE (1 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_083",
        "code":  "21600",
        "name":  "SANDW. CIABATTA JAMON Y QUESO (1 UN)",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_084",
        "code":  "11494",
        "name":  "SANDW. CROISSANT (COMPLETO) (P/U) CATERING",
        "recipe":  [
                       {
                           "breadId":  "b_croissant",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_085",
        "code":  "11688",
        "name":  "SANDW. MIGA (X 5)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  0.09
                       }
                   ]
    },
    {
        "id":  "p_086",
        "code":  "11878",
        "name":  "SANDW. MIGA JQ EVENTOS (1 UNIDAD)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_087",
        "code":  "11689",
        "name":  "SANDW. MIGA NEGRO (SALVADO)(X 5)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  0.09
                       }
                   ]
    },
    {
        "id":  "p_088",
        "code":  "12975",
        "name":  "SANDW. MIGA QUESO EVENTOS (1 UNIDAD)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty": 0.018
                       }
                   ]
    },
    {
        "id":  "p_089",
        "code":  "22652",
        "name":  "SANDW. MIGA x 2 (Termosellado)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  0.036
                       }
                   ]
    },
    {
        "id":  "p_090",
        "code":  "11547",
        "name":  "SANDW. MILA (HORNO) LTH",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_091",
        "code":  "11695",
        "name":  "SANDW. MILA( FRITA) LTH",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_092",
        "code":  "20769",
        "name":  "SANDW. PBT BONDIOLA Y QUESO (PREMIUM)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_093",
        "code":  "11875",
        "name":  "SANDW. PBT COMBINADO (JQ SALQ)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_094",
        "code":  "12812",
        "name":  "SANDW. PBT COMBINADO (JQ SALQ) X 1 UNIDAD",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_095",
        "code":  "32161",
        "name":  "SANDW. PBT COMBINADO XL(JQ SAL-Q)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_096",
        "code":  "20767",
        "name":  "SANDW. PBT CRUDO Y QUESO (PREMIUM)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_097",
        "code":  "2506",
        "name":  "SANDW. PBT J-Q",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_098",
        "code":  "22569",
        "name":  "SANDW. PBT J-Q (X2) DOBLE (Termosellado) (MELI)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_099",
        "code":  "20768",
        "name":  "SANDW. PBT LOMITO Y QUESO (PREMIUM)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_100",
        "code":  "20176",
        "name":  "SANDW. PBT PECHUGA GRILLE C/ JQ (134 GR LIMPIO)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_101",
        "code":  "2505",
        "name":  "SANDW. PBT SAL-Q",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_102",
        "code":  "11661",
        "name":  "SANDW. PBT SAL-Q X 2",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_103",
        "code":  "11716",
        "name":  "SANDW. PBT SUPREMA JAMON Y QUESO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_104",
        "code":  "22568",
        "name":  "SANDW. PEBETE COMLETO DOBLE MELI TERMOSELLADO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_105",
        "code":  "11826",
        "name":  "SANDW. PEBETE X2 QUESO, TOM,LECH Y HUEVO",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    {
        "id":  "p_106",
        "code":  "22566",
        "name":  "SANDW. PECHIGA CRISPY",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_107",
        "code":  "13383",
        "name":  "SANDW. SALAME QUESO X1",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_108",
        "code":  "13384",
        "name":  "SANDW. SALCHICHON QUESO X1",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_109",
        "code":  "22545",
        "name":  "SANDW. SUPREMA JAMON Y QUESO PAN ALARGADO",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_110",
        "code":  "22427",
        "name":  "SANDW. SUPREMA JAMON Y QUESO, PAN BIMBO ALARG + GUARN",
        "recipe":  [
                       {
                           "breadId":  "b_bimbo_alargado",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_112",
        "code":  "12867",
        "name":  "SANDW.CROISSANT (VERDURA APARTE)",
        "recipe":  [
                       {
                           "breadId":  "b_croissant",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_113",
        "code":  "20247",
        "name":  "SANDW.CROISSANT JQ(HIPER)",
        "recipe":  [
                       {
                           "breadId":  "b_croissant",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_114",
        "code":  "20268",
        "name":  "SANDW.PBT JQ-LT (X2U)",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  2
                       }
                   ]
    },
    
    {
        "id":  "p_116",
        "code":  "22538",
        "name":  "sandwich bagel multicereal",
        "recipe":  [
                       {
                           "breadId":  "b_bagel",
                           "qty":  1
                       }
                   ]
    },
  
    {
        "id":  "p_118",
        "code":  "22493",
        "name":  "SANDWICH CIABATTA DE ACEITUNAS, CON MORTADELA, QUESO Y PESTO",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_119",
        "code":  "22491",
        "name":  "SANDWICH CIABATTA GRATINADA DE LOMITO Y MIX DE QUESO",
        "recipe":  [
                       {
                           "breadId":  "b_ciabatta",
                           "qty":  1
                       }
                   ]
    },
    
    {
        "id":  "p_121",
        "code":  "22395",
        "name":  "SANDWICH DE MILA DE QUESO",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_122",
        "code":  "22537",
        "name":  "Sandwich de pebete completo",
        "recipe":  [
                       {
                           "breadId":  "b_pebete",
                           "qty":  1
                       }
                   ]
    },
   
    {
        "id":  "p_127",
        "code":  "22644",
        "name":  "SANDWICH HAMBURGUESA DE QUINOA, POROTOS Y HONGOS",
        "recipe":  [
                       {
                           "breadId":  "b_brioche",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_128",
        "code":  "22649",
        "name":  "SUPREMA BOX - GRANEL (SANDW SUPREMA + PAPAS) (AGREGAR 12369) (TASTY, HUE REV, LT + PAPAS RUSTIC +CAJA)",
        "recipe":  [
                       {
                           "breadId":  "b_alargado",
                           "qty":  1
                       }
                   ]
    },
  
    {
        "id":  "p_130",
        "code":  "22394",
        "name":  "Sándwich Vegetariano de Hummus de Remolacha",
        "recipe":  [
                       {
                           "breadId":  "b_sesamo",
                           "qty":  1
                       }
                   ]
    },
    {
        "id":  "p_131",
        "code":  "20094",
        "name":  "TRIPLE J-Q EVENTOS (1U)",
        "recipe":  [
                       {
                           "breadId":  "b_miga",
                           "qty":  0.018
                       }
                   ]
    }
],
  weeklyPlan: {
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
  }
};

class Store {
  constructor() {
    this.data = this.load();
    this.listeners = [];
  }

  // Generador de ID unicos
  generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  // Cargar datos de LocalStorage con migracion de stock previo
  load() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = JSON.parse(JSON.stringify(INITIAL_DATA));
        // Migrar stock fisico de versiones previas si existe
        const prevKeys = ['stock_panes_app_v3', 'stock_panes_app_v2', 'stock_panes_app_v1'];
        for (const prevKey of prevKeys) {
          const prevRaw = localStorage.getItem(prevKey);
          if (prevRaw) {
            try {
              const oldData = JSON.parse(prevRaw);
              if (Array.isArray(oldData.breadTypes)) {
                initial.breadTypes.forEach(b => {
                  const matchOld = oldData.breadTypes.find(ob => ob.id === b.id || ob.name.toLowerCase() === b.name.toLowerCase());
                  if (matchOld && typeof matchOld.stock === 'number') {
                    b.stock = matchOld.stock;
                  }
                });
                break;
              }
            } catch (err) {
              console.warn('Error leyendo version anterior:', err);
            }
          }
        }
        this.saveToStorage(initial);
        return initial;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.breadTypes || !parsed.products || !parsed.weeklyPlan || parsed.products.length < 100) {
        throw new Error('Formato invalido');
      }
      return parsed;
    } catch (e) {
      console.warn('Error leyendo localStorage, restableciendo a catalogo oficial:', e);
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
      alert('Error: No se pudo guardar la informacion en el almacenamiento local.');
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

  // Restablecer al catalogo oficial
  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
  }

  // Limpiar LocalStorage completamente
  clearLocalStorage(reloadInitial = true) {
    try {
      localStorage.clear();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('stock_panes_app_v2');
      localStorage.removeItem('stock_panes_app_v1');
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
      if (!parsed.breadTypes || !parsed.products || !parsed.weeklyPlan || parsed.products.length < 100) {
        throw new Error('Estructura de respaldo invalida.');
      }
      this.data = parsed;
      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /* ====================================================
     GESTION DE TIPOS DE PAN
  ==================================================== */
  getBreadTypes() {
    return [...this.data.breadTypes];
  }

  getBreadById(id) {
    return this.data.breadTypes.find(b => b.id === id) || null;
  }

  addBreadType(name, initialStock = 0) {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre del pan no puede estar vacio.');
    
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
      if (!cleanName) throw new Error('El nombre del pan no puede estar vacio.');
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

  // Verifica si un pan esta en uso por algun producto
  getProductsUsingBread(breadId) {
    return this.data.products.filter(p => 
      p.recipe && p.recipe.some(r => r.breadId === breadId && r.qty > 0)
    );
  }

  deleteBreadType(id) {
    const index = this.data.breadTypes.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Tipo de pan no encontrado.');

    // Verificar si esta en uso
    const usedIn = this.getProductsUsingBread(id);
    if (usedIn.length > 0) {
      const names = usedIn.map(p => p.name).join(', ');
      throw new Error(`No se puede eliminar porque esta asociado a los productos: ${names}. Modifica esos productos primero.`);
    }

    this.data.breadTypes.splice(index, 1);
    this.save();
    return true;
  }

  /* ====================================================
     GESTION DE PRODUCTOS Y RECETAS
  ==================================================== */
  getProducts() {
    return [...this.data.products];
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id) || null;
  }

  addProduct(name, recipe = [], code = '') {
    const cleanName = (name || '').trim();
    if (!cleanName) throw new Error('El nombre del producto no puede estar vacio.');

    const exists = this.data.products.some(p => p.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) throw new Error(`Ya existe un producto llamado "${cleanName}".`);

    // Validar y limpiar receta
    const cleanRecipe = this.sanitizeRecipe(recipe);

    const newProd = {
      id: this.generateId('p'),
      code: (code || '').trim(),
      name: cleanName,
      recipe: cleanRecipe
    };

    this.data.products.push(newProd);
    this.save();
    return newProd;
  }

  updateProduct(id, name, recipe, code = null) {
    const prod = this.getProductById(id);
    if (!prod) throw new Error('Producto no encontrado.');

    if (name !== undefined) {
      const cleanName = (name || '').trim();
      if (!cleanName) throw new Error('El nombre del producto no puede estar vacio.');
      const exists = this.data.products.some(p => p.id !== id && p.name.toLowerCase() === cleanName.toLowerCase());
      if (exists) throw new Error(`Ya existe otro producto con el nombre "${cleanName}".`);
      prod.name = cleanName;
    }

    if (code !== null && code !== undefined) {
      prod.code = (code || '').trim();
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

    // Eliminar tambien de las planificaciones semanales
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
     GESTION DE PLANIFICACION SEMANAL
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

  // Descontar consumo real del dia del stock disponible
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