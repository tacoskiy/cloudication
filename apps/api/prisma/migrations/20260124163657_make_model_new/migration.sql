-- CreateTable
CREATE TABLE "CloudPost" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,

    CONSTRAINT "CloudPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloudLocation" (
    "post_id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloudLocation_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "CloudLike" (
    "post_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "liked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CloudLike_pkey" PRIMARY KEY ("post_id","client_id")
);

-- AddForeignKey
ALTER TABLE "CloudLocation" ADD CONSTRAINT "CloudLocation_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "CloudPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudLike" ADD CONSTRAINT "CloudLike_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "CloudPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
