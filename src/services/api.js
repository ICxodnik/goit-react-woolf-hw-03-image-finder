import axios from "axios";

const perPage = 40;
const imgFetcher = axios.create({
    baseURL: 'https://pixabay.com/api/',
    params: {
        key: "42411336-47edecd0595d1c6e33b2e7e0d",
        safesearch: true,
        orientation: "horizontal",
        image_type: "photo",
        per_page: perPage,
    }
});

export async function getItems(searchValue, page = 1) {
    const response = await imgFetcher.get('/', {
        params: {
            q: searchValue,
            page,
        }
    });

    const data = response.data.hits.map(element => {
        return {
            previewImageUrl: element.webformatURL,
            largeImageUrl: element.largeImageURL,
            altTags: element.tags,
            likeCount: element.likes,
            viewCount: element.views,
            commentsCount: element.comments,
            downloadCount: element.downloads,
        }
    });

    return {
        data,
        total: response.data.total,
        hasNextPage: (response.data.total - (page * perPage)) > 0
    };
}