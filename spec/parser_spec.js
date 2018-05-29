describe('Parser', () => {

  beforeEach(function () {
    this.module = require('../src/parser');
    this.instance = new this.module();
  });

  describe('with valid HTML', () => {

    beforeEach(function (done) {
      this.instance.parse('<a><b></b><c><d></d></c></a>').on('end', () => {
        done();
      });
    });

    it('has no issues', function () {
      expect(this.instance.issues.length).toBe(0);
    });
  });

  describe('with a missing closing tag', () => {

    beforeEach(function (done) {
      this.instance.parse('<a><b></a>').on('end', () => {
        done();
      });
    });

    it('finds two issues', function () {
      expect(this.instance.issues.length).toBe(2);
      expect(this.instance.issues[0].type).toEqual('mismatch_close_tag');
      expect(this.instance.issues[1].type).toEqual('unclosed_tag');
    });
  });

  describe('with wrongly placed closing tags', () => {

    beforeEach(function (done) {
      this.instance.parse('<a><b></a></b>').on('end', () => {
        done();
      });
    });

    it('finds two issues', function () {
      expect(this.instance.issues.length).toBe(2);
      expect(this.instance.issues[0].type).toEqual('mismatch_close_tag');
      expect(this.instance.issues[1].type).toEqual('unclosed_tag');
    });
  });

  describe('with inconsistent closing tags', () => {

    beforeEach(function (done) {
      this.instance.parse('<a><b><c></d></a>').on('end', () => {
        done();
      });
    });

    it('finds three issues', function () {
      expect(this.instance.issues.length).toBe(3);
      expect(this.instance.issues[0].type).toEqual('mismatch_close_tag');
      expect(this.instance.issues[1].type).toEqual('mismatch_close_tag');
      expect(this.instance.issues[2].type).toEqual('unclosed_tag');
    });
  });

  describe('with self closing tags', () => {

    beforeEach(function (done) {
      this.instance.parse('<a><b /></a>').on('end', () => {
        done();
      });
    });

    it('has no issues', function () {
      expect(this.instance.issues.length).toBe(0);
    });
  });

  describe('with void tags', () => {

    describe('that have a closing tags', () => {

      beforeEach(function (done) {
        this.instance.parse('<input></input>').on('end', () => {
          done();
        });
      });

      it('finds one issue', function () {
        expect(this.instance.issues.length).toBe(1);
        expect(this.instance.issues[0].type).toEqual('void_close_tag');
      });
    });

    describe('that are self closing', () => {

      beforeEach(function (done) {
        this.instance.parse('<input />').on('end', () => {
          done();
        });
      });

      it('has no issues', function () {
        expect(this.instance.issues.length).toBe(0);
      });
    });

    describe('that are not self closing', () => {

      beforeEach(function (done) {
        this.instance.parse('<input>').on('end', () => {
          done();
        });
      });

      it('has no issues', function () {
        expect(this.instance.issues.length).toBe(0);
      });
    });
  });
});
