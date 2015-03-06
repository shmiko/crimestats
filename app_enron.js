var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
// Connection URL
var url = 'mongodb://127.0.0.1:27017/uscrimestats';
//var mdb =  'mongodb://mms-calmapit:waxnepke14@mms-0.calmapit.2634.mongodbdns.com:27017/crimestats';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {

  //assert.equal(null, err);
  console.log("Connected correctly to server");
  var messages = db.collection('messages');
  

  //Question: What day did most crimes occur in chicago from September 2001 to present?
  /*crimes.mapReduce(function(){
    
  var milis = Date.parse(this.Date);
  var date = new Date(milis);
    var daysOfWeek = ["Sunday"
                      , "Monday"
                      , "Tuesday"
                      , "Wednesday"
                      , "Thursday"
                      , "Friday"
                      , "Saturday"
                      ];
    emit(daysOfWeek[date.getDay()], 1);
  },
  function(key, values){
    return Array.sum(values);
  },
  {
    out: "crime_day_frequencies"
  },
  function(err, results, stats){

    if(err){
      return console.error(err);
    }

    var outCollection = db.collection('crime_day_frequencies');

      outCollection.find().toArray(function(err, docs){
        if(err){
          return console.error(err);
        }

        console.log('Number of crimes based on each day of the week');

        for(var i in docs){
          console.log(docs[i]);
        }
        return;
      });
  });
  */

  //question what time of day do most crimes occur?
  /*crimes.mapReduce(function(){
    
    var milis = Date.parse(this.Date);
    var date = new Date(milis);
    //break any given day up into 8 segmets of 3 hours
      var timesOfDay = ["12:01AM-3AM"
                        , "3:01AM - 6:00AM"
                        , "6:01AM - 9:00AM"
                        , "9:01AM - 12:00PM"
                        , "12:01PM - 3:00PM"
                        , "3:01PM - 6:00PM"
                        , "6:01PM - 9:00PM"
                        , "9:01PM - 12:00AM"
                        ];
      
      var hours = date.getHours();
      //compute which one of the 8 segmetns of the day this falls into
      var timeOfDay = Math.ceil(hours /3);
      //get the name of the part of day
      var timeOfDayName = timesOfDay[timeOfDay];
      //assign the value 1, to increment the number of crimes that happen this time of day
      emit(timeOfDayName, 1);
    },
    function(key, values){
      //reduce by summing all values mapped
      return Array.sum(values);
    },
    {
      out: "crime_time_frequencies"
    },
    function(err, results, stats){
      console.log('completed!');
      if(err){
        return console.error(err);
      }

      var outCollection = db.collection('crime_time_frequencies');

      outCollection.find({}).toArray(function(err, docs){
        if(err){
          return console.error(err);
        }

        console.log('Number of crimes based on 3 hour time window during day');

        for(var i in docs){
          console.log(docs[i]);
        }

        return;
      });

      return;

    }
  );
  */

  //Question: what is the most common types of crimes commit in chicago since 2001?
  //#1db.messages.aggregate({$match: {'headers.From':"andrew.fastow@enron.com"}}, {$unwind:'$headers.To'}, {$match: {'headers.To':'jeff.skilling@enron.com'}}, {$group: {'_id': null, total_emails_sent:{"$sum":1}}}, {$project: {_id:0, total_emails_sent:1}}) , function(err, docs){
  messages.aggregate({$unwind: '$headers.To'}, 
                        {$group: {_id : '$_id', From : {$first: '$headers.From'}, To: {$addToSet : '$headers.To'}}}, 
                        {$unwind: '$To'}, 
                        {$group: {_id: { From:'$From', To:'$To' }, total : {$sum : 1}}}, {$sort: { total: -1}}, {$limit: 1}, 
                        {$project: {_id:0, From: '$_id.From', To : '$_id.To', Total: '$total'}}
                  , function(err, docs){
 
                  if(err){
                    return console.error(err);
                  }

                  console.log('Crime data by type');
                  for(var i in docs){
                    console.log(docs[i]);
                  }
                });

});