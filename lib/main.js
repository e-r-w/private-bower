var Express = require('express');
var argv = require('optimist').argv;
var path = require('path');
var bodyParser = require('body-parser');

var utils = require('./utils.js');
var Application = require('./application.js');
var configurationManager = require('./configurationManager.js');

module.exports = function Main() {
    var _application;
    
    function _start() {
        var serverApp = Express();
        
        var defaultConfigPath = path.join(utils.dirname, '../bower.conf.json');
        configurationManager.loadConfiguration(argv.config || defaultConfigPath);
        
        var config = configurationManager.config;
        
        _application = new Application(serverApp, Express.static);
        
        initializePackageStores();
        initializeService();
        
        function initializePackageStores() {
            _application.startPrivatePackageStore();
            
            if(!config.disablePublic) {
                initializePublic();
            }
            
            function initializePublic() {
                _application.startPublicPackageStore();
                
                if(config.repositoryCache) {
                    _application.startPublicRespositoryCache();
                }
            }
        }
        
        function initializeService() {
            _application.addMiddleware(bodyParser());
            _application.serveStatic(path.join(utils.dirname, '../site'));
            
            _application.loadControllers('controllers');
            _application.listen(config.port);
        }
    }
    
    return {
        start: _start
    };
};