# Product

## Register

product

## Users

Internal accounting staff at Solutekno. Typically 1–3 people handling daily bookkeeping for a service-oriented business. They work on desktop during office hours, entering transactions throughout the day and reconciling before close of business. They are trained accountants comfortable with double-entry concepts (Jurnal Umum, Buku Besar, Neraca Lajur) but expect the tool to reduce friction, not introduce it.

## Product Purpose

A web-based accounting system for Solutekno's service business. It handles the full general-ledger cycle: chart of accounts management, journal entry posting with auxiliary (subsidiary) accounts for AR/AP tracking, automated ledger computation, and financial report generation (trial balance, income statement, balance sheet). Success looks like: the team posts the day's transactions, checks the trial balance balances, and leaves confident the books are correct. Real-time sync via WebSocket means multiple users see updates instantly.

## Brand Personality

Precise, reliable, professional. The interface should feel like a well-organized ledger book brought into a modern tool. Confidence through clarity, not decoration. Numbers are the hero; the UI stays out of their way.

## Anti-references

- Overly playful or colorful consumer apps (Notion, Trello, Asana). This is a financial tool; whimsy undermines trust.
- Bloated enterprise ERP dashboards (SAP, Oracle). Dense is fine; cluttered is not.
- Generic SaaS marketing templates with big hero metrics, gradient cards, and stock illustrations. The landing page should feel like the product: serious and purposeful.

## Design Principles

1. **Numbers first.** Financial data is the primary content. Typography, alignment, and spacing exist to make numbers scannable and trustworthy. Tabular figures everywhere.
2. **Quiet confidence.** The interface earns trust by being predictable and clear, not by being loud. Restraint is a feature.
3. **Zero ambiguity.** Debit is debit, kredit is kredit. Labels, states, and feedback leave no room for misinterpretation. Balance indicators are immediate.
4. **Efficient by default.** Common workflows (post journal, check trial balance) should require minimal clicks. The tool respects the user's time.
5. **Indonesian context.** All UI copy is in Bahasa Indonesia. Accounting terminology follows Indonesian standards (Neraca, Laba Rugi, Buku Besar). Number formatting uses id-ID locale.

## Accessibility & Inclusion

WCAG 2.1 AA as the baseline. Ensure sufficient contrast ratios for all text (especially financial figures on dark backgrounds). Support keyboard navigation for all forms and tables. Respect `prefers-reduced-motion`. No information conveyed by color alone; always pair with text labels or icons.
