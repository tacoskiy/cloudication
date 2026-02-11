"use client";

import Sheet from "@/features/shared/components/Sheet";
import Button from "@/features/shared/components/Button";
import Icon from "@/features/shared/components/Icon";

interface SystemPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "camera" | "location";
}

const SystemPermissionModal = ({ isOpen, onClose, type }: SystemPermissionModalProps) => {
  const isCamera = type === "camera";

  return (
    <Sheet isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" className="p-8">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-[32px] bg-alert/10 flex items-center justify-center">
          <Icon
            name="setting"
            size={40}
            className="text-alert"
          />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-black text-invert">
            OS設定で許可が必要です
          </h2>
          <div className="text-sm text-invert/60 leading-relaxed font-medium space-y-4">
            <p>
              ブラウザまたはOSの設定で{isCamera ? "カメラ" : "位置情報"}が拒否されています。
              アプリを利用するには、端末の設定から許可をオンにする必要があります。
            </p>
            <div className="bg-invert/5 rounded-2xl p-4 text-[13px] text-left border border-invert/5">
              <p className="font-bold mb-1 text-invert/80">手順の例:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>ブラウザのURL横のアイコンをタップ</li>
                <li>「権限」または「設定」を選択</li>
                <li>{isCamera ? "カメラ" : "位置情報"}を「許可」に変更</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 pt-2">
          <Button
            onClick={onClose}
            label="設定方法を確認しました"
            className="w-full h-14 rounded-2xl! bg-brand text-surface font-bold text-lg"
          />
        </div>

        <p className="text-[10px] text-invert/20 font-bold uppercase tracking-widest">
          Cloudication / Permissions
        </p>
      </div>
    </Sheet>
  );
};

export default SystemPermissionModal;
