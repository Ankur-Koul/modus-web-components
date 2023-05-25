import {
  Component,
  Event,
  EventEmitter,
  h, // eslint-disable-line @typescript-eslint/no-unused-vars
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { PaginationDirection } from './enums/pagination-direction.enum';
import { IconChevronRightThick } from '../icons/icon-chevron-right-thick';
import { IconChevronLeftThick } from '../icons/icon-chevron-left-thick';

@Component({
  tag: 'modus-pagination',
  styleUrl: 'modus-pagination.scss',
  shadow: true,
})
export class ModusPagination {
  /* (optional) The pagination's aria-label. */
  @Prop() ariaLabel: string | null;

  /* The active page. */
  @Prop({ mutable: true }) activePage: number;
  @Watch('activePage')
  activePageWatch(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
      this.setPages();
      this.pageChange.emit(newValue);
    }
  }

  /* The maximum page value. */
  @Prop() maxPage: number;

  /**
   * Checks and updates maxPage value on change of items per page.
   */
  @Watch('maxPage')
  maxPageWatch(newValue: number, oldValue: number) {
    if (newValue !== oldValue) {
      this.setPages();
    }
  }

  /* The minimum page value. */
  @Prop() minPage: number;

  /** Weather to display text or previous icon. */
  @Prop() prevPageButtonText: string;

  /** Weather to display text or next icon. */
  @Prop() nextPageButtonText: string;

  /* The pagination's size. */
  @Prop() size: 'large' | 'medium' | 'small' = 'medium';

  /** An event that fires on page change. */
  @Event() pageChange: EventEmitter<number>;

  @State() pages: (number | string)[];

  constructor() {
    this.setPages();
  }

  chevronSizeBySize: Map<string, string> = new Map([
    ['small', '16'],
    ['medium', '20'],
    ['large', '24'],
  ]);

  classBySize: Map<string, string> = new Map([
    ['small', 'small'],
    ['medium', 'medium'],
    ['large', 'large'],
  ]);

  setPages(): void {
    const pages: (number | string)[] = [];

    const ellipsis = '...';

    // Always show the first page.
    this.maxPage > 1 && pages.push(this.minPage);

    if (this.maxPage - this.minPage < 7) {
      // No need for ellipsis for 7 pages - push all of them.
      for (let i = this.minPage + 1; i < this.maxPage; i++) {
        pages.push(i);
      }
    } else {
      if (this.activePage - this.minPage < 4) {
        // One of the first 4 pages is active.
        [1, 2, 3, 4].map((val) => pages.push(this.minPage + val));
        pages.push(ellipsis);
      } else if (this.maxPage - this.activePage < 4) {
        // One of the last 4 pages is active.
        pages.push(ellipsis);
        [4, 3, 2, 1].map((val) => pages.push(this.maxPage - val));
      } else {
        // The active page is somewhere in the middle.
        pages.push(ellipsis);
        [-1, 0, 1].map((val) => pages.push(this.activePage + val));
        pages.push(ellipsis);
      }
    }

    // Always show the last page.
    pages.push(this.maxPage);

    this.pages = pages;
  }

  handlePageChange(direction: PaginationDirection): void {
    if (
      direction === PaginationDirection.Previous &&
      this.activePage !== this.minPage
    ) {
      this.activePage--;
    } else if (
      direction === PaginationDirection.Next &&
      this.activePage !== this.maxPage
    ) {
      this.activePage++;
    }
  }

  handleOnArrowsKeydown(
    event: KeyboardEvent,
    direction: PaginationDirection
  ): void {
    if (event.key.toLowerCase() === 'enter') {
      this.handlePageChange(direction);
      event.preventDefault();
    }
  }

  handleOnPageNumbersKeydown(event: KeyboardEvent, page: number): void {
    if (event.key.toLowerCase() === 'enter') {
      this.handlePageClick(page);
      event.preventDefault();
    }
  }

  handlePageClick(page: number): void {
    if (!isNaN(page)) {
      this.activePage = page;
    }
  }

  render(): unknown {
    const previousPageControl = (
      <li
        class={`${this.activePage != this.minPage ? 'hoverable' : 'disabled'}`}
        onClick={() => this.handlePageChange(PaginationDirection.Previous)}
        onKeyDown={(event) =>
          this.handleOnArrowsKeydown(event, PaginationDirection.Previous)
        }
        tabIndex={0}>
        {this.prevPageButtonText ? (
          <span data-test-id="prev-button-text">{this.prevPageButtonText}</span>
        ) : (
          <IconChevronLeftThick size={this.chevronSizeBySize.get(this.size)} />
        )}
      </li>
    );

    const nextPageControl = (
      <li
        class={`${this.activePage != this.maxPage ? 'hoverable' : 'disabled'}`}
        onClick={() => this.handlePageChange(PaginationDirection.Next)}
        onKeyDown={(event) =>
          this.handleOnArrowsKeydown(event, PaginationDirection.Next)
        }
        tabIndex={0}>
        {this.nextPageButtonText ? (
          <span data-test-id="next-button-text">{this.nextPageButtonText}</span>
        ) : (
          <IconChevronRightThick size={this.chevronSizeBySize.get(this.size)} />
        )}
      </li>
    );

    return (
      <nav
        aria-label={this.ariaLabel}
        class={`${this.classBySize.get(this.size)}`}>
        <ol>
          {previousPageControl}
          {this.pages.map((page) => {
            return (
              <li
                class={`${page === this.activePage ? 'active' : ''} ${
                  !isNaN(+page) ? 'hoverable' : ''
                }`}
                onClick={() => this.handlePageClick(+page)}
                onKeyDown={(event: KeyboardEvent) =>
                  this.handleOnPageNumbersKeydown(event, +page)
                }
                tabIndex={0}>
                {page}
              </li>
            );
          })}
          {nextPageControl}
        </ol>
      </nav>
    );
  }
}
