import "./modal.scss";

interface Props {
  children: React.ReactNode;
  title?: string;
  hideFooter?: boolean;
  contentAlign?: "left" | "right" | "center";
  onCancelClick: () => void;
  onContinueClick: () => Promise<void> | void;
}

const Modal = (props: Props) => {
  return (
    <div className="modal">
      <div className="modal__background" onClick={props.onCancelClick}/>
      <div className="modal__body">
        {props.title && <div className="modal__header">{props.title}</div>}
        <div
          className={`modal__content modal__content--${
            props.contentAlign || "left"
          }`}
        >
          {props.children}
        </div>
        {!props.hideFooter && (
          <div className="modal__footer">
            <button className="btn btn-outline" onClick={props.onCancelClick}>
              Cancel
            </button>
            <button className="btn" onClick={props.onContinueClick}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
