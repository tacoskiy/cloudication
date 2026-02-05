"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

interface ModerateResultModalProps {
  result: ImageModerateResponse | null;
  onClose: () => void;
  isOpen: boolean;
}

type ViewState = "result" | "post";
type ArticleAnim = "enter" | "exit";

const ModerateResultModal = ({
  result,
  onClose,
  isOpen,
}: ModerateResultModalProps) => {
  const [view, setView] = useState<ViewState>("result");
  const [articleAnim, setArticleAnim] = useState<ArticleAnim>("enter");

  // モーダルが閉じたら初期化
  useEffect(() => {
    if (!isOpen) {
      setView("result");
      setArticleAnim("enter");
    }
  }, [isOpen]);

  const switchView = (next: ViewState) => {
    setArticleAnim("exit");

    requestAnimationFrame(() => {
      setTimeout(() => {
        setView(next);
        setArticleAnim("enter");
      }, 200); // exit duration と完全一致させる
    });
  };

  const articleAnimClass =
    articleAnim === "enter"
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-6 scale-95";

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-300
        ${isOpen ? "opacity-100 bg-black/50" : "pointer-events-none opacity-0"}
      `}
    >
      <article
        className={`
          w-full max-w-sm rounded-3xl bg-white p-4
          transition-all duration-200 ease-out
          ${articleAnimClass}
        `}
      >
        {/* ================= 判定結果 ================= */}
        {view === "result" && (
          <>
            {result?.status === "rejected" && (
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-2xl bg-alert/12 p-4">
                  <Icon
                    name="not_enough_clouds"
                    size={24}
                    className="h-12 w-12 text-alert"
                  />
                </div>

                <h2 className="text-center text-lg font-bold text-alert">
                  {result.reasons.join(" / ")}
                </h2>

                <div className="flex flex-col items-start gap-2">
                  {result.suggestions.map((s) => (
                    <p
                      key={s}
                      className="rounded-3xl bg-alert/12 px-4 py-2 text-sm font-medium text-alert"
                    >
                      {s}
                    </p>
                  ))}
                </div>

                <Button
                  onClick={onClose}
                  icon="camera"
                  className="w-full rounded-xl bg-alert py-6 font-bold"
                  label="撮り直す"
                />
              </div>
            )}

            {result?.status === "accepted_with_warning" && (
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-2xl bg-warning/12 p-4">
                  <Icon
                    name="face"
                    size={24}
                    className="h-12 w-12 text-warning"
                  />
                </div>

                <h2 className="text-center text-lg font-bold text-warning">
                  {result.reasons.join(" / ")}
                </h2>

                <div className="flex flex-col items-start gap-2">
                  {result.suggestions.map((s) => (
                    <p
                      key={s}
                      className="rounded-3xl bg-warning/12 px-4 py-2 text-sm font-medium text-warning"
                    >
                      {s}
                    </p>
                  ))}
                </div>

                <div className="flex w-full gap-2">
                  <Button
                    onClick={() => switchView("post")}
                    icon="post"
                    className="w-full rounded-xl bg-warning/12 py-6 font-bold text-warning"
                    label="投稿する"
                  />
                  <Button
                    onClick={onClose}
                    icon="camera"
                    className="w-full rounded-xl bg-warning py-6 font-bold"
                    label="撮り直す"
                  />
                </div>
              </div>
            )}

            {result?.status === "accepted" && (
              <div className="flex flex-col gap-6">
                <h2 className="text-center text-lg font-bold">
                  投稿できます
                </h2>

                <Button
                  onClick={() => switchView("post")}
                  icon="post"
                  className="w-full rounded-xl py-6 font-bold"
                  label="投稿する"
                />
              </div>
            )}
          </>
        )}

        {/* ================= 投稿 ================= */}
        {view === "post" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-center text-lg font-bold">
              投稿内容を確認
            </h2>

            <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-600">
              投稿フォーム（仮）
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => switchView("result")}
                className="w-full rounded-xl py-6"
                label="戻る"
              />
              <Button
                onClick={onClose}
                className="w-full rounded-xl py-6 font-bold bg-brand-accent"
                label="投稿する"
              />
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default ModerateResultModal;
