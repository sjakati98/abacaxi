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
        wikiPageId: 14293,
        sectionIdx: 1,
        created: new Date('2016-08-16'),
        ytId: '9ObfHixqb5M',
        title: 'Pilgrimage to Spruce Island | INDIE ALASKA',
        upvotes: 2,
        downvotes: 1
    },
]);

db.videos.createIndex({ wikiPageId: 1});

//TODO: Example Page Initialization Script