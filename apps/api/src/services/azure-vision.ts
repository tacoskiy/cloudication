// src/services/vision.ts
export async function analyzeWithAzureVision(buffer: Buffer, filename?: string) {
  const endpoint = process.env.VISION_ENDPOINT;
  const key = process.env.VISION_KEY;

  // Mock response if credentials are not set
  if (!endpoint || !key) {
    console.log("Azure Vision credentials not found. Using mock response.");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulate failure for cats (based on filename)
    if (filename && (filename.includes("cat") || filename.includes("neko") || filename.includes("猫"))) {
       return {
        adult: { isAdultContent: false, isRacyContent: false, isGoryContent: false, adultScore: 0, racyScore: 0, goreScore: 0 },
        faceDetected: false,
        cloudRatio: 0.0, // No clouds
        tags: [{ name: "cat", confidence: 0.99 }, { name: "animal", confidence: 0.9 }],
        faces: [],
      };
    }

    // Default Mock: Cloud present, no face (Success case)
    return {
      adult: {
        isAdultContent: false,
        isRacyContent: false,
        isGoryContent: false,
        adultScore: 0,
        racyScore: 0,
        goreScore: 0
      },
      faceDetected: false,
      cloudRatio: 0.95, 
      tags: [{ name: "cloud", confidence: 0.99 }, { name: "sky", confidence: 0.9 }],
      faces: [],
    };
  }

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