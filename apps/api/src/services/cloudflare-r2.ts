import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const TEMP_BUCKET = process.env.R2_TEMP_BUCKET_NAME || "cloudication-temp";
const MAIN_BUCKET = process.env.R2_MAIN_BUCKET_NAME || "cloudication-main";

export async function r2TempUpload(
  buffer: Buffer,
  key: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: TEMP_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // R2 の公開 URL を返す（一時保存用）
  const publicUrl = process.env.R2_TEMP_PUBLIC_URL
    ? `${process.env.R2_TEMP_PUBLIC_URL}/${key}`
    : `https://${TEMP_BUCKET}.r2.dev/${key}`;

  return publicUrl;
}

/**
 * 投稿確定時に temp バケットから main バケットへ画像を移動する
 */
export async function r2MoveToMain(key: string): Promise<string> {
  // 1. Copy
  await r2Client.send(
    new CopyObjectCommand({
      Bucket: MAIN_BUCKET,
      CopySource: encodeURIComponent(`${TEMP_BUCKET}/${key}`),
      Key: key,
    })
  );

  // 2. Delete from Temp
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: TEMP_BUCKET,
      Key: key,
    })
  );

  // 公開用メイン URL を返す
  const publicUrl = process.env.R2_MAIN_PUBLIC_URL
    ? `${process.env.R2_MAIN_PUBLIC_URL}/${key}`
    : `https://${MAIN_BUCKET}.r2.dev/${key}`;

  return publicUrl;
}
