import { useOrderStore } from '@/hooks/user-order';
import { Category } from '@/types/category';
import Image from 'next/image';
import { JSX, useEffect, useState } from 'react';
import { CartDetails } from './cartDetails';

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
     
 
      {/* How To Order */}
      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Cara Order </h3>
        <div
          className="text-sm text-gray-300"
          dangerouslySetInnerHTML={{ __html: formattedSteps }}
        ></div>
      </div>
      <CartDetails />
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