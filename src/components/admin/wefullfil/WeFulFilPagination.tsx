
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { WeFulFilPagination as WeFulFilPaginationType } from "@/types/wefullfil";

interface WeFulFilPaginationProps {
  pagination: WeFulFilPaginationType;
  onPageChange: (page: number) => void;
}

export const WeFulFilPagination: React.FC<WeFulFilPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { current_page, total_pages } = pagination;

  const renderPaginationItems = () => {
    const pageItems = [];
    
    // Always show first page
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => onPageChange(1)}
          isActive={current_page === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if needed
    if (current_page > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add previous page if not first or second page
    if (current_page > 2) {
      pageItems.push(
        <PaginationItem key={current_page - 1}>
          <PaginationLink onClick={() => onPageChange(current_page - 1)}>
            {current_page - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add current page if not first
    if (current_page !== 1) {
      pageItems.push(
        <PaginationItem key={current_page}>
          <PaginationLink 
            onClick={() => onPageChange(current_page)}
            isActive={true}
          >
            {current_page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add next page if not last
    if (current_page < total_pages - 1) {
      pageItems.push(
        <PaginationItem key={current_page + 1}>
          <PaginationLink onClick={() => onPageChange(current_page + 1)}>
            {current_page + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed
    if (current_page < total_pages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if not first
    if (total_pages > 1) {
      pageItems.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => onPageChange(total_pages)}
            isActive={current_page === total_pages}
          >
            {total_pages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pageItems;
  };

  if (total_pages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, current_page - 1))}
            isActive={false}
            className={current_page === 1 ? "opacity-50 cursor-not-allowed" : ""}
          />
        </PaginationItem>
        
        {renderPaginationItems()}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(total_pages, current_page + 1))}
            isActive={false}
            className={current_page === total_pages ? "opacity-50 cursor-not-allowed" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
