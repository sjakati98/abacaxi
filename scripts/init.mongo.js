// Connect to the abacaxi database
db = new Mongo().getDB("abacaxi");

// Now, we insert some mock data.
db.videos.insert([
    {
        wikiPageId: 460187,
        sectionIdx: 0,
        created: new Date(),
        ytId: "zJz2V5HpdTM",
        title: "Software Development Career Paths: Starting Out",
        upvotes: 300,
        downvotes: 12
    },
    {
        wikiPageId: 460187,
        sectionIdx: 0,
        created: new Date(),
        ytId: "_9ZS6q4996g",
        title: "13 Types of Software Developers",
        upvotes: 123,
        downvotes: 21
    },
    {
        wikiPageId: 460187,
        sectionIdx: 0,
        created: new Date(),
        ytId: "29fkwiRCaEc",
        title: "Software Developer Job Types",
        upvotes: 3,
        downvotes: 0
    },
    {
        wikiPageId: 460187,
        sectionIdx: 0,
        created: new Date(),
        ytId: "3hcQKZ774QQ",
        title: "Career Paths for Computer Science Majors",
        upvotes: 6,
        downvotes: 2
    },
    {
        wikiPageId: 460187,
        sectionIdx: 1,
        created: new Date(),
        ytId: "m2N3tmJ_A0Q",
        title: "Freelancing As A Web Developer",
        upvotes: 120,
        downvotes: 8
    },
    {
        wikiPageId: 460187,
        sectionIdx: 1,
        created: new Date(),
        ytId: "xV2hHvef3Jw",
        title: "Advice for Getting Started in Web Design (Freelance vs. Full-Time Job)",
        upvotes: 60,
        downvotes: 18
    },
    {
        wikiPageId: 460187,
        sectionIdx: 1,
        created: new Date(),
        ytId: "10v84ZXDntA",
        title: "What Does A Web Developer Workday Look Like? | Q & A Session | #devsLife",
        upvotes: 51,
        downvotes: 17
    },
    {
        wikiPageId: 460187,
        sectionIdx: 1,
        created: new Date(),
        ytId: "jcojL6zsXk",
        title: "I Wanna Be a Web Designer · A Day In The Life Of A Web Designer",
        upvotes: 50,
        downvotes: 17
    },
    {
        wikiPageId: 460187,
        sectionIdx: 2,
        created: new Date(),
        ytId: "GEfuOMzRgXo",
        title: "Web development for beginners: What does a web developer do?",
        upvotes: 201,
        downvotes: 13
    },
    {
        wikiPageId: 460187,
        sectionIdx: 2,
        created: new Date(),
        ytId: "WbsnmNWpKy4",
        title: "What Does a Front End Developer Do? How Front End Coding vs. Back End",
        upvotes: 72,
        downvotes: 19
    },
    {
        wikiPageId: 460187,
        sectionIdx: 2,
        created: new Date(),
        ytId: "UtDpYVf9jKU",
        title: "What Is a Full Stack Developer & How To Become a Full Stack Developer in 1 Year",
        upvotes: 50,
        downvotes: 17
    },
    {
        wikiPageId: 460187,
        sectionIdx: 2,
        created: new Date(),
        ytId: "jcojLPkZNo7MFNFg6zsXk",
        title: "Learn JavaScript - Full Course for Beginners",
        upvotes: 400,
        downvotes: 6
    }
]);

db.videos.createIndex({ wikiPageId: 1});