# Hypnos - A Better Way to REST

[![Build Status](https://travis-ci.com/adventurerscodex/hypnos.svg?branch=master)](https://travis-ci.com/adventurerscodex/hypnos)
[![Coverage Status](https://coveralls.io/repos/github/adventurerscodex/hypnos/badge.svg)](https://coveralls.io/github/adventurerscodex/hypnos)

**This project is currently in development.**

*An API client and ORM for CoreAPI powered REST APIs.*

Hypnos is a light-weight ORM and API Client for Web apps. It provides a clean and concise way to interact with your API data **without any URLs or manual requests**. In a way, it is very similar to `Apollo` for GraphQL, but more inspired by projects like `Django ORM` and `SQLAlchemy`.

Finally, web apps can have a real model layer.


Overview
--------

Hypnos lets you feel like you're developing with a real database. Using the power of [CoreAPI][coreapi] things like URLs and request methods are a thing of the past. You define a CoreAPI compatible data model in your API (via something like Django-REST framework) and point Hypnos at your API schema and Hypnos will take care of the rest.


### Features

Besides making your code easier to understand, Hypnos also has some really cool features out of the box!

- **Built-in pagination support** for things like infinite scrolling.
- **Request caching** to prevent repeated, identical queries to your API.
- **Cache Dependency Tracking** so that when a record gets updated, Hypnos won't serve any cached data for its dependents.
- **Smart Requests**: Behind the scenes Hypnos will do the smart thing: if you tell Hypnos which fields to update, Hypnos will transform the request from `PUT` to `PATCH`.
- **Need custom behavior?** Hypnos allows you to query your API directly in case you still need to do something we don't support.


[coreapi]: http://www.coreapi.org


### Example

    // book.js

    import { Model } from 'hypnos';

    class Book extends Model {
        // The CoreAPI keys/path for this resource.
        __skeys__ = ['book'];

        // Properties from your API are mapped in dynamially so you only
        // need to specify your computed properties.
        // No need to repeat your data model!

        get summary() {
            const {title, type, author} = this;
            return `${title} is a thrilling new ${type} from ${author}`;
        }

        toggleFavorite() {
            this.favorite = !this.favorite;
        }
    }

    // service/component/view_controller.js

    import Hypnos from 'hypnos';

    Book.ps.retrieve({ id: '1234' }).then(response => {
         const book = response.object;
         // Update the local properties of the book object.
         book.title = 'My new favorite book';

         // Persist your changes back to the API.
         book.ps.save();

         // ...You can even refresh your local object from the API.
         book.ps.refresh();

         // ...Or delete it easily.
         book.ps.delete();
    });

    // OR use with async/await!
    const response = await Book.ps.retrieve({ id: '1234' });


Smart Caching
-------------

Hypnos is smart. If you specify which resources depend on each other, then Hypnos will automatically clear data from the cache when a record's dependencies are updated.

### Example

    /* book.js */

    class Book extends Model {
        __skeys__ = ['book'];
        __dependents__ = [Author];
        // ...
    }

    /* author.js */

    class Author extends Model {
        __skeys__ = ['book'];
        __dependents__ = [Book];
        // ...
    }

    /* service/component/view_controller.js */

    // Listing and retrieving records (by default) doesn't invalidate the cache.

    const { objects: books } = await Book.ps.list();        // From the network
    const { objects: authors } = await Author.ps.list();    // From the network
    const { objects: books } = await Book.ps.list();        // From the cache

    // But write operations do!

    const { object: book } = await Book.ps.update({         // Clear the Author and book cache!
        id: '1234',
        title: 'A new title!'
    });
    const { objects: books } = await Book.ps.list();        // From the network

    // Of course, you can always override these defaults
    const { objects: books } = await Book.ps.list(          // From the network
        // Query parameters
        { search: 'over the rainbow' },
        // Don't map the result to a Book instance just return raw data.
        true,
        // Don't use the cache.
        false,
        // Force clear the dependents' cache.
        true
    );


Configuring Hypnos
------------------

Hypnos must be configured before accessing the `.client` lazy property. Hypnos' configuration object takes 3 special parameters, each with their own formats, fed to Hypnos' dependencies.

- `credentials`: Is the credentials configuration for the API. This takes the format of the CoreAPI credentials object.
- `schema`: The CoreAPI schema document.
- `cacheConfig`: The cache configuration which should take the format found in the `node-cache` documentation.

**IMPORTANT:** Caching is disabled unless a `cacheConfig` is specified.


    Hypnos.configuration = {
        credentials: {
            scheme: 'Bearer',
            token: '--super-secret-token--',
        },
        schema: getSchema(),
        cacheConfig: {
            stdTTL: 120,
            checkperiod: 10
        }
    };

