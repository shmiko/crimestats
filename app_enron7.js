
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/test7', function(err, db) {
    if(err) throw err;
      //use photoshare

      db.albums.ensureIndex({'images':1});
      var cur = db.images.find();

      var j = 0;
      while(cur.hasNext()){
        doc = cur.next();
        image_id = doc._id

        b = db.albums.find({images : image_id}).count()
        if(b == 0){
          db.images.remove({_id:image_id})
          j++;
        }
      }
   
});