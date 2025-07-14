function fetchWithUserAgent(url) {
    return fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });
}

async function popularNovels(page) {
    const url = `https://www.realmnovel.com/novels?page=${page}`;
    const res = await fetchWithUserAgent(url);
    const html = await res.text();
    const loadedCheerio = cheerio.load(html);

    const novels = [];

    loadedCheerio('div.book-item').each((_, element) => {
        const name = loadedCheerio(element).find('h3.book-title').text().trim();
        const cover = loadedCheerio(element).find('img').attr('src');
        const url = loadedCheerio(element).find('a').attr('href');

        novels.push({
            name,
            cover,
            url: 'https://www.realmnovel.com' + url,
        });
    });

    return novels;
}

async function parseNovelAndChapters(novelUrl) {
    const res = await fetchWithUserAgent(novelUrl);
    const html = await res.text();
    const loadedCheerio = cheerio.load(html);

    const novel = {
        url: novelUrl,
        name: loadedCheerio('h1.novel-title').text().trim(),
        cover: loadedCheerio('div.novel-cover img').attr('src'),
        summary: loadedCheerio('div.novel-summary').text().trim(),
        chapters: [],
    };

    loadedCheerio('ul.chapter-list li a').each((_, el) => {
        const chapterName = loadedCheerio(el).text().trim();
        const chapterUrl = loadedCheerio(el).attr('href');

        novel.chapters.push({
            name: chapterName,
            url: 'https://www.realmnovel.com' + chapterUrl,
            releaseTime: null,
        });
    });

    novel.chapters.reverse(); // ترتيب تصاعدي

    return novel;
}

async function parseChapter(chapterUrl) {
    const res = await fetchWithUserAgent(chapterUrl);
    const html = await res.text();
    const loadedCheerio = cheerio.load(html);

    const content = loadedCheerio('div.chapter-content').html();

    return {
        content,
    };
}

async function searchNovels(searchTerm) {
    const url = `https://www.realmnovel.com/search?keyword=${searchTerm}`;
    const res = await fetchWithUserAgent(url);
    const html = await res.text();
    const loadedCheerio = cheerio.load(html);

    const novels = [];

    loadedCheerio('div.book-item').each((_, element) => {
        const name = loadedCheerio(element).find('h3.book-title').text().trim();
        const cover = loadedCheerio(element).find('img').attr('src');
        const url = loadedCheerio(element).find('a').attr('href');

        novels.push({
            name,
            cover,
            url: 'https://www.realmnovel.com' + url,
        });
    });

    return novels;
}

const realmnovel = {
    id: 'realmnovel',
    name: 'RealmNovel',
    site: 'https://www.realmnovel.com',
    version: '1.0.0',
    popularNovels,
    parseNovelAndChapters,
    parseChapter,
    searchNovels,
};

export default realmnovel;
   
