import { NotificationEntity } from "../../../entities/notifications/notification.entity";

export type notificationOutput = {
    message: string;
    status:  number;
}
export type notificationOutputMany = {
    message: string;
    status:  number;
    notifications: NotificationEntity[];
}
export type saveNotificationInput = {
    to: string[];
    type: "system" | "personal" | "group";
    from?: string;
    message: string;
    invite?: boolean;
}
export interface NotificationGatewayInterface {
    saveNotification(notification: saveNotificationInput): Promise<notificationOutput>;
    getNotifications(): Promise<notificationOutputMany>;
    deleteNotifications(uuid: string): Promise<notificationOutput>;
}