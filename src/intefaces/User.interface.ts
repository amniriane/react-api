export interface UserI {
    _id: string;
    name: string;
    email: string;
    password?: string;
    token?: string;
    shotNumber: number;
    drink?: { canReceived: boolean, canSend: boolean, drinked: boolean, date: number};
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
