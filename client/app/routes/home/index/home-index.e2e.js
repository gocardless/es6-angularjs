describe('Home page', function() {
  it('renders', function() {
    browser.get('/');
    browser.pause();
    expect(element(by.css('h2')).getText()).toEqual('Example');
  });
});
