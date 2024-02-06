export type emailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};
export interface RegisterEmailQueueInterface {
  sendEmail(email: emailOptions): Promise<void>;
}
