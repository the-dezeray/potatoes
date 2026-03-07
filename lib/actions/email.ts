"use server"

import EmailSender from "@/lib/EmailSender";

export async function sendApplicationEmail(email, name) {
  try {
    await EmailSender.send({
      type: "applicationReceived",
      recipients: [email],
      data: { name: name || "Applicant" },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send application email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendApprovalEmail(email, name) {
  try {
    await EmailSender.send({
      type: "accepted",
      recipients: [email],
      data: { name: name || "Member" },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { success: false, error: error.message };
  }
}

export async function sendRejectionEmail(email, name) {
  try {
    await EmailSender.send({
      type: "rejected",
      recipients: [email],
      data: { name: name || "User" },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return { success: false, error: error.message };
  }
}
