import { SelectQueryBuilder } from 'typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

export type PaginatedMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  startRecord: number;
  endRecord: number;
  skip: number;
};

function toSafeInt(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export function normalizePageNumber(pageNumber: unknown): number {
  const n = toSafeInt(pageNumber, 1);
  return Math.max(1, n);
}

export function normalizePageSize(
  pageSize: unknown,
  {
    defaultSize = 10,
    maxSize = 100,
  }: { defaultSize?: number; maxSize?: number } = {},
): number {
  const n = toSafeInt(pageSize, defaultSize);
  return Math.min(Math.max(1, n), maxSize);
}

function clearPagination<T>(qb: SelectQueryBuilder<T>) {
  // TypeORM doesn't expose "unset skip/take", but clone() preserves expressionMap.
  // We intentionally clear it for count queries so totals are correct.
  (qb as any).expressionMap.skip = undefined;
  (qb as any).expressionMap.take = undefined;
  (qb as any).expressionMap.limit = undefined;
  (qb as any).expressionMap.offset = undefined;
}

export async function paginateAndClamp<T>(
  qb: SelectQueryBuilder<T>,
  {
    pageNumber,
    pageSize,
    maxPageSize = 100,
  }: { pageNumber: unknown; pageSize: unknown; maxPageSize?: number },
): Promise<{ rows: T[]; meta: PaginatedMeta }> {
  const safePageSize = normalizePageSize(pageSize, {
    defaultSize: 10,
    maxSize: maxPageSize,
  });
  const requestedPage = normalizePageNumber(pageNumber);

  const countQb = qb.clone();
  clearPagination(countQb);
  const total = await countQb.getCount();
  const totalPages = total === 0 ? 0 : Math.ceil(total / safePageSize);

  // If FE sends an out-of-range page (common when search changes), clamp it.
  const effectivePage =
    totalPages === 0 ? 1 : Math.min(Math.max(requestedPage, 1), totalPages);

  const skip = (effectivePage - 1) * safePageSize;

  qb.skip(skip).take(safePageSize);
  const rows = await qb.getMany();

  const startRecord = total === 0 ? 0 : skip + 1;
  const endRecord = total === 0 ? 0 : Math.min(skip + safePageSize, total);

  return {
    rows,
    meta: {
      total,
      page: effectivePage,
      pageSize: safePageSize,
      totalPages,
      startRecord,
      endRecord,
      skip,
    },
  };
}

export async function paginateAndClampFind<T>(
  repo: Repository<T>,
  options: Omit<FindManyOptions<T>, 'skip' | 'take'> & {
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  },
  {
    pageNumber,
    pageSize,
    maxPageSize = 100,
  }: { pageNumber: unknown; pageSize: unknown; maxPageSize?: number },
): Promise<{ rows: T[]; meta: PaginatedMeta }> {
  const safePageSize = normalizePageSize(pageSize, {
    defaultSize: 10,
    maxSize: maxPageSize,
  });
  const requestedPage = normalizePageNumber(pageNumber);

  const total = await repo.count({
    where: options.where as any,
  });
  const totalPages = total === 0 ? 0 : Math.ceil(total / safePageSize);
  const effectivePage =
    totalPages === 0 ? 1 : Math.min(Math.max(requestedPage, 1), totalPages);
  const skip = (effectivePage - 1) * safePageSize;

  const rows = await repo.find({
    ...(options as any),
    skip,
    take: safePageSize,
  });

  const startRecord = total === 0 ? 0 : skip + 1;
  const endRecord = total === 0 ? 0 : Math.min(skip + safePageSize, total);

  return {
    rows,
    meta: {
      total,
      page: effectivePage,
      pageSize: safePageSize,
      totalPages,
      startRecord,
      endRecord,
      skip,
    },
  };
}
