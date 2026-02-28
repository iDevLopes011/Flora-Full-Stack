CREATE TABLE "dictionary_words" (
    "word" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dictionary_words_pkey" PRIMARY KEY ("word")
);
