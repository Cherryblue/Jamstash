'use strict';
/**
* jamstash.persistence Module
*
* Provides load, save and delete operations for the current song and queue.
* Data storage provided by HTML5 localStorage.
*/
angular.module('jamstash.persistence', ['angular-locker',
    'jamstash.settings.service', 'jamstash.player.service', 'jamstash.notifications', 'jamstash.utils'])

.config(['lockerProvider', function (lockerProvider) {
    lockerProvider.setDefaultDriver('local')
        .setDefaultNamespace(false)
        .setEventsEnabled(false);
}])

.service('persistence', ['globals', 'player', 'notifications', 'locker', 'jamstashVersion', 'jamstashVersionChangesets', 'utils',
    function (globals, player, notifications, locker, jamstashVersion, jamstashVersionChangesets, utils) {
    /* Manage current track */
    this.loadTrackPosition = function () {
        // Load Saved Song
        var song = locker.get('CurrentSong');
        if (song) {
            player.load(song);
        }
        if (globals.settings.Debug) { console.log('Current Position Loaded from localStorage: ', song); }
    };

    this.saveTrackPosition = function (song) {
        locker.put('CurrentSong', song);
        if (globals.settings.Debug) { console.log('Saving Current Position: ', song); }
    };

    this.deleteTrackPosition = function () {
        locker.forget('CurrentSong');
        if (globals.settings.Debug) { console.log('Removing Current Position from localStorage'); }
    };

    /* Manage playing queue */
    this.loadQueue = function () {
        // load Saved queue
        var queue = locker.get('CurrentQueue');
        if (queue) {
            player.addSongs(queue);
            if (player.queue.length > 0) {
                notifications.updateMessage(player.queue.length + ' Saved Song(s)', true);
            }
            if (globals.settings.Debug) { console.log('Play Queue Loaded from localStorage: ' + player.queue.length + ' song(s)'); }
        }
    };

    this.saveQueue = function () {
        locker.put('CurrentQueue', player.queue);
        if (globals.settings.Debug) { console.log('Saving Queue: ' + player.queue.length + ' songs'); }
    };

    this.deleteQueue = function () {
        locker.forget('CurrentQueue');
        if (globals.settings.Debug) { console.log('Removing Play Queue from localStorage'); }
    };

    /* Manage player volume */
    this.getVolume = function () {
        return locker.get('Volume');
    };

    this.saveVolume = function (volume) {
        locker.put('Volume', volume);
    };

    this.deleteVolume = function () {
        locker.forget('Volume');
    };

    /* Manage user settings */
    this.getSettings = function () {
        if(utils.checkVersionNewer(jamstashVersion, this.getVersion())) {
            this.upgradeToVersion(jamstashVersion);
        }
        return locker.get('Settings');
    };

    this.saveSettings = function (settings) {
        locker.put('Settings', settings);
    };

    this.deleteSettings = function () {
        locker.forget('Settings');
    };

    /* Manage Jamstash Version */
    this.getVersion = function () {
        return locker.get('JamstashVersion');
    };

    this.upgradeToVersion = function (finalVersion) {
        var currentVersion = this.getVersion();
        var settings = locker.get('Settings');
        // Apply all upgrades older than the final version and newer than the current
        var allUpgrades = _(jamstashVersionChangesets.versions).filter(function (toApply) {
            var olderOrEqualToFinal = utils.checkVersion(finalVersion, toApply.version);
            var newerThanCurrent = utils.checkVersionNewer(toApply.version, currentVersion);
            return olderOrEqualToFinal && newerThanCurrent;
        });
        _(allUpgrades).each(function (versionUpg) {
            versionUpg.changeset(settings);
        });
        this.saveSettings(settings);
        locker.put('JamstashVersion', finalVersion);
        notifications.updateMessage('Version ' + currentVersion + ' to ' + finalVersion, true);
    };
}])

.value('jamstashVersionChangesets', {
    versions: [
        {
            version: '4.4.5',
            changeset: function (settings) {
                settings.DefaultSearchType = 0;
            }
        }
    ]
});

