"use client";

import React, { SVGProps } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/avatar";
import { Button, ButtonGroup } from "@heroui/button";
import { ChipProps } from "@heroui/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
} from "@heroui/table";
import { SortDescriptor } from "@react-types/shared";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Tooltip } from "@heroui/tooltip";
import {
  TbBrowserShare,
  TbKey,
  TbUsers,
  TbSearch,
  TbPlus,
  TbChevronDown,
} from "react-icons/tb";

import { CredentialDto } from "@/lib/services/credentials.service";
import { CopyButton } from "@/components/copy-button";
import { AvatarFallback } from "@/components/avatar-fallback";
import { siteConfig } from "@/config/site";
import clsx from "clsx";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "USERNAME", uid: "username" },
  { name: "CREATED AT", uid: "createdAt", sortable: true },
  { name: "UPDATED AT", uid: "updatedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "username", "actions"];

export default function CredentialsTable(props: {
  credentials: CredentialDto[];
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const router = useRouter();

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...props.credentials];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredUsers = filteredUsers.filter((user) =>
    //     Array.from(statusFilter).includes(user.status),
    //   );
    // }

    return filteredUsers;
  }, [props.credentials, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    // const start = (page - 1) * rowsPerPage;
    // const end = start + rowsPerPage;
    return filteredItems;
    // return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: CredentialDto, b: CredentialDto) => {
      const first = a[sortDescriptor.column as keyof CredentialDto] as number;
      const second = b[sortDescriptor.column as keyof CredentialDto] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (credential: CredentialDto, columnKey: React.Key) => {
      const cellValue = credential[columnKey as keyof CredentialDto];

      switch (columnKey) {
        case "name":
          return (
            <div className="inline-flex items-center">
              <div className="block mr-2 min-w-9">
                <Avatar
                  alt="Credential image"
                  size="md"
                  radius="full"
                  src={`/api/icons?domain=${credential.url}&size=64`}
                  name={credential.name}
                  showFallback
                  fallback={
                    <AvatarFallback letter={credential.name[0]} size={36} />
                  }
                />
              </div>
              <div className="flex-1 max-w-[35vw] sm:max-w-[15vw]">
                <p className="block text-bold font-semibold truncate">
                  {credential.name}
                </p>
                <p className="block text-bold text-tiny font-extralight truncate">
                  {credential.url}
                </p>
              </div>
            </div>
          );
        case "username":
          return (
            <Snippet
              hideSymbol
              radius="none"
              classNames={{
                base: "pl-0 py-0 bg-transparent",
                copyButton: "opacity-40",
              }}
            >
              {cellValue?.toString()}
            </Snippet>
            // <div className="flex-col cursor-text" onClick={(e) => { e.stopPropagation(); console.log('clicked')}}>
            //   <p className="text-bold text-small">{cellValue?.toString()}</p>
            // </div>
          );
        case "actions":
          return (
            <ButtonGroup
              className="flex justify-end sm:justify-center"
              color="default"
              radius="sm"
              variant="ghost"
            >
              <CopyButton
                icon={TbUsers}
                iconClassName="text-cyan-300"
                textToCopy={credential.username}
                variant="ghost"
                addTooltip
                tooltipText="Copy username"
              />
              <CopyButton
                icon={TbKey}
                iconClassName="text-amber-300"
                textToCopy={credential.password}
                variant="ghost"
                addTooltip
                tooltipText="Copy password"
              />
              <Tooltip content="Go to the website">
                <Button
                  isExternal
                  isIconOnly
                  aria-label="Go to the website"
                  as={Link}
                  className="mx-1"
                  href={credential.url}
                >
                  <TbBrowserShare className="w-5 h-5 text-emerald-400" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          );
        default:
          return cellValue?.toLocaleString();
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<TbSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<TbChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              as={Link}
              color="primary"
              endContent={<TbPlus />}
              href={siteConfig.links.newCredential}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {props.credentials.length} credentials
          </span>
          {/* <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label> */}
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    props.credentials.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      removeWrapper
      classNames={{
        wrapper: "max-h-[382px]",
        td: "max-w-[50vw] sm:max-w-[20vw]",
        tr: "hover:bg-default-50 cursor-pointer",
      }}
      // selectedKeys={selectedKeys}
      // selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      onSortChange={setSortDescriptor}
      aria-label="Example table with custom cells, pagination and sorting"
      // bottomContent={bottomContent}
      bottomContentPlacement="outside"
      topContentPlacement="outside"
      // onSelectionChange={setSelectedKeys}
      onSelectionChange={(e: any) => console.log(`onSelect ${e.currentKey}`)}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            aria-sort="none"
            className={column.uid === "username" ? "hidden sm:table-cell" : ""}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No credentials found"} items={sortedItems}>
        {(item) => (
          <TableRow
            key={item.id}
            onClick={() => router.push(`/credentials/${item.id}`)}
          >
            {(columnKey) => (
              <TableCell
                className={clsx(
                  columnKey === "username" && "hidden sm:table-cell",
                  columnKey === "actions" && "px-1 sm:px-3"
                )}
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
