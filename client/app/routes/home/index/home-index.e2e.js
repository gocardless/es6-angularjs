describe('home index', function() {
  it('has heading', function() {
    browser.get('/');
    expect(element(by.css('h2')).getText()).toEqual('Example');
  });
});
