import Button from "../common/Button";
import Icon from "../common/Icon";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-auto px-6 py-4 bg-brand flex justify-between gap-3">
      <a href="###" className="flex items-center gap-3">
        <Icon name="cloudication" size={36} className="text-surface"/>
        <Image className="h-4 w-auto" src="img/vector/cloudication-logotype.svg" alt="クモ二ケーション" width={1} height={1} priority/>
      </a>
      <nav className="flex gap-3">
        <Button icon="help" className="button-white-overlay"/>
        <Button icon="setting" className="button-white-overlay"/>
      </nav>
    </header>
  );
};

export default Header;