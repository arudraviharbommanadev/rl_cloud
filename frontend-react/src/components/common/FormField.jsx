import { useRef } from "react";

export default function FormField({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "number", 
  step = "any",
  min,
  max,
  hint,
  options,
  required = true 
}) {
  const inputRef = useRef(null);

  const handleStep = (direction) => {
    const input = inputRef.current;
    if (!input) return;

    if (direction === "up") {
      input.stepUp();
    } else {
      input.stepDown();
    }

    onChange({ target: input });
  };

  if (type === "select") {
    return (
      <label className="form-field" htmlFor={name}>
        <span className="field-label-row">
          <span>{label}</span>
        </span>
        <select id={name} name={name} value={value} onChange={onChange} required={required}>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="form-field" htmlFor={name}>
      <span className="field-label-row">
        <span>{label}</span>
      </span>
      <div className={`input-wrapper ${hint ? "has-hint" : ""} ${type === "number" ? "has-stepper" : ""}`}>
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={type}
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          required={required}
        />
        {hint ? <span className="input-hint">{hint}</span> : null}
        {type === "number" ? (
          <div className="stepper-controls" aria-hidden="true">
            <button type="button" className="stepper-btn" tabIndex={-1} onClick={() => handleStep("up")}>
              ▲
            </button>
            <button type="button" className="stepper-btn" tabIndex={-1} onClick={() => handleStep("down")}>
              ▼
            </button>
          </div>
        ) : null}
      </div>
    </label>
  );
}
