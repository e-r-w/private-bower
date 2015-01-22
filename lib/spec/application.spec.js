var mockery = require('mockery');

describe('Application', function() {
    var fs;
    var mockServerApp;
    var staticHandlerMock, staticHandlerMiddleware;
    var application;
    var testModule1, testModule2;
    
    beforeEach(function() {
        testModule1 = {
            bind: jasmine.createSpy('mock1.bind()')
        };
        
        testModule1Cons = jasmine.createSpy('testModule1').and.returnValue(testModule1);
        
        testModule2 = {
            bind: jasmine.createSpy('mock2.bind()')
        };
        
        testModule2Cons = jasmine.createSpy('testModule2').and.returnValue(testModule2);
        
        
        fs = {
            readdirSync: jasmine.createSpy('fs.readdirSync()').and.returnValue([
                'testModules/mock1',
                'testModules/mock2'
            ])
        };
        
        mockery.registerMock('fs', fs);
        mockery.registerMock('testModules/mock1', testModule1Cons);
        mockery.registerMock('testModules/mock2', testModule2Cons);
        
        mockery.enable({ useCleanCache: true });

        var Application = require('../application.js');
        mockServerApp = {
            use: jasmine.createSpy('serverApp.use()'),
            listen: jasmine.createSpy('serverApp.listen()')
        };
        
        staticHandlerMiddleware = function() {};
        staticHandlerMock = jasmine.createSpy('express.static()').and.returnValue(staticHandlerMiddleware);
        
        application = new Application(mockServerApp, staticHandlerMock);
    });
    
    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });
    
    it('should have these properties', function() {
        expect(application.loadControllers).toBeFunction();
        expect(application.listen).toBeFunction();
        expect(application.addMiddleware).toBeFunction();
        expect(application.serveStatic).toBeFunction();
        expect(application.startPrivatePackageStore).toBeFunction();
        expect(application.startPublicPackageStore).toBeFunction();
        expect(application.startPublicRespositoryCache).toBeFunction();
    });
    
    describe('loadControllers(controllersRoot)', function() {
        beforeEach(function() {
            application.loadControllers('testModules');
        });
        
        it('should initiate all controllers', function() {
            expect(testModule1Cons).toHaveBeenCalled();
            expect(testModule2Cons).toHaveBeenCalled();
        });
        
        it('should bind all controllers', function() {
            expect(testModule1.bind).toHaveBeenCalledWith(mockServerApp);
            expect(testModule2.bind).toHaveBeenCalledWith(mockServerApp);
        });
    });
    
    describe('addMiddleware()', function() {
        it('should call serverApp use', function() {
            var middleware = function() {};
            
            application.addMiddleware(middleware);
            
            expect(mockServerApp.use).toHaveBeenCalledWith(middleware);
        });
    });
    
    describe('listen()', function() {
        it('should call serverApp listen', function() {
            var port = 1234;
        
            application.listen(port);
            
            expect(mockServerApp.listen).toHaveBeenCalledWith(port);
        });
    });
    
    describe('serveStatic()', function() {
        it('should call serverApp static with the given path', function() {
            var path = 'fakePath';
            
            application.serveStatic(path);
            
            expect(staticHandlerMock).toHaveBeenCalledWith(path);
        });
        
        it('should register the middleware', function() {
            application.serveStatic('fakePath');
            
            expect(mockServerApp.use).toHaveBeenCalledWith(staticHandlerMiddleware);
        });
    });
    
    describe('startPrivatePackageStore()', function() {
        //TODO
    });
    
    describe('startPublicPackageStore()', function() {
        //TODO
    });
    
    describe('startPublicRespositoryCache', function() {
        //TODO
    });
});