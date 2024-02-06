import { emailOptions } from "@modules/auth/core/register/registerEmailQueue.interface";
import * as amqplib from "amqplib";
import { RegisterRepositoryInterface } from "@modules/auth/core/register/registerRepository.interface";
import { RegisterEmailQueueInterface } from "@modules/auth/core/register/registerEmailQueue.interface";
export class RegisterEmailQueue implements RegisterEmailQueueInterface {
  private exchangeName = "emails";

  constructor(
    readonly channel: amqplib.Channel,
    readonly repo: RegisterRepositoryInterface,
  ) {}
  async sendEmail(email: emailOptions): Promise<void> {
    const message = Buffer.from(JSON.stringify(email));
    this.channel.sendToQueue(this.exchangeName, message);
  }
}
