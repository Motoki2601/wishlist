import type { SortKey } from '../types';

interface Props {
  genres: string[];
  tags: string[];
  selectedGenre: string;
  selectedTag: string;
  sortKey: SortKey;
  showPurchased: boolean;
  onGenreChange: (g: string) => void;
  onTagChange: (t: string) => void;
  onSortChange: (s: SortKey) => void;
  onShowPurchasedChange: (v: boolean) => void;
}

export default function FilterBar({
  genres, tags, selectedGenre, selectedTag, sortKey, showPurchased,
  onGenreChange, onTagChange, onSortChange, onShowPurchasedChange,
}: Props) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm p-3.5">
      <div className="flex flex-wrap gap-2">
        {/* ジャンルフィルタ */}
        <select
          value={selectedGenre}
          onChange={e => onGenreChange(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
        >
          <option value="">すべてのジャンル</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* タグフィルタ */}
        <select
          value={selectedTag}
          onChange={e => onTagChange(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
        >
          <option value="">すべてのタグ</option>
          {tags.map(t => (
            <option key={t} value={t}>#{t}</option>
          ))}
        </select>

        {/* ソート */}
        <select
          value={sortKey}
          onChange={e => onSortChange(e.target.value as SortKey)}
          className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-slate-700"
        >
          <option value="rank">優先度順</option>
          <option value="price_asc">価格：安い順</option>
          <option value="price_desc">価格：高い順</option>
          <option value="createdAt">追加順</option>
        </select>

        {/* 購入済み表示切替 */}
        <label className="flex items-center gap-1.5 cursor-pointer text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 bg-white">
          <input
            type="checkbox"
            checked={showPurchased}
            onChange={e => onShowPurchasedChange(e.target.checked)}
            className="w-3.5 h-3.5 accent-blue-500"
          />
          購入済みも表示
        </label>
      </div>
    </div>
  );
}
