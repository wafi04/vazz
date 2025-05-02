import { Category } from '@/types/category';
import Image from 'next/image';
import { JSX, useEffect, useState } from 'react';

export function SidebarOrder({
  category,
}: {
  category: Category;
}): JSX.Element {
  const [formattedSteps, setFormattedSteps] = useState<string>('');

  useEffect(() => {
    if (!category.ketLayanan) {
      setFormattedSteps('');
      return;
    }

    let content = category.ketLayanan
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p>(.*?)<\/p>/gi, '$1\n'); 
    
    const steps = content
      .split('\n')
      .filter(step => step.trim().length > 0);

    // Buat HTML dengan penomoran
    if (steps.length > 0) {
      const numberedSteps = steps.map((step, index) => {
        return `<div class="step-item">
          <span class="step-number">${index + 1}.</span>
          <span class="step-text">${step.trim()}</span>
        </div>`;
      }).join('');

      setFormattedSteps(`<div class="steps-container">${numberedSteps}</div>`);
    } else {
      setFormattedSteps(category.ketLayanan);
    }
  }, [category.ketLayanan]);

  return (
    <div className="space-y-6">
      {/* Game Info */}
      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={category.thumbnail}
              alt={category.nama}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {category.nama}
            </h3>
            <p className="text-sm text-gray-300">{category.subNama}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-blue-950/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Category</p>
            <p className="text-sm text-white font-medium">{category.tipe}</p>
          </div>
          <div className="bg-blue-950/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm text-white font-medium capitalize">
              {category.status}
            </p>
          </div>
        </div>
      </div>
      
      {/* How To Order */}
      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">How To Order</h3>
        <div
          className="text-sm text-gray-300"
          dangerouslySetInnerHTML={{ __html: formattedSteps }}
        ></div>
      </div>

      <style jsx global>{`
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .step-number {
          color: #3b82f6; /* blue-500 */
          font-weight: 600;
          min-width: 20px;
        }
        
        .step-text {
          flex: 1;
        }
      `}</style>
    </div>
  );
}