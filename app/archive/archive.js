/**
* jamstash.archive.controller Module
*
* Access Archive.org
*/
angular.module('jamstash.archive.controller', ['jamstash.archive.service', 'jamstash.selectedsongs'])

.controller('ArchiveController', ['$scope', '$rootScope', '$location', '$routeParams', '$http', '$timeout', 'utils', 'globals', 'model', 'notifications', 'player', 'archive', 'json', 'SelectedSongs',
    function($scope, $rootScope, $location, $routeParams, $http, $timeout, utils, globals, model, notifications, player, archive, json, SelectedSongs){
    'use strict';

    $scope.settings = globals.settings;
    $scope.itemType = 'archive';
    $rootScope.song = [];
    $scope.Protocol = 'jsonp';
    $scope.artist = [];
    $scope.album = [];
    $scope.selectedArtist = null;
    $scope.selectedAlbum = null;
    $scope.selectedSongs = [];
    $scope.SavedCollections = globals.SavedCollections;
    $scope.AllArtists = [];
    $scope.loadedCollection = false;
    /*
    $scope.getCollections = function (query) {
        json.getCollections(query).then(function (data) {
            $scope.AllCollections = data;
            $scope.loadedCollection = true;
        });
    };
    $scope.selectedCollection = globals.DefaultCollection;
    $scope.$watch("selectedCollection", function (newValue, oldValue) {
        if (newValue !== oldValue) {
            utils.setValue('DefaultCollection', newValue, false);
            globals.DefaultCollection = newValue;
        }
    });
    */
    $scope.writeSavedCollection = function () {
        utils.setValue('SavedCollections', $scope.SavedCollections.join(), false);
        globals.SavedCollections = $scope.SavedCollections;
    };
    $scope.addSavedCollection = function (newValue) {
        if ($scope.SavedCollections.indexOf(newValue) == -1) {
            $scope.SavedCollections.push(newValue);
            $scope.writeSavedCollection();
            var index = $scope.AllArtists.indexOf(newValue);
            $scope.AllArtists.splice(index, 1);
        }
    };
    $scope.deleteSavedCollection = function (index) {
        $scope.SavedCollections.splice(index, 1);
        $scope.writeSavedCollection();
    };
    $scope.setupDemoCollections = function () {
        var demo = ["YonderMountainStringBand", "GreenskyBluegrass"];
        angular.forEach(demo, function (item, key) {
            if ($scope.SavedCollections.indexOf(item) == -1) {
                $scope.SavedCollections.push(item);
            }
        });
    };

    /* Filter */
    $scope.selectedArchiveAlbumSort = globals.settings.DefaultArchiveAlbumSort;
    $scope.ArchiveAlbumSort = [
        'addeddate desc',
        'addeddate asc',
        'avg_rating desc',
        'avg_rating asc',
        'createdate desc',
        'createdate asc',
        'date desc',
        'date asc',
        'downloads desc',
        'downloads asc',
        'num_reviews desc',
        'num_reviews asc',
        'publicdate desc',
        'publicdate asc',
        'stars desc',
        'stars asc'
    ];
    $scope.$watch("selectedArchiveAlbumSort", function (newValue, oldValue) {
        if (utils.getValue('AlbumSort') != newValue) {
            if (typeof newValue != 'undefined') {
                utils.setValue('AlbumSort', newValue, true);
                globals.settings.DefaultArchiveAlbumSort = newValue;
            } else {
                utils.setValue('AlbumSort', null, true);
            }
            $scope.getAlbums($scope.selectedArtist);
        }
    });
    $scope.getYears = function (startYear) {
        var currentYear = new Date().getFullYear(), years = [];
        startYear = startYear || 1950;
        while (startYear <= currentYear) {
            years.push(startYear++);
        }
        return years;
    };
    $scope.Years = $scope.getYears();
    $scope.filter = {
        Year: "",
        Source: "",
        Description: ""
    };
    $scope.filterSave = function () {
        if ($scope.selectedArtist) {
            $scope.getAlbums($scope.selectedArtist, $scope.filter);
        }
    };
    /* End Filter */

    $scope.getArtists = function (all) {
        var query = $('#Artists').val();
        var collection = $('#Collections option:selected').text();
        if (all || query.length >= 3) {
            archive.getArtists(query, collection).then(function (data) {
                $scope.AllArtists = data.artist;
                $scope.loadedCollection = true;
            });
        }
    };
    $scope.getAlbums = function (name) {
        archive.getAlbums(name, $scope.filter).then(function (data) {
            $scope.song = data.song;
            $scope.album = data.album;
            $scope.selectedArtist = data.selectedArtist;
            $scope.BreadCrumbs = data.breadcrumb;
			$scope.navigateRight();
        });
    };
    $scope.getSongs = function (id, action) {
        archive.getSongs(id, action).then(function (data) {
            $scope.album = data.album;
            $scope.song = data.song;
            $scope.selectedAlbum = data.selectedAlbum;
            $scope.BreadCrumbs = data.breadcrumb;
            //$rootScope.showSongs();
            //alert($("#songs").html())
            //utils.safeApply();
            $timeout(
                function () {
                    $.fancybox.update();
                }
            );
        });
    };
    $scope.scrollToTop = function () {
        $('#Artists').stop().scrollTo('#auto', 400);
    };

    $scope.selectAll = function () {
        SelectedSongs.addSongs($scope.song);
    };

    $scope.addSelectedSongsToQueue = function () {
        if (SelectedSongs.get().length === 0) {
            return;
        }
        player.addSongs(SelectedSongs.get());
        notifications.updateMessage(SelectedSongs.get().length + ' Song(s) Added to Queue', true);
        SelectedSongs.reset();
    };

    $scope.toggleSelection = function (song) {
        SelectedSongs.toggle(song);
    };

    $scope.selectNone = function () {
        SelectedSongs.reset();
    };

    $scope.playAll = function () {
        player.emptyQueue()
            .addSongs($scope.song)
            .playFirstSong();
    };

    $scope.playFrom = function (index) {
        var songsToPlay = $scope.song.slice(index, $scope.song.length);
        player.emptyQueue()
            .addSongs(songsToPlay)
            .playFirstSong();
    };

    $scope.addSongToQueue = function (song) {
        player.addSong(song);
    };

    $scope.playSong = function (song) {
        player.emptyQueue()
            .addSong(song)
            .playFirstSong();
    };
	
	$scope.navigateRight = function(){
		var browsingSection = document.getElementById('browsingSection');
		browsingSection.children[1].scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
	};
	
	$scope.navigateLeft = function(){
		var browsingSection = document.getElementById('browsingSection');
		browsingSection.children[0].scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
	};

    // Hyz: Replace
    $scope.removeSong = function (item) {
        $rootScope.removeSong(item, $scope.song);
    };

    $scope.toggleStar = function (item) {
        //Do nothing: we aren't logged in archive.org, so we can't star anything there.
    };

    /* Launch on Startup */
    //$scope.getArtists();
    $scope.getAlbums();
    if ($routeParams.artist) {
        if ($routeParams.album) {
            //collection:(GreenskyBluegrass) AND format:(MP3) AND identifier:(gsbg2013-09-20.flac16)
            $scope.getSongs($routeParams.album);
        } else {
            $scope.getAlbums($routeParams.artist);
        }
        $scope.addSavedCollection($routeParams.artist);
    }
    /* End Startup */
}]);
