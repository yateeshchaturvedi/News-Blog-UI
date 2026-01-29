import Link from "next/link";
import Image from "next/image";

interface NewsCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
}

export default function NewsCard({ id, title, description, image, category, date }: NewsCardProps) {
    return (
        <Link href={`/news/${id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
                <Image src={image} alt={title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{category}</span>
                    <span>{date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
            </div>
        </Link>
    );
}
