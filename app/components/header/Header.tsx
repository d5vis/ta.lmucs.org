import Logo from "./Logo";
import AppBar from "./AppBar";

const Header = () => {
  return (
    <div className="sticky top-4 z-50 grid grid-cols-[auto_1fr] min-w-screen gap-4">
      <Logo />
      <AppBar />
    </div>
  );
};

export default Header;
