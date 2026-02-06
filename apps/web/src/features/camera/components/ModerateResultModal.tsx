import { useModerateModalFlow } from "../hooks/useModerateModalFlow";
import ModerationResultView from "./ModerationResultView";
import PostFormView from "./PostFormView";
import { ImageModerateResponse } from "@cloudication/shared-types/image-moderate";
import Sheet from "@/features/shared/components/Sheet";

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
    <Sheet 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-sm"
      className={`p-5 ${articleAnimClass}`}
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
