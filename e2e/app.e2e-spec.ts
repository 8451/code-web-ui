import { CodeWebUiPage } from './app.po';

describe('code-web-ui App', () => {
  let page: CodeWebUiPage;

  beforeEach(() => {
    page = new CodeWebUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
