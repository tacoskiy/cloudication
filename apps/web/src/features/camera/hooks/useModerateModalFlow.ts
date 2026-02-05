import { useEffect, useState } from "react";

export type ModerateViewState = "result" | "post";
export type ArticleAnimState = "enter" | "exit";

export const useModerateModalFlow = (isOpen: boolean) => {
  const [view, setView] = useState<ModerateViewState>("result");
  const [articleAnim, setArticleAnim] = useState<ArticleAnimState>("enter");

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setView("result");
      setArticleAnim("enter");
    }
  }, [isOpen]);

  const switchView = (next: ModerateViewState) => {
    setArticleAnim("exit");

    requestAnimationFrame(() => {
      setTimeout(() => {
        setView(next);
        setArticleAnim("enter");
      }, 200); // match exit duration
    });
  };

  const articleAnimClass =
    articleAnim === "enter"
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-6 scale-95";

  return {
    view,
    articleAnimClass,
    switchView,
  };
};
