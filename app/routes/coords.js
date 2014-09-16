exports.addCoords = function(req, res) {
  var coords = req.body;
  console.log("Coords Body: ");
  console.log(coords);
  db.collection('coords', function(err, collection) {
    collection.insert(coords, {safe:true}, function(err, result) {
      if(err) {
        res.send({'error':'An error during posting coords has occured'});
      } else { 
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);
      }
    });
  });
}

exports.updateCoords = function(req, res) {
  var id = req.params.id;
  var coords = req.body;
  conosle.log('Updating coords: ' + id);
  console.log(JSON.stringify(coords));
  db.collection('coords', function(err, collection) {
    collection.update({'_id':new BSON.ObjectID(id)}, coords, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating coords: ' + err);
        res.send({'error':'An error has occured'});
      } else { 
        console.log('' + result + ' coords(s) updated');
        res.send(coords);
      }
    });
  });
}
