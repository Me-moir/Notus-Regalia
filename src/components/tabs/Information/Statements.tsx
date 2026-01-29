"use client";
import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { statements, type Statement } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';

const ITEMS_PER_PAGE = 4;

interface StatementAccordionItemProps {
  statement: Statement;
  isOpen: boolean;
  onToggle: () => void;
}

const StatementAccordionItem = memo(({ statement, isOpen, onToggle }: StatementAccordionItemProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentBox = boxRef.current;
      if (!currentBox) return;
      const rect = currentBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      currentBox.style.setProperty('--mouse-x', `${x}px`);
      currentBox.style.setProperty('--mouse-y', `${y}px`);
    };

    box.addEventListener('mousemove', handleMouseMove);
    return () => box.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={boxRef} className={`${styles.notificationBox} group`}>
      <div className={styles.boxInner}>
        {/* Header - Always Visible */}
        <button
          onClick={onToggle}
          className="w-full text-left focus:outline-none"
          aria-expanded={isOpen}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="flex-1 line-clamp-2 pr-4 text-white/70 group-hover:text-white font-semibold text-base leading-tight transition-colors duration-300">
              {statement.title}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Attachment Icons */}
              {(statement.pdfUrl || statement.linkUrl) && (
                <div className="flex items-center gap-2">
                  {statement.pdfUrl && (
                    <a
                      href={statement.pdfUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 group/pdf"
                      title="Download PDF"
                    >
                      <i className="bi bi-filetype-pdf text-base text-neutral-400 group-hover/pdf:scale-110 group-hover/pdf:text-neutral-300 transition-all"></i>
                    </a>
                  )}
                  {statement.linkUrl && (
                    <a
                      href={statement.linkUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 group/link"
                      title="Open Link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-link-45deg text-lg text-neutral-400 group-hover/link:scale-110 group-hover/link:text-neutral-300 transition-all"></i>
                    </a>
                  )}
                </div>
              )}
              {/* Chevron */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Date and Tags Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">{statement.date}</span>
            <span className="text-gray-700">•</span>
            <div className="flex flex-wrap gap-2">
              {statement.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                    tag === 'Recruitment' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/20' 
                      : 'bg-neutral-800/50 text-neutral-400 border-neutral-700/50'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* Expandable Content - FIXED HEIGHT */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 border-t border-white/5">
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-5">
              {statement.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

StatementAccordionItem.displayName = 'StatementAccordionItem';

const StatementsSection = memo(() => {
  const [openStatementId, setOpenStatementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for search input
  useEffect(() => {
    const searchInput = searchInputRef.current;
    if (!searchInput) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentInput = searchInputRef.current;
      if (!currentInput) return;
      const rect = currentInput.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      currentInput.style.setProperty('--mouse-x', `${x}px`);
      currentInput.style.setProperty('--mouse-y', `${y}px`);
    };

    searchInput.addEventListener('mousemove', handleMouseMove);
    return () => searchInput.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggle = (statementId: string) => {
    setOpenStatementId(prev => prev === statementId ? null : statementId);
  };

  // Filter statements based on search query
  const filteredStatements = useMemo(() => {
    if (!searchQuery.trim()) return statements;
    
    const query = searchQuery.toLowerCase();
    return statements.filter((statement) => 
      statement.title.toLowerCase().includes(query) ||
      statement.tags.some(tag => tag.toLowerCase().includes(query)) ||
      statement.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStatements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStatements = filteredStatements.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenStatementId(null);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenStatementId(null);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
        marginTop: '10vh'
      }}
    >
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Section Header */}
        <div 
          className="text-center mb-12 sm:mb-16 border border-dashed border-white/20 rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.8) 100%)'
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Statements and Notices
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Official announcements, updates, and disclosures from Regalitica Holdings and portfolio ventures.
          </p>
        </div>

        {/* Search and Pagination Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Search Bar - Left Side */}
          <div ref={searchInputRef} className="relative flex-1 sm:max-w-md">
            <div 
              className="relative h-14 rounded-lg overflow-hidden transition duration-200 group"
              style={{
                backgroundColor: '#101010',
                boxShadow: 'inset 0px 1px 1px rgba(255, 255, 255, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.2), inset 0px 4px 4px rgba(255, 255, 255, 0.15)',
                border: 'solid 1px rgba(255, 255, 255, 0.13)'
              }}
            >
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(255, 215, 0, 0.5), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.4), transparent 70%)',
                  padding: '1px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 10
                }}
              />
              <div className="relative h-full flex items-center">
                <i className="bi bi-search absolute left-4 text-lg text-gray-500 pointer-events-none z-10"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search statements..."
                  className="w-full h-full pl-12 pr-4 bg-transparent border-none text-white/70 placeholder-white/30 focus:outline-none focus:ring-0 relative z-50"
                />
              </div>
            </div>
          </div>

          {/* Page Numbers and Info - Right Side */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#101010] border border-[rgba(255,255,255,0.13)] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all overflow-hidden group"
                style={{
                  boxShadow: 'inset 0px 1px 1px rgba(255, 255, 255, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.2), inset 0px 4px 4px rgba(255, 255, 255, 0.15)'
                }}
                aria-label="Previous page"
              >
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative min-w-[36px] h-9 px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all overflow-hidden ${
                      currentPage === page
                        ? 'bg-[#101010] text-white'
                        : 'bg-[#101010] border border-[rgba(255,255,255,0.13)] text-gray-400 hover:text-white'
                    }`}
                    style={{
                      boxShadow: 'inset 0px 1px 1px rgba(255, 255, 255, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.2), inset 0px 4px 4px rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    {currentPage === page && (
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                          padding: '1px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                      />
                    )}
                    <span className="relative z-10">{page}</span>
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#101010] border border-[rgba(255,255,255,0.13)] text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all overflow-hidden group"
                style={{
                  boxShadow: 'inset 0px 1px 1px rgba(255, 255, 255, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.2), inset 0px 4px 4px rgba(255, 255, 255, 0.15)'
                }}
                aria-label="Next page"
              >
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Page Info below pagination buttons */}
            {filteredStatements.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredStatements.length)} of {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-500">
            Found {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Accordion List Container - FIXED HEIGHT */}
        <div className="space-y-4" style={{ minHeight: '800px' }}>
          {currentStatements.length > 0 ? (
            currentStatements.map((statement) => (
              <StatementAccordionItem
                key={statement.id}
                statement={statement}
                isOpen={openStatementId === statement.id}
                onToggle={() => handleToggle(statement.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-16">
              <div 
                className="relative border border-dashed border-white/20 rounded-2xl p-8 max-w-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.8) 100%)'
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center">
                    <i className="bi bi-cup-hot text-3xl text-neutral-400"></i>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-lg font-medium mb-2">No statements found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search terms or browse all statements</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

StatementsSection.displayName = 'StatementsSection';

export default StatementsSection;