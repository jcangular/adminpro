export class User {
    constructor(
        public name: string,
        public email: string,
        public id?: string,
        public role?: string,
        public status?: string,
        public google?: boolean,
        public createdOn?: Date,
        public img?: string,
    ) { }
}
