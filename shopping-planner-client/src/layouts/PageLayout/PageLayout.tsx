import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageLayout(props: Props) {
  const outerClasses = props.className ? ` ${props.className}` : "";

  return (
    <div className={`page-main${outerClasses}`}>
      <div className="page-container">{props.children}</div>
    </div>
  );
}
