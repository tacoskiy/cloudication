// src/services/vision.ts
export async function analyzeWithAzureVision(buffer: Buffer) {
  const endpoint = process.env.VISION_ENDPOINT!;
  const key = process.env.VISION_KEY!;

  const url =
    `${endpoint}/vision/v3.2/analyze` +
    `?visualFeatures=Tags,Adult,Faces`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": key,
    },
    body: new Uint8Array(buffer),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("AZURE ERROR", data);
    throw new Error("Azure Vision failed");
  }

  const cloudTag = (data.tags || []).find((t: any) => t.name === "cloud");
  const faces = data.faces || [];
  const tags = data.tags || [];

  return {
    adult: data.adult ?? {},
    faceDetected: faces.length > 0,
    cloudRatio: cloudTag ? cloudTag.confidence : 0,
    tags,
    faces,
  };
}