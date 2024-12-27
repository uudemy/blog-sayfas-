// Blog Projesi TypeScript Giriş Noktası

interface BlogPost {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
}

class BlogManager {
    private posts: BlogPost[] = [];

    addPost(post: BlogPost): void {
        this.posts.push(post);
    }

    getAllPosts(): BlogPost[] {
        return this.posts;
    }
}

const blogManager = new BlogManager();

blogManager.addPost({
    id: 1,
    title: "TypeScript ile Blog Projesi",
    content: "Merhaba, bu ilk blog yazımız!",
    createdAt: new Date()
});

console.log(blogManager.getAllPosts());
