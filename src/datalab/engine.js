// ============================================================
// DATA LAB ENGINE — Monster Energy Can Catalog Generator v2
// ============================================================
// Pure, modular functions. Zero external dependencies.
// ============================================================

// -----------------------------------------------------------
// 1. BASE DATA: Linhas de produtos (famílias)
// -----------------------------------------------------------
export const baseItems = [
  { nome: "Monster Energy",         linha: "Original",   familia_id: "monster_energy" },
  { nome: "Monster Ultra White",    linha: "Ultra",      familia_id: "monster_ultra_white" },
  { nome: "Monster Ultra Rosa",     linha: "Ultra",      familia_id: "monster_ultra_rosa" },
  { nome: "Monster Ultra Fiesta",   linha: "Ultra",      familia_id: "monster_ultra_fiesta" },
  { nome: "Monster Ultra Black",    linha: "Ultra",      familia_id: "monster_ultra_black" },
  { nome: "Monster Ultra Sunrise",  linha: "Ultra",      familia_id: "monster_ultra_sunrise" },
  { nome: "Monster Ultra Violet",   linha: "Ultra",      familia_id: "monster_ultra_violet" },
  { nome: "Monster Ultra Paradise", linha: "Ultra",      familia_id: "monster_ultra_paradise" },
  { nome: "Monster Ultra Peachy Keen", linha: "Ultra",   familia_id: "monster_ultra_peachy_keen" },
  { nome: "Monster Ultra Watermelon", linha: "Ultra",    familia_id: "monster_ultra_watermelon" },
  { nome: "Monster Mango Loco",     linha: "Juice",      familia_id: "monster_mango_loco" },
  { nome: "Monster Pacific Punch",  linha: "Juice",      familia_id: "monster_pacific_punch" },
  { nome: "Monster Pipeline Punch", linha: "Juice",      familia_id: "monster_pipeline_punch" },
  { nome: "Monster Khaos",          linha: "Juice",      familia_id: "monster_khaos" },
  { nome: "Monster Rehab Tea Lemonade", linha: "Rehab",  familia_id: "monster_rehab_tea_lemonade" },
  { nome: "Monster Rehab Peach Tea",    linha: "Rehab",  familia_id: "monster_rehab_peach_tea" },
  { nome: "Monster Reserve Watermelon", linha: "Reserve", familia_id: "monster_reserve_watermelon" },
  { nome: "Monster Import",         linha: "Import",     familia_id: "monster_import" },
  { nome: "Monster Assault",        linha: "Original",   familia_id: "monster_assault" },
  { nome: "Lewis Hamilton 44",      linha: "Signature",  familia_id: "monster_lewis_hamilton_44" },
  { nome: "The Doctor VR46",        linha: "Signature",  familia_id: "monster_vr46" },
  { nome: "Monster Dragon Tea Green", linha: "Dragon Tea", familia_id: "monster_dragon_tea_green" },
  { nome: "Monster Mule",           linha: "Monster Energy", familia_id: "monster_mule" },
];

// -----------------------------------------------------------
// 2. PAÍSES com código, idioma e volume padrão
// -----------------------------------------------------------
export const countries = [
  { nome: "Estados Unidos",  code: "US", idioma: "EN", volume: 473 },
  { nome: "Brasil",          code: "BR", idioma: "PT", volume: 473 },
  { nome: "Reino Unido",     code: "GB", idioma: "EN", volume: 500 },
  { nome: "Japão",           code: "JP", idioma: "JA", volume: 355 },
  { nome: "Alemanha",        code: "DE", idioma: "DE", volume: 500 },
  { nome: "França",          code: "FR", idioma: "FR", volume: 500 },
  { nome: "México",          code: "MX", idioma: "ES", volume: 473 },
  { nome: "Austrália",       code: "AU", idioma: "EN", volume: 500 },
  { nome: "Itália",          code: "IT", idioma: "IT", volume: 500 },
  { nome: "Espanha",         code: "ES", idioma: "ES", volume: 500 },
  { nome: "Canadá",          code: "CA", idioma: "EN", volume: 473 },
  { nome: "Coreia do Sul",   code: "KR", idioma: "KO", volume: 355 },
];

// -----------------------------------------------------------
// 3. DESIGNS com peso (probabilidade)
// -----------------------------------------------------------
export const designs = [
  { name: "Original Label",      code: "OG",  weight: 5 },
  { name: "Rebrand",             code: "REB", weight: 2 },
  { name: "Limited Art",         code: "LTD", weight: 1 },
  { name: "Anniversary Edition", code: "ANN", weight: 1 },
  { name: "Regional Label",      code: "REG", weight: 3 },
];

// -----------------------------------------------------------
// 4. UTILITY FUNCTIONS
// -----------------------------------------------------------

/**
 * Remove acentos, substitui espaços por hífen, lowercase.
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Seleciona um item com base em peso (weighted random).
 * @param {Array<{weight: number}>} items
 * @returns {object} item selecionado
 */
