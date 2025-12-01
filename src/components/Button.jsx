export const ButtonPrimary = ({ label, icon, href, download = false }) => {
  if (href) {
    return (
      <a
        href={href}
        download={download}
        className="btn btn-primary flex items-center gap-1"
      >
        {label}
        {icon && <span className="material-symbols-rounded">{icon}</span>}
      </a>
    );
  }

  return (
    <button className="btn btn-primary flex items-center gap-1">
      {label}
      {icon && <span className="material-symbols-rounded">{icon}</span>}
    </button>
  );
};

export const ButtonOutline = ({ label, icon, href }) => (
  <a
    href={href}
    className="btn btn-outline flex items-center gap-1"
  >
    {label}
    {icon && <span className="material-symbols-rounded">{icon}</span>}
  </a>
);
