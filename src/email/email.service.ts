class EmailService {
  constructor(models:any) {

  }
  sendEmail({to, subject, body}: { to: string[], subject: string, body: string }) {
    console.log("sendEmail called", {to, subject, body})
  }
}
export default EmailService;
