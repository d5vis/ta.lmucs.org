import { Card } from "@/components/ui/card";
import Link from "next/link";

const Logo = () => {
  return (
    <Card className="flex items-center justify-center pt-2 pb-2 pl-4 pr-4 rounded-2xl text-lmublue font-[family-name:var(--font-metric-bold)]">
      <Link href="/">
        <h1>🦁 LMUCS</h1>
      </Link>
    </Card>
  );
};

export default Logo;
