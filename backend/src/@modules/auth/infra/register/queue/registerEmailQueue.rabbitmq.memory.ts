import { RegisterEmailQueueInterface, emailOptions } from "@modules/auth/core/register/registerEmailQueue.interface";

export class registerEmailQueueMemory implements RegisterEmailQueueInterface {
  async sendEmail(email: emailOptions): Promise<void> {}
}
