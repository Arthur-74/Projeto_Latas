import React, { useState, useMemo, useCallback, useRef } from 'react';
import '../datalab/DataLab.css';
import {
  generateDatasetV2,
  findDuplicates,
  exportClean,
  filterItems,
  stats,
  baseItems,
  countries,
  designs,
} from '../datalab/engine';

// ─────────────────────────────────────────────
// ICONS (inline SVG para zero dependências)
// ─────────────────────────────────────────────
const Icons = {
  Flask: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 3h6M12 3v7l-5 8.5a2 2 0 001.7 3h6.6a2 2 0 001.7-3L12 10V3" />
    </svg>
  ),
  Database: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Chart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// ─────────────────────────────────────────────
// DATA LAB PAGE
// ─────────────────────────────────────────────
export function DataLab() {
  // State
  const [dataset, setDataset] = useState([]);
  const [anoInicio, setAnoInicio] = useState(2012);
  const [anoFim, setAnoFim] = useState(2023);
  const [activeTab, setActiveTab] = useState('generator');
  const [filterPais, setFilterPais] = useState('');
  const [filterLinha, setFilterLinha] = useState('');
  const [filterDesign, setFilterDesign] = useState('');
  const [filterAno, setFilterAno] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inspectItem, setInspectItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [tableSort, setTableSort] = useState({ key: 'id', dir: 'asc' });
  const [tablePage, setTablePage] = useState(0);
  const tableRef = useRef(null);

  const PAGE_SIZE = 50;

  // Generate dataset
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Small timeout for animation effect
    setTimeout(() => {
      const data = generateDatasetV2({ anoInicio, anoFim });
      setDataset(data);
      setIsGenerating(false);
      setTablePage(0);
    }, 600);
  }, [anoInicio, anoFim]);

  // Stats
  const datasetStats = useMemo(() => {
    if (dataset.length === 0) return null;
    return stats(dataset);
  }, [dataset]);

  // Duplicates
  const duplicatesResult = useMemo(() => {
    if (dataset.length === 0) return null;
    return findDuplicates(dataset);
  }, [dataset]);

  // Filtered data
  const filteredData = useMemo(() => {
    const filters = {};
    if (filterPais) filters.pais_code = filterPais;
    if (filterLinha) filters.linha = filterLinha;
    if (filterDesign) filters.design_code = filterDesign;
    if (filterAno) filters.ano = parseInt(filterAno);
    return filterItems(dataset, filters);
  }, [dataset, filterPais, filterLinha, filterDesign, filterAno]);

  // Sort
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aVal = a[tableSort.key];
      const bVal = b[tableSort.key];
      if (aVal < bVal) return tableSort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return tableSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, tableSort]);

  // Paginate
  const pagedData = useMemo(() => {
    const start = tablePage * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, tablePage]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);

  // Export JSON
  const handleExport = useCallback(() => {
    const cleaned = exportClean(dataset);
    const blob = new Blob([JSON.stringify(cleaned, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monster-catalog-v2-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dataset]);

  // Copy JSON to clipboard
  const handleCopyItem = useCallback((item) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Sort handler
  const handleSort = useCallback((key) => {
    setTableSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Lines from stats
  const linhas = useMemo(() => {
    if (!datasetStats) return [];
    return Object.entries(datasetStats.porLinha).sort((a, b) => b[1] - a[1]);
  }, [datasetStats]);

  const paisStats = useMemo(() => {
    if (!datasetStats) return [];
    return Object.entries(datasetStats.porPais).sort((a, b) => b[1] - a[1]);
  }, [datasetStats]);

  const designStats = useMemo(() => {
    if (!datasetStats) return [];
    return Object.entries(datasetStats.porDesign).sort((a, b) => b[1] - a[1]);
  }, [datasetStats]);

  const tabs = [
    { id: 'generator', label: 'Gerador', icon: <Icons.Zap /> },
    { id: 'explorer', label: 'Explorer', icon: <Icons.Database /> },
    { id: 'stats', label: 'Estatísticas', icon: <Icons.Chart /> },
    { id: 'tools', label: 'Ferramentas', icon: <Icons.Flask /> },
  ];

  return (
    <div className="datalab-root">
      {/* Background FX */}
      <div className="datalab-bg-grid" />
      <div className="datalab-bg-glow" />

      {/* Header */}
      <header className="datalab-header">
        <div className="datalab-header-inner">
          <div className="datalab-title-group">
            <div className="datalab-icon-badge clip-diagonal-btn">
              <Icons.Flask />
            </div>
            <div>
              <h1 className="datalab-title">DATA LAB</h1>
              <p className="datalab-subtitle">Monster Energy Catalog Generator v2</p>
            </div>
          </div>
          {dataset.length > 0 && (
            <div className="datalab-header-stats">
              <span className="datalab-badge datalab-badge-neon clip-diagonal-btn">{dataset.length} itens</span>
              <span className="datalab-badge datalab-badge-dim clip-diagonal-btn">{duplicatesResult?.totalDuplicates || 0} duplicatas</span>
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="datalab-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`datalab-tab clip-diagonal-btn ${activeTab === tab.id ? 'datalab-tab-active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <div className="datalab-content">

        {/* ── GENERATOR TAB ─────────────────── */}
        {activeTab === 'generator' && (
          <div className="datalab-section datalab-fade-in">
            <div className="datalab-card">
              <h2 className="datalab-card-title">
                <Icons.Zap /> Configuração do Gerador
              </h2>
              <div className="datalab-gen-grid">
                <div className="datalab-field">
                  <label>Ano Início</label>
                  <input
                    className="clip-diagonal-btn"
                    type="number"
                    value={anoInicio}
                    onChange={(e) => setAnoInicio(parseInt(e.target.value))}
                    min={2002}
                    max={2025}
                  />
                </div>
                <div className="datalab-field">
                  <label>Ano Fim</label>
                  <input
                    className="clip-diagonal-btn"
                    type="number"
                    value={anoFim}
                    onChange={(e) => setAnoFim(parseInt(e.target.value))}
                    min={2002}
                    max={2025}
                  />
                </div>
                <div className="datalab-field">
                  <label>Famílias Base</label>
                  <div className="datalab-field-value clip-diagonal-btn">{baseItems.length} produtos</div>
                </div>
                <div className="datalab-field">
                  <label>Países</label>
                  <div className="datalab-field-value clip-diagonal-btn">{countries.length} regiões</div>
                </div>
              </div>

              <div className="datalab-gen-info">
                <span className="datalab-info-text">
                  Estimativa: ~{baseItems.length * countries.length * (anoFim - anoInicio + 1)} combinações possíveis
                </span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="datalab-btn datalab-btn-primary datalab-btn-generate"
              >
                {isGenerating ? (
                  <>
                    <span className="datalab-spinner" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Icons.Zap /> Gerar Dataset v2
                  </>
                )}
              </button>
            </div>

            {/* Design weights table */}
            <div className="datalab-card">
              <h2 className="datalab-card-title">
                <Icons.Chart /> Pesos de Design
              </h2>
              <div className="datalab-weights-grid">
                {designs.map((d) => {
                  const total = designs.reduce((s, i) => s + i.weight, 0);
                  const pct = ((d.weight / total) * 100).toFixed(0);
                  return (
                    <div key={d.code} className="datalab-weight-item">
                      <div className="datalab-weight-header">
                        <span className="datalab-weight-code clip-diagonal-btn">{d.code}</span>
                        <span className="datalab-weight-name">{d.name}</span>
                      </div>
                      <div className="datalab-weight-bar-bg">
                        <div
                          className="datalab-weight-bar"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="datalab-weight-pct">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countries reference */}
            <div className="datalab-card">
              <h2 className="datalab-card-title">
                <Icons.Database /> Países Registrados
              </h2>
              <div className="datalab-countries-grid">
                {countries.map((c) => (
                  <div key={c.code} className="datalab-country-chip clip-diagonal-btn">
                    <span className="datalab-country-code clip-diagonal-btn">{c.code}</span>
                    <span className="datalab-country-name">{c.nome}</span>
                    <span className="datalab-country-ml">{c.volume}ml</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EXPLORER TAB ─────────────────── */}
        {activeTab === 'explorer' && (
          <div className="datalab-section datalab-fade-in">
            {dataset.length === 0 ? (
              <div className="datalab-empty">
                <Icons.Database />
                <p>Nenhum dataset gerado.</p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="datalab-btn datalab-btn-secondary"
                >
                  Ir para o Gerador
                </button>
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="datalab-card datalab-filters-card">
                  <h2 className="datalab-card-title">
                    <Icons.Filter /> Filtros
                  </h2>
                  <div className="datalab-filters-grid">
                    <div className="datalab-field">
                      <label>País</label>
                      <select value={filterPais} onChange={(e) => { setFilterPais(e.target.value); setTablePage(0); }}>
                        <option value="">Todos</option>
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>{c.nome} ({c.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="datalab-field">
                      <label>Linha</label>
                      <select value={filterLinha} onChange={(e) => { setFilterLinha(e.target.value); setTablePage(0); }}>
                        <option value="">Todas</option>
                        {[...new Set(baseItems.map(b => b.linha))].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                    <div className="datalab-field">
                      <label>Design</label>
                      <select value={filterDesign} onChange={(e) => { setFilterDesign(e.target.value); setTablePage(0); }}>
                        <option value="">Todos</option>
                        {designs.map((d) => (
                          <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                        ))}
                      </select>
                    </div>
                    <div className="datalab-field">
                      <label>Ano</label>
                      <input
                        type="number"
                        value={filterAno}
                        onChange={(e) => { setFilterAno(e.target.value); setTablePage(0); }}
                        placeholder="Ex: 2020"
                        min={2002}
                        max={2025}
                      />
                    </div>
                  </div>
                  <div className="datalab-filter-info">
                    Exibindo <strong>{filteredData.length}</strong> de <strong>{dataset.length}</strong> itens
                  </div>
                </div>

                {/* Data Table */}
                <div className="datalab-card datalab-table-card" ref={tableRef}>
                  <div className="datalab-table-wrapper">
                    <table className="datalab-table">
                      <thead>
                        <tr>
                          {['id','nome','linha','pais_code','ano','design_code','volume_ml','raridade'].map((col) => (
                            <th
                              key={col}
                              onClick={() => handleSort(col)}
                              className={tableSort.key === col ? 'datalab-th-active' : ''}
                            >
                              {col.replace(/_/g,' ')}
                              {tableSort.key === col && (
                                <span className="datalab-sort-icon">{tableSort.dir === 'asc' ? '↑' : '↓'}</span>
                              )}
                            </th>
                          ))}
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedData.map((item) => (
                          <tr key={item.id}>
                            <td className="datalab-cell-id">{item.id}</td>
                            <td>{item.nome}</td>
                            <td>
                              <span className="datalab-tag datalab-tag-linha">{item.linha}</span>
                            </td>
                            <td>
                              <span className="datalab-tag datalab-tag-pais">{item.pais_code}</span>
                            </td>
                            <td>{item.ano}</td>
                            <td>
                              <span className={`datalab-tag datalab-tag-design datalab-design-${item.design_code.toLowerCase()}`}>
                                {item.design_code}
                              </span>
                            </td>
                            <td>{item.volume_ml}ml</td>
                            <td>
                              <span className={`datalab-tag ${item.raridade === 'Raro' ? 'datalab-tag-raro' : 'datalab-tag-incomum'}`}>
                                {item.raridade}
                              </span>
                            </td>
                            <td className="datalab-actions-cell">
                              <button
                                onClick={() => setInspectItem(item)}
                                className="datalab-action-btn"
                                title="Inspecionar"
                              >
                                <Icons.Eye />
                              </button>
                              <button
                                onClick={() => handleCopyItem(item)}
                                className="datalab-action-btn"
                                title="Copiar JSON"
                              >
                                {copiedId === item.id ? <Icons.Check /> : <Icons.Copy />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="datalab-pagination">
                      <button
                        disabled={tablePage === 0}
                        onClick={() => setTablePage((p) => p - 1)}
                        className="datalab-btn datalab-btn-secondary datalab-btn-sm"
                      >
                        ← Anterior
                      </button>
                      <span className="datalab-page-info">
                        Página {tablePage + 1} de {totalPages}
                      </span>
                      <button
                        disabled={tablePage >= totalPages - 1}
                        onClick={() => setTablePage((p) => p + 1)}
                        className="datalab-btn datalab-btn-secondary datalab-btn-sm"
                      >
                        Próxima →
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STATS TAB ─────────────────── */}
        {activeTab === 'stats' && (
          <div className="datalab-section datalab-fade-in">
            {!datasetStats ? (
              <div className="datalab-empty">
                <Icons.Chart />
                <p>Gere um dataset para ver as estatísticas.</p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="datalab-btn datalab-btn-secondary"
                >
                  Ir para o Gerador
                </button>
              </div>
            ) : (
              <>
                {/* Big number cards */}
                <div className="datalab-stats-hero">
                  <div className="datalab-stat-big">
                    <span className="datalab-stat-big-number">{datasetStats.total}</span>
                    <span className="datalab-stat-big-label">Total de Itens</span>
                  </div>
                  <div className="datalab-stat-big">
                    <span className="datalab-stat-big-number">{Object.keys(datasetStats.porPais).length}</span>
                    <span className="datalab-stat-big-label">Países</span>
                  </div>
                  <div className="datalab-stat-big">
                    <span className="datalab-stat-big-number">{Object.keys(datasetStats.porLinha).length}</span>
                    <span className="datalab-stat-big-label">Linhas</span>
                  </div>
                  <div className="datalab-stat-big">
                    <span className="datalab-stat-big-number">{duplicatesResult?.totalDuplicates || 0}</span>
                    <span className="datalab-stat-big-label">Duplicatas</span>
                  </div>
                </div>

                {/* Distribution Charts */}
                <div className="datalab-stats-grid">
                  {/* Por Linha */}
                  <div className="datalab-card">
                    <h3 className="datalab-card-title">Distribuição por Linha</h3>
                    <div className="datalab-bar-chart">
                      {linhas.map(([key, count]) => {
                        const pct = ((count / datasetStats.total) * 100).toFixed(1);
                        return (
                          <div key={key} className="datalab-bar-row">
                            <span className="datalab-bar-label">{key}</span>
                            <div className="datalab-bar-track">
                              <div
                                className="datalab-bar-fill datalab-bar-neon"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="datalab-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Por País */}
                  <div className="datalab-card">
                    <h3 className="datalab-card-title">Distribuição por País</h3>
                    <div className="datalab-bar-chart">
                      {paisStats.map(([key, count]) => {
                        const pct = ((count / datasetStats.total) * 100).toFixed(1);
                        return (
                          <div key={key} className="datalab-bar-row">
                            <span className="datalab-bar-label">{key}</span>
                            <div className="datalab-bar-track">
                              <div
                                className="datalab-bar-fill datalab-bar-cyan"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="datalab-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Por Design */}
                  <div className="datalab-card">
                    <h3 className="datalab-card-title">Distribuição por Design</h3>
                    <div className="datalab-bar-chart">
                      {designStats.map(([key, count]) => {
                        const pct = ((count / datasetStats.total) * 100).toFixed(1);
                        const colors = { OG: 'datalab-bar-neon', REB: 'datalab-bar-amber', LTD: 'datalab-bar-purple', ANN: 'datalab-bar-rose', REG: 'datalab-bar-cyan' };
                        return (
                          <div key={key} className="datalab-bar-row">
                            <span className="datalab-bar-label">{key}</span>
                            <div className="datalab-bar-track">
                              <div
                                className={`datalab-bar-fill ${colors[key] || 'datalab-bar-neon'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="datalab-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Por Raridade */}
                  <div className="datalab-card">
                    <h3 className="datalab-card-title">Distribuição por Raridade</h3>
                    <div className="datalab-bar-chart">
                      {Object.entries(datasetStats.porRaridade).sort((a,b) => b[1] - a[1]).map(([key, count]) => {
                        const pct = ((count / datasetStats.total) * 100).toFixed(1);
                        return (
                          <div key={key} className="datalab-bar-row">
                            <span className="datalab-bar-label">{key}</span>
                            <div className="datalab-bar-track">
                              <div
                                className={`datalab-bar-fill ${key === 'Raro' ? 'datalab-bar-amber' : 'datalab-bar-neon'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="datalab-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TOOLS TAB ─────────────────── */}
        {activeTab === 'tools' && (
          <div className="datalab-section datalab-fade-in">
            {dataset.length === 0 ? (
              <div className="datalab-empty">
                <Icons.Flask />
                <p>Gere um dataset para usar as ferramentas.</p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="datalab-btn datalab-btn-secondary"
                >
                  Ir para o Gerador
                </button>
              </div>
            ) : (
              <div className="datalab-tools-grid">
                {/* Export Tool */}
                <div className="datalab-card datalab-tool-card">
                  <div className="datalab-tool-icon datalab-tool-icon-blue">
                    <Icons.Download />
                  </div>
                  <h3>Exportação Limpa</h3>
                  <p>Remove duplicados, recalcula campos derivados e exporta JSON pronto para banco SQL.</p>
                  <button onClick={handleExport} className="datalab-btn datalab-btn-primary">
                    <Icons.Download /> Exportar JSON
                  </button>
                </div>

                {/* Duplicate Detector */}
                <div className="datalab-card datalab-tool-card">
                  <div className="datalab-tool-icon datalab-tool-icon-amber">
                    <Icons.Warning />
                  </div>
                  <h3>Detecção de Duplicados</h3>
                  <p>Analisa o dataset inteiro por variant_key duplicadas.</p>
                  <div className="datalab-tool-result">
                    {duplicatesResult && (
                      <div className={`datalab-tool-badge ${duplicatesResult.totalDuplicates > 0 ? 'datalab-tool-badge-warn' : 'datalab-tool-badge-ok'}`}>
                        {duplicatesResult.totalDuplicates > 0 ? (
                          <><Icons.Warning /> {duplicatesResult.totalDuplicates} duplicatas encontradas</>
                        ) : (
                          <><Icons.Check /> Nenhuma duplicata encontrada</>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Clean Dataset */}
                <div className="datalab-card datalab-tool-card">
                  <div className="datalab-tool-icon datalab-tool-icon-neon">
                    <Icons.Trash />
                  </div>
                  <h3>Limpar Dataset</h3>
                  <p>Aplica exportClean() ao dataset atual, removendo duplicados e recalculando campos.</p>
                  <button
                    onClick={() => {
                      const cleaned = exportClean(dataset);
                      setDataset(cleaned);
                    }}
                    className="datalab-btn datalab-btn-secondary"
                  >
                    <Icons.Trash /> Limpar Agora
                  </button>
                </div>

                {/* Copy All */}
                <div className="datalab-card datalab-tool-card">
                  <div className="datalab-tool-icon datalab-tool-icon-purple">
                    <Icons.Copy />
                  </div>
                  <h3>Copiar Dataset</h3>
                  <p>Copia o dataset completo (filtrado) como JSON para a área de transferência.</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(filteredData, null, 2));
                    }}
                    className="datalab-btn datalab-btn-secondary"
                  >
                    <Icons.Copy /> Copiar JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── INSPECT MODAL ─────────────────── */}
      {inspectItem && (
        <div className="datalab-modal-overlay" onClick={() => setInspectItem(null)}>
          <div className="datalab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="datalab-modal-header">
              <h3>{inspectItem.nome}</h3>
              <button onClick={() => setInspectItem(null)} className="datalab-modal-close">✕</button>
            </div>
            <div className="datalab-modal-body">
              <pre className="datalab-json-view">
                {JSON.stringify(inspectItem, null, 2)}
              </pre>
            </div>
            <div className="datalab-modal-footer">
              <button
                onClick={() => handleCopyItem(inspectItem)}
                className="datalab-btn datalab-btn-primary datalab-btn-sm"
              >
                <Icons.Copy /> Copiar JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
