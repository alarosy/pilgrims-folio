import { useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";
import { Icon, type IconName } from "../ornament/Icon";

type Variant = "primary" | "secondary" | "quiet";

/** A button that presses like a stamp into its own ink shadow. */
export function StampButton({
  variant = "primary",
  icon,
  iconEnd,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: IconName; iconEnd?: IconName }) {
  return (
    <button type="button" className={`btn btn-${variant} ${className}`} {...rest}>
      <span className="btn-face">
        {icon ? <Icon name={icon} size={18} /> : null}
        <span>{children}</span>
        {iconEnd ? <Icon name={iconEnd} size={18} /> : null}
      </span>
    </button>
  );
}

/** The same stamp look for a link (e.g. "Continue this lesson in Claude"). */
export function StampLink({
  href,
  to,
  variant = "primary",
  icon,
  iconEnd,
  external = false,
  children,
  className = "",
}: {
  href?: string;
  to?: string;
  variant?: Variant;
  icon?: IconName;
  iconEnd?: IconName;
  external?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const face = (
    <span className="btn-face">
      {icon ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} size={18} /> : null}
    </span>
  );
  const cls = `btn btn-${variant} no-underline ${className}`;
  if (to) return <Link to={to} className={cls}>{face}</Link>;
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {face}
    </a>
  );
}

/** On/off switch with a visible label (role="switch"). */
export function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  const hintId = useId();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={hint ? hintId : undefined}
      className="switch"
      onClick={() => onChange(!checked)}
    >
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      <span className="flex flex-col leading-tight">
        <span>{label}</span>
        {hint ? (
          <span id={hintId} className="text-caption text-ink-muted">
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/** A small radio group drawn as a row of type sorts. Arrow keys move the choice. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; lang?: string }[];
  label: string;
}) {
  const move = (dir: number) => {
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + dir + options.length) % options.length];
    if (next) onChange(next.value);
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="seg"
      onKeyDown={(e) => {
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), move(rtl && e.key === "ArrowRight" ? -1 : 1));
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), move(rtl && e.key === "ArrowLeft" ? 1 : -1));
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          lang={o.lang}
          aria-checked={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          className="seg-option"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A labelled text field: a ruled line to write on. */
export function TextField({
  label,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label block text-ink-muted">
        {label}
      </label>
      <input id={id} type={type} className="field" placeholder={placeholder} aria-describedby={hint ? `${id}-h` : undefined} />
      {hint ? (
        <p id={`${id}-h`} className="mt-1 text-caption text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
