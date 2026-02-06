"use client";

import { usePermissionStatuses, PermissionStatus } from "../hooks/usePermissionStatuses";
import Icon from "@/features/shared/components/Icon";
import Button from "@/features/shared/components/Button";
import Link from "next/link";

const StatusBadge = ({ status }: { status: PermissionStatus }) => {
  switch (status) {
    case "granted":
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent/20 rounded-full border border-brand-accent/20 shadow-sm shadow-brand-accent/10">
          <Icon name="cloudication" size={14} className="text-brand-accent" />
          <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Granted</span>
        </div>
      );
    case "denied":
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-alert/20 rounded-full border border-alert/20 shadow-sm shadow-alert/10">
          <Icon name="not_enough_clouds" size={14} className="text-alert" />
          <span className="text-alert text-[10px] font-black uppercase tracking-widest">Denied</span>
        </div>
      );
    case "prompt":
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-warning/20 rounded-full border border-warning/20 shadow-sm shadow-warning/10">
          <Icon name="help" size={14} className="text-warning" />
          <span className="text-warning text-[10px] font-black uppercase tracking-widest">Prompt</span>
        </div>
      );
    case "loading":
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-invert/5 rounded-full border border-invert/10">
          <div className="w-3 h-3 rounded-full border-2 border-invert/20 border-t-invert animate-spin" />
          <span className="text-invert/40 text-[10px] font-black uppercase tracking-widest">Checking</span>
        </div>
      );
  }
};

const PermissionItem = ({
  icon,
  title,
  description,
  status
}: {
  icon: string;
  title: string;
  description: string;
  status: PermissionStatus
}) => (
  <div className="group relative w-full p-6 bg-surface rounded-[32px] border border-invert/10 hover:border-invert/20 transition-all">
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 border border-brand/10 group-hover:scale-105 transition-transform duration-500">
          <Icon name={icon as any} size={24} className="text-brand" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-invert text-base font-bold tracking-tight">{title}</h3>
          <p className="text-invert/40 text-[11px] leading-relaxed font-medium max-w-[200px]">{description}</p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  </div>
);

const PermissionStatusView = () => {
  const { cameraStatus, locationStatus, refresh } = usePermissionStatuses();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-3 text-center px-6">
        <div className="w-16 h-16 mx-auto mb-2 rounded-[24px] bg-brand flex items-center justify-center shadow-2xl shadow-brand/20">
          <Icon name="cloudication" size={64} className="text-surface" />
        </div>
        <h2 className="text-2xl font-black text-surface tracking-tight">アプリの許可状態</h2>
        <p className="text-invert/40 text-sm font-medium leading-relaxed">
          クモニケーションを快適に利用するために、<br />
          カメラと位置情報の許可をお願いします。
        </p>
      </div>

      <div className="flex flex-col gap-4 px-3">
        <PermissionItem
          icon="camera"
          title="カメラ"
          description="雲を撮影するために、カメラへのアクセスが必要です。"
          status={cameraStatus}
        />
        <PermissionItem
          icon="location"
          title="位置情報"
          description="自分の近くの雲を表示するために、位置情報の共有が必要です。"
          status={locationStatus}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 items-center">
        <Button
          onClick={refresh}
          label="ステータスを更新"
          icon="cloudication"
          className="w-full h-16 rounded-[24px] font-bold bg-brand text-surface hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand/20"
        />
        <p className="text-invert/20 text-[10px] text-center font-medium px-4">
          ※許可を拒否した場合、ブラウザの設定から手動で許可する必要があります。
        </p>
      </div>
    </div>
  );
};

export default PermissionStatusView;
