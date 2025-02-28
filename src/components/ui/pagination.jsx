import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handleFirst = () => {
    onPageChange(1)
  }

  const handleLast = () => {
    onPageChange(totalPages)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      if (startPage > 1) {
        pageNumbers.push(1)
        if (startPage > 2) {
          pageNumbers.push("...")
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...")
        }
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === "number" && onPageChange(number)}
        className={`px-3 py-1 rounded-md ${
          number === currentPage
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        } ${typeof number !== "number" ? "cursor-default" : ""}`}
      >
        {number}
      </button>
    ))
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex space-x-1">{renderPageNumbers()}</div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight size={20} />
      </button>
    </div>
  )
}

