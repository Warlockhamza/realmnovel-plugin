import { Plugin } from '@plugin';

export default new Plugin({
  id: 'realmnovel',
  name: 'RealmNovel',
  site: 'https://www.realmnovel.com',
  type: 'novel',
  language: 'en',

  async popularNovels(page) {
    const url = `https://www.realmnovel.com/latest-release?page=${page}`;
    const body = await this.request(url);
    const loaded = this.cheerio.load(body);

    const novels = [];

    loaded('.book-img-text').each((i, el) => {
      const name = loaded(el).find('.book-name').text().trim();
      const cover = loaded(el).find('img').attr('src');
      const link = loaded(el).find('a').attr('href');

      novels.push({
        name,
        cover,
        path: link,
      });
    });

    return novels;
  },

  async parseNovelAndChapters(novelUrl) {
    const body = await this.request(novelUrl);
    const loaded = this.cheerio.load(body);

    const name = loaded('h1').text().trim();
    const cover = loaded('.book-cover img').attr('src');
    const summary = loaded('.book-desc').text().trim();

    const chapters = [];

    loaded('.chapter-list a').each((i, el) => {
      chapters.push({
        name: loaded(el).text().trim(),
        path: loaded(el).attr('href'),
      });
    });

    return {
      name,
      cover,
      summary,
      chapters,
    };
  },

  async parseChapter(chapterUrl) {
    const body = await this.request(chapterUrl);
    const loaded = this.cheerio.load(body);

    const content = loaded('.chapter-content').html();

    return {
      content,
    };
  },

  async searchNovels(searchTerm) {
    const url = `https://www.realmnovel.com/search?keyword=${searchTerm}`;
    const body = await this.request(url);
    const loaded = this.cheerio.load(body);

    const results = [];

    loaded('.book-img-text').each((i, el) => {
      const name = loaded(el).find('.book-name').text().trim();
      const cover = loaded(el).find('img').attr('src');
      const link = loaded(el).find('a').attr('href');

      results.push({
        name,
        cover,
        path: link,
      });
    });

    return results;
  },
});
