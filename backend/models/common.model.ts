
export class CommonResponse {
    status: Number = 400;
    data: any = [];
    success: boolean = false;
    message: string = "";
}

export enum Role {
    ADMIN = 1,
    USER,
}

export enum CommunityParticipantRole {
    ADMIN = 1,
    PARTICIPANT,
}

export enum Gender {
    MALE = 1,
    FEMALE = 2,
}

export enum PostType {
    USER = 1,
    COMMUNITY = 2,
}

export enum Relation {
    FATHER = 1,
    MOTHER = 2,
    SIBLINGS = 3,
    CHILDREN = 5,
    WIFE = 6,
}