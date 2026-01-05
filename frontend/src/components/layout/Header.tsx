import Button from "../common/Button";
import Icon from "../common/Icon";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-auto px-6 py-4 bg-brand-primary flex justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon name="cloudication" size={36} className="text-text-invert"/>
        <Image className="h-4 w-auto" src="img/vector/cloudication-logotype.svg" alt="クモ二ケーション" width={1} height={1}></Image>
      </div>
      <nav className="flex gap-3">
        <Button icon="help" className="bg-bg-overlay text-text-invert"/>
        <Button icon="setting" className="bg-bg-overlay text-text-invert"/>
      </nav>
    </header>
  );
};

export default Header;