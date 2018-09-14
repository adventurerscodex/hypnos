'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Author = exports.Book = undefined;

var _model = require('../models/model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Book = exports.Book = function (_Model) {
    _inherits(Book, _Model);

    function Book(title, author, isBestseller) {
        _classCallCheck(this, Book);

        var _this = _possibleConstructorReturn(this, (Book.__proto__ || Object.getPrototypeOf(Book)).call(this));

        _this.title = title;
        _this.author = author;
        _this.isBestseller = isBestseller;
        return _this;
    }

    return Book;
}(_model.Model);

Book.__skeys__ = ['books'];
Book.__dependents__ = [];
Book.FIELDS = ['title', 'author', 'isBestseller', 'uuid'];

var Author = exports.Author = function (_Model2) {
    _inherits(Author, _Model2);

    function Author(firstName, lastName, books) {
        _classCallCheck(this, Author);

        var _this2 = _possibleConstructorReturn(this, (Author.__proto__ || Object.getPrototypeOf(Author)).call(this));

        _this2.firstName = firstName;
        _this2.lastName = lastName;
        return _this2;
    }

    return Author;
}(_model.Model);

Author.__skeys__ = ['authors'];
Author.__dependents__ = [Book];
Author.FIELDS = ['firstName', 'lastName', 'uuid'];