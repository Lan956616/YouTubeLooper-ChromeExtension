type ContainerProps = {
  children: React.ReactNode;
  isDark: boolean;
};
const Container: React.FC<ContainerProps> = ({ children, isDark }) => {
  return <div className={`container  ${isDark && "darkmode"}`}>{children}</div>;
};

export default Container;
