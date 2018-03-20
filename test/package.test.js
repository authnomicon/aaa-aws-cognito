/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/aws-cognito', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('opt/aws/cognito');
      
      expect(json.assembly.components).to.have.length(2);
      expect(json.assembly.components).to.include('authentication/password/verifier');
      expect(json.assembly.components).to.include('directory');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
