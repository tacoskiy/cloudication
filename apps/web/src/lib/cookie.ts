/**
 * シンプルな Cookie 操作ユーティリティ
 */

export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

export const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
};

/**
 * 永続的な Client ID を取得または生成する
 */
export const getOrCreateClientId = (): string => {
  let clientId = getCookie("cloudication_client_id");
  if (!clientId) {
    clientId = `client_${crypto.randomUUID()}`;
    setCookie("cloudication_client_id", clientId);
  }
  return clientId;
};
