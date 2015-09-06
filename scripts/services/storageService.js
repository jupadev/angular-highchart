'use strict';

angular.module('demoApp.serices.common', [])
  .service('storageService', function($window) {
    var jsStorage = {
      store: {},
      setItem: function(key, data) {
        this.store[key] = data;
      },
      getItem: function(key) {
        return angular.isUndefined(this.store[key]) ? null : this.store[key];
      },
      removeItem: function(key) {
        this.store[key] = undefined;
      }
    };

    var storage = isLocalStorageEnabled() ?
      $window.localStorage :
      (isSessionStorageEnabled() ?
        $window.sessionStorage : jsStorage);

    function isLocalStorageEnabled() {
      return isStorageEnabled('localStorage');
    }

    function isSessionStorageEnabled() {
      return isStorageEnabled('sessionStorage');
    }

    function isStorageEnabled(storageKey) {
      try {
        $window[storageKey].setItem('__testKey', 'item');
        $window[storageKey].removeItem('__testKey');
        return true;
      } catch (e) {
        return false;
      }
    }

    function getData(key) {
      var storageItem = storage.getItem(key);
      try {
        storageItem = JSON.parse(storageItem);
      } catch (e) {}
      return storageItem;
    }

    function setData(key, data) {
      storage.setItem(key,
        typeof data === 'object' ? JSON.stringify(data) : data);
    }

    function removeData(key) {
      storage.removeItem(key);
    }

    return {

      getData: getData,

      setData: setData,

      removeData: removeData,
    };

  });