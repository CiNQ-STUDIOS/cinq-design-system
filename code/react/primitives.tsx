/**
 * CiNQ · React primitives
 *
 * Copy this file and primitives.css into a product. Every component binds
 * to the tokens through the classes in primitives.css; nothing here carries
 * a colour, a size or a duration. No dependencies beyond React. Icons are
 * passed in as nodes so the product picks its own set (Phosphor, one weight
 * per surface, is the house choice).
 *
 * Contents: Mark, Loader, Button, ButtonLink, Slab, Field, Input, Select,
 * Textarea, Toggle, Segmented, Checkbox, Badge, StatTile, Table, TopBar,
 * AppTopBar, Sidebar, BottomNav, Stepper, Dialog, BottomSheet, Toast,
 * ToastRegion, EmptyState, Skeleton, ErrorState.
 */
"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

/* ── The mark ────────────────────────────────────────────────────────────── */

const MARK = { size: 100, cx: 50, cy: 50, r: 33, stroke: 20, opening: 78, gap: 7, segments: 5 } as const;

function markSegments(): string[] {
  const pt = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [MARK.cx + MARK.r * Math.cos(a), MARK.cy - MARK.r * Math.sin(a)] as const;
  };
  const f = (n: number) => Number(n.toFixed(3));
  const sweep = 360 - MARK.opening;
  const seg = (sweep - MARK.gap * (MARK.segments - 1)) / MARK.segments;
  const out: string[] = [];
  for (let i = 0; i < MARK.segments; i++) {
    const a0 = MARK.opening / 2 + i * (seg + MARK.gap);
    const a1 = a0 + seg;
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    out.push(`M ${f(x0)} ${f(y0)} A ${MARK.r} ${MARK.r} 0 ${seg > 180 ? 1 : 0} 0 ${f(x1)} ${f(y1)}`);
  }
  return out;
}
const SEGMENTS = markSegments();

