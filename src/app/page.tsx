import { TopTitles } from '@/components/top-titles';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-orange-500">Up</span>
          <span className="text-black">Screen</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Descubra, avalie e ranqueie seus filmes e séries favoritos
        </p>
      </div>

      {/* Top Titles Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Títulos Mais Bem Avaliados
        </h2>
        <p className="text-lg text-gray-600">
          Descubra os filmes e séries mais bem avaliados pela nossa comunidade
        </p>
      </div>
      <TopTitles />
    </div>
  );
}
