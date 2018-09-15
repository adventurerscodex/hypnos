import { Model } from '../models/model';

export class Book extends Model {

    static __skeys__ = ['books'];
    static __dependents__ = [];

    static FIELDS = ['title', 'author', 'isBestseller', 'uuid'];

    constructor(title, author, isBestseller) {
        super();

        this.title = title;
        this.author = author;
        this.isBestseller = isBestseller;
    }
}


export class Author extends Model {

    static __skeys__ = ['authors'];
    static __dependents__ = [Book];

    static FIELDS = ['firstName', 'lastName', 'uuid'];

    constructor(firstName, lastName, books) {
        super();

        this.firstName = firstName;
        this.lastName = lastName;
    }
}
