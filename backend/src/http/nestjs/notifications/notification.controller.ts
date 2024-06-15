import { NotificationRepositoryTypeOrm } from "@modules/notifications/infra/orm/notificationRepository.typeOrm";
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SaveNotificationInputDto } from "./dto/saveNotification.request.dto";
import { SaveNotificationUsecase } from "@modules/notifications/core/usecase/saveNotification.usecase";
import { SetReadedNotificationsUsecase } from "@modules/notifications/core/usecase/setReadedNotification.usecase";
import { GetNotificationUsecase } from "@modules/notifications/core/usecase/getNotification.usecase";
import { DeleteNotificationUsecase } from "@modules/notifications/core/usecase/deleteNotification.usecase";
import { NotificationsSocketLocal } from "@modules/notifications/infra/socket/NotificationsSocket.local";
import { getAmountNotificationsUsecase } from "@modules/notifications/core/usecase/getAmountNotification.usecase";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
  constructor(
    readonly repo: NotificationRepositoryTypeOrm,
    readonly socket: NotificationsSocketLocal,
  ) {}
  @Post()
  async createNotification(@Res() res, @Body() body: SaveNotificationInputDto) {
    const notification = await new SaveNotificationUsecase(this.repo, this.socket).execute(body);
    res.status(HttpStatus.OK).send({
      message: "Notificação criada",
      notification: notification.toOutput(),
    });
  }
  @Patch()
  async setReadedNotification(@Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    await new SetReadedNotificationsUsecase(this.repo, this.socket).execute(tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Notificações lidas",
    });
  }
  @Get()
  async GetNotifications(@Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const notifications = await new GetNotificationUsecase(this.repo).execute(tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      notifications: notifications.map((notification) => {
        return notification.toOutput();
      }),
    });
  }
  @Get("amount")
  async GetAmountNotifications(@Res() res, @Req() req) {
    const tokenDecoded = req["tokenPayload"];
    const notifications = await new getAmountNotificationsUsecase(this.repo).execute(tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({ notifications: notifications });
  }
  @Delete(":uuid")
  async DeleteNotification(@Res() res, @Req() req, @Param("uuid") uuid: string) {
    const tokenDecoded = req["tokenPayload"];
    await new DeleteNotificationUsecase(this.repo).execute(uuid, tokenDecoded.uuid);
    res.status(HttpStatus.OK).send({
      message: "Notificação deletada",
    });
  }
}
