/* global describe, it, expect */

var expect = require('chai').expect;
var factory = require('../../../app/authentication/password/verifier');


describe('authentication/password/verifier', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schemas.authnomicon.org/js/ds/authentication/password/VerifierProvider');
    expect(factory['@singleton']).to.equal(undefined);
    
    expect(factory['@name']).to.equal('amazon-cognito');
  });
  
});
