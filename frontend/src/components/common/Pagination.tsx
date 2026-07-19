import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const range = 2; // how many pages to show around current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "..."
    ) {
      pages.push("...");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 24, marginBottom: 12 }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          height: 38,
          padding: "0 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          color: currentPage === 1 ? "var(--text-muted)" : "var(--text)",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = "var(--green)";
            e.currentTarget.style.color = "var(--green)";
          }
        }}
        onMouseLeave={e => {
          if (currentPage !== 1) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text)";
          }
        }}
      >
        Trước
      </button>

      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <span key={`ell-${idx}`} style={{ padding: "0 8px", color: "var(--text-muted)", fontSize: 14 }}>
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={`page-${p}`}
            onClick={() => onPageChange(p as number)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              border: isCurrent ? "1px solid var(--green)" : "1px solid var(--border)",
              background: isCurrent ? "var(--green)" : "#fff",
              color: isCurrent ? "#fff" : "var(--text)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              if (!isCurrent) {
                e.currentTarget.style.borderColor = "var(--green)";
                e.currentTarget.style.color = "var(--green)";
              }
            }}
            onMouseLeave={e => {
              if (!isCurrent) {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text)";
              }
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          height: 38,
          padding: "0 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          color: currentPage === totalPages ? "var(--text-muted)" : "var(--text)",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = "var(--green)";
            e.currentTarget.style.color = "var(--green)";
          }
        }}
        onMouseLeave={e => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text)";
          }
        }}
      >
        Sau
      </button>
    </div>
  );
};
