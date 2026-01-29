import { latestNews, trendingNews } from "@/lib/placeholder";
import Image from "next/image";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const allNews = [...trendingNews, ...latestNews];
    const news = allNews.find(p => p.href === `/blog/${params.slug}`);

    if (!news) {
        return <div className="text-center text-red-500">Blog post not found</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="relative h-[500px]">
                <Image src={news.image} alt={news.title} layout="fill" objectFit="cover" className="opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-12">
                     <span className="text-white bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">{news.category}</span>
                    <h1 className="text-5xl font-extrabold text-white mt-4 leading-tight">{news.title}</h1>
                    <p className="text-gray-300 mt-2">Published on {news.date}</p>
                </div>
            </div>
            <div className="p-12">
                <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed">
                    <p className="text-xl font-semibold mb-6">{news.description}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi.</p>
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-700">
                        <p className="text-xl italic font-medium text-gray-900 dark:text-white">&quot;The future belongs to those who believe in the beauty of their dreams.&quot; - Eleanor Roosevelt</p>
                    </blockquote>
                    <p>Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Praesent vitae nisi quis est limit sequi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. </p>
                </div>
                <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-center">
                    <p className="text-gray-500 dark:text-gray-400">Advertisement</p>
                </div>
            </div>
        </div>
    );
}
