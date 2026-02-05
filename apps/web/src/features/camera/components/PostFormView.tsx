import Button from "@/components/common/Button";

interface PostFormViewProps {
  onBack: () => void;
  onSubmit: () => void;
}

const PostFormView = ({ onBack, onSubmit }: PostFormViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-lg font-bold text-invert">投稿内容を確認</h2>

      <div className="rounded-xl bg-invert/5 p-4 text-sm text-invert/60">
        投稿フォーム（仮）
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onBack}
          className="w-full rounded-xl py-6 bg-invert/5 text-invert/60 font-bold"
          label="戻る"
        />
        <Button
          onClick={onSubmit}
          className="w-full rounded-xl py-6 font-bold bg-brand-accent text-surface"
          label="投稿する"
        />
      </div>
    </div>
  );
};

export default PostFormView;
