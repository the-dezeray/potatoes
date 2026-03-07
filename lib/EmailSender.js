import EmailService from "@/lib/EmailService";
import * as templates from "./EmailTemplate";

class EmailSender {
  async send({ type, recipients, data }) {
    const recipientList = Array.isArray(recipients)
      ? recipients
      : [recipients];

    let html;

    switch (type) {
      case "applicationReceived":
        html = templates.applicationReceived(data.name);
        break;
      case "accepted":
        html = templates.accepted(data.name);
        break;
      case "rejected":
        html = templates.rejected(data.name);
        break;
      case "massUpdate":
        html = templates.massUpdate(data.message);
        
        await EmailService.sendMail({
          to: process.env.GMAIL_USER, 
          bcc: recipientList,         
          subject: data.subject || "Innovation Club Announcement",
          html,
  });
  return;

        break;
      case "meetingInvite":
        html = templates.meetingInvite(data.name, data.date);
        break;
      default:
        throw new Error("Unknown email type");
    }

    const batchSize = 20;

    for (let i = 0; i < recipientList.length; i += batchSize) {
      const batch = recipientList.slice(i, i + batchSize);

      await Promise.all(
        batch.map(email =>
          EmailService.sendMail({
            to: email,
            subject: data.subject || "Innovation Club",
            html
          })
        )
      );
    }
  }
}

export default new EmailSender();