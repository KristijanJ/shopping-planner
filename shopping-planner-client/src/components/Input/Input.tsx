import { ChangeEvent, KeyboardEventHandler } from "react";
import "./input.scss";

interface Props {
  onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  id: string;
  label?: string;
  type: string;
  value?: string | number;
  error?: string;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

export default function Input(props: Props) {
  return (
    <div className="form-input-element">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <input
        type={props.type}
        name={props.id}
        id={props.id}
        value={props.value || ""}
        onInput={props.onInput}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        ref={props.inputRef}
      />
      {props.error && (
        <div className="form-input-element__error">{props.error}</div>
      )}
    </div>
  );
}
