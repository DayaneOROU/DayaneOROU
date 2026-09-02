import React from "react";
import StackedSections from "@/components/animata/scroll/stacked-sections";

const CARDS = [
  {
    num: "01",
    title: "Expériences",
    desc: "Pins here, then the next pane stacks on top.",
  },
  {
    num: "02",
    title: "Formation",
    desc: "Pins here, then the next pane stacks on top.",
  },
  {
    num: "03",
    title: "Skills",
    desc: "Pins here, then the next pane stacks on top.",
  },
  {
    num: "04",
    title: "Langues",
    desc: "Pins here, then the next pane stacks on top.",
  },
];

export default function rojects() {
  return (
    <>
      <section className="maw-w-[500px] mx-[500px]">
        <StackedSections stackOffset={80}>
          {CARDS.map((card, i) => (
            <div
              key={card.num}
              style={{
                position: "sticky",
                zIndex: i + 1,
              }}
            >
              <div
                style={{
                  background: "#F5F3EF",
                  borderRadius: "16px",
                  margin: "0 24px",
                  padding: "24px 28px",
                  minHeight: "260px",
                  border: "0.5px solid #e8e5e0",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#918981",
                    marginBottom: "24px",
                  }}
                >
                  {card.num}
                </p>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: "12px",
                  }}
                >
                  {card.title}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#918981",
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </StackedSections>
      </section>
    </>
  );
}
