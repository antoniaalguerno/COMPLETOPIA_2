export interface Region {
  NombreRegion: string;
  comunas: string[];
}

export const RegionesYcomunas: { regiones: Region[] } = {
  regiones: [
    {
      NombreRegion: "Arica y Parinacota",
      comunas: ["Arica", "Camarones", "Putre", "General Lagos"],
    },
    {
      NombreRegion: "Tarapacá",
      comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    },
    {
      NombreRegion: "Antofagasta",
      comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    },
    {
      NombreRegion: "Atacama",
      comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    },
    {
      NombreRegion: "Coquimbo",
      comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    },
    {
      NombreRegion: "REGIÓN DE VALPARAÍSO",
      comunas: ["ALGARROBO","CABILDO","CALERA","CALLE LARGA","CARTAGENA","CASABLANCA","CATEMU","CONCÓN","CURACAVÍ","EL QUISCO","EL TABO","HIJUELAS","ISLA DE PASCUA","JUAN FERNÁNDEZ","LA CRUZ","LA LIGUA","LIMACHE","LLAILLAY","LOS ANDES","NOGALES","OLMUÉ","PANQUEHUE","PAPUDO","PETORCA","PUCHUNCAVÍ","PUTAENDO","QUILLOTA","QUILPUÉ","QUINTERO","RINCONADA","SAN ANTONIO","SAN ESTEBAN","SAN FELIPE","SANTA MARÍA","SANTO DOMINGO","VALPARAÍSO","VILLA ALEMANA","VIÑA DEL MAR","ZAPALLAR"],
    },
    {
      NombreRegion: "Región del Libertador Gral. Bernardo O’Higgins",
      comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    },
    {
      NombreRegion: "Región del Maule",
      comunas: ["Talca", "ConsVtución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "ReVro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    },
    {
      NombreRegion: "REGIÓN DEL BIOBÍO",
      comunas: ["ALTO BIOBÍO","ANTUCO","ARAUCO","CABRERO","CAÑETE","CHIGUAYANTE","CONCEPCIÓN","CONTULMO","CORONEL","CURANILAHE","FLORIDA","HUALPÉN","HUALQUI","LAJA","LEBU","LOS ALAMOS","LOS ANGELES","LOTA","MULCHÉN","NACIMIENTO","NEGRETE","PENCO","QUILACO","QUILLECO","SSAN PEDRO DE LA PAZ","SAN ROSENDO","SANTA BÁRBARA","SANTA JUANA","TALCAHUANO","TIRÚA","TOMÉ","TUCAPEL","YUMBEL"],
    },
    {
      NombreRegion: "Región de la Araucanía",
      comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    },
    {
      NombreRegion: "Región de Los Ríos",
      comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    },
    {
      NombreRegion: "Región de Los Lagos",
      comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "FruVllar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    },
    {
      NombreRegion: "Región Aisén del Gral. Carlos Ibáñez del Campo",
      comunas: ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    },
    {
      NombreRegion: "Región de Magallanes y de la AntárVca Chilena",
      comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "AntárVca", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
    },
    {
      NombreRegion: "Región Metropolitana de Santiago",
      comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    },
  ],
};

/**
 * Devuelve los nombres de todas las regiones en el mismo orden del dataset.
 */
export function getRegionNames(): string[] {
  return RegionesYcomunas.regiones.map((r) => r.NombreRegion);
}

/**
 * Devuelve las comunas de una región (copia del array).
 * Si no existe la región, retorna arreglo vacío.
 */
export function getCommunesForRegion(regionName: string): string[] {
  const region = RegionesYcomunas.regiones.find((r) => r.NombreRegion === regionName);
  return region ? [...region.comunas] : [];
}

/**
 * Busca una región por nombre y retorna la estructura completa o undefined.
 */
export function findRegion(regionName: string): Region | undefined {
  return RegionesYcomunas.regiones.find((r) => r.NombreRegion === regionName);
}

/**
 * Genera un arreglo de opciones usable en React (value/label).
 */
export function buildRegionOptions(): { value: string; label: string }[] {
  return getRegionNames().map((name) => ({ value: name, label: name }));
}

/**
 * Genera opciones de comunas para una región usable en React.
 */
export function buildCommuneOptions(regionName: string): { value: string; label: string }[] {
  return getCommunesForRegion(regionName).map((c) => ({ value: c, label: c }));
}

export default RegionesYcomunas;

