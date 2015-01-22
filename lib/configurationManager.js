var fs = require('fs');
var path = require('path');
var log4js = require('log4js');
var utils = require('./utils.js');

var logger = require('./logger.js');

module.exports = function ConfigurationManager() {
    var self = {
        config: {
            port: 5678,
            timeout: 2 * 60 * 1200
        },
        loadConfiguration: _loadConfiguration
    };
    
    function _loadConfiguration(configPath) {
        if(!fs.existsSync(configPath)) {
            logger.error('config file not found at ' + configPath);
        }
    
        var configDirectory = path.join(configPath, '../');
    
        var json = fs.readFileSync(configPath).toString();
        var configFile = JSON.parse(json);
        
        utils.extend(self.config, configFile);
    
        setConfigValues();
        
        configureLog4Js();
        
        function setConfigValues() {
            self.config.registryFile = path.resolve(configFile.registryFile || path.join(configDirectory, './bowerRepository.json'));
        }
        
        function configureLog4Js() {
            if(self.config.log4js && self.config.log4js.enabled)  {
                log4js.configure(self.config.log4js.configPath);
            }
        }
    }
    
    return self;
}();