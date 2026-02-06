"use client";

const Policy = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-6 text-center">
      <div className="space-y-6">
        <p className="text-invert/40 text-sm leading-relaxed tracking-wider font-medium">
          このアプリでは、雲の写真と一言を匿名で投稿できます。
          投稿された写真は地図上に表示されますが、24時間後に自動で削除されます。
        </p>
        <p className="text-invert/40 text-sm leading-relaxed tracking-wider font-medium">
          写真は雲のデータとして保存されますが、人物や建物など、
          個人の特定につながる可能性があるものが写っている場合は、AIが警告します。
        </p>
        <p className="text-invert/40 text-sm leading-relaxed tracking-wider font-medium">
          ユーザー名やフォロー機能はありません。反応は「いいね」のみで、
          誰が投稿したかは分かりません。
        </p>
        <p className="text-invert/60 text-base leading-relaxed tracking-widest font-bold pt-4 italic">
          空を見上げたその瞬間の気持ちを、<br />
          安心して残せる場所を目指しています。
        </p>
      </div>
      <div className="w-12 h-px bg-invert/10 mx-auto" />
      <p className="text-invert/20 text-[11px] tracking-widest uppercase font-black">
        Cloudication Service Policy
      </p>
    </div>
  );
};

export default Policy;
