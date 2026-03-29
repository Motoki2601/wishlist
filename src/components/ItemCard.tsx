import { ExternalLink, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { WishItem } from '../types';

interface Props {
  item: WishItem;
  onEdit: (item: WishItem) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string) => void;
}

const RANK_COLORS = [
  '',
  'bg-gradient-to-br from-slate-400 to-slate-300',   // ★1: スレート（最低優先）
  'bg-gradient-to-br from-sky-400 to-cyan-300',      // ★2: 空→シアン
  'bg-gradient-to-br from-lime-400 to-emerald-400',  // ★3: 黄緑→緑（中間）
  'bg-gradient-to-br from-amber-400 to-orange-300',  // ★4: アンバー→オレンジ
  'bg-gradient-to-br from-rose-500 to-pink-400',     // ★5: 赤→ピンク（最高優先）
];
const RANK_LABELS = ['', '★1', '★2', '★3', '★4', '★5'];

export default function ItemCard({ item, onEdit, onDelete, onTogglePurchased }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 transition-opacity ${
        item.purchased ? 'opacity-40' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* ランクバッジ */}
          <span
            className={`mt-0.5 shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold text-white ${
              RANK_COLORS[item.rank] ?? 'bg-gray-300'
            }`}
          >
            {RANK_LABELS[item.rank]}
          </span>

          {/* メイン情報 */}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-gray-800 truncate ${item.purchased ? 'line-through' : ''}`}>
              {item.name}
            </p>
            <p className="text-violet-600 font-bold text-sm mt-0.5">
              {item.price > 0 ? `¥${item.price.toLocaleString()}` : '価格未設定'}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.genre && (
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  {item.genre}
                </span>
              )}
              {item.tags.map(t => (
                <span key={t} className="text-xs bg-fuchsia-50 text-fuchsia-600 px-2 py-0.5 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* アクション */}
          <div className="flex gap-1 shrink-0">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg"
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* 展開ボタン */}
        {(item.memo || item.url) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 w-full justify-end"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? '閉じる' : '詳細'}
          </button>
        )}

        {/* 展開パネル */}
        {expanded && (
          <div className="mt-2 pt-3 border-t space-y-2">
            {item.url && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">URL</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline break-all"
                >
                  {item.url}
                </a>
              </div>
            )}
            {item.memo && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">メモ</p>
                <p className="text-xs text-gray-700 whitespace-pre-wrap">{item.memo}</p>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => onTogglePurchased(item.id)}
                className="w-3.5 h-3.5 accent-violet-500"
              />
              <span className="text-xs text-gray-600">購入済み</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