/** The five-segment C. Inherits currentColor. */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK.size} ${MARK.size}`}
      className={className}
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {SEGMENTS.map((d, i) => (
        <path key={i} d={d} stroke="currentColor" strokeWidth={MARK.stroke} />
      ))}
    </svg>
  );
}

/** The mark as a loading indicator. Size it with width/height on className. */
export function Loader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cx("cq-loader", className)}>
      <Mark />
    </span>
  );
}

/* ── Button ──────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "ghost" | "bone" | "destructive";
type ButtonBase = {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  /** An icon node for the disc on the right. Omit for a plain pill. */
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

function buttonClass({ variant = "primary", size = "md", icon, className }: ButtonBase) {
  return cx("cq-btn", `cq-btn-${variant}`, size === "sm" && "cq-btn-sm", !icon && "cq-btn-no-ico", className);
}

function ButtonInner({ children, icon, loading }: Pick<ButtonBase, "children" | "icon" | "loading">) {
  return (
    <>
      <span className="cq-btn-label">{children}</span>
      {icon ? (
        <span className="cq-btn-ico" aria-hidden>
          {icon}
        </span>
      ) : null}
      {loading ? (
        <span className="cq-btn-spinner">
          <Loader className="cq-btn-ico" />
        </span>
      ) : null}
    </>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonBase & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBase>
>(function Button({ variant, size, icon, loading, children, className, disabled, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className={buttonClass({ variant, size, icon, className, children })}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      <ButtonInner icon={icon} loading={loading}>
        {children}
      </ButtonInner>
    </button>
  );
});

export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  ButtonBase & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBase>
>(function ButtonLink({ variant, size, icon, loading, children, className, ...rest }, ref) {
  return (
    <a ref={ref} className={buttonClass({ variant, size, icon, className, children })} aria-busy={loading || undefined} {...rest}>
      <ButtonInner icon={icon} loading={loading}>
        {children}
      </ButtonInner>
    </a>
  );
});

/* ── Slab ────────────────────────────────────────────────────────────────── */

type SlabTone = "ink" | "accent" | "deep" | "bone";

export function Slab({
  tone = "ink",
  /** The bezel treatment for the public site. Apps use the plain slab. */
  marketing = false,
  interactive = false,
  selected,
  className,
  children,
  ...rest
}: {
  tone?: SlabTone;
  marketing?: boolean;
  interactive?: boolean;
  selected?: boolean;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const toneClass = tone !== "ink" ? `cq-slab-${tone}` : undefined;
  if (marketing && tone === "ink") {
    return (
      <div className={cx("cq-slab cq-slab-marketing", interactive && "cq-slab-interactive", className)} data-selected={selected} {...rest}>
        <div className="cq-slab-core">{children}</div>
      </div>
    );
  }
  return (
    <div className={cx("cq-slab", toneClass, interactive && "cq-slab-interactive", className)} data-selected={selected} {...rest}>
      {children}
    </div>
  );
}

/* ── Fields ──────────────────────────────────────────────────────────────── */

type FieldProps = {
  label: string;
  /** "optional" or "required", shown after the label. Mark the minority. */
  note?: string;
  help?: string;
  error?: string;
  className?: string;
  children: (a: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
};

/** Binds a label, help text and an error to any control by id. */
export function Field({ label, note, help, error, className, children }: FieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = [help && helpId, error && errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cx("cq-field", className)}>
      <label className="cq-label" htmlFor={id}>
        {label}
        {note ? <span className="cq-label-note"> ({note})</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {help && !error ? (
        <p className="cq-help" id={helpId}>
          {help}
        </p>
      ) : null}
      {error ? (
        <p className="cq-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...rest }, ref) {
    return <input ref={ref} className={cx("cq-input", className)} aria-invalid={invalid || undefined} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  function Select({ className, invalid, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cx("cq-select", className)} aria-invalid={invalid || undefined} {...rest}>
        {children}
      </select>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, rows = 3, ...rest }, ref) {
  return <textarea ref={ref} className={cx("cq-textarea", className)} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
});

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={cx("cq-toggle", className)}
      onClick={() => onChange(!checked)}
    >
      <span className="cq-toggle-track" aria-hidden>
        <span className="cq-toggle-knob" />
      </span>
      <span>{label}</span>
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: ReadonlyArray<{ value: T; label: ReactNode }>;
  value: T;
  onChange: (v: T) => void;
  /** Accessible name for the group. */
  label: string;
  className?: string;
}) {
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value);
    onChange(options[(i + dir + options.length) % options.length].value);
  };
  return (
    <div role="radiogroup" aria-label={label} className={cx("cq-segmented", className)}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className="cq-segment"
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); }
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Checkbox({
  label,
  indeterminate,
  className,
  ...rest
}: { label: ReactNode; indeterminate?: boolean; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return (
    <label className={cx("cq-check", className)}>
      <input ref={ref} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}

/* ── Badge and stat ──────────────────────────────────────────────────────── */

export function Badge({
  tone,
  children,
  className,
}: {
  tone?: "positive" | "negative" | "attention" | "info" | "accent";
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx("cq-badge", tone && `cq-badge-${tone}`, className)}>{children}</span>;
}

export function StatTile({
  label,
  value,
  delta,
  className,
}: {
  label: string;
  value: ReactNode;
  /** A signed change. Positive numbers read as up. */
  delta?: { value: number; label: string };
  className?: string;
}) {
  return (
    <Slab className={cx("cq-stat", className)}>
      <span className="cq-mono" style={{ color: "var(--text-3)" }}>{label}</span>
      <span className="cq-numeral cq-stat-value">{value}</span>
      {delta ? (
        <span className={cx("cq-tabular", delta.value >= 0 ? "cq-stat-delta-up" : "cq-stat-delta-down")} style={{ fontSize: "var(--text-label)" }}>
          {delta.value >= 0 ? "▲" : "▼"} {Math.abs(delta.value)} {delta.label}
        </span>
      ) : null}
    </Slab>
  );
}

/* ── Table ───────────────────────────────────────────────────────────────── */

export type Column<Row> = {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  numeric?: boolean;
  sortable?: boolean;
  /** Keeps this column visible while scrolling horizontally. Use on the first. */
  sticky?: boolean;
};

export type Sort = { key: string; dir: "asc" | "desc" } | null;

export function Table<Row>({
  columns,
  rows,
  rowKey,
  sort,
  onSort,
  selectable,
  selected,
  onSelect,
  loading,
  error,
  onRetry,
  empty,
  caption,
  className,
}: {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  sort?: Sort;
  onSort?: (s: Sort) => void;
  selectable?: boolean;
  selected?: Set<string>;
  onSelect?: (next: Set<string>) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  empty?: { title: string; body: string; action?: ReactNode };
  caption?: string;
  className?: string;
}) {
  const allKeys = rows.map(rowKey);
  const sel = selected ?? new Set<string>();
  const allSelected = allKeys.length > 0 && allKeys.every((k) => sel.has(k));
  const someSelected = !allSelected && allKeys.some((k) => sel.has(k));
  const toggleAll = () => onSelect?.(allSelected ? new Set() : new Set(allKeys));
  const toggleOne = (k: string) => {
    const next = new Set(sel);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelect?.(next);
  };
  const cycle = (key: string) => {
    if (!onSort) return;
    if (sort?.key !== key) return onSort({ key, dir: "asc" });
    if (sort.dir === "asc") return onSort({ key, dir: "desc" });
    onSort(null);
  };
  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cx("cq-table-wrap", className)}>
      <table className="cq-table" aria-busy={loading || undefined}>
        {caption ? <caption className="cq-sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th style={{ width: 1 }}>
                <Checkbox
                  label={<span className="cq-sr-only">Select all rows</span>}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
            ) : null}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  className={cx(c.numeric && "cq-num", c.sticky && "cq-sticky")}
                  aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                >
                  {c.sortable && onSort ? (
                    <button type="button" onClick={() => cycle(c.key)}>
                      {c.header}
                      <span aria-hidden style={{ color: "var(--text-2)" }}>{active ? (sort!.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody aria-live="polite">
          {loading
            ? [0, 1, 2].map((i) => (
                <tr key={`sk-${i}`}>
                  <td colSpan={colCount}>
                    <Skeleton style={{ height: "1em", width: `${70 - i * 15}%` }} />
                  </td>
                </tr>
              ))
            : null}
          {!loading && error ? (
            <tr>
              <td colSpan={colCount} className="cq-table-state">
                <ErrorState title="The list did not load" body={error} onRetry={onRetry} />
              </td>
            </tr>
          ) : null}
          {!loading && !error && rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="cq-table-state">
                <EmptyState title={empty?.title ?? "Nothing here yet"} body={empty?.body ?? "Rows will show up here as they come in."} action={empty?.action} />
              </td>
            </tr>
          ) : null}
          {!loading && !error
            ? rows.map((row) => {
                const k = rowKey(row);
                return (
                  <tr key={k} aria-selected={selectable ? sel.has(k) : undefined}>
                    {selectable ? (
                      <td>
                        <Checkbox label={<span className="cq-sr-only">Select row</span>} checked={sel.has(k)} onChange={() => toggleOne(k)} />
                      </td>
                    ) : null}
                    {columns.map((c) => (
                      <td key={c.key} className={cx(c.numeric && "cq-num", c.sticky && "cq-sticky")}>
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
}

/* ── Navigation ──────────────────────────────────────────────────────────── */

export type NavItem = { href: string; label: string; icon?: ReactNode; current?: boolean };

/** The marketing header pill. Hides on scroll down, returns on scroll up. */
export function TopBar({ brand, links, cta, className }: { brand: ReactNode; links: NavItem[]; cta?: ReactNode; className?: string }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={cx("cq-topbar cq-glass", className)} data-hidden={hidden}>
      {brand}
      <nav aria-label="Site">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="cq-nav-link" aria-current={l.current ? "page" : undefined}>
            {l.label}
          </a>
        ))}
      </nav>
      {cta}
    </header>
  );
}

/** The slim top bar inside an app: title left, actions right. */
export function AppTopBar({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={cx("cq-topbar-app", className)}>
      <h1 className="cq-display" style={{ fontSize: "var(--text-title)", margin: 0 }}>{title}</h1>
      <div style={{ marginLeft: "auto", display: "flex", gap: "var(--gap)" }}>{children}</div>
    </header>
  );
}

export function Sidebar({
  brand,
  groups,
  footer,
  className,
}: {
  brand: ReactNode;
  groups: Array<{ kicker?: string; items: NavItem[] }>;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <aside className={cx("cq-sidebar", className)}>
      {brand}
      <nav aria-label="Main" style={{ display: "flex", flexDirection: "column", gap: "var(--gap-lg)" }}>
        {groups.map((g, i) => (
          <div key={i} className="cq-sidebar-group">
            {g.kicker ? <div className="cq-mono cq-sidebar-kicker">{g.kicker}</div> : null}
            {g.items.map((it) => (
              <a key={it.href} href={it.href} className="cq-sidebar-link" aria-current={it.current ? "page" : undefined}>
                {it.icon}
                {it.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
      {footer ? <div style={{ marginTop: "auto" }}>{footer}</div> : null}
    </aside>
  );
}

export function BottomNav({ items, className }: { items: NavItem[]; className?: string }) {
  if (items.length > 5) throw new Error("BottomNav takes at most five items.");
  return (
    <nav aria-label="Main" className={cx("cq-bottomnav cq-glass", className)}>
      {items.map((it) => (
        <a key={it.href} href={it.href} className="cq-bottomnav-item" aria-current={it.current ? "page" : undefined}>
          {it.icon}
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}

export function Stepper({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol className={cx("cq-stepper", className)} aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} className="cq-step" aria-current={i === current ? "step" : undefined} data-done={i < current}>
          <span className="cq-step-num" aria-hidden>{i < current ? "✓" : i + 1}</span>
          <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)" }}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/* ── Overlays ────────────────────────────────────────────────────────────── */

function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    const onClick = (e: MouseEvent) => { if (e.target === el) onClose(); };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => { el.removeEventListener("cancel", onCancel); el.removeEventListener("click", onClick); };
  }, [onClose]);
  return ref;
}

/** Native <dialog>: focus trap, Escape and focus return come free. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Primary action last. */
  actions: ReactNode;
  className?: string;
}) {
  const ref = useDialog(open, onClose);
  const id = useId();
  return (
    <dialog ref={ref} className={cx("cq-dialog", className)} aria-labelledby={id}>
      <h2 id={id} className="cq-display cq-dialog-title">{title}</h2>
      <div className="cq-dialog-body">{children}</div>
      <div className="cq-dialog-actions">{actions}</div>
    </dialog>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useDialog(open, onClose);
  const id = useId();
  return (
    <dialog ref={ref} className={cx("cq-sheet", className)} aria-labelledby={id}>
      <div className="cq-sheet-handle" aria-hidden />
      <h2 id={id} className="cq-display cq-dialog-title" style={{ fontSize: "var(--text-slab)" }}>{title}</h2>
      <div className="cq-dialog-body">{children}</div>
    </dialog>
  );
}

/* ── Toast ───────────────────────────────────────────────────────────────── */

export type ToastItem = {
  id: string;
  tone?: "positive" | "negative" | "attention" | "info";
  icon?: ReactNode;
  message: string;
  action?: { label: string; onClick: () => void };
};

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);
  return (
    <div className={cx("cq-toast", toast.tone && `cq-toast-${toast.tone}`)} role="status">
      {toast.icon ? <span className="cq-toast-ico" aria-hidden>{toast.icon}</span> : null}
      <span>{toast.message}</span>
      {toast.action ? (
        <button type="button" className="cq-toast-action" onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}>
          {toast.action.label}
        </button>
      ) : null}
    </div>
  );
}

export function ToastRegion({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="cq-toast-region" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ── Feedback states ─────────────────────────────────────────────────────── */

export function EmptyState({ title, body, action, className }: { title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx("cq-state", className)}>
      <Mark className="cq-state-mark" />
      <h3 className="cq-state-title">{title}</h3>
      <p className="cq-state-body">{body}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title, body, onRetry, className }: { title: string; body: string; onRetry?: () => void; className?: string }) {
  return (
    <div className={cx("cq-state cq-state-error", className)} role="alert">
      <Mark className="cq-state-mark" />
      <h3 className="cq-state-title">{title}</h3>
      <p className="cq-state-body">{body}</p>
      {onRetry ? (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function Skeleton({ className, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cx("cq-skeleton", className)} style={style} {...rest} />;
}
