import Icon from "../common/Icon";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full h-auto p-3 bg-amber-400 flex gap-3">
      <div className="flex items-center gap-3">
        <Icon name="cloudication" />
        <Image className="h-3 w-auto" src="img/vector/cloudication-logotype.svg" alt="クモ二ケーション" width={1} height={1}></Image>
      </div>
    </header>
  );
};

export default Header;
