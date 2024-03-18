const Button = ({ children, className, onClick, type }: { children?: any; className?: string; onClick?: () => void; type?: string }) => (
  <button className={className} onClick={onClick} type={type !== null ? type : 'button'}>
    {children}
  </button>
);

export default Button;
