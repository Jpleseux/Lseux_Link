export type emailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
export interface LoginEmailQueueInterface {
  sendEmail(email: emailOptions): Promise<void>;
}
