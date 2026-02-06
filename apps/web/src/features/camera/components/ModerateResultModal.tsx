import { useModerateModalFlow } from "../hooks/useModerateModalFlow";
import ModerationResultView from "./ModerationResultView";
import PostFormView from "./PostFormView";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";
import Sheet from "@/features/shared/components/Sheet";
import { useEffect } from "react";

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
  const { view, articleAnimClass, switchView, setView } = useModerateModalFlow(isOpen);

  useEffect(() => {
    if (isOpen && result?.status === "accepted" && view === "result") {
      // 成功時は即座に投稿フォームへ
      setView("post");
    }
  }, [isOpen, result, view, setView]);


  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      className={`p-6 ${articleAnimClass}`}
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
          imageToken={result?.image_token || ""}
          imageUrl={result?.preview_url}
          onBack={() => switchView("result")}
          onSubmit={onClose}
        />
      )}
    </Sheet>
  );
};

export default ModerateResultModal;
