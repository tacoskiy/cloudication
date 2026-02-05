"use client";

import { useModerateModalFlow } from "../hooks/useModerateModalFlow";
import ModerationResultView from "./ModerationResultView";
import PostFormView from "./PostFormView";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";

interface ModerateResultModalProps {
  result: ImageModerateResponse | null;
  onClose: () => void;
  isOpen: boolean;
}

const ModerateResultModal = ({
  result,
  onClose,
  isOpen,
}: ModerateResultModalProps) => {
  const { view, articleAnimClass, switchView } = useModerateModalFlow(isOpen);

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
          w-full max-w-sm rounded-[42px] bg-white p-6 shadow-2xl
          transition-all duration-200 ease-out
          ${articleAnimClass}
        `}
      >
        {view === "result" && (
          <ModerationResultView
            result={result}
            onClose={onClose}
            onSwitchToPost={() => switchView("post")}
          />
        )}

        {view === "post" && (
          <PostFormView
            onBack={() => switchView("result")}
            onSubmit={onClose}
          />
        )}
      </article>
    </div>
  );
};

export default ModerateResultModal;
