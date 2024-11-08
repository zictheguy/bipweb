import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';

export const revalidate = 3600;

async function fetchImdbIdFromTmdb(tmdbId: string) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YjM2NTVkZjZhYTQxYzZhZWQxNjA0ZDFkYzIyYTg2NiIsIm5iZiI6MTcyMjE1NDM2OS42OTAxOTEsInN1YiI6IjY2YTVmYzljMTE1NjA4NGI1ZmRhZjQ1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.p-f_Pck9W-H8BUUasQZYDyKSvATgp1huIB4J9-OgMR8`);
  const data = await response.json();
  return data.imdb_id; // Trả về imdb_id nếu có
}

export default function Page({ params }: { params: { slug: string } }) {
  const [imdbId, setImdbId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('tmdb'); // Trạng thái để lựa chọn giữa tmdb và imdb
  const idTmdb = params.slug.split('-').pop() || '';

  useEffect(() => {
    if (idTmdb) {
      // Nếu là id tmdb, gọi API TMDB để lấy imdb_id
      fetchImdbIdFromTmdb(idTmdb).then((imdb) => {
        setImdbId(imdb); // Lưu imdb_id khi có
      });
    }
  }, [idTmdb]);

  // Xử lý URL cho EmbedPlayer tùy theo lựa chọn
  const playerUrl =
    selectedId === 'tmdb' ? `https://vidsrc.cc/v2/embed/movie/${idTmdb}` : `https://vidsrc.cc/v2/embed/movie/${imdbId}`;

  return (
    <div>
      <div>
        {/* Chọn giữa tmdb và imdb */}
        <button onClick={() => setSelectedId('tmdb')} disabled={!idTmdb}>
          Play with TMDB ID
        </button>
        <button onClick={() => setSelectedId('imdb')} disabled={!imdbId}>
          Play with IMDb ID
        </button>
      </div>

      {/* Hiển thị EmbedPlayer */}
      {playerUrl ? <EmbedPlayer url={playerUrl} /> : <p>Loading...</p>}
    </div>
  );
}
