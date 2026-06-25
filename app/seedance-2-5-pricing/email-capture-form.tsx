"use client";

export function EmailCaptureForm() {
  return (
    <div className="email-capture-form">
      <label className="sr-only" htmlFor="seedance-25-email">
        Email address
      </label>
      <input
        id="seedance-25-email"
        name="email"
        placeholder="you@example.com"
        type="email"
      />
      <button
        onClick={() => {
          const input = document.getElementById(
            "seedance-25-email",
          ) as HTMLInputElement;
          const email = input?.value.trim();
          const subject = encodeURIComponent("Seedance 2.5 pricing update");
          window.location.href = `mailto:hello@videoapicost.com?subject=${subject}${email ? `&body=${encodeURIComponent(email)}` : ""}`;
        }}
        type="button"
      >
        Notify me
      </button>
    </div>
  );
}
