// Connect to the issuetracker database. Note, if the issuetracker database
// does not exist, it will create it with this call.
db = new Mongo().getDB('abacaxi');

// Next, we remove everything inside it. This is helpful to ensure that the
// database starts from a known state.
db.videos.remove({});

// Now, we insert some mock data that mirrors the data that we have in the
// in-memory version of the `server.js` code.
db.videos.insert([
    {
        wikiPageId: 76894,
        sectionIdx: 3,
        created: new Date('2016-08-15'),
        ytId: 'Bxpu6tbFCsI',
        title: 'Emu War - OverSimplified (Mini-Wars #4)',
        upvotes: 3,
        downvotes: 0
    },
    {
        wikiPageId: 76894,
        sectionIdx: 0,
        created: new Date('2016-08-15'),
        ytId: 'yb2Y2rcgnCw',
        title: 'Emu in the House | Kangaroo Dundee',
        upvotes: 3,
        downvotes: 0
    },
    {
        wikiPageId: 76894,
        sectionIdx: 5,
        created: new Date('2016-08-15'),
        ytId: 'QOPZQHTNUs0',
        title: 'The Great Emu War',
        upvotes: 3,
        downvotes: 0
    }
]);

db.videos.createIndex({ wikiPageId: 1});