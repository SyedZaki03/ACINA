// Import React to access JSX element creation and fragment wrappers
import React from 'react';

/**
 * Custom MarkdownRenderer component that parses and renders styled markdown blocks line-by-line.
 * Handles headers, horizontal lines, tables, lists, and paragraphs without double-newline limitations.
 * @param {string} content - Raw markdown text input to be parsed.
 */
export default function MarkdownRenderer({ content }) {
  // Return null immediately if there is no content to prevent render faults
  if (!content) return null;

  // Split raw text by linebreaks to parse line-by-line
  const lines = content.split(/\r?\n/);
  // Array carrying parsed markdown block structures
  const blocks = [];
  
  // Track active multi-line block grouping state
  let currentBlock = null;

  // Iterate over each line of the markdown source
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Trim leading/trailing whitespaces
    const trimmedLine = line.trim();

    // 1. Handle empty lines (closes any currently active block)
    if (trimmedLine === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // 2. Handle header line blocks (matches # to ######)
    if (trimmedLine.startsWith('#')) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({ type: 'header', content: trimmedLine });
      continue;
    }

    // 3. Handle horizontal separating lines (--- or ***)
    if (trimmedLine === '---' || trimmedLine === '***') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      blocks.push({ type: 'hr' });
      continue;
    }

    // 4. Handle table line blocks (lines starting with pipes "|")
    if (trimmedLine.startsWith('|')) {
      // If active block is not a table, close it
      if (currentBlock && currentBlock.type !== 'table') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      // Initialize table lines array if not present
      if (!currentBlock) {
        currentBlock = { type: 'table', lines: [] };
      }
      currentBlock.lines.push(trimmedLine);
      continue;
    }

    // 5. Handle unordered list items (starts with -, *, or •)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
      // Close previous non-list blocks
      if (currentBlock && currentBlock.type !== 'ul') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      // Initialize list items array if not present
      if (!currentBlock) {
        currentBlock = { type: 'ul', items: [] };
      }
      // Extract bullet item content
      const match = trimmedLine.match(/^[-*•]\s+(.*)$/);
      currentBlock.items.push(match ? match[1] : trimmedLine);
      continue;
    }

    // 6. Handle ordered list items (starts with numbers "1.")
    if (/^\d+\.\s+/.test(trimmedLine)) {
      // Close previous non-list blocks
      if (currentBlock && currentBlock.type !== 'ol') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      // Initialize numbered items list if not present
      if (!currentBlock) {
        currentBlock = { type: 'ol', items: [] };
      }
      // Extract list item content
      const match = trimmedLine.match(/^\d+\.\s+(.*)$/);
      currentBlock.items.push(match ? match[1] : trimmedLine);
      continue;
    }

    // 7. Handle standard paragraphs (default fallback)
    if (currentBlock && currentBlock.type !== 'paragraph') {
      blocks.push(currentBlock);
      currentBlock = null;
    }
    // Initialize paragraph block if not present
    if (!currentBlock) {
      currentBlock = { type: 'paragraph', lines: [] };
    }
    currentBlock.lines.push(trimmedLine);
  }

  // Push final active block remains to list
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return (
    // Render parsed blocks map list
    <div className="space-y-4 font-sans text-xs md:text-sm leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header': {
            // Match level size and heading text
            const match = block.content.match(/^(#{1,6})\s+(.*)$/);
            if (match) {
              const level = match[1].length;
              const text = renderInline(match[2]);
              const headerClasses = 
                level === 1 ? "text-2xl font-black text-slate-900 dark:text-white mt-6 mb-2" :
                level === 2 ? "text-xl font-bold text-slate-800 dark:text-gray-100 mt-5 mb-2" :
                "text-lg font-bold text-slate-700 dark:text-gray-250 mt-4 mb-2";
              const HeaderTag = `h${level}`;
              return <HeaderTag key={idx} className={headerClasses}>{text}</HeaderTag>;
            }
            return null;
          }
          
          case 'hr':
            // Render separating bar line
            return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;
            
          case 'table': {
            const lines = block.lines;
            // Identify standard header separators
            const hasHeader = lines[1] && lines[1].includes('---');
            const tableRows = [];
            let startIndex = 0;
            let headers = [];
            
            // Extract header columns names
            if (hasHeader) {
              headers = lines[0].split('|').map(x => x.trim()).filter((x, i, arr) => i > 0 && i < arr.length - 1);
              startIndex = 2;
            }

            // Extract cells details from rows
            for (let i = startIndex; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line.startsWith('|')) {
                const cells = line.split('|').map(x => x.trim()).filter((x, i, arr) => i > 0 && i < arr.length - 1);
                tableRows.push(cells);
              }
            }

            return (
              // Styled HTML table element layout cards
              <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm bg-white dark:bg-slate-900/10">
                <table className="w-full text-left text-xs border-collapse">
                  {headers.length > 0 && (
                    <thead>
                      <tr className="bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 font-bold text-slate-700 dark:text-gray-300">
                            {renderInline(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b last:border-b-0 border-slate-100 dark:border-slate-800/60 hover:bg-slate-500/[0.02] dark:hover:bg-white/[0.01]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-650 dark:text-gray-400 font-medium">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'ul':
            // Styled bullet points unordered lists
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 my-2 text-slate-650 dark:text-gray-450">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ul>
            );
            
          case 'ol':
            // Styled numbered ordered lists
            return (
              <ol key={idx} className="list-decimal pl-5 space-y-1.5 my-2 text-slate-650 dark:text-gray-450">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{renderInline(item)}</li>
                ))}
              </ol>
            );
            
          case 'paragraph':
            // Standard text blocks with inline breaks preserved
            return (
              <p key={idx} className="text-slate-650 dark:text-gray-300 my-2 leading-relaxed">
                {block.lines.map((line, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {lineIdx > 0 && <br />}
                    {renderInline(line)}
                  </React.Fragment>
                ))}
              </p>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Parses inline content and extracts bold formatting, code text, and links
 * @param {string} text - Raw inline text to parse
 * @returns {Array} List of react nodes mapping text components
 */
function renderInline(text) {
  if (!text) return "";

  // Regular expression matching bold markers (**bold**), code chunks (`code`), and markdown link tags ([label](url))
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    // Parse bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{content}</strong>;
    }
    // Parse inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-cyan-600 dark:text-cyan-400">{content}</code>;
    }
    // Parse links
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [_, label, url] = match;
        return (
          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 underline hover:text-cyan-500 transition-colors">
            {label}
          </a>
        );
      }
    }
    // Return standard plain text cell if no markers are matched
    return part;
  });
}
