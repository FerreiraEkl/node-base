export interface IUser {
    // PRIMARY KEYS ====================
    id?: number;

    // STANDART ATRIBUTES ==============
    userName: string;
    userLogin: string;
    userPassword: string;
    userEmail: string;
    userPhone?: string;
    userProfile: number;

    // DATATIMES =======================
    createdAt?: Date;
    updatedAt?: Date;
}
