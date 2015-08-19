angular.module('jamApp', [
  'jamApp.services',
  'ui.router',
  'ngAutocomplete'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('artists', {
      url: "/artists",
      templateUrl: "app/artists/artists.html"

    })
    .state('artists.artist', {
      url: '/artist',
      templateUrl: 'app/artist/artist.html',
      // controller: function($stateParams){
      //   console.log('in stateProvider')
      // }
    })
})

.controller('JamController', function ($scope, $location, $state, CityInfo) {
  $scope.options = ['establishment', '(cities)'];
  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.submit = function() {
    if($scope.text) {
      city = $scope.text;
      CityInfo.getCityId(city)
      .then(function(res){
        //console.log(res.data.resultsPage)
        var cityId = res.data.resultsPage.results.location[0].metroArea.id
        console.log(cityId)
        $scope.cityId.city = cityId
        return $scope.listCityEvents(cityId)

      })
      $scope.text = '';
      $state.go('artists')
    }
  };
  $scope.listCityEvents = function(cityId) {
    if(cityId){
      CityInfo.getCityEvents(cityId)
      .then(function(res){
        console.log(res)
        var events = res.data.resultsPage.results.event
        for(var i = 0; i < events.length; i++){
          var artist = events[i].performance[0].artist.displayName
          $scope.eventsList.push({
            artistName: artist,
            artistId: events[i].performance[0].artist.id,
            eventDateTime: {date: events[i].start.date,
            time: events[i].start.time},
            venue: events[i].venue.displayName,
            venueId: events[i].venue.id
          })
        }
        console.log($scope.eventsList)
      })
    }
  }
  $scope.artistDeets = function(artistClicked){
    // console.log($events)
    $scope.artistClicked = artistClicked
    console.log('in ArtistDeets', artistClicked)
    $state.go('artists.artist')
  }
  $scope.spotify = function(){
    $
  }
});

