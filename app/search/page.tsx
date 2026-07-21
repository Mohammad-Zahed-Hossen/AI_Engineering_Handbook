import SearchBoxWrapper from '@/components/shared/SearchBoxWrapper';

export default function SearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Search Results</h1>
        <p className="text-sm text-muted-foreground">
          Find packages, models, workflows, cheatsheets, and more across the AI Engineering Handbook.
        </p>
      </div>
      
      <div className="mb-8">
        <SearchBoxWrapper />
      </div>
    </div>
  );
}
