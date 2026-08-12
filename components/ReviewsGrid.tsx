"use client";

import { useEffect } from "react";
import { googleReviewsUrl } from "@/lib/site-data";
import { refreshScrollReveal } from "@/components/ScrollReveal";

export default function ReviewsGrid() {
  useEffect(() => {
    refreshScrollReveal();
  }, []);

  return (
    <div className="reviews-grid" id="reviews-grid" aria-live="polite">
      <div className="review-card">
        <div className="review-card-stars" aria-label="Ocena 5 na 5">
          ★★★★★
        </div>
        <p className="review-card-author">5,0 · 2 opinie na Google</p>
        <p className="review-card-text">
          Opinie klientów są dostępne na profilu Google. Kliknij poniżej, żeby je przeczytać.
        </p>
      </div>
      <p className="reviews-note">
        <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">
          Przejdź do opinii na Google →
        </a>
      </p>
    </div>
  );
}
