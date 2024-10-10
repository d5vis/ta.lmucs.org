import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto">
      made with{" "}
      <Link
        href="https://github.com/d5vis/ta.lmucs.org"
        target="_blank"
        className="text-lmucrimson"
      >
        &lt;3
      </Link>{" "}
      at loyola marymount university
    </footer>
  );
};

export default Footer;
