export function getUrlApiPagination(
  baseUrl: string | undefined,
  router: string,
  paginationParams: {
    currentPage: number;
    pageSize: number;
  }
) {
  const { currentPage, pageSize } = paginationParams;
  const params = new URLSearchParams({
    page: currentPage.toString(),
    size: pageSize.toString(),
  }).toString();
  return `${baseUrl}${router}?${params}`;
}
