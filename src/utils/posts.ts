import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Category = 'tech' | 'talk';

/** 글 분류. 헤더 탭과 목록 페이지(/tech/, /talk/)가 이 순서를 따릅니다. */
export const CATEGORIES: Record<Category, { label: string }> = {
  tech: { label: '기술글' },
  talk: { label: '잡담' },
};

/** 태그에 '기술'이 있으면 기술글, 나머지는 전부 잡담 */
export function categoryOf(post: Post): Category {
  return post.data.tags.includes('기술') ? 'tech' : 'talk';
}

/** 초안 제외 + 최신순 정렬. category를 주면 해당 분류만 돌려줍니다. */
export async function getPosts(category?: Category): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts
    .filter((post) => !category || categoryOf(post) === category)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
