/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../app/plugins/directory');


describe('plugins/directory', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/aaa/DirectoryPlugIn');
    expect(factory['@singleton']).to.equal(undefined);
    
    expect(factory['@name']).to.equal('amazon-cognito');
  });
  
});
