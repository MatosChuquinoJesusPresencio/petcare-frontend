import { useEffect, useRef, useState } from "react";

interface SearchableSelectProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  allowCustom?: boolean;
}

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
  required,
  placeholder = "Buscar o escribir...",
  error,
  allowCustom = true,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  const showCreateOption =
    allowCustom &&
    query.trim() !== "" &&
    !options.some((opt) => opt.toLowerCase() === query.trim().toLowerCase());

  function handleSelect(option: string) {
    onChange(option);
    setQuery(option);
    setOpen(false);
  }

  function handleCreate() {
    const trimmed = query.trim();
    if (trimmed) {
      onChange(trimmed);
      setQuery(trimmed);
      setOpen(false);
    }
  }

  function handleClear() {
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="campo-grupo" ref={containerRef} style={{ position: "relative" }}>
      <label className="campo-etiqueta">
        {label}{required && " *"}
      </label>
      <div
        className={`campo-entrada ${error ? "campo-entrada--error" : ""}`}
        style={{ cursor: "text", display: "flex", alignItems: "center", paddingRight: value ? "30px" : undefined, position: "relative" }}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
      >
        <input
          ref={inputRef}
          type="text"
          className="campo-entrada"
          style={{ border: "none", outline: "none", boxShadow: "none", padding: 0, background: "transparent", width: "100%" }}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            style={{ position: "absolute", right: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--color-texto-claro)", padding: "2px 6px", fontSize: "0.85em" }}
            title="Limpiar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>
      {open && (
        <ul
          style={{
            position: "absolute",
            zIndex: 1050,
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "200px",
            overflowY: "auto",
            background: "var(--color-blanco, #fff)",
            border: "1px solid var(--color-borde, #dee2e6)",
            borderRadius: "0 0 0.375rem 0.375rem",
            margin: 0,
            padding: "0.25rem 0",
            listStyle: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {filtered.length === 0 && !showCreateOption && (
            <li style={{ padding: "0.5rem 0.75rem", color: "var(--color-texto-claro, #6c757d)", fontStyle: "italic", fontSize: "0.875rem" }}>
              Sin resultados
            </li>
          )}
          {filtered.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                background: value === opt ? "var(--color-primario, #0d6efd)" : "transparent",
                color: value === opt ? "var(--color-blanco, #fff)" : "var(--color-texto, #212529)",
              }}
              onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = "var(--color-fondo, #f8f9fa)"; }}
              onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = "transparent"; }}
            >
              {opt}
            </li>
          ))}
          {showCreateOption && (
            <li
              onClick={handleCreate}
              style={{
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "var(--color-primario, #0d6efd)",
                fontStyle: "italic",
                borderTop: filtered.length > 0 ? "1px solid var(--color-borde, #dee2e6)" : undefined,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-fondo, #f8f9fa)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Usar "{query.trim()}"
            </li>
          )}
        </ul>
      )}
      {error && <div className="campo-error">{error}</div>}
    </div>
  );
}
