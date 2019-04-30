db = new Mongo().getDB("abacaxi");

db.videos.remove({wikiPageId: 460187});