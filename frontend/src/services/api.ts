export function getUrlApiPagination(
  router: string,
  paginationParams: {
    currentPage: number;
    pageSize: number;
  },
) {
  const baseUrl = process.env.BACKEND_URL;
  const { currentPage, pageSize } = paginationParams;
  const params = new URLSearchParams({
    page: currentPage.toString(),
    size: pageSize.toString(),
  }).toString();

  return `${baseUrl}${router}?${params}`;
}