export function pickWeighted(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

/**
 * Gera uma variant_key única.
 * Formato: {familia_id}-{pais_code}-{ano}-{design_code}
 */
export function buildVariantKey(familia_id, pais_code, ano, design_code) {
  return `${familia_id}-${pais_code}-${ano}-${design_code}`;
}

/**
 * Gera o slug padronizado.
 * Formato: {nome_slugified}-{pais_code}-{ano}-{design_code}
 */
export function buildSlug(nome, pais_code, ano, design_code) {
  return `${slugify(nome)}-${pais_code}-${ano}-${design_code}`.toLowerCase();
}

/**
 * Determina a raridade com base no design.
 */
export function getRaridade(design_code) {
  if (design_code === "LTD" || design_code === "ANN") return "Raro";
  return "Incomum";
}

/**
 * Flags automáticas baseadas no design_code.
 */
export function getFlags(design_code) {
  return {
    is_limited: design_code === "LTD" || design_code === "ANN",
    is_rebrand: design_code === "REB",
  };
}

// -----------------------------------------------------------
// 5. GERADOR V2
// -----------------------------------------------------------

/**
 * Gera o dataset completo v2.
 *
 * @param {object} options
 * @param {number} options.anoInicio - Ano inicial do range (default: 2012)
 * @param {number} options.anoFim - Ano final do range (default: 2023)
 * @param {Array} [options.customBaseItems] - Base items customizados (opcional)
 * @param {Array} [options.customCountries] - Países customizados (opcional)
 * @param {Array} [options.customDesigns] - Designs customizados (opcional)
 * @returns {Array} Dataset gerado
 */
export function generateDatasetV2(options = {}) {
  const {
    anoInicio = 2012,
    anoFim = 2023,
    customBaseItems = baseItems,
    customCountries = countries,
    customDesigns = designs,
  } = options;

  const dataset = [];
  let counter = 0;
  const usedVariantKeys = new Set();

  for (const item of customBaseItems) {
    for (const country of customCountries) {
      for (let ano = anoInicio; ano <= anoFim; ano++) {
        const design = pickWeighted(customDesigns);
        const variant_key = buildVariantKey(item.familia_id, country.code, ano, design.code);

        // Evita duplicatas de variant_key durante a geração
        if (usedVariantKeys.has(variant_key)) continue;
        usedVariantKeys.add(variant_key);

        counter++;
        const flags = getFlags(design.code);

        const entry = {
          id: `gen-${counter}`,
          nome: item.nome,
          linha: item.linha,
          ano: ano,
          pais: country.nome,
          pais_code: country.code,
          design: design.name,
          design_code: design.code,
          volume_ml: country.volume,
          idioma: country.idioma,
          raridade: getRaridade(design.code),
          familia_id: item.familia_id,
          variant_key: variant_key,
          is_limited: flags.is_limited,
          is_rebrand: flags.is_rebrand,
          slug: buildSlug(item.nome, country.code, ano, design.code),

          // Campos preparados para futura validação com dados reais
          confidence_score: null,
          source_tags: [],
        };

        dataset.push(entry);
      }
    }
  }

  return dataset;
}

// -----------------------------------------------------------
// 6. FERRAMENTAS DO LABORATÓRIO
// -----------------------------------------------------------

/**
 * Detecta itens duplicados baseado em variant_key.
 * @param {Array} items
 * @returns {object} { duplicates: Array, uniqueKeys: Set }
 */
export function findDuplicates(items) {
  const seen = new Map();
  const duplicates = [];

  for (const item of items) {
    if (seen.has(item.variant_key)) {
      duplicates.push({
        original: seen.get(item.variant_key),
        duplicate: item,
        variant_key: item.variant_key,
      });
    } else {
      seen.set(item.variant_key, item);
    }
  }

  return {
    duplicates,
    totalDuplicates: duplicates.length,
    uniqueKeys: seen.size,
  };
}

/**
 * Exportação limpa: remove duplicados, garante consistência.
 * Pronto para banco SQL.
 * @param {Array} items
 * @returns {Array} Items limpos e deduplicados
 */
export function exportClean(items) {
  const seen = new Set();
  const cleaned = [];

  for (const item of items) {
    if (seen.has(item.variant_key)) continue;
    seen.add(item.variant_key);

    // Re-calcula campos derivados para garantir consistência
    const flags = getFlags(item.design_code);
    cleaned.push({
      ...item,
      raridade: getRaridade(item.design_code),
      is_limited: flags.is_limited,
      is_rebrand: flags.is_rebrand,
      slug: buildSlug(item.nome, item.pais_code, item.ano, item.design_code),
    });
  }

  return cleaned;
}

/**
 * Filtro dinâmico: filtra itens por qualquer combinação de campos.
 * @param {Array} items
 * @param {object} filters - Ex: { pais_code: "BR", linha: "Ultra" }
 * @returns {Array} Items filtrados
 */
export function filterItems(items, filters = {}) {
  const filterEntries = Object.entries(filters).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  if (filterEntries.length === 0) return items;

  return items.filter((item) =>
    filterEntries.every(([key, value]) => {
      const itemValue = item[key];
      if (typeof value === "string") {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      if (typeof value === "boolean") {
        return itemValue === value;
      }
      if (typeof value === "number") {
        return itemValue === value;
      }
      return itemValue === value;
    })
  );
}

/**
 * Estatísticas do dataset.
 * @param {Array} items
 * @returns {object}
 */
export function stats(items) {
  const porPais = {};
  const porLinha = {};
  const porDesign = {};
  const porAno = {};
  const porRaridade = {};

  for (const item of items) {
    porPais[item.pais_code] = (porPais[item.pais_code] || 0) + 1;
    porLinha[item.linha] = (porLinha[item.linha] || 0) + 1;
    porDesign[item.design_code] = (porDesign[item.design_code] || 0) + 1;
    porAno[item.ano] = (porAno[item.ano] || 0) + 1;
    porRaridade[item.raridade] = (porRaridade[item.raridade] || 0) + 1;
  }

  return {
    total: items.length,
    porPais,
    porLinha,
    porDesign,
    porAno,
    porRaridade,
  };
}
