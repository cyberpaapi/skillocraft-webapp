import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { imgSrc } from "@/lib/imgSrc";
import SuccessStoryExtras from "@/components/success/SuccessStoryExtras";

interface SuccessStory {
  id: string;
  name: string;
  description: string;
  brand: string;
  earning: string;
  imageLink: string;
  coverPhoto: string;
  status: string;
  category?: { name: string };
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getStory(id: string): Promise<SuccessStory | null> {
  try {
    const res = await fetch(`${API}/success/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export default async function SuccessStoryPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);
  if (!story) notFound();

  return (
    <>
      <main className="container mx-auto py-12 px-4 max-w-3xl">
      <Link href="/success/inside" className="inline-flex items-center gap-2 text-sm text-primary mb-6 hover:underline">
        ← Back to Success Stories
      </Link>

      <div className="bg-background rounded-3xl shadow-xl overflow-hidden">
        <div className="relative w-full aspect-video">
          <Image
            src={imgSrc(story.coverPhoto)}
            alt={story.name}
            fill
            unoptimized
            className="object-cover"
            priority
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={imgSrc(story.imageLink)}
                alt={story.name}
                fill
                unoptimized
                className="object-cover rounded-full border-2 border-primary"
              />
            </div>
            <div>
              <p className="text-xs text-primary font-medium">Founded By</p>
              <h1 className="text-xl font-bold text-black flex items-center gap-2">
                {story.name} <RiVerifiedBadgeFill className="text-red-500 size-5" />
              </h1>
              {story.category?.name && (
                <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">
                  {story.category.name}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Brand</p>
              <p className="font-semibold text-slate-800">{story.brand || "—"}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Earning / Month</p>
              <p className="font-semibold text-slate-800">{story.earning || "—"}</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Story</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{story.description}</p>
          </div>
        </div>
      </div>
      </main>

      {/* Featured products, CTA, and more success stories */}
      <SuccessStoryExtras currentId={params.id} />
    </>
  );
}
