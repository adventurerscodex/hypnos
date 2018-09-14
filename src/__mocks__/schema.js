import coreapi from 'coreapi';

const codec = new coreapi.codecs.CoreJSONCodec();

export default codec.decode(JSON.stringify({
    '_type': 'document',
    '_meta': {
        'url': 'http://localhost/api/docs/schema.js',
        'title': 'Testing API'
    },
    'authors': {
        'list': {
            '_type': 'link',
            'url': 'localhostapi/lastName/',
            'action': 'get',
            'description': '',
            'fields': [
                {
                    'name': 'page',
                    'location': 'query',
                    'schema': {
                        '_type': 'integer',
                        'firstName': 'Page',
                        'description': 'A page number within the paginated result set.'
                    }
                },
                {
                    'name': 'search',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Search',
                        'description': 'A search term.'
                    }
                },
                {
                    'name': 'ordering',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Ordering',
                        'description': 'Which field to use when ordering the results.'
                    }
                },
                {
                    'name': 'firstName',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': '',
                        'description': ''
                    }
                },
            ]
        },
        'create': {
            '_type': 'link',
            'url': '/api/lastName/',
            'action': 'post',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'firstName',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'lastName',
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'lastName',
                        'description': ''
                    }
                },
            ]
        },
        'read': {
            '_type': 'link',
            'url': '/api/lastName/{uuid}/',
            'action': 'get',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'search',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Search',
                        'description': 'A search term.'
                    }
                },
                {
                    'name': 'ordering',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Ordering',
                        'description': 'Which field to use when ordering the results.'
                    }
                },
                {
                    'name': 'firstName',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'firstName': '',
                        'description': ''
                    }
                },
            ]
        },
        'update': {
            '_type': 'link',
            'url': '/api/lastName/{uuid}/',
            'action': 'put',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'firstName',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'lastName',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'lastName',
                        'description': ''
                    }
                },
            ]
        },
        'partialUpdate': {
            '_type': 'link',
            'url': '/api/lastName/{uuid}/',
            'action': 'patch',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'firstName',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'lastName',
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'lastName',
                        'description': ''
                    }
                },
            ]
        },
        'delete': {
            '_type': 'link',
            'url': '/api/lastName/{uuid}/',
            'action': 'delete',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'firstName': 'uuid',
                        'description': ''
                    }
                },
            ]
        }
    },
    'books': {
        'list': {
            '_type': 'link',
            'url': 'localhostapi/book/',
            'action': 'get',
            'description': '',
            'fields': [
                {
                    'name': 'page',
                    'location': 'query',
                    'schema': {
                        '_type': 'integer',
                        'title': 'Page',
                        'description': 'A page number within the paginated result set.'
                    }
                },
                {
                    'name': 'search',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': 'Search',
                        'description': 'A search term.'
                    }
                },
                {
                    'name': 'ordering',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': 'Ordering',
                        'description': 'Which field to use when ordering the results.'
                    }
                },
                {
                    'name': 'title',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': '',
                        'description': ''
                    }
                },
            ]
        },
        'create': {
            '_type': 'link',
            'url': '/api/book/',
            'action': 'post',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'title',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'author',
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Author',
                        'description': ''
                    }
                },
                {
                    'name': 'isBestseller',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'boolean',
                        'title': 'Bestselling?',
                        'description': ''
                    }
                }
            ]
        },
        'read': {
            '_type': 'link',
            'url': '/api/book/{uuid}/',
            'action': 'get',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'title': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'search',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': 'Search',
                        'description': 'A search term.'
                    }
                },
                {
                    'name': 'ordering',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': 'Ordering',
                        'description': 'Which field to use when ordering the results.'
                    }
                },
                {
                    'name': 'title',
                    'location': 'query',
                    'schema': {
                        '_type': 'string',
                        'title': '',
                        'description': ''
                    }
                },
            ]
        },
        'update': {
            '_type': 'link',
            'url': '/api/book/{uuid}/',
            'action': 'put',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'title': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'title',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'author',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Author',
                        'description': ''
                    }
                },
                {
                    'name': 'isBestseller',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'boolean',
                        'title': 'Bestselling?',
                        'description': ''
                    }
                }
            ]
        },
        'partialUpdate': {
            '_type': 'link',
            'url': '/api/book/{uuid}/',
            'action': 'patch',
            'encoding': 'application/json',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'title': 'uuid',
                        'description': ''
                    }
                },
                {
                    'name': 'title',
                    'required': true,
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Name',
                        'description': ''
                    }
                },
                {
                    'name': 'author',
                    'location': 'form',
                    'schema': {
                        '_type': 'string',
                        'title': 'Author',
                        'description': ''
                    }
                },
                {
                    'name': 'isBestseller',
                    'location': 'form',
                    'schema': {
                        '_type': 'boolean',
                        'title': 'Bestselling?',
                        'description': ''
                    }
                }
            ]
        },
        'delete': {
            '_type': 'link',
            'url': '/api/book/{uuid}/',
            'action': 'delete',
            'description': '',
            'fields': [
                {
                    'name': 'uuid',
                    'required': true,
                    'location': 'path',
                    'schema': {
                        '_type': 'string',
                        'title': 'uuid',
                        'description': ''
                    }
                },
            ]
        }
    }
}));
