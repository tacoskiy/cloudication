"use client";

import Sheet from "@/components/common/Sheet";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "camera" | "location";
  onRetry: () => void;
}

const PermissionModal = ({ isOpen, onClose, type, onRetry }: PermissionModalProps) => {
  const isCamera = type === "camera";

  return (
    <Sheet isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" className="p-8">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-[32px] bg-brand/12 flex items-center justify-center animate-pulse">
          <Icon 
            name={isCamera ? "camera" : "help"} 
            size={40} 
            className="text-brand" 
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-invert">
            {isCamera ? "カメラを許可してください" : "位置情報を許可してください"}
          </h2>
          <p className="text-sm text-invert/60 leading-relaxed font-medium">
            {isCamera 
              ? "雲を撮影して解析するために、カメラへのアクセスが必要です。設定から許可をお願いします。" 
              : "雲を世界中のマップに届けるために、位置情報の共有が必要です。設定から許可をお願いします。"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 pt-2">
          <Button
            onClick={() => {
              onRetry();
              onClose();
            }}
            label="許可する"
            className="w-full h-14 rounded-2xl bg-brand text-surface font-bold text-lg"
          />
          <Button
            onClick={onClose}
            label="閉じる"
            className="w-full h-14 rounded-2xl bg-invert/5 text-invert/40 font-bold"
          />
        </div>

        <p className="text-[10px] text-invert/20 font-bold uppercase tracking-widest">
          Cloudication / Permissions
        </p>
      </div>
    </Sheet>
  );
};

export default PermissionModal;
