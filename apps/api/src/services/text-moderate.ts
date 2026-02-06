/**
 * 不適切な言葉（NGワード）のリスト
 */
const NG_WORDS = [
  // 攻撃的な言葉・暴力的表現
  "死ね", "しね", "シネ", "殺す", "ころす", "コロス", "殺意", "さつい", "サツイ",
  "処刑", "しょけい", "ショケイ", "消えろ", "きえろ", "キエロ", "くたばれ",
  "地獄に落ちろ", "じごくにおちろ", "自殺", "じさつ", "ジサツ",
  // 誹謗中傷・侮辱
  "バカ", "ばか", "あほ", "馬鹿", "阿呆", "マヌケ", "まぬけ", "カス", "かす",
  "クズ", "くず", "ゴミ", "ごみ", "役立たず", "やくたたず",
  "キモイ", "きもい", "きもイ", "ブス", "ぶす", "デブ", "でぶ", "ハゲ", "はげ",
  "死ねばいいのに", "しねばいいのに",
  // 差別的表現
  "ガイジ", "がいじ", "チョン", "ちょん", "シナ", "しな", "土人", "どじん", "部落", "ぶらく",
  // 性的・不適切な表現
  "エロ", "えろ", "セフレ", "せふれ", "オナニー", "おなにー", "クリトリス", "くりとりす",
  "ペニス", "ぺにす", "バイブ", "ばいぶ", "アダルト", "あだると",
  "淫乱", "いんらん", "痴女", "ちじょ", "変態", "へんたい", "露出", "ろしゅつ",
  "射精", "しゃせい", "中出し", "なかだし", "援交", "えんこう", "パパ活", "ぱぱかつ",
  "おめこ", "ちんこ", "まんこ", "ちんぽ", "まんげ", "ちんげ",
  // 英語・その他
  "fuck", "shit", "bitch", "asshole", "dick", "pussy", "sex", "porn",
];

/**
 * カタカナをひらがなに変換する
 */
function toHiragana(text: string): string {
  return text.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * 重複する文字を1つにまとめる (例: "死死死ね" -> "死ね")
 * ただし、正規化しすぎると誤検知が増えるため慎重に
 */
function removeRepeatedChars(text: string): string {
  return text.replace(/(.)\1+/g, "$1");
}

/**
 * テキストにNGワードが含まれているかチェックする
 * @param text チェック対象の文字列
 * @returns NGワードが含まれている場合はtrue
 */
export function containsNGWord(text: string): boolean {
  if (!text) return false;

  // 1. 小文字化
  let t = text.toLowerCase();
  
  // 2. カタカナをひらがなに変換
  t = toHiragana(t);
  
  // 3. 記号・スペースを除去
  // \u3000-\u303f: 日本語の記号
  // \uff00-\uffef: 半角・全角の記号/英数字
  t = t.replace(/[\s\t\n\r、。！？！？！？…,.!?;:()（）\[\]【】\-_=+*&^%$#@!~`'"]+/g, "");
  t = t.replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u8fff]+/g, "");

  // 4. 重複文字の正規化（"死死ね" などの対策）
  const collapsed = removeRepeatedChars(t);

  // 判定
  return NG_WORDS.some(word => {
    const normalizedWord = toHiragana(word.toLowerCase());
    return t.includes(normalizedWord) || collapsed.includes(normalizedWord);
  });
}
