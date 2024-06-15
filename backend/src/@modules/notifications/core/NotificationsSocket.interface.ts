export interface NotificationsSocketInterface {
  notify(uuid: string[]): Promise<void>;
  removeNotify(uuid: string): Promise<void>;
}
