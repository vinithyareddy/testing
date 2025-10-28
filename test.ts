/* ✅ Make mini-header and main header align on all zoom levels */
.top-mini-header,
.HeaderNewBgView {
  display: flex;
  justify-content: center; /* centers both inner wrappers equally */
  width: 100%;
  box-sizing: border-box;
}

/* Make their inner wrappers (like .content-wrapper-section) use same width */
.top-mini-header > div,
.HeaderNewBgView > div {
  width: 100%;
  max-width: 1280px; /* shared visual grid width */
  padding: 0 3vw;     /* responsive padding */
  box-sizing: border-box;
  margin: 0 auto;
}

/* Optional: keep smaller font and spacing in mini header */
.top-mini-header {
  font-size: 0.95rem;
  padding-top: 6px;
  padding-bottom: 6px;
}

/* Optional: slightly larger spacing for main header */
.HeaderNewBgView {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Responsive fine-tune */
@media (max-width: 768px) {
  .top-mini-header > div,
  .HeaderNewBgView > div {
    padding: 0 5vw;
  }
}
