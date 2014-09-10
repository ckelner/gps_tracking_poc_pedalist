exports.index = function(req, res){
  res.render(
    'index',
    {
      title: 'SPSU Fall Game Jam 2014'
    }
  );
};

/*exports.fullscreenmap = function(req, res){
  res.render(
    'fullscreenmap',
    {
      title: '#Weather Full Screen Map'
    }
  );
};

exports.rank = function(req, res){
  res.render(
    'rank',
    {
      title: '#Weather Rankings'
    }
  );
};
*/
