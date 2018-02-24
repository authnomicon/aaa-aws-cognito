/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('authnomicon-aaa-aws-cognito', function() {
  
  it('should export hello world', function() {
    expect(pkg.hello).to.equal('world');
  });
  
});
