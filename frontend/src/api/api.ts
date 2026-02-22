export const BASE_URL = "https://loca-space.onrender.com";

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
  
  const base = baseUrl || BASE_URL;
  return `${base}${router}?${params}`;
}