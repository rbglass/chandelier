"use strict";

var assert = require("assert");

suite('Array', function(){

  suite('#indexOf()', function(){
    test('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });

});
