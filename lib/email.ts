type EmailType = "signup" | "signin" | "waiting" | "borrow-remainder" | "borrow-overdue";

export const sendEmail = async (
  email: string,
  studentName: string,
  type: EmailType,
  bookTitle?: string,
  bookCover?: string
) => {
  console.log(bookCover)
  const cardColor = "#020617";
  const textColor = "#e5e7eb";
  const mutedText = "#94a3b8";
  let subject = "";
  let message = "";

  if (type === "signup") {
    subject = "Welcome to BookWise 🎉";
    message = `
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Welcome to <strong>BookWise</strong>! 🎉</p>
      <p>Your account has been successfully created.</p>
      <p>Please wait while we review and accept your account.  
      Once approved, you’ll be able to access all features.</p>
    `;
  }

  if (type === "signin") {
    subject = "You signed in to BookWise ✅";
    message = `
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>You have successfully signed in to <strong>BookWise</strong>.</p>
      <p>We’re glad to see you back. 📚</p>
    `;
  }

  if (type === "waiting") {
    subject = "We miss you at BookWise 👋";
    message = `
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>It looks like you haven’t logged in for a while.</p>
      <p>Your BookWise account is waiting for you — come back and continue learning 📖.</p>
    `;
  }

  if (type === "borrow-remainder") {
    subject = "Book due soon ⏰";
    message = `
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your borrowed book is due in 2 days.</p>
  
<div
  style="
    margin: 16px 0;
    padding: 12px;
    border-radius: 10px;
    background-color: #010b38;
    text-align: center;
  "
>
  <img
    src="https://ik.imagekit.io/userrahul${bookCover}"
    alt="Book Cover"
    style="
      max-width: 140px;
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: block;
      margin: 0 auto 12px;
    "
    loading="lazy"
  />

  <p style="margin: 0; font-size: 14px; color:#f5f7fa;">
    <strong>${bookTitle}</strong>
  </p>
</div>
    `;
  }

  if (type === "borrow-overdue") {
    subject = "Book overdue 🚨";
    message = `
      <p>Hi <strong>${studentName}</strong>,</p>
      <p>Your borrowed book is overdue.</p>

      <div
      style="
        margin: 16px 0;
        padding: 12px;
        border-radius: 10px;
        background-color: #010b38;
        text-align: center;
      "
    >
      <img
        src="https://ik.imagekit.io/userrahul${bookCover}"
        alt="Book Cover"
        style="
          max-width: 140px;
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: block;
          margin: 0 auto 12px;
        "
        loading="lazy"
      />
    
      <p style="margin: 0; font-size: 14px; color:#f5f7fa;">
        <strong>${bookTitle}</strong>
      </p>
    </div>
    `;
  }

  const html = `
    <div style="margin:0;padding:03;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:${cardColor};border-radius:12px;padding:32px;">
        <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="vertical-align:middle;">
      <img 
        src="https://yamquhjrdttbhec1.public.blob.vercel-storage.com/bookwise%20%281%29.png"
        alt="BookWise Logo"
        width="48"
        style="display:block;"
      />
    </td>
    <td style="vertical-align:middle;padding-left:12px;">
      <h1 style="color:${textColor};margin:0;font-size:24px;">
        BookWise
      </h1>
    </td>
  </tr>
</table>

        <!-- Message -->
        <div style="color:${textColor};font-size:15px;line-height:1.6;">
          ${message}
        </div>

        <!-- Footer -->
        <div style="margin-top:32px;border-top:1px solid #1e293b;padding-top:16px;">
          <p style="color:${mutedText};font-size:13px;margin:0;">
            — From the <strong>BookWise Team</strong>
          </p>
        </div>

      </div>
    </div>
  `;
  const response = await fetch("/api/sendEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      subject,
      html,
    }),
  });

  const data = await response.json();
  console.log(data);
};
