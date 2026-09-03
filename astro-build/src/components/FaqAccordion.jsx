import { useState } from "react";

export default function FaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-section">
      <div className="faq-title">Frequently Asked Questions</div>
      {faqs.map((faq, i) => (
        <div className="faq-item" key={i}>
          <button
            className="faq-q"
            type="button"
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{faq.q}</span>
            <svg
              className={`faq-chevron${openIndex === i ? " open" : ""}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {openIndex === i && <div className="faq-a">{faq.a}</div>}
        </div>
      ))}
    </div>
  );
}
