import { ProseClient } from '@/components/shared/Prose';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface MentalModelDisplayProps {
  content: string;
  className?: string;
}

// Transform Mermaid flowchart into conceptual mental model
// The mental model should answer: "What is the correct way to think about this principle?"
function transformMentalModel(content: string): {
  analogy: string;
  coreInsight: string;
  thinkingModel: string;
} {
  // Check if content contains Mermaid
  if (content.includes('```mermaid') || content.includes('flowchart')) {
    // Bias-Variance Tradeoff
    if (content.includes('Too simple') || content.includes('Too flexible') || content.includes('bias') || content.includes('variance')) {
      return {
        analogy: 'Think of model selection like adjusting a radio dial.',
        coreInsight: 'Too far left and you get static (high bias/underfit). Too far right and you get multiple stations bleeding together (high variance/overfit). The sweet spot is clear signal.',
        thinkingModel: 'When validation gets worse, ask: "Is this model too rigid or too sensitive?" Then choose: more capacity (reduce bias) or more regularization/data (reduce variance).',
      };
    }
    
    // Default transformation for optimization principles
    if (content.includes('Loss surface') || content.includes('gradient') || content.includes('update')) {
      return {
        analogy: 'Think of gradient descent like tuning a shower temperature control.',
        coreInsight: 'You adjust based on feedback (the gradient), but too aggressive causes oscillation (divergence) and too timid means you never reach comfort (stall).',
        thinkingModel: 'The "temperature" is your model\'s loss, and you\'re the optimizer trying to find the perfect setting. The key insight: it\'s a control system, not just a mechanical update rule.',
      };
    }
    
    // Default transformation for probability/inference principles
    if (content.includes('Prior') || content.includes('Posterior') || content.includes('Evidence')) {
      return {
        analogy: 'Think of Bayesian inference like a detective updating their theory.',
        coreInsight: 'They never discard previous knowledge. Every new piece of evidence adjusts confidence rather than restarting from zero.',
        thinkingModel: 'Bayesian inference works exactly the same way: old knowledge + new evidence = better belief, which leads to better decisions.',
      };
    }
    
    // Generic fallback
    return {
      analogy: 'Think of this principle as a system with feedback loops.',
      coreInsight: 'The system responds to signals, but the response must be tuned to the context.',
      thinkingModel: 'Small changes in input can lead to dramatically different outcomes. The key is understanding the relationship between signal, response, and result.',
    };
  }
  
  // If not Mermaid, return the content as-is for the core insight
  return {
    analogy: '',
    coreInsight: content,
    thinkingModel: '',
  };
}

// MentalModelDisplay presents conceptual understanding, not diagrams
// It answers: "What is the correct way to think about this principle?"
export default function MentalModelDisplay({ 
  content, 
  className 
}: MentalModelDisplayProps) {
  const { analogy, coreInsight, thinkingModel } = transformMentalModel(content);
  
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-card overflow-hidden",
        className
      )}
    >
      <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-500/10">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xs font-semibold text-foreground">Mental Model</h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {analogy && (
          <div>
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
              Analogy
            </span>
            <p className="text-xs text-foreground font-medium">{analogy}</p>
          </div>
        )}
        
        {coreInsight && (
          <div>
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
              Core Insight
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {coreInsight}
            </p>
          </div>
        )}
        
        {thinkingModel && (
          <div>
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
              Thinking Model
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {thinkingModel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}