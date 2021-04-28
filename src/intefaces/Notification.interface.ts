export interface NotificationI {
    _id: string;
    title: string;
    message: string;
    targetId: string;
    senderId: string;
    seen: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
