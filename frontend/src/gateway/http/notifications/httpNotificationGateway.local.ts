import { NotificationEntity, NotificationProps } from "../../../entities/notifications/notification.entity";
import { UserEntity } from "../../../entities/notifications/User.entity";
import httpClient from "../../../http/httpClient";
import { NotificationGatewayInterface, notificationOutput, notificationOutputAmount, notificationOutputMany, saveNotificationInput } from "../../interfaces/notifications/notificationGateway.interface";

export class HttpNotificationGateway implements NotificationGatewayInterface {
    constructor(readonly httpClient: httpClient) {}
    async saveNotification(notification: saveNotificationInput): Promise<notificationOutput> {
        const response = await this.httpClient.post(`notifications`, notification);
        if (response && response.status < 300) {
            return {
                status: response.status,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async getNotifications(): Promise<notificationOutputMany> {
        const response = await this.httpClient.get(`notifications`);
        const { data } = response;
        if (response && response.status < 300) {
            return {
                notifications: data.notifications.map((notification: any) => {
                    return new NotificationEntity({
                        isInvite: notification.isInvite,
                        isReaded: notification.isReaded,
                        message: notification.message,
                        type: notification.type,
                        uuid: notification.uuid,
                        from: new UserEntity(notification.from),
                        to: notification.to.map((to: any) => {
                            return new UserEntity(to)
                        })
                    })
                }),
                status: response.status,
                message: response.data.message,
            }
        }
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async getAmountNotifications(): Promise<notificationOutputAmount> {
        const response = await this.httpClient.get(`notifications/amount`);
        const { data } = response;
        if (response && response.status < 300) {
            return {
                amount: data.notifications,
                status: response.status,
                message: response.data.message,
            }
        }
        return {
            amount: 0,
            status: response.status,
            message: response.data.message,
        }
    }
    async deleteNotifications(uuid: string): Promise<notificationOutput> {
        const response = await this.httpClient.delete(`notifications`, uuid);
        return {
            status: response.status,
            message: response.data.message,
        }
    }
    async setReadedNotifications(): Promise<notificationOutput> {
        const response = await this.httpClient.patch(`notifications`, {});
        return {
            status: response.status,
            message: response.data.message,
        } 
    }
}