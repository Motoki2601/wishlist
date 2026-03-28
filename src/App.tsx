import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { loadItems, saveItems } from './storage';
import type { WishItem, SortKey } from './types';
import ItemCard from './components/ItemCard';
import ItemModal from './components/ItemModal';
import FilterBar from './components/FilterBar';

const nextId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function App() {
  const [items, setItems] = useState<WishItem[]>(() => loadItems());
  const [editItem, setEditItem] = useState<WishItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [showPurchased, setShowPurchased] = useState(false);

  useEffect(() => saveItems(items), [items]);

  const genres = useMemo(() => [...new Set(items.map(i => i.genre).filter(Boolean))].sort(), [items]);
  const tags = useMemo(() => [...new Set(items.flatMap(i => i.tags))].sort(), [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (!showPurchased) list = list.filter(i => !i.purchased);
    if (selectedGenre) list = list.filter(i => i.genre === selectedGenre);
    if (selectedTag) list = list.filter(i => i.tags.includes(selectedTag));
    return [...list].sort((a, b) => {
      if (sortKey === 'rank') return a.rank - b.rank;
      if (sortKey === 'price_asc') return a.price - b.price;
      if (sortKey === 'price_desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items, selectedGenre, selectedTag, sortKey, showPurchased]);

  const openAdd = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (item: WishItem) => { setEditItem(item); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); };

  const handleSave = (data: Omit<WishItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    if (editItem) {
      setItems(prev => prev.map(i =>
        i.id === editItem.id ? { ...i, ...data, updatedAt: now } : i
      ));
    } else {
      setItems(prev => [...prev, { ...data, id: nextId(), createdAt: now, updatedAt: now }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('削除しますか？')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleTogglePurchased = (id: string) => {
    const now = new Date().toISOString();
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, purchased: !i.purchased, updatedAt: now } : i
    ));
  };

  const totalPrice = filtered
    .filter(i => !i.purchased && i.price > 0)
    .reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🎁 欲しいものリスト</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {filtered.length}件
              {totalPrice > 0 && ` · 合計 ¥${totalPrice.toLocaleString()}`}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <Plus size={16} />
            追加
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* フィルタバー */}
        {items.length > 0 && (
          <FilterBar
            genres={genres}
            tags={tags}
            selectedGenre={selectedGenre}
            selectedTag={selectedTag}
            sortKey={sortKey}
            showPurchased={showPurchased}
            onGenreChange={setSelectedGenre}
            onTagChange={setSelectedTag}
            onSortChange={setSortKey}
            onShowPurchasedChange={setShowPurchased}
          />
        )}

        {/* アイテム一覧 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {items.length === 0 ? (
              <>
                <p className="text-5xl mb-4">🛍️</p>
                <p className="font-medium">まだ何もありません</p>
                <p className="text-sm mt-1">「追加」ボタンで登録しましょう</p>
              </>
            ) : (
              <>
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-medium">条件に一致するアイテムがありません</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
                onTogglePurchased={handleTogglePurchased}
              />
            ))}
          </div>
        )}
      </main>

      {/* モーダル */}
      {showModal && (
        <ItemModal
          item={editItem}
          genres={genres}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
