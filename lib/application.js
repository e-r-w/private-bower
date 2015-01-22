var fs = require('fs');
var path = require('path');

module.exports = function Application(serverApp, staticHandler) {
    function _startPrivatePackageStore() {
        //TODO
    }
    
    function _startPublicPackageStore() {
        //TODO
    }
    
    function _startPublicRespositoryCache() {
        //TODO
    }
    
    function _listen(port) {
        serverApp.listen(port);
    }
    
    function _serveStatic(staticPath) {
        _addMiddleware(staticHandler(staticPath));
    }
    
    function _addMiddleware(middleware) {
        serverApp.use(middleware);
    }
    
    function _loadControllers(controllersRoot) {
        fs.readdirSync(controllersRoot).forEach(loadControllerAtByName);
        
        function loadControllerAtByName(controllerPath) {
            var controller = require(controllerPath);
            
            controller.bind(serverApp);
        }
    }
    
    return {
        listen: _listen,
        addMiddleware: _addMiddleware,
        loadControllers: _loadControllers,
        serveStatic: _serveStatic,
        
        startPrivatePackageStore: _startPrivatePackageStore,
        startPublicPackageStore: _startPublicPackageStore,
        startPublicRespositoryCache: _startPublicRespositoryCache
    };
};