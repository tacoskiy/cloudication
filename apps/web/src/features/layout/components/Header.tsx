import Link from "next/link";
import Button from "@/features/shared/components/Button";
import Icon from "@/features/shared/components/Icon";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-auto px-6 py-4 bg-brand flex justify-between gap-3">
      <Link href="/" className="flex items-center gap-3">
        <Icon name="cloudication" size={36} className="text-surface" />
        <Image className="h-4 w-auto" src="/img/vector/cloudication-logotype.svg" alt="クモ二ケーション" width={1} height={1} priority />
      </Link>
      <nav className="flex gap-2">
        <Link href="/permissions">
          <Button icon="setting" className="button-white-overlay h-10 w-10 p-0" />
        </Link>
      </nav>
    </header>
  );
};

export default Header;